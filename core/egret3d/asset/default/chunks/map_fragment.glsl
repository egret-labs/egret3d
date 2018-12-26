#ifdef USE_MAP

	vec4 texelColor = texture2D( map, vUv );

	texelColor = mapTexelToLinear( texelColor ); // modified by egret. TODO
	diffuseColor *= texelColor;

#endif
