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
    #if defined FLIP_V
        xlv_TEXCOORD0 = ( uvTransform * vec3( uv.x, 1.0 - uv.y, 1 ) ).xy;// modify egret
    #else
		xlv_TEXCOORD0 = ( uvTransform * vec3( uv.xy, 1 ) ).xy;
	#endif
    #include <lightmap_vert>
    gl_Position = (modelViewProjectionMatrix * tmpVertex);
}