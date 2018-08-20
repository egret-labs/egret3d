#include <common>
#include <skinning_pars_vert>
#include <lightmap_pars_vert> 
attribute vec4 position;
attribute vec4 uv;
uniform highp mat4 modelViewProjectionMatrix;
uniform highp mat3 uvTransform;  
varying highp vec2 xlv_TEXCOORD0;

void main() {
    #include <skinning_base_vert>
    // xlv_TEXCOORD0 = uv.xy * uvTransform.xy + uvTransform.zw;
    xlv_TEXCOORD0 = ( uvTransform * vec3( uv.xy, 1 ) ).xy;
    #include <lightmap_vert>
    gl_Position = (modelViewProjectionMatrix * tmpVertex);
}