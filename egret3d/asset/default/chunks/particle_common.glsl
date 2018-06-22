

uniform float u_currentTime;
uniform vec3 u_gravity;

uniform vec3 u_worldPosition;
uniform vec4 u_worldRotation;
uniform bool u_startRotation3D;
uniform int u_scalingMode;
uniform vec3 u_positionScale;
uniform vec3 u_sizeScale;
uniform mat4 glstate_matrix_vp;

#ifdef STRETCHEDBILLBOARD
	uniform vec3 glstate_cameraPos;
#endif
uniform vec3 glstate_cameraForward;
uniform vec3 glstate_cameraUp;

uniform float u_lengthScale;
uniform float u_speeaScale;
uniform int u_simulationSpace;

#if defined(VELOCITYCONSTANT)||defined(VELOCITYCURVE)||defined(VELOCITYTWOCONSTANT)||defined(VELOCITYTWOCURVE)
  uniform int u_spaceType;
#endif
#if defined(VELOCITYCONSTANT)||defined(VELOCITYTWOCONSTANT)
  uniform vec3 u_velocityConst;
#endif
#if defined(VELOCITYCURVE)||defined(VELOCITYTWOCURVE)
  uniform vec2 u_velocityCurveX[4];
  uniform vec2 u_velocityCurveY[4];
  uniform vec2 u_velocityCurveZ[4];
#endif
#ifdef VELOCITYTWOCONSTANT
  uniform vec3 u_velocityConstMax;
#endif
#ifdef VELOCITYTWOCURVE
  uniform vec2 u_velocityCurveMaxX[4];
  uniform vec2 u_velocityCurveMaxY[4];
  uniform vec2 u_velocityCurveMaxZ[4];
#endif

#ifdef COLOROGRADIENT
  uniform vec4 u_colorGradient[4];
  uniform vec2 u_alphaGradient[4];
#endif
#ifdef COLORTWOGRADIENTS
  uniform vec4 u_colorGradient[4];
  uniform vec2 u_alphaGradient[4];
  uniform vec4 u_colorGradientMax[4];
  uniform vec2 u_alphaGradientMax[4];
#endif

#if defined(SIZECURVE)||defined(SIZETWOCURVES)
  uniform vec2 u_sizeCurve[4];
#endif
#ifdef SIZETWOCURVES
  uniform vec2 u_sizeCurveMax[4];
#endif
#if defined(SIZECURVESEPERATE)||defined(SIZETWOCURVESSEPERATE)
  uniform vec2 u_sizeCurveX[4];
  uniform vec2 u_sizeCurveY[4];
  uniform vec2 u_sizeCurveZ[4];
#endif
#ifdef SIZETWOCURVESSEPERATE
  uniform vec2 u_sizeCurveMaxX[4];
  uniform vec2 u_sizeCurveMaxY[4];
  uniform vec2 u_sizeCurveMaxZ[4];
#endif

#ifdef ROTATIONOVERLIFETIME
  #if defined(ROTATIONCONSTANT)||defined(ROTATIONTWOCONSTANTS)
    uniform float u_rotationConst;
  #endif
  #ifdef ROTATIONTWOCONSTANTS
    uniform float u_rotationConstMax;
  #endif
  #if defined(ROTATIONCURVE)||defined(ROTATIONTWOCURVES)
    uniform vec2 u_rotationCurve[4];
  #endif
  #ifdef ROTATIONTWOCURVES
    uniform vec2 u_rotationCurveMax[4];
  #endif
#endif
#ifdef ROTATIONSEPERATE
  #if defined(ROTATIONCONSTANT)||defined(ROTATIONTWOCONSTANTS)
    uniform vec3 u_rotationConstSeprarate;
  #endif
  #ifdef ROTATIONTWOCONSTANTS
    uniform vec3 u_rotationConstMaxSeprarate;
  #endif
  #if defined(ROTATIONCURVE)||defined(ROTATIONTWOCURVES)
    uniform vec2 u_rotationCurveX[4];
    uniform vec2 u_rotationCurveY[4];
    uniform vec2 u_rotationCurveZ[4];
		uniform vec2 u_rotationCurveW[4];
  #endif
  #ifdef ROTATIONTWOCURVES
    uniform vec2 u_rotationCurveMaxX[4];
    uniform vec2 u_rotationCurveMaxY[4];
    uniform vec2 u_rotationCurveMaxZ[4];
		uniform vec2 u_rotationCurveMaxW[4];
  #endif
#endif

#if defined(TEXTURESHEETANIMATIONCURVE)||defined(TEXTURESHEETANIMATIONTWOCURVE)
  uniform float u_cycles;
  uniform vec4 u_subUV;
  uniform vec2 u_uvCurve[4];
#endif
#ifdef TEXTURESHEETANIMATIONTWOCURVE
  uniform vec2 u_uvCurveMax[4];
#endif

varying float v_discard;
varying vec4 v_color;
#ifdef DIFFUSEMAP
	varying vec2 v_texcoord;
#endif
#ifdef RENDERMESH
	varying vec4 v_mesh_color;
#endif

vec3 rotation_euler(in vec3 vector,in vec3 euler)
{
  float halfPitch = euler.x * 0.5;
	float halfYaw = euler.y * 0.5;
	float halfRoll = euler.z * 0.5;

	float sinPitch = sin(halfPitch);
	float cosPitch = cos(halfPitch);
	float sinYaw = sin(halfYaw);
	float cosYaw = cos(halfYaw);
	float sinRoll = sin(halfRoll);
	float cosRoll = cos(halfRoll);

	float quaX = (cosYaw * sinPitch * cosRoll) + (sinYaw * cosPitch * sinRoll);
	float quaY = (sinYaw * cosPitch * cosRoll) - (cosYaw * sinPitch * sinRoll);
	float quaZ = (cosYaw * cosPitch * sinRoll) - (sinYaw * sinPitch * cosRoll);
	float quaW = (cosYaw * cosPitch * cosRoll) + (sinYaw * sinPitch * sinRoll);
	
	float x = quaX + quaX;
  float y = quaY + quaY;
  float z = quaZ + quaZ;
  float wx = quaW * x;
  float wy = quaW * y;
  float wz = quaW * z;
	float xx = quaX * x;
  float xy = quaX * y;
	float xz = quaX * z;
  float yy = quaY * y;
  float yz = quaY * z;
  float zz = quaZ * z;

  return vec3(((vector.x * ((1.0 - yy) - zz)) + (vector.y * (xy - wz))) + (vector.z * (xz + wy)),
              ((vector.x * (xy + wz)) + (vector.y * ((1.0 - xx) - zz))) + (vector.z * (yz - wx)),
              ((vector.x * (xz - wy)) + (vector.y * (yz + wx))) + (vector.z * ((1.0 - xx) - yy)));
	
}

vec3 rotation_axis(in vec3 vector,in vec3 axis, in float angle)
{
	float halfAngle = angle * 0.5;
	float sin = sin(halfAngle);
	
	float quaX = axis.x * sin;
	float quaY = axis.y * sin;
	float quaZ = axis.z * sin;
	float quaW = cos(halfAngle);
	
	float x = quaX + quaX;
  float y = quaY + quaY;
  float z = quaZ + quaZ;
  float wx = quaW * x;
  float wy = quaW * y;
  float wz = quaW * z;
	float xx = quaX * x;
  float xy = quaX * y;
	float xz = quaX * z;
  float yy = quaY * y;
  float yz = quaY * z;
  float zz = quaZ * z;

  return vec3(((vector.x * ((1.0 - yy) - zz)) + (vector.y * (xy - wz))) + (vector.z * (xz + wy)),
              ((vector.x * (xy + wz)) + (vector.y * ((1.0 - xx) - zz))) + (vector.z * (yz - wx)),
              ((vector.x * (xz - wy)) + (vector.y * (yz + wx))) + (vector.z * ((1.0 - xx) - yy)));
}

vec3 rotation_quaternions(in vec3 v,in vec4 q) 
{
	return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);
}

#if defined(VELOCITYCURVE)||defined(VELOCITYTWOCURVE)||defined(SIZECURVE)||defined(SIZECURVESEPERATE)||defined(SIZETWOCURVES)||defined(SIZETWOCURVESSEPERATE)
float evaluate_curve_float(in vec2 curves[4],in float t)
{
	float res;
	for(int i=1;i<4;i++)
	{
		vec2 curve=curves[i];
		float curTime=curve.x;
		if(curTime>=t)
		{
			vec2 lastCurve=curves[i-1];
			float lastTime=lastCurve.x;
			float tt=(t-lastTime)/(curTime-lastTime);
			res=mix(lastCurve.y,curve.y,tt);
			break;
		}
	}
	return res;
}
#endif

#if defined(VELOCITYCURVE)||defined(VELOCITYTWOCURVE)||defined(ROTATIONCURVE)||defined(ROTATIONTWOCURVES)
float evaluate_curve_total(in vec2 curves[4],in float t)
{
	float res=0.0;
	for(int i=1;i<4;i++)
	{
		vec2 curve=curves[i];
		float curTime=curve.x;
		vec2 lastCurve=curves[i-1];
		float lastValue=lastCurve.y;
		
		if(curTime>=t){
			float lastTime=lastCurve.x;
			float tt=(t-lastTime)/(curTime-lastTime);
			res+=(lastValue+mix(lastValue,curve.y,tt))/2.0*_time.x*(t-lastTime);
			break;
		}
		else{
			res+=(lastValue+curve.y)/2.0*_time.x*(curTime-lastCurve.x);
		}
	}
	return res;
}
#endif

#if defined(COLOROGRADIENT)||defined(COLORTWOGRADIENTS)
vec4 evaluate_curve_color(in vec2 gradientAlphas[4],in vec4 gradientColors[4],in float t)
{
	vec4 overTimeColor;
	for(int i=1;i<4;i++)
	{
		vec2 gradientAlpha=gradientAlphas[i];
		float alphaKey=gradientAlpha.x;
		if(alphaKey>=t)
		{
			vec2 lastGradientAlpha=gradientAlphas[i-1];
			float lastAlphaKey=lastGradientAlpha.x;
			float age=(t-lastAlphaKey)/(alphaKey-lastAlphaKey);
			overTimeColor.a=mix(lastGradientAlpha.y,gradientAlpha.y,age);
			break;
		}
	}
	
	for(int i=1;i<4;i++)
	{
		vec4 gradientColor=gradientColors[i];
		float colorKey=gradientColor.x;
		if(colorKey>=t)
		{
			vec4 lastGradientColor=gradientColors[i-1];
			float lastColorKey=lastGradientColor.x;
			float age=(t-lastColorKey)/(colorKey-lastColorKey);
			overTimeColor.rgb=mix(gradientColors[i-1].yzw,gradientColor.yzw,age);
			break;
		}
	}
	return overTimeColor;
}
#endif


#if defined(TEXTURESHEETANIMATIONCURVE)||defined(TEXTURESHEETANIMATIONTWOCURVE)
float evaluate_curve_frame(in vec2 gradientFrames[4],in float t)
{
	float overTimeFrame;
	for(int i=1;i<4;i++)
	{
		vec2 gradientFrame=gradientFrames[i];
		float key=gradientFrame.x;
		if(key>=t)
		{
			vec2 lastGradientFrame=gradientFrames[i-1];
			float lastKey=lastGradientFrame.x;
			float age=(t-lastKey)/(key-lastKey);
			overTimeFrame=mix(lastGradientFrame.y,gradientFrame.y,age);
			break;
		}
	}
	return floor(overTimeFrame);
}
#endif

vec3 computeVelocity(in float t)
{
  vec3 res;
  #ifdef VELOCITYCONSTANT
	 res=u_velocityConst; 
  #endif
  #ifdef VELOCITYCURVE
     res= vec3(evaluate_curve_float(u_velocityCurveX,t),evaluate_curve_float(u_velocityCurveY,t),evaluate_curve_float(u_velocityCurveZ,t));
  #endif
  #ifdef VELOCITYTWOCONSTANT
	 res=mix(u_velocityConst,u_velocityConstMax,vec3(_random1.y,_random1.z,_random1.w)); 
  #endif
  #ifdef VELOCITYTWOCURVE
     res=vec3(mix(evaluate_curve_float(u_velocityCurveX,t),evaluate_curve_float(u_velocityCurveMaxX,t),_random1.y),
	            mix(evaluate_curve_float(u_velocityCurveY,t),evaluate_curve_float(u_velocityCurveMaxY,t),_random1.z),
					 		mix(evaluate_curve_float(u_velocityCurveZ,t),evaluate_curve_float(u_velocityCurveMaxZ,t),_random1.w));
  #endif
					
  return res;
} 

vec3 computePosition(in vec3 startVelocity, in vec3 lifeVelocity,in float age,in float t,vec3 gravityVelocity,vec4 worldRotation)
{
   	vec3 startPosition;
   	vec3 lifePosition;
		#if defined(VELOCITYCONSTANT)||defined(VELOCITYCURVE)||defined(VELOCITYTWOCONSTANT)||defined(VELOCITYTWOCURVE)
			#ifdef VELOCITYCONSTANT
				  startPosition=startVelocity*age;
				  lifePosition=lifeVelocity*age;
			#endif
			#ifdef VELOCITYCURVE
				  startPosition=startVelocity*age;
				  lifePosition=vec3(evaluate_curve_total(u_velocityCurveX,t),evaluate_curve_total(u_velocityCurveY,t),evaluate_curve_total(u_velocityCurveZ,t));
			#endif
			#ifdef VELOCITYTWOCONSTANT
				  startPosition=startVelocity*age;
				  lifePosition=lifeVelocity*age;
			#endif
			#ifdef VELOCITYTWOCURVE
				  startPosition=startVelocity*age;
				  lifePosition=vec3(mix(evaluate_curve_total(u_velocityCurveX,t),evaluate_curve_total(u_velocityCurveMaxX,t),_random1.y)
			      								,mix(evaluate_curve_total(u_velocityCurveY,t),evaluate_curve_total(u_velocityCurveMaxY,t),_random1.z)
			      								,mix(evaluate_curve_total(u_velocityCurveZ,t),evaluate_curve_total(u_velocityCurveMaxZ,t),_random1.w));
			#endif

			vec3 finalPosition;
			if(u_spaceType==0){
			  if(u_scalingMode!=2)
			   finalPosition =rotation_quaternions(u_positionScale*(_startPosition.xyz+startPosition+lifePosition),worldRotation);
			  else
			   finalPosition =rotation_quaternions(u_positionScale*_startPosition.xyz+startPosition+lifePosition,worldRotation);
			}
			else{
			  if(u_scalingMode!=2)
			    finalPosition = rotation_quaternions(u_positionScale*(_startPosition.xyz+startPosition),worldRotation)+lifePosition;
			  else
			    finalPosition = rotation_quaternions(u_positionScale*_startPosition.xyz+startPosition,worldRotation)+lifePosition;
			}
		  #else
			 startPosition=startVelocity*age;
			 vec3 finalPosition;
			 if(u_scalingMode!=2)
			   finalPosition = rotation_quaternions(u_positionScale*(_startPosition.xyz+startPosition),worldRotation);
			 else
			   finalPosition = rotation_quaternions(u_positionScale*_startPosition.xyz+startPosition,worldRotation);
		#endif
  
  if(u_simulationSpace==1)
    finalPosition=finalPosition+_startWorldPosition;
  else if(u_simulationSpace==0) 
    finalPosition=finalPosition+u_worldPosition;
  
  finalPosition+=0.5*gravityVelocity*age;
 
  return finalPosition;
}


vec4 computeColor(in vec4 color,in float t)
{
	#ifdef COLOROGRADIENT
	  color*=evaluate_curve_color(u_alphaGradient,u_colorGradient,t);
	#endif	
	#ifdef COLORTWOGRADIENTS
	  color*=mix(evaluate_curve_color(u_alphaGradient,u_colorGradient,t),evaluate_curve_color(u_alphaGradientMax,u_colorGradientMax,t),_random0.y);
	#endif

  return color;
}

vec2 computeBillbardSize(in vec2 size,in float t)
{
	#ifdef SIZECURVE
		size*=evaluate_curve_float(u_sizeCurve,t);
	#endif
	#ifdef SIZETWOCURVES
	  size*=mix(evaluate_curve_float(u_sizeCurve,t),evaluate_curve_float(u_sizeCurveMax,t),_random0.z); 
	#endif
	#ifdef SIZECURVESEPERATE
		size*=vec2(evaluate_curve_float(u_sizeCurveX,t),evaluate_curve_float(u_sizeCurveY,t));
	#endif
	#ifdef SIZETWOCURVESSEPERATE
	  size*=vec2(mix(evaluate_curve_float(u_sizeCurveX,t),evaluate_curve_float(u_sizeCurveMaxX,t),_random0.z)
	    				,mix(evaluate_curve_float(u_sizeCurveY,t),evaluate_curve_float(u_sizeCurveMaxY,t),_random0.z));
	#endif
	return size;
}

#ifdef RENDERMESH
vec3 computeMeshSize(in vec3 size,in float t)
{
	#ifdef SIZECURVE
		size*=evaluate_curve_float(u_sizeCurve,t);
	#endif
	#ifdef SIZETWOCURVES
	  size*=mix(evaluate_curve_float(u_sizeCurve,t),evaluate_curve_float(u_sizeCurveMax,t),_random0.z); 
	#endif
	#ifdef SIZECURVESEPERATE
		size*=vec3(evaluate_curve_float(u_sizeCurveX,t),evaluate_curve_float(u_sizeCurveY,t),evaluate_curve_float(u_sizeCurveZ,t));
	#endif
	#ifdef SIZETWOCURVESSEPERATE
	  size*=vec3(mix(evaluate_curve_float(u_sizeCurveX,t),evaluate_curve_float(u_sizeCurveMaxX,t),_random0.z)
	  			  	,mix(evaluate_curve_float(u_sizeCurveY,t),evaluate_curve_float(u_sizeCurveMaxY,t),_random0.z)
							,mix(evaluate_curve_float(u_sizeCurveZ,t),evaluate_curve_float(u_sizeCurveMaxZ,t),_random0.z));
	#endif
	return size;
}
#endif

float computeRotation(in float rotation,in float age,in float t)
{ 
	#ifdef ROTATIONOVERLIFETIME
		#ifdef ROTATIONCONSTANT
			float ageRot=u_rotationConst*age;
	        rotation+=ageRot;
		#endif
		#ifdef ROTATIONCURVE
			rotation+=evaluate_curve_total(u_rotationCurve,t);
		#endif
		#ifdef ROTATIONTWOCONSTANTS
			float ageRot=mix(u_rotationConst,u_rotationConstMax,_random0.w)*age;
	    rotation+=ageRot;
	  #endif
		#ifdef ROTATIONTWOCURVES
			rotation+=mix(evaluate_curve_total(u_rotationCurve,t),evaluate_curve_total(u_rotationCurveMax,t),_random0.w);
		#endif
	#endif
	#ifdef ROTATIONSEPERATE
		#ifdef ROTATIONCONSTANT
			float ageRot=u_rotationConstSeprarate.z*age;
	        rotation+=ageRot;
		#endif
		#ifdef ROTATIONCURVE
			rotation+=evaluate_curve_total(u_rotationCurveZ,t);
		#endif
		#ifdef ROTATIONTWOCONSTANTS
			float ageRot=mix(u_rotationConstSeprarate.z,u_rotationConstMaxSeprarate.z,_random0.w)*age;
	        rotation+=ageRot;
	    #endif
		#ifdef ROTATIONTWOCURVES
			rotation+=mix(evaluate_curve_total(u_rotationCurveZ,t),evaluate_curve_total(u_rotationCurveMaxZ,t),_random0.w));
		#endif
	#endif
	return rotation;
}

#if defined(RENDERMESH)&&(defined(ROTATIONOVERLIFETIME)||defined(ROTATIONSEPERATE))
vec3 compute3DRotation(in vec3 rotation,in float age,in float t)
{ 
	#ifdef ROTATIONOVERLIFETIME
			#ifdef ROTATIONCONSTANT
					float ageRot=u_rotationConst*age;
			    rotation+=ageRot;
			#endif
			#ifdef ROTATIONCURVE
					rotation+=evaluate_curve_total(u_rotationCurve,t);
			#endif
			#ifdef ROTATIONTWOCONSTANTS
					float ageRot=mix(u_rotationConst,u_rotationConstMax,_random0.w)*age;
			    rotation+=ageRot;
			#endif
			#ifdef ROTATIONTWOCURVES
					rotation+=mix(evaluate_curve_total(u_rotationCurve,t),evaluate_curve_total(u_rotationCurveMax,t),_random0.w);
			#endif
	#endif
	#ifdef ROTATIONSEPERATE
				#ifdef ROTATIONCONSTANT
					vec3 ageRot=u_rotationConstSeprarate*age;
			        rotation+=ageRot;
				#endif
				#ifdef ROTATIONCURVE
					rotation+=vec3(evaluate_curve_total(u_rotationCurveX,t),evaluate_curve_total(u_rotationCurveY,t),evaluate_curve_total(u_rotationCurveZ,t));
				#endif
				#ifdef ROTATIONTWOCONSTANTS
					vec3 ageRot=mix(u_rotationConstSeprarate,u_rotationConstMaxSeprarate,_random0.w)*age;
			        rotation+=ageRot;
			  #endif
				#ifdef ROTATIONTWOCURVES
					rotation+=vec3(mix(evaluate_curve_total(u_rotationCurveX,t),evaluate_curve_total(u_rotationCurveMaxX,t),_random0.w)
			        ,mix(evaluate_curve_total(u_rotationCurveY,t),evaluate_curve_total(u_rotationCurveMaxY,t),_random0.w)
			        ,mix(evaluate_curve_total(u_rotationCurveZ,t),evaluate_curve_total(u_rotationCurveMaxZ,t),_random0.w));
				#endif
	#endif
	return rotation;
}
#endif

vec2 computeUV(in vec2 uv,in float t)
{ 
	#ifdef TEXTURESHEETANIMATIONCURVE
		float cycleNormalizedAge=t*u_cycles;
		float uvNormalizedAge=cycleNormalizedAge-floor(cycleNormalizedAge);
		float frame=evaluate_curve_frame(u_uvCurve,uvNormalizedAge);
		uv.x *= u_subUV.x + u_subUV.z;
		uv.y *= u_subUV.y + u_subUV.w;
		float totalULength=frame*u_subUV.x;
		float floorTotalULength=floor(totalULength);
	  uv.x+=totalULength-floorTotalULength;
		uv.y+=floorTotalULength*u_subUV.y;
    #endif
	#ifdef TEXTURESHEETANIMATIONTWOCURVE
		float cycleNormalizedAge=t*u_cycles;
		float uvNormalizedAge=cycleNormalizedAge-floor(cycleNormalizedAge);
	  float frame=floor(mix(evaluate_curve_frame(u_uvCurve,uvNormalizedAge),evaluate_curve_frame(u_uvCurveMax,uvNormalizedAge),_random1.x));
		uv.x *= u_subUV.x + u_subUV.z;
		uv.y *= u_subUV.y + u_subUV.w;
		float totalULength=frame*u_subUV.x;
		float floorTotalULength=floor(totalULength);
	  uv.x+=totalULength-floorTotalULength;
		uv.y+=floorTotalULength*u_subUV.y;
    #endif
	return uv;
}