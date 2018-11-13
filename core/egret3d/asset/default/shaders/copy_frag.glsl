uniform float opacity;
uniform sampler2D map;
varying vec2 vUv;

void main() {
	vec4 texel = texture2D( map, vUv );
	gl_FragColor = opacity * texel;
}