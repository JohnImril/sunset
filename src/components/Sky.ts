import * as THREE from "three";

class Sky extends THREE.Mesh {
	constructor() {
		const material = new THREE.ShaderMaterial({
			fragmentShader: Sky.fragmentShader,
			vertexShader: Sky.vertexShader,
			uniforms: THREE.UniformsUtils.clone(Sky.uniforms),
			side: THREE.BackSide,
		});

		super(new THREE.BoxGeometry(1, 1, 1), material);
	}

	static uniforms = {
		safeLuminance: { value: 1 },
		turbidity: { value: 2 },
		rayleigh: { value: 1 },
		mieCoefficient: { value: 0.005 },
		mieDirectionalG: { value: 0.8 },
		sunPosition: { value: new THREE.Vector3() },
	};

	static vertexShader = `
    uniform vec3 sunPosition;
    uniform float rayleigh;
    uniform float turbidity;
    uniform float mieCoefficient;

    varying vec3 vWorldPosition;
    varying vec3 vSunDirection;
    varying float vSunfade;
    varying vec3 vBetaR;
    varying vec3 vBetaM;
    varying float vSunE;

    const vec3 up = vec3(0.0, 1.0, 0.0);
    const float e = 2.71828182845904523536028747135266249775724709369995957;
    const float pi = 3.141592653589793238462643383279502884197169;
    const vec3 lambda = vec3(680E-9, 550E-9, 450E-9);
    const vec3 totalRayleigh = vec3(5.804542996261093E-6, 1.3562911419845635E-5, 3.0265902468824876E-5);
    const float v = 4.0;
    const vec3 K = vec3(0.686, 0.678, 0.666);
    const vec3 MieConst = vec3(1.8399918514433978E14, 2.7798023919660528E14, 4.0790479543861094E14);
    const float cutoffAngle = 1.6110731556870734;
    const float steepness = 1.5;
    const float EE = 1000.0;

    float sunIntensity(float zenithAngleCos) {
      zenithAngleCos = clamp(zenithAngleCos, -1.0, 1.0);
      return EE * max(0.0, 1.0 - pow(e, -( ( cutoffAngle - acos(zenithAngleCos) ) / steepness)));
    }

    vec3 totalMie(float T) {
      float c = (0.2 * T) * 10E-18;
      return 0.434 * c * MieConst;
    }

    void main() {
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      gl_Position.z = gl_Position.w;
      vSunDirection = normalize(sunPosition);
      vSunE = sunIntensity(dot(vSunDirection, up));
      vSunfade = 1.0 - clamp(1.0 - exp((sunPosition.y / 450000.0)), 0.0, 1.0);
      float rayleighCoefficient = rayleigh - (1.0 * (1.0 - vSunfade));
      vBetaR = totalRayleigh * rayleighCoefficient;
      vBetaM = totalMie(turbidity) * mieCoefficient;
    }
  `;

	static fragmentShader = `
    varying vec3 vWorldPosition;
    varying vec3 vSunDirection;
    varying float vSunfade;
    varying vec3 vBetaR;
    varying vec3 vBetaM;
    varying float vSunE;

    uniform float safeLuminance;
    uniform float mieDirectionalG;

    const vec3 cameraPos = vec3(0.0, 0.0, 0.0);
    const float pi = 3.141592653589793238462643383279502884197169;
    const float n = 1.0003;
    const float N = 2.545E25;
    const float rayleighZenithLength = 8.4E3;
    const float mieZenithLength = 1.25E3;
    const vec3 up = vec3(0.0, 1.0, 0.0);
    const float sunAngularDiameterCos = 0.999956676946448443553574619906976478926848692873900859324;
    const float THREE_OVER_SIXTEENPI = 0.05968310365946075;
    const float ONE_OVER_FOURPI = 0.07957747154594767;

    float rayleighPhase(float cosTheta) {
      return THREE_OVER_SIXTEENPI * (1.0 + pow(cosTheta, 2.0));
    }

    float hgPhase(float cosTheta, float g) {
      float g2 = pow(g, 2.0);
      float inverse = 1.0 / pow(1.0 - 2.0 * g * cosTheta + g2, 1.5);
      return ONE_OVER_FOURPI * ((1.0 - g2) * inverse);
    }

    const float A = 0.15;
    const float B = 0.50;
    const float C = 0.10;
    const float D = 0.20;
    const float E = 0.02;
    const float F = 0.30;
    const float whiteScale = 1.0748724675633854;

    vec3 Uncharted2Tonemap(vec3 x) {
      return ((x * (A * x + C * B) + D * E) / (x * (A * x + B) + D * F)) - E / F;
    }

    void main() {
      float zenithAngle = acos(max(0.0, dot(up, normalize(vWorldPosition - cameraPos))));
      float inverse = 1.0 / (cos(zenithAngle) + 0.15 * pow(93.885 - ((zenithAngle * 180.0) / pi), -1.253));
      float sR = rayleighZenithLength * inverse;
      float sM = mieZenithLength * inverse;
      vec3 Fex = exp(-(vBetaR * sR + vBetaM * sM));
      float cosTheta = dot(normalize(vWorldPosition - cameraPos), vSunDirection);
      float rPhase = rayleighPhase(cosTheta * 0.5 + 0.5);
      vec3 betaRTheta = vBetaR * rPhase;
      float mPhase = hgPhase(cosTheta, mieDirectionalG);
      vec3 betaMTheta = vBetaM * mPhase;
      vec3 Lin = pow(vSunE * ((betaRTheta + betaMTheta) / (vBetaR + vBetaM)) * (1.0 - Fex), vec3(1.5));
      Lin *= mix(vec3(1.0), pow(vSunE * ((betaRTheta + betaMTheta) / (vBetaR + vBetaM)) * Fex, vec3(1.0 / 2.0)), clamp(pow(1.0 - dot(up, vSunDirection), 5.0), 0.0, 1.0));
      vec3 direction = normalize(vWorldPosition - cameraPos);
      float theta = acos(direction.y);
      float phi = atan(direction.z, direction.x);
      vec2 uv = vec2(phi, theta) / vec2(2.0 * pi, pi) + vec2(0.5, 0.0);
      vec3 L0 = vec3(0.1) * Fex;
      float sundisk = smoothstep(sunAngularDiameterCos, sunAngularDiameterCos + 0.00002, cosTheta);
      L0 += (vSunE * 19000.0 * Fex) * sundisk;
      vec3 texColor = (Lin + L0) * 0.04 + vec3(0.0, 0.0003, 0.00075);
      vec3 curr = Uncharted2Tonemap((log2(2.0 / pow(safeLuminance, 4.0))) * texColor);
      vec3 color = curr * whiteScale;
      vec3 retColor = pow(color, vec3(1.0 / (1.2 + (1.2 * vSunfade))));
      gl_FragColor = vec4(retColor, 1.0);
    }
  `;
}

export default Sky;
