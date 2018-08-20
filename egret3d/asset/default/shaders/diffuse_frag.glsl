#include <common>
#include <lightmap_pars_frag>
uniform vec4 diffuse;
uniform sampler2D map;
uniform lowp float _AlphaCut;
varying highp vec2 xlv_TEXCOORD0;
void main() {
    lowp vec4 outColor = texture2D(map, xlv_TEXCOORD0) * diffuse;
    if(outColor.a < _AlphaCut)
        discard;
    #include <lightmap_frag>    
}