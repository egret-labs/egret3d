uniform vec3 color;
uniform sampler2D map;
uniform sampler2D tDiffuse;
varying vec4 vUvA;
varying vec4 vUvB;

float blendOverlay( float base, float blend ) {
    return( base < 0.5 ? ( 2.0 * base * blend ) : ( 1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );
}

vec3 blendOverlay( vec3 base, vec3 blend ) {
    return vec3( blendOverlay( base.r, blend.r ), blendOverlay( base.g, blend.g ), blendOverlay( base.b, blend.b ) );
}

void main() {
    vec4 baseA = texture2DProj( map, vUvA );
    vec4 baseB = texture2DProj( tDiffuse, vUvB );
    gl_FragColor = vec4( baseA.rgb + blendOverlay( baseB.rgb, color ), 1.0 );
}