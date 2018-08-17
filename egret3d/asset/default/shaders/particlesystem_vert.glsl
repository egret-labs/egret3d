//inspired by layaair:https://github.com/layabox/layaair/blob/master/src/d3/src/laya/d3/shader/files/ParticleShuriKen.vs
#include <common>
#if defined(SPHERHBILLBOARD)||defined(STRETCHEDBILLBOARD)||defined(HORIZONTALBILLBOARD)||defined(VERTICALBILLBOARD)
	attribute vec2 corner;
#endif
#ifdef RENDERMESH
	attribute vec3 position;
	attribute vec4 color;
#endif
attribute vec2 uv;
attribute vec3 startPosition;
attribute vec3 startVelocity;
attribute vec4 startColor;
attribute vec3 startSize;
attribute vec3 startRotation;
attribute vec2 time;
#if defined(COLOROGRADIENT)||defined(COLORTWOGRADIENTS)||defined(SIZETWOCURVES)||defined(SIZETWOCURVESSEPERATE)||defined(ROTATIONTWOCONSTANTS)||defined(ROTATIONTWOCURVES)
  attribute vec4 random0;
#endif
#if defined(TEXTURESHEETANIMATIONTWOCURVE)||defined(VELOCITYTWOCONSTANT)||defined(VELOCITYTWOCURVE)
  attribute vec4 random1;
#endif
attribute vec3 startWorldPosition;
attribute vec4 startWorldRotation;

#include <particle_common>

void main()
{
	float age = u_currentTime - time.y;
	float t = age/time.x;
	if(t>1.0){ 			
			v_discard=1.0;
			return;
  }
	  
	#include <particle_affector>
	gl_Position=viewProjectionMatrix*vec4(center,1.0);
	v_color = computeColor(startColor, t);
	v_texcoord =computeUV(uv * _MainTex_ST.xy + _MainTex_ST.zw, t);
	v_discard=0.0;
}

