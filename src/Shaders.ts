export const vertexShader = `
  uniform float time;
  uniform float scroll;
  uniform float distortCenter;
  uniform float roadWidth;
  uniform float speed;
  uniform float maxHeight;
  varying vec2 vUv;
  varying float vDistort;

  void main() {
    vUv = uv;
    vec3 pos = position;

    pos.z += time * speed;
    pos.y += sin(pos.z * 0.1 + scroll) * maxHeight;

    vec3 distortion = vec3(sin(uv.y * 20.0 + time * 2.0) * distortCenter, 0.0, 0.0);
    pos += distortion;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const fragmentShader = `
  uniform sampler2D pallete;
  varying vec2 vUv;

  void main() {
    vec3 color = texture2D(pallete, vUv).rgb;
    gl_FragColor = vec4(color, 1.0);
  }
`;
