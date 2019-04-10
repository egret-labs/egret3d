//modified by egret
#ifdef USE_INSTANCED
	attribute vec4 modelMatrix0;
	attribute vec4 modelMatrix1;
	attribute vec4 modelMatrix2;
	attribute vec4 modelMatrix3;
	attribute vec4 modelViewMatrix0;	
	attribute vec4 modelViewMatrix1;	
	attribute vec4 modelViewMatrix2;	
	attribute vec4 modelViewMatrix3;	
#else
	uniform mat4 modelMatrix;
	uniform mat4 modelViewMatrix;
#endif
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
#ifndef USE_INSTANCED
	uniform mat3 normalMatrix;
#endif
uniform vec3 cameraPosition;

attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;



#ifdef USE_COLOR

	attribute vec3 color;
#endif
#ifdef USE_MORPHTARGETS
	attribute vec3 morphTarget0;
	attribute vec3 morphTarget1;
	attribute vec3 morphTarget2;
	attribute vec3 morphTarget3;
	#ifdef USE_MORPHNORMALS
		attribute vec3 morphNormal0;
		attribute vec3 morphNormal1;
		attribute vec3 morphNormal2;
		attribute vec3 morphNormal3;
	#else
		attribute vec3 morphTarget4;
		attribute vec3 morphTarget5;
		attribute vec3 morphTarget6;
		attribute vec3 morphTarget7;
	#endif
#endif
#ifdef USE_SKINNING
	attribute vec4 skinIndex;
	attribute vec4 skinWeight;
#endif