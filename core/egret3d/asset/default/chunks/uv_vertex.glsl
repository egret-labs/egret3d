#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP ) || defined( USE_EMISSIVEMAP ) || defined( USE_ROUGHNESSMAP ) || defined( USE_METALNESSMAP )
	// modified by egret
	#if defined FLIP_V
		vUv = ( uvTransform * vec3( uv.x, 1.0 - uv.y, 1.0 ) ).xy;
	#else
		vUv = ( uvTransform * vec3( uv, 1.0 ) ).xy;
	#endif
#endif