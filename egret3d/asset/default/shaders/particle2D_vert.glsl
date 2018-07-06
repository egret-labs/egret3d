attribute vec2 _glesCorner;
attribute vec2 _glesMultiTexCoord0;
attribute vec3 _startPosition;
attribute vec3 _startVelocity;
attribute vec4 _startColor;
attribute vec3 _startSize;
attribute vec3 _startRotation;
attribute vec2 _time;
attribute vec3 _startWorldPosition;
attribute vec4 _startWorldRotation;
#if defined(COLOROGRADIENT)||defined(COLORTWOGRADIENTS)||defined(SIZETWOCURVES)||defined(SIZETWOCURVESSEPERATE)||defined(ROTATIONTWOCONSTANTS)||defined(ROTATIONTWOCURVES)
  attribute vec4 _random0;
#endif
#if defined(TEXTURESHEETANIMATIONTWOCURVE)||defined(VELOCITYTWOCONSTANT)||defined(VELOCITYTWOCURVE)
  attribute vec4 _random1;
#endif

#include <particle_common>

void main()
{
	float age = u_currentTime - _time.y;
	float t = age/_time.x;
	if(t>1.0){ 			
		v_discard=1.0;
		return;
    }

    vec3 lifeVelocity = computeVelocity(t);
    vec4 worldRotation;
    if(u_simulationSpace==1){
	    worldRotation=_startWorldRotation;
    }
    else{
        worldRotation=u_worldRotation;
    }
    vec3 gravity=u_gravity*age;

    vec3 center=computePosition(_startVelocity, lifeVelocity, age, t,gravity,worldRotation); 
    #ifdef SPHERHBILLBOARD
		vec2 corner=_glesCorner.xy;
	    vec3 cameraUpVector = normalize(glstate_cameraUp);
	    vec3 sideVector = normalize(cross(glstate_cameraForward,cameraUpVector));
	    vec3 upVector = normalize(cross(sideVector,glstate_cameraForward));
	   	corner*=computeBillbardSize(_startSize.xy,t);
		#if defined(ROTATIONOVERLIFETIME)||defined(ROTATIONSEPERATE)
			if(u_startRotation3D){
				vec3 rotation=vec3(_startRotation.xy,computeRotation(_startRotation.z,age,t));
				center += u_sizeScale.xzy*rotation_euler(corner.x*sideVector+corner.y*upVector,rotation);
			}
			else{
				float rot = computeRotation(_startRotation.x, age,t);
				float c = cos(rot);
				float s = sin(rot);
				mat2 rotation= mat2(c, -s, s, c);
				corner=rotation*corner;
				center += u_sizeScale.xzy*(corner.x*sideVector+corner.y*upVector);
			}
		#else
			if(u_startRotation3D){
				center += u_sizeScale.xzy*rotation_euler(corner.x*sideVector+corner.y*upVector,_startRotation);
			}
			else{
				float c = cos(_startRotation.x);
				float s = sin(_startRotation.x);
				mat2 rotation= mat2(c, -s, s, c);
				corner=rotation*corner;
				center += u_sizeScale.xzy*(corner.x*sideVector+corner.y*upVector);
			}
		#endif
	#endif
	#ifdef STRETCHEDBILLBOARD
		vec2 corner=_glesCorner.xy;
		vec3 velocity;
		#if defined(VELOCITYCONSTANT)||defined(VELOCITYCURVE)||defined(VELOCITYTWOCONSTANT)||defined(VELOCITYTWOCURVE)
	   		if(u_spaceType==0)
	  				velocity=rotation_quaternions(u_sizeScale*(_startVelocity+lifeVelocity),worldRotation)+gravity;
	   		else
	  				velocity=rotation_quaternions(u_sizeScale*_startVelocity,worldRotation)+lifeVelocity+gravity;
	 	#else
	   		velocity= rotation_quaternions(u_sizeScale*_startVelocity,worldRotation)+gravity;
	 	#endif	
		vec3 cameraUpVector = normalize(velocity);
		vec3 direction = normalize(center-glstate_cameraPos);
	   vec3 sideVector = normalize(cross(direction,normalize(velocity)));
		sideVector=u_sizeScale.xzy*sideVector;
		cameraUpVector=length(vec3(u_sizeScale.x,0.0,0.0))*cameraUpVector;
	   vec2 size=computeBillbardSize(_startSize.xy,t);
	   const mat2 rotaionZHalfPI=mat2(0.0, -1.0, 1.0, 0.0);
	   corner=rotaionZHalfPI*corner;
	   corner.y=corner.y-abs(corner.y);
	   float speed=length(velocity);
	   center +=sign(u_sizeScale.x)*(sign(u_lengthScale)*size.x*corner.x*sideVector+(speed*u_speeaScale+size.y*u_lengthScale)*corner.y*cameraUpVector);
	#endif
	#ifdef HORIZONTALBILLBOARD
		vec2 corner=_glesCorner.xy;
	   const vec3 cameraUpVector=vec3(0.0,0.0,1.0);
	   const vec3 sideVector = vec3(-1.0,0.0,0.0);
		float rot = computeRotation(_startRotation.x, age,t);
	   float c = cos(rot);
	   float s = sin(rot);
	   mat2 rotation= mat2(c, -s, s, c);
	   corner=rotation*corner;
		corner*=computeBillbardSize(_startSize.xy,t);
	   center +=u_sizeScale.xzy*(corner.x*sideVector+ corner.y*cameraUpVector);
	#endif
	#ifdef VERTICALBILLBOARD
		vec2 corner=_glesCorner.xy;
	   const vec3 cameraUpVector =vec3(0.0,1.0,0.0);
	   vec3 sideVector = normalize(cross(glstate_cameraForward,cameraUpVector));
		float rot = computeRotation(_startRotation.x, age,t);
	   float c = cos(rot);
	   float s = sin(rot);
	   mat2 rotation= mat2(c, -s, s, c);
	   corner=rotation*corner;
		corner*=computeBillbardSize(_startSize.xy,t);
	   center +=u_sizeScale.xzy*(corner.x*sideVector+ corner.y*cameraUpVector);
	#endif
	  
	gl_Position=glstate_matrix_vp*vec4(center,1.0);
	v_color = computeColor(_startColor, t);
	#ifdef DIFFUSEMAP
		v_texcoord =computeUV(_glesMultiTexCoord0, t);
	#endif
	v_discard=0.0;
}