#include <common>
#include <skinning_pars_vert>
#include <lightmap_pars_vert> 
attribute vec4 _glesVertex;
attribute vec4 _glesMultiTexCoord0;
uniform highp mat4 glstate_matrix_mvp;
uniform highp vec4 _MainTex_ST;  
varying highp vec2 xlv_TEXCOORD0;

void main() {
    highp vec4 tmpVertex;
    tmpVertex.w = 1.0;
    #include <skinning_base_vert>
    xlv_TEXCOORD0 = _glesMultiTexCoord0.xy * _MainTex_ST.xy + _MainTex_ST.zw;
    #include <lightmap_vert>
    gl_Position = (glstate_matrix_mvp * tmpVertex);
}