#include <common>
#include <skinning_pars_vert>
#include <lightmap_pars_vert> 
attribute vec4 position;
attribute vec4 uv;
uniform highp mat4 modelViewProjectionMatrix;
uniform highp vec4 _MainTex_ST;  
varying highp vec2 xlv_TEXCOORD0;

void main() {
    #include <skinning_base_vert>
    xlv_TEXCOORD0 = uv.xy * _MainTex_ST.xy + _MainTex_ST.zw;
    #include <lightmap_vert>
    gl_Position = (modelViewProjectionMatrix * tmpVertex);
}