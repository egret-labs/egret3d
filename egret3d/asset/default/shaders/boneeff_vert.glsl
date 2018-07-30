#include <common>
attribute vec4 _glesVertex;   
attribute vec4 _glesBlendIndex4;
attribute vec4 _glesBlendWeight4;
attribute vec4 _glesMultiTexCoord0;
uniform highp vec4 glstate_vec4_bones[110];
uniform highp mat4 glstate_matrix_mvp;
uniform highp vec4 _MainTex_ST; 
varying highp vec2 xlv_TEXCOORD0;
mat4 buildMat4(int index)
{
	vec4 quat = glstate_vec4_bones[index * 2 + 0];
	vec4 translation = glstate_vec4_bones[index * 2 + 1];
	float xy2 = 2.0 * quat.x * quat.y;
	float xz2 = 2.0 * quat.x * quat.z;
	float xw2 = 2.0 * quat.x * quat.w;
	float yz2 = 2.0 * quat.y * quat.z;
	float yw2 = 2.0 * quat.y * quat.w;
	float zw2 = 2.0 * quat.z * quat.w;
	float xx = quat.x * quat.x;
	float yy = quat.y * quat.y;
	float zz = quat.z * quat.z;
	float ww = quat.w * quat.w;
	mat4 matrix = mat4(
	xx - yy - zz + ww, xy2 + zw2, xz2 - yw2, 0,
	xy2 - zw2, -xx + yy - zz + ww, yz2 + xw2, 0,
	xz2 + yw2, yz2 - xw2, -xx - yy + zz + ww, 0,
	translation.x, translation.y, translation.z, 1);
	return matrix;
}

highp vec4 calcVertex(highp vec4 srcVertex,highp vec4 blendIndex,highp vec4 blendWeight)
{
	int i = int(blendIndex.x);  
    int i2 =int(blendIndex.y);
	int i3 =int(blendIndex.z);
	int i4 =int(blendIndex.w);
	
    mat4 mat = buildMat4(i)*blendWeight.x 
			 + buildMat4(i2)*blendWeight.y 
			 + buildMat4(i3)*blendWeight.z 
			 + buildMat4(i4)*blendWeight.w;
	return mat* srcVertex;
}


void main()
{                                               
    highp vec4 tmpvar_1 = vec4(calcVertex(_glesVertex,_glesBlendIndex4,_glesBlendWeight4).xyz, 1.0);
			 
    gl_Position = glstate_matrix_mvp *  tmpvar_1;

	xlv_TEXCOORD0 = _glesMultiTexCoord0.xy * _MainTex_ST.xy + _MainTex_ST.zw;  
}