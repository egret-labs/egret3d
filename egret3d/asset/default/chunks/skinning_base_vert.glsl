#ifdef SKINNING
    mat4 boneMatX = buildMat4(int(skinIndex.x));
	mat4 boneMatY = buildMat4(int(skinIndex.y));
	mat4 boneMatZ = buildMat4(int(skinIndex.z));
	mat4 boneMatW = buildMat4(int(skinIndex.w));
	
    mat4 mat = boneMatX*skinWeight.x 
			 + boneMatY*skinWeight.y 
			 + boneMatZ*skinWeight.z 
			 + boneMatW*skinWeight.w;
    
    highp vec4 tmpVertex = vec4((mat* position).xyz, 1.0);
	// highp vec4 tmpVertex = vec4(calcVertex(position,skinIndex,skinWeight).xyz, 1.0);
#else
    // tmpVertex.xyz = position.xyz;
	highp vec4 tmpVertex = vec4(position.xyz, 1.0);
#endif