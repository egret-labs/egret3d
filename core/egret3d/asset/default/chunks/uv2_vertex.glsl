#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )

	#ifdef USE_LIGHTMAP//Egret
		vUv2 = vec2(uv2.x * lightmapScaleOffset.x + lightmapScaleOffset.z, 1.0 - ((1.0 - uv2.y) * lightmapScaleOffset.y + lightmapScaleOffset.w));
	#else	
		vUv2 = uv2;
	#endif

#endif