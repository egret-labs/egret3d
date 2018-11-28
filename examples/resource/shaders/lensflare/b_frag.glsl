precision highp float;
uniform sampler2D map;
varying vec2 vUV;
void main() {
	gl_FragColor = texture2D( map, vec2(vUV.x, 1.0 - vUV.y) );
}