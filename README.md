# Sunset

Sunset is an interactive WebGL scene built with React, Three.js, Vite, and custom GLSL shaders.

## Features

- Realtime shader-based terrain animation.
- Procedural sky shader with configurable atmospheric uniforms.
- Mouse/touch interaction that affects camera and terrain distortion.
- Visibility-aware render loop (animation pauses when tab is hidden).
- Split production bundle (`index` + `three` chunks) for better caching.

## Tech Stack

- React 19
- Three.js
- TypeScript
- Vite 7
- `vite-plugin-glsl`

## Getting Started

### Prerequisites

- Node.js 22+
- npm

### Install

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Default dev URL: `http://localhost:5173`

### Build Production

```bash
npm run build
```

Production files are emitted to `dist/`.

### Preview Production Build

```bash
npm run preview
```

## Architecture

`src/components/Landscape.tsx`
- React lifecycle wrapper.
- Creates and disposes scene instance.

`src/scene/LandscapeScene.ts`
- Scene orchestration.
- Input listeners, resize handling, render loop, cleanup.

`src/scene/terrainFactory.ts`
- Terrain mesh/material/geometry factories.

`src/components/Sky.ts`
- Sky mesh factory and shader/uniform definitions.

`src/scene/config.ts`
- Centralized scene constants (camera, fog, quality, DPR caps).

`src/scene/math.ts`
- Shared math helpers (`mapRange`, `lerp`).

`src/shaders/custom-vertex.glsl`
- Vertex displacement logic.

`src/shaders/custom-fragment.glsl`
- Terrain fragment shading logic.

## Notes

- On mobile, terrain segment density is reduced for better performance.
- Renderer pixel ratio is capped to avoid excessive GPU load on high-DPI devices.

## License

[MIT](LICENSE)
