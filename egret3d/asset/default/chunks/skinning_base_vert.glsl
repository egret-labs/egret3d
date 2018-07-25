#ifdef SKINNING
    mat4 boneMatX = buildMat4(int(_glesBlendIndex4.x));
	mat4 boneMatY = buildMat4(int(_glesBlendIndex4.y));
	mat4 boneMatZ = buildMat4(int(_glesBlendIndex4.z));
	mat4 boneMatW = buildMat4(int(_glesBlendIndex4.w));
	
    mat4 mat = boneMatX*_glesBlendWeight4.x 
			 + boneMatY*_glesBlendWeight4.y 
			 + boneMatZ*_glesBlendWeight4.z 
			 + boneMatW*_glesBlendWeight4.w;
    
    highp vec4 tmpVertex = vec4((mat* _glesVertex).xyz, 1.0);
	// highp vec4 tmpVertex = vec4(calcVertex(_glesVertex,_glesBlendIndex4,_glesBlendWeight4).xyz, 1.0);
#else
    // tmpVertex.xyz = _glesVertex.xyz;
	highp vec4 tmpVertex = vec4(_glesVertex.xyz, 1.0);
#endif