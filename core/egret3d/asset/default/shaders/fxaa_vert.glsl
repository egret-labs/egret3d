// Attributes
uniform vec2 resolution;

// Output
varying vec2 vUV;
varying vec2 sampleCoordS;
varying vec2 sampleCoordE;
varying vec2 sampleCoordN;
varying vec2 sampleCoordW;
varying vec2 sampleCoordNW;
varying vec2 sampleCoordSE;
varying vec2 sampleCoordNE;
varying vec2 sampleCoordSW;


void main(void) {	
	vUV = uv;

	sampleCoordS = vUV + vec2( 0.0, 1.0) * resolution;
	sampleCoordE = vUV + vec2( 1.0, 0.0) * resolution;
	sampleCoordN = vUV + vec2( 0.0,-1.0) * resolution;
	sampleCoordW = vUV + vec2(-1.0, 0.0) * resolution;

	sampleCoordNW = vUV + vec2(-1.0,-1.0) * resolution;
	sampleCoordSE = vUV + vec2( 1.0, 1.0) * resolution;
	sampleCoordNE = vUV + vec2( 1.0,-1.0) * resolution;
	sampleCoordSW = vUV + vec2(-1.0, 1.0) * resolution;

	gl_Position = vec4(position.x, position.y, 0.0, 1.0);
}