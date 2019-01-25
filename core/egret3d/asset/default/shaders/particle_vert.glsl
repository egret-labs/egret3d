//inspired by layaair:https://github.com/layabox/layaair/blob/master/src/d3/src/laya/d3/shader/files/ParticleShuriKen.vs
#include <common>
#if defined(SPHERHBILLBOARD)||defined(STRETCHEDBILLBOARD)||defined(HORIZONTALBILLBOARD)||defined(VERTICALBILLBOARD)
	attribute vec2 corner;
#endif
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
#include <fog_pars_vertex>

void main()
{
	float age = u_currentTime - time.y;
	float t = age/time.x;
	if(t>1.0){ 			
			v_discard=1.0;
			return;
  }
	  
	#include <particle_affector>
	vec4 mvPosition = viewMatrix * vec4( center, 1.0 );
	gl_Position = projectionMatrix * mvPosition;
	v_color = computeColor(startColor, t);
	v_texcoord = computeUV(uv, t);
	v_discard=0.0;
	#include <fog_vertex>
}

