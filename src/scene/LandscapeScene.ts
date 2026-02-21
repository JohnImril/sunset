import * as THREE from "three";
import { createSky } from "../components/Sky";
import { createTerrainMesh } from "./terrainFactory";

const MOBILE_UA = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

export const createLandscapeScene = (container: HTMLDivElement) => {
	const isMobile = MOBILE_UA.test(navigator.userAgent);
	const mouse = { x: 0, y: 0, xDamped: 0, yDamped: 0 };

	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 10000);
	const renderer = new THREE.WebGLRenderer({ antialias: true });
	const terrain = createTerrainMesh();
	let frameId = 0;
	let isRunning = false;

	const onInputMove = (e: MouseEvent | TouchEvent) => {
		if (e.type === "mousemove") {
			const mouseEvent = e as MouseEvent;
			mouse.x = mouseEvent.clientX;
			mouse.y = mouseEvent.clientY;
			return;
		}
		const touchEvent = e as TouchEvent;
		mouse.x = touchEvent.changedTouches[0].clientX;
		mouse.y = touchEvent.changedTouches[0].clientY;
	};

	const onResize = () => {
		const width = window.innerWidth;
		const height = window.innerHeight;

		camera.aspect = width / height;
		camera.updateProjectionMatrix();

		const maxPixelRatio = isMobile ? 1.5 : 2;
		renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxPixelRatio));
		renderer.setSize(width, height);
	};

	const render = () => {
		if (!isRunning) {
			return;
		}
		frameId = requestAnimationFrame(render);

		mouse.xDamped = lerp(mouse.xDamped, mouse.x, 0.1);
		mouse.yDamped = lerp(mouse.yDamped, mouse.y, 0.05);

		const width = window.innerWidth;
		const height = window.innerHeight;
		const time = performance.now() * 0.0005;
		const uniforms = terrain.material.uniforms;

		uniforms.time.value = time;
		uniforms.scroll.value = time + map(mouse.yDamped, 0, height, 0, 4);
		uniforms.distortCenter.value = Math.sin(time) * 0.1;
		uniforms.roadWidth.value = map(mouse.xDamped, 0, width, 1, 4.5);
		camera.position.y = map(mouse.yDamped, 0, height, 4, 11);

		renderer.render(scene, camera);
	};

	const onVisibilityChange = () => {
		if (document.hidden) {
			cancelAnimationFrame(frameId);
			frameId = 0;
			return;
		}
		if (isRunning && frameId === 0) {
			render();
		}
	};

	const setupScene = () => {
		const fogColor = new THREE.Color(0x333333);
		scene.background = fogColor;
		scene.fog = new THREE.Fog(fogColor, 0, 400);

		camera.position.y = 8;
		camera.position.z = 4;
		scene.add(new THREE.AmbientLight(0xffffff, 1));

		const sky = createSky();
		sky.scale.setScalar(450000);
		const skyMaterial = sky.material as THREE.ShaderMaterial;
		skyMaterial.uniforms.turbidity.value = 13;
		skyMaterial.uniforms.rayleigh.value = 1.2;
		skyMaterial.uniforms.safeLuminance.value = 1;
		skyMaterial.uniforms.mieCoefficient.value = 0.1;
		skyMaterial.uniforms.mieDirectionalG.value = 0.58;
		scene.add(sky);

		const sunSphere = new THREE.Mesh(
			new THREE.SphereGeometry(20000, 16, 8),
			new THREE.MeshBasicMaterial({ color: 0xffffff })
		);
		sunSphere.visible = false;
		scene.add(sunSphere);

		const theta = Math.PI * -0.002;
		const phi = 2 * Math.PI * -0.25;
		sunSphere.position.set(
			400000 * Math.cos(phi),
			400000 * Math.sin(phi) * Math.sin(theta),
			400000 * Math.sin(phi) * Math.cos(theta)
		);
		skyMaterial.uniforms.sunPosition.value.copy(sunSphere.position);
	};

	const start = () => {
		setupScene();
		scene.add(terrain);
		container.appendChild(renderer.domElement);

		if (isMobile) {
			window.addEventListener("touchmove", onInputMove, { passive: true });
		} else {
			window.addEventListener("mousemove", onInputMove, { passive: true });
		}
		window.addEventListener("resize", onResize);
		document.addEventListener("visibilitychange", onVisibilityChange);

		onResize();
		isRunning = true;
		if (!document.hidden) {
			render();
		}
	};

	const dispose = () => {
		isRunning = false;
		cancelAnimationFrame(frameId);
		window.removeEventListener("resize", onResize);
		window.removeEventListener("mousemove", onInputMove);
		window.removeEventListener("touchmove", onInputMove);
		document.removeEventListener("visibilitychange", onVisibilityChange);

		if (container.contains(renderer.domElement)) {
			container.removeChild(renderer.domElement);
		}

		scene.traverse((object) => {
			const mesh = object as THREE.Mesh;
			mesh.geometry?.dispose();
			if (!mesh.material) {
				return;
			}
			const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
			for (const material of materials) {
				material.dispose();
			}
		});
		renderer.dispose();
	};

	return { start, dispose };
};

const map = (value: number, start1: number, stop1: number, start2: number, stop2: number) => {
	return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
};

const lerp = (start: number, end: number, amt: number) => {
	return (1 - amt) * start + amt * end;
};
