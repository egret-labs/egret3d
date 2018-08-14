#ifdef USE_MAP

	vec4 texelColor = texture2D( map, vUv );

	// texelColor = mapTexelToLinear( texelColor );TODO
	diffuseColor *= texelColor;

#endif
