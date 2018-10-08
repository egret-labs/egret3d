#ifdef USE_SKINNING

	// Modify Egret.
	// vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinVertex = vec4( transformed, 1.0 );

	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;

	// Modify Egret.
	// transformed = ( bindMatrixInverse * skinned ).xyz;
	transformed = skinned.xyz;

#endif
