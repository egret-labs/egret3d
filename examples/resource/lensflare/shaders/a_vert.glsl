precision highp float;
uniform vec3 screenPosition;
uniform vec2 tscale;
void main() {
	gl_Position = vec4( position.xy * tscale + screenPosition.xy, screenPosition.z, 1.0 );
}