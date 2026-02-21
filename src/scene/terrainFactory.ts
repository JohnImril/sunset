import * as THREE from "three";
import vertexShader from "../shaders/custom-vertex.glsl";
import fragmentShader from "../shaders/custom-fragment.glsl";

export type TerrainUniforms = {
	time: { value: number };
	scroll: { value: number };
	distortCenter: { value: number };
	roadWidth: { value: number };
	speed: { value: number };
	maxHeight: { value: number };
	color: { value: THREE.Color };
};

export const createTerrainGeometry = () => {
	return new THREE.PlaneGeometry(100, 400, 400, 400);
};

export const createTerrainMaterial = () => {
	const uniforms: TerrainUniforms = {
		time: { value: 0 },
		scroll: { value: 0 },
		distortCenter: { value: 0.1 },
		roadWidth: { value: 0.5 },
		speed: { value: 3 },
		maxHeight: { value: 10 },
		color: { value: new THREE.Color(0, 0, 0) },
	};

	return new THREE.ShaderMaterial({
		uniforms: THREE.UniformsUtils.merge([THREE.ShaderLib.basic.uniforms, uniforms]),
		vertexShader,
		fragmentShader,
		fog: true,
	});
};

export const createTerrainMesh = () => {
	const terrain = new THREE.Mesh(createTerrainGeometry(), createTerrainMaterial());
	terrain.position.z = -180;
	terrain.rotation.x = -Math.PI / 2;
	return terrain;
};
