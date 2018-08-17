//inspired by layaair:https://github.com/layabox/layaair/blob/master/src/d3/src/laya/d3/shader/files/ParticleShuriKen.vs
#include <common>
#if defined(SPHERHBILLBOARD)||defined(STRETCHEDBILLBOARD)||defined(HORIZONTALBILLBOARD)||defined(VERTICALBILLBOARD)
	attribute vec2 _glesCorner;
#endif
#ifdef RENDERMESH
	attribute vec3 _glesVertex;
	attribute vec4 _glesColor;
#endif
attribute vec2 _glesMultiTexCoord0;
attribute vec3 _startPosition;
attribute vec3 _startVelocity;
attribute vec4 _startColor;
attribute vec3 _startSize;
attribute vec3 _startRotation;
attribute vec2 _time;
#if defined(COLOROGRADIENT)||defined(COLORTWOGRADIENTS)||defined(SIZETWOCURVES)||defined(SIZETWOCURVESSEPERATE)||defined(ROTATIONTWOCONSTANTS)||defined(ROTATIONTWOCURVES)
  attribute vec4 _random0;
#endif
#if defined(TEXTURESHEETANIMATIONTWOCURVE)||defined(VELOCITYTWOCONSTANT)||defined(VELOCITYTWOCURVE)
  attribute vec4 _random1;
#endif
attribute vec3 _startWorldPosition;
attribute vec4 _startWorldRotation;

#include <particle_common>

void main()
{
	float age = u_currentTime - _time.y;
	float t = age/_time.x;
	if(t>1.0){ 			
			v_discard=1.0;
			return;
  }
	  
	#include <particle_affector>
	gl_Position=viewProjectionMatrix*vec4(center,1.0);
	v_color = computeColor(_startColor, t);
	v_texcoord =computeUV(_glesMultiTexCoord0 * _MainTex_ST.xy + _MainTex_ST.zw, t);
	v_discard=0.0;
}

