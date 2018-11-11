precision highp float;
uniform vec3 screenPosition;
uniform vec2 tscale;
varying vec2 vUV;
void main() {
	vUV = uv;
	gl_Position = vec4( position.xy * tscale + screenPosition.xy, screenPosition.z, 1.0 );
}