import { useEffect, useRef } from "react";
import { createLandscapeScene } from "../scene/LandscapeScene";

const Landscape = () => {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) {
			return;
		}
		const scene = createLandscapeScene(container);
		scene.start();

		return () => {
			scene.dispose();
		};
	}, []);

	return <div ref={containerRef} style={{ width: "100%", height: "100vh" }} />;
};

export default Landscape;
