float getShadowMask() {

	float shadow = 1.0;

	#ifdef USE_SHADOWMAP

	#if NUM_DIR_LIGHTS > 0

	DirectionalLight directionalLight;

	#pragma unroll_loop
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {

 		// modified by egret
		// directionalLight = directionalLights[ i ];
		directionalLight.shadow = int(directionalLights[ i  * 11 + 6]);
		directionalLight.shadowBias = directionalLights[ i  * 11 + 7];
		directionalLight.shadowRadius = directionalLights[ i  * 11 + 8];
		directionalLight.shadowMapSize = vec2(directionalLights[ i  * 11 + 9], directionalLights[ i  * 11 + 10]);

		shadow *= bool( directionalLight.shadow ) ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;

	}

	#endif

	#if NUM_SPOT_LIGHTS > 0

	SpotLight spotLight;

	#pragma unroll_loop
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {

 		// modified by egret
		// spotLight = spotLights[ i ];
		spotLight.shadow = int(spotLights[ i  * 18 + 13]);
		spotLight.shadowBias = spotLights[ i  * 18 + 14];
		spotLight.shadowRadius = spotLights[ i  * 18 + 15];
		spotLight.shadowMapSize = vec2(spotLights[ i  * 18 + 16], spotLights[ i  * 18 + 17]);

		shadow *= bool(spotLight.shadow) ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotShadowCoord[ i ] ) : 1.0;

	}

	#endif

	#if NUM_POINT_LIGHTS > 0

	PointLight pointLight;

	#pragma unroll_loop
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {

 		// modified by egret
		// pointLight = pointLights[ i ];
		pointLight.shadow = int(pointLights[ i  * 15 + 8]);
		pointLight.shadowBias = pointLights[ i  * 15 + 9];
		pointLight.shadowRadius = pointLights[ i  * 15 + 10];
		pointLight.shadowMapSize = vec2(pointLights[ i  * 15 + 11], pointLights[ i  * 15 + 12]);
		pointLight.shadowCameraNear = pointLights[ i  * 15 + 13];
		pointLight.shadowCameraFar = pointLights[ i  * 15 + 14];

		shadow *= bool(pointLight.shadow) ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;

	}

	#endif

	/*
	#if NUM_RECT_AREA_LIGHTS > 0

		// TODO (abelnation): update shadow for Area light

	#endif
	*/

	#endif

	return shadow;

}
