attribute vec3 _glesVertex;   
attribute vec3 _glesNormal;               
attribute vec4 _glesMultiTexCoord0;    

uniform mat4 glstate_matrix_mvp;      
uniform mat4 glstate_matrix_model;

#include <shadowMap_pars_vert>

varying vec3 xlv_POS;
varying vec3 xlv_NORMAL;                
varying vec2 xlv_TEXCOORD0;

#include <transpose>
#include <inverse>

void main() {   
    vec4 tmpvar_1 = vec4(_glesVertex.xyz, 1.0);                            

    vec3 normal = (transpose(inverse(glstate_matrix_model)) * vec4(_glesNormal, 1.0)).xyz;
    xlv_NORMAL = normal;
    #ifdef FLIP_SIDED
    	xlv_NORMAL = - xlv_NORMAL;
    #endif

    vec3 worldpos = (glstate_matrix_model * tmpvar_1).xyz;
    xlv_POS = worldpos; 

    xlv_TEXCOORD0 = _glesMultiTexCoord0.xy;

    #include <shadowMap_vert>
     
    gl_Position = (glstate_matrix_mvp * tmpvar_1);
}