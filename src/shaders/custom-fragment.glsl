uniform vec3 color;
varying float vDisplace;
uniform vec3 fogColor;
uniform float fogNear;
uniform float fogFar;
varying float fogDepth;
		
void main() {
	vec4 finalColor = vec4(color, 1.0);
	#ifdef USE_FOG
		float fogFactor = smoothstep(fogNear, fogFar, fogDepth);
		finalColor.rgb = mix(finalColor.rgb, fogColor, fogFactor);
	#endif
	gl_FragColor = finalColor;
}