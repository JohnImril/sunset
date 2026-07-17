import { describe, expect, it } from "vitest";
import { TERRAIN_SEGMENTS } from "./config";
import { createTerrainGeometry, createTerrainMesh } from "./terrainFactory";

describe("terrain quality budgets", () => {
	it("keeps the mobile vertex count below half of desktop", () => {
		const desktopVertices = (TERRAIN_SEGMENTS.desktop + 1) ** 2;
		const mobileVertices = (TERRAIN_SEGMENTS.mobile + 1) ** 2;
		expect(mobileVertices / desktopVertices).toBeLessThan(0.5);
	});

	it("creates the expected geometry and scene placement", () => {
		const geometry = createTerrainGeometry(2, 3);
		expect(geometry.attributes.position.count).toBe(12);
		geometry.dispose();

		const mesh = createTerrainMesh(2, 3);
		expect(mesh.rotation.x).toBeCloseTo(-Math.PI / 2);
		expect(mesh.position.z).toBe(-180);
		mesh.geometry.dispose();
		mesh.material.dispose();
	});
});
