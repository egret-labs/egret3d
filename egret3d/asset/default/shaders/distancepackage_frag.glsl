#include <packing>

varying vec3 xlv_POS;
uniform vec4 glstate_referencePosition;
uniform float glstate_nearDistance;
uniform float glstate_farDistance;

void main() {
    float dist = length( xlv_POS - glstate_referencePosition.xyz );
	dist = ( dist - glstate_nearDistance ) / ( glstate_farDistance - glstate_nearDistance );
	dist = saturate( dist ); // clamp to [ 0, 1 ]

	gl_FragColor = packDepthToRGBA( dist );
}