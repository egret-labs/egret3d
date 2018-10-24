#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )

	attribute vec2 uv2;
	varying vec2 vUv2;
	#ifdef USE_LIGHTMAP//Egret	
		uniform vec4 lightmapScaleOffset;
	#endif

#endif