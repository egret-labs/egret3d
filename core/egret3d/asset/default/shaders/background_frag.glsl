uniform sampler2D map;

varying vec2 vUv;

void main() {

	vec4 texColor = texture2D( map, vUv );

	gl_FragColor = mapTexelToLinear( texColor );

	#include <tonemapping_fragment>
	#include <encodings_fragment>

}