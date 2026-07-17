import { describe, expect, it } from "vitest";
import { lerp, mapRange } from "./math";

describe("scene math", () => {
	it("maps values between ranges", () => {
		expect(mapRange(5, 0, 10, -1, 1)).toBe(0);
	});

	it("interpolates without clamping", () => {
		expect(lerp(10, 20, 0.25)).toBe(12.5);
		expect(lerp(10, 20, 1.5)).toBe(25);
	});
});
