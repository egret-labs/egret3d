#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )

	attribute vec2 uv2;
	varying vec2 vUv2;
	
 	// modified by egret
	#ifdef USE_LIGHTMAP
		uniform vec4 lightMapScaleOffset;
	#endif

#endif