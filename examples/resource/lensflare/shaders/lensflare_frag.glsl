precision highp float;
uniform sampler2D map;
uniform vec3 color;
varying vec2 vUV;
varying float vVisibility;
void main() {
	vec4 texture = texture2D( map, vUV );
	texture.a *= vVisibility;
	gl_FragColor = texture;
	gl_FragColor.rgb *= color;
}