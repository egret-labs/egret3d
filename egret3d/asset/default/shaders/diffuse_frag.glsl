#include <common>
#include <lightmap_pars_frag>
uniform vec3 diffuse;
uniform sampler2D map;
uniform lowp float alphaTest;
varying highp vec2 xlv_TEXCOORD0;
void main() {
    lowp vec4 outColor = texture2D(map, xlv_TEXCOORD0) * vec4(diffuse, 1.0);
    if(outColor.a < alphaTest)
        discard;
    #include <lightmap_frag>    
}