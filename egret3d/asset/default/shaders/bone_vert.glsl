#include <common>
attribute vec4 _glesVertex;   
attribute vec4 _glesBlendIndex4;
attribute vec4 _glesBlendWeight4;
attribute vec4 _glesMultiTexCoord0;
uniform highp mat4 glstate_matrix_mvp;
uniform highp mat4 glstate_matrix_bones[24];
uniform highp vec4 _MainTex_ST; 
varying highp vec2 xlv_TEXCOORD0;
void main()                                     
{                                               
    highp vec4 tmpvar_1;                        
    tmpvar_1.w = 1.0;                           
    tmpvar_1.xyz = _glesVertex.xyz;  
	
    int i = int(_glesBlendIndex4.x);  
    int i2 =int(_glesBlendIndex4.y);
	int i3 =int(_glesBlendIndex4.z);
	int i4 =int(_glesBlendIndex4.w);
	
    mat4 mat = glstate_matrix_bones[i]*_glesBlendWeight4.x 
			 + glstate_matrix_bones[i2]*_glesBlendWeight4.y 
			 + glstate_matrix_bones[i3]*_glesBlendWeight4.z 
			 + glstate_matrix_bones[i4]*_glesBlendWeight4.w;
			 
    gl_Position = (glstate_matrix_mvp * mat)* tmpvar_1;

	xlv_TEXCOORD0 = _glesMultiTexCoord0.xy * _MainTex_ST.xy + _MainTex_ST.zw;
}