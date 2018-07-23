#include <common>
attribute vec4 _glesVertex;   
attribute vec3 _glesNormal;               
attribute vec4 _glesMultiTexCoord0;
#include <skinning_pars_vert>

uniform mat4 glstate_matrix_mvp;      
uniform mat4 glstate_matrix_model;

#include <shadowMap_pars_vert>

varying vec3 xlv_POS;
varying vec3 xlv_NORMAL;             
varying vec2 xlv_TEXCOORD0;

#include <transpose>
#include <inverse>

void main() {   
    vec4 tmpVertex;
    tmpVertex.w = 1.0;
    #include <skinning_base_vert>

    vec3 tmpNormal;      
    #include <skinning_normal_vert>              

    vec3 normal = (transpose(inverse(glstate_matrix_model)) * vec4(tmpNormal, 1.0)).xyz;
    xlv_NORMAL = normal;
    #ifdef FLIP_SIDED
    	xlv_NORMAL = - xlv_NORMAL;
    #endif

    vec3 worldpos = (glstate_matrix_model * tmpVertex).xyz;
    xlv_POS = worldpos; 

    xlv_TEXCOORD0 = _glesMultiTexCoord0.xy;

    #include <shadowMap_vert>
     
    gl_Position = (glstate_matrix_mvp * tmpVertex);
}