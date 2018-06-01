vec3 lifeVelocity = computeVelocity(t);
vec4 worldRotation;
if(u_simulationSpace==1)
	worldRotation=_startWorldRotation;
else
	worldRotation=u_worldRotation;
vec3 gravity=u_gravity*age;

vec3 center=computePosition(_startVelocity, lifeVelocity, age, t,gravity,worldRotation); 
#ifdef SPHERHBILLBOARD
			vec2 corner=_glesCorner.xy;
	     vec3 cameraUpVector =normalize(glstate_cameraUp);
	     vec3 sideVector = normalize(cross(glstate_cameraForward,cameraUpVector));
	     vec3 upVector = normalize(cross(sideVector,glstate_cameraForward));
	   	corner*=computeBillbardSize(_startSize.xy,t);
		#if defined(ROTATIONOVERLIFETIME)||defined(ROTATIONSEPERATE)
			if(u_startSize3D){
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
			if(u_startSize3D){
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
	   corner=rotation*corner*cos(0.78539816339744830961566084581988);
		corner*=computeBillbardSize(_startSize.xy,t);
	   center +=u_sizeScale.xzy*(corner.x*sideVector+ corner.y*cameraUpVector);
	#endif
	#ifdef RENDERMESH
	   vec3 size=computeMeshSize(_startSize,t);
		#if defined(ROTATIONOVERLIFETIME)||defined(ROTATIONSEPERATE)
				if(u_startSize3D){
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
		if(u_startSize3D){
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
		v_mesh_color=_glesColor;
	 #endif