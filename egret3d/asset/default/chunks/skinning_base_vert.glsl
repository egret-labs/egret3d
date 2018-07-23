#ifdef SKINNING
    mat4 boneMatX = buildMat4(int(_glesBlendIndex4.x));
	mat4 boneMatY = buildMat4(int(_glesBlendIndex4.y));
	mat4 boneMatZ = buildMat4(int(_glesBlendIndex4.z));
	mat4 boneMatW = buildMat4(int(_glesBlendIndex4.w));
	
    mat4 mat = boneMatX*_glesBlendWeight4.x 
			 + boneMatY*_glesBlendWeight4.y 
			 + boneMatZ*_glesBlendWeight4.z 
			 + boneMatW*_glesBlendWeight4.w;
    
    tmpVertex.xyz = (mat* _glesVertex).xyz;
#else
    tmpVertex.xyz = _glesVertex.xyz;
#endif