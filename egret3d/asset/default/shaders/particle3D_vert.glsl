attribute vec3 _glesVertex;
attribute vec4 _glesColor;
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
	v_discard=0.0;

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

    vec3 size=computeMeshSize(_startSize,t);
	#if defined(ROTATIONOVERLIFETIME)||defined(ROTATIONSEPERATE)
			if(u_startRotation3D){
				vec3 rotation=vec3(_startRotation.xy,-computeRotation(_startRotation.z, age,t));
				center+= rotation_quaternions(u_sizeScale*rotation_euler(_glesVertex*size,rotation),worldRotation);
			}
			else{
				#ifdef ROTATIONOVERLIFETIME
					float angle=computeRotation(_startRotation.x, age,t);
					if(_startPosition.x>0.1 || _startPosition.x < -0.1||_startPosition.y>0.1 || _startPosition.y < -0.1){
						center+= (rotation_quaternions(rotation_axis(u_sizeScale*_glesVertex*size,normalize(cross(vec3(0.0,0.0,1.0),vec3(_startPosition.xy,0.0))),angle),worldRotation));//已验证
					}
					else{
						#ifdef SHAPE
							center+= u_sizeScale.xzy*(rotation_quaternions(rotation_axis(_glesVertex*size,vec3(0.0,-1.0,0.0),angle),worldRotation));
						#else
							if(u_simulationSpace==1)
								center+=rotation_axis(u_sizeScale*_glesVertex*size,vec3(0.0,0.0,-1.0),angle);
							else if(u_simulationSpace==0)
								center+=rotation_quaternions(u_sizeScale*rotation_axis(_glesVertex*size,vec3(0.0,0.0,-1.0),angle),worldRotation);
						#endif
					}
				#endif
				#ifdef ROTATIONSEPERATE
					vec3 angle=compute3DRotation(vec3(0.0,0.0,_startRotation.z), age,t);
					center+= (rotation_quaternions(rotation_euler(u_sizeScale*_glesVertex*size,vec3(angle.x,angle.y,angle.z)),worldRotation));
				#endif	
			}
	#else
	if(u_startRotation3D){
		center+= rotation_quaternions(u_sizeScale*rotation_euler(_glesVertex*size,_startRotation),worldRotation);
	}
	else{
		if(_startPosition.x>0.1 || _startPosition.x < -0.1||_startPosition.y>0.1 || _startPosition.y < -0.1){
			if(u_simulationSpace==1)
				center+= rotation_axis(u_sizeScale*_glesVertex*size,normalize(cross(vec3(0.0,0.0,1.0),vec3(_startPosition.xy,0.0))),_startRotation.x);
			else if(u_simulationSpace==0)
				center+= (rotation_quaternions(u_sizeScale*rotation_axis(_glesVertex*size,normalize(cross(vec3(0.0,0.0,1.0),vec3(_startPosition.xy,0.0))),_startRotation.x),worldRotation));
		}
		else{
			#ifdef SHAPE
				if(u_simulationSpace==1)
					center+= u_sizeScale*rotation_axis(_glesVertex*size,vec3(0.0,-1.0,0.0),_startRotation.x);
				else if(u_simulationSpace==0)
					center+= rotation_quaternions(u_sizeScale*rotation_axis(_glesVertex*size,vec3(0.0,-1.0,0.0),_startRotation.x),worldRotation);	
			#else
				if(u_simulationSpace==1)
					center+= rotation_axis(u_sizeScale*_glesVertex*size,vec3(0.0,0.0,-1.0),_startRotation.x);
				else if(u_simulationSpace==0)
					center+= rotation_quaternions(u_sizeScale*rotation_axis(_glesVertex*size,vec3(0.0,0.0,-1.0),_startRotation.x),worldRotation);
			#endif
		}
	}
	#endif

	gl_Position=glstate_matrix_vp*vec4(center,1.0);
	v_color = computeColor(_startColor, t) * _glesColor;
	v_texcoord = computeUV(_glesMultiTexCoord0, t);
}