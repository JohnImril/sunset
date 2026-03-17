import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import glsl from "vite-plugin-glsl";

const reactCompiler = babel({
	presets: [reactCompilerPreset()],
} as Parameters<typeof babel>[0]);

export default defineConfig({
	plugins: [react(), reactCompiler, glsl()],
	build: {
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (id.includes("/node_modules/three/")) {
						return "three";
					}
				},
			},
		},
	},
	base: "./",
});
