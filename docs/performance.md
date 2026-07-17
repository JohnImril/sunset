# Performance evidence

The scene uses explicit, test-covered geometry and pixel-density budgets:

| Profile | Terrain segments | Vertices | Pixel-ratio cap |
| --- | ---: | ---: | ---: |
| Desktop | 400 x 400 | 160,801 | 2 |
| Mobile | 260 x 260 | 68,121 | 1.5 |

The mobile terrain therefore uses about 42.4% of the desktop vertex count. The
unit suite checks that this ratio stays below 50%, so an accidental quality
increase fails CI. SCENE_CONFIG also caps device pixel ratio and the render
loop pauses while the document is hidden.

Reproduce the evidence with npm test and npm run build.
