#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )

	#ifdef USE_LIGHTMAP//Egret
		vUv2 = vec2(uv2.x * lightMapScaleOffset.x + lightMapScaleOffset.z, 1.0 - ((1.0 - uv2.y) * lightMapScaleOffset.y + lightMapScaleOffset.w));
	#else	
		vUv2 = uv2;
	#endif

#endif