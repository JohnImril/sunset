import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import Sky from "./Sky";
import vertexShader from "../shaders/custom-vertex.glsl";
import fragmentShader from "../shaders/custom-fragment.glsl";

const Landscape: React.FC = () => {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const container = containerRef.current;
		let scene: THREE.Scene, renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera;
		let terrain: THREE.Mesh;
		const mouse = { x: 0, y: 0, xDamped: 0, yDamped: 0 };
		const isMobile = typeof window.orientation !== "undefined";
		const width = window.innerWidth;
		const height = window.innerHeight;

		const init = () => {
			sceneSetup();
			sceneElements();
			render();
			if (isMobile) {
				window.addEventListener("touchmove", onInputMove, { passive: true });
			} else {
				window.addEventListener("mousemove", onInputMove, { passive: true });
			}
			window.addEventListener("resize", resize);
			resize();
		};

		const sceneSetup = () => {
			scene = new THREE.Scene();
			const fogColor = new THREE.Color(0x333333);
			scene.background = fogColor;
			scene.fog = new THREE.Fog(fogColor, 0, 400);

			camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000);
			camera.position.y = 8;
			camera.position.z = 4;

			const ambientLight = new THREE.AmbientLight(0xffffff, 1);
			scene.add(ambientLight);

			const sky = new Sky();
			sky.scale.setScalar(450000);
			(sky.material as THREE.ShaderMaterial).uniforms.turbidity.value = 13;
			(sky.material as THREE.ShaderMaterial).uniforms.rayleigh.value = 1.2;
			(sky.material as THREE.ShaderMaterial).uniforms.luminance.value = 1;
			(sky.material as THREE.ShaderMaterial).uniforms.mieCoefficient.value = 0.1;
			(sky.material as THREE.ShaderMaterial).uniforms.mieDirectionalG.value = 0.58;
			scene.add(sky);

			const sunSphere = new THREE.Mesh(
				new THREE.SphereGeometry(20000, 16, 8),
				new THREE.MeshBasicMaterial({ color: 0xffffff })
			);
			sunSphere.visible = false;
			scene.add(sunSphere);

			const theta = Math.PI * -0.002;
			const phi = 2 * Math.PI * -0.25;

			sunSphere.position.x = 400000 * Math.cos(phi);
			sunSphere.position.y = 400000 * Math.sin(phi) * Math.sin(theta);
			sunSphere.position.z = 400000 * Math.sin(phi) * Math.cos(theta);

			(sky.material as THREE.ShaderMaterial).uniforms["sunPosition"].value.copy(sunSphere.position);

			renderer = new THREE.WebGLRenderer({ antialias: true });
			renderer.setPixelRatio(window.devicePixelRatio);
			renderer.setSize(width, height);
			if (containerRef.current) {
				containerRef.current.appendChild(renderer.domElement);
			}
		};

		const sceneElements = () => {
			const geometry = new THREE.PlaneGeometry(100, 400, 400, 400);

			const uniforms = {
				time: { type: "f", value: 0.0 },
				scroll: { type: "f", value: 0.0 },
				distortCenter: { type: "f", value: 0.1 },
				roadWidth: { type: "f", value: 0.5 },
				speed: { type: "f", value: 3 },
				maxHeight: { type: "f", value: 10.0 },
				color: { value: new THREE.Color(0, 0, 0) },
			};

			const material = new THREE.ShaderMaterial({
				uniforms: THREE.UniformsUtils.merge([THREE.ShaderLib.basic.uniforms, uniforms]),
				vertexShader: vertexShader,
				fragmentShader: fragmentShader,
				wireframe: false,
				fog: true,
			});

			terrain = new THREE.Mesh(geometry, material);
			terrain.position.z = -180;
			terrain.rotation.x = -Math.PI / 2;

			scene.add(terrain);
		};

		const onInputMove = (e: MouseEvent | TouchEvent) => {
			let x, y;
			if (e.type === "mousemove") {
				x = (e as MouseEvent).clientX;
				y = (e as MouseEvent).clientY;
			} else {
				x = (e as TouchEvent).changedTouches[0].clientX;
				y = (e as TouchEvent).changedTouches[0].clientY;
			}
			mouse.x = x;
			mouse.y = y;
		};

		const resize = () => {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		};

		const render = () => {
			requestAnimationFrame(render);

			mouse.xDamped = lerp(mouse.xDamped, mouse.x, 0.1);
			mouse.yDamped = lerp(mouse.yDamped, mouse.y, 0.05);

			const time = performance.now() * 0.0005;
			(terrain.material as THREE.ShaderMaterial).uniforms.time.value = time;
			(terrain.material as THREE.ShaderMaterial).uniforms.scroll.value =
				time + map(mouse.yDamped, 0, height, 0, 4);
			(terrain.material as THREE.ShaderMaterial).uniforms.distortCenter.value = Math.sin(time) * 0.1;
			(terrain.material as THREE.ShaderMaterial).uniforms.roadWidth.value = map(mouse.xDamped, 0, width, 1, 4.5);

			camera.position.y = map(mouse.yDamped, 0, height, 4, 11);

			renderer.render(scene, camera);
		};

		const map = (value: number, start1: number, stop1: number, start2: number, stop2: number) => {
			return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
		};

		const lerp = (start: number, end: number, amt: number) => {
			return (1 - amt) * start + amt * end;
		};

		init();

		return () => {
			window.removeEventListener("resize", resize);
			if (container) {
				container.removeChild(renderer.domElement);
			}
		};
	}, []);

	return <div ref={containerRef} style={{ width: "100%", height: "100vh" }} />;
};

export default Landscape;
