/**
 * This is a template that can be used to light a material, it uses pluggable
 * RenderEquations (RE)for specific lighting scenarios.
 *
 * Instructions for use:
 * - Ensure that both RE_Direct, RE_IndirectDiffuse and RE_IndirectSpecular are defined
 * - If you have defined an RE_IndirectSpecular, you need to also provide a Material_LightProbeLOD. <---- ???
 * - Create a material parameter that is to be passed as the third parameter to your lighting functions.
 *
 * TODO:
 * - Add area light support.
 * - Add sphere light support.
 * - Add diffuse light probe (irradiance cubemap) support.
 */

GeometricContext geometry;

geometry.position = - vViewPosition;
geometry.normal = normal;
geometry.viewDir = normalize( vViewPosition );

IncidentLight directLight;

#if (NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )

	PointLight pointLight;

	#pragma unroll_loop
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {

 		// modified by egret
		// pointLight = pointLights[ i ];
		pointLight.position = vec3(pointLights[ i  * 15 + 0], pointLights[ i  * 15 + 1], pointLights[ i  * 15 + 2]);
		pointLight.color = vec3(pointLights[ i  * 15 + 3], pointLights[ i  * 15 + 4], pointLights[ i  * 15 + 5]);
		pointLight.distance = pointLights[ i  * 15 + 6];
		pointLight.decay = pointLights[ i  * 15 + 7];

		getPointDirectLightIrradiance( pointLight, geometry, directLight );

		#ifdef USE_SHADOWMAP

 		// modified by egret
		pointLight.shadow = int(pointLights[ i  * 15 + 8]);
		pointLight.shadowBias = pointLights[ i  * 15 + 9];
		pointLight.shadowRadius = pointLights[ i  * 15 + 10];
		pointLight.shadowMapSize = vec2(pointLights[ i  * 15 + 11], pointLights[ i  * 15 + 12]);
		pointLight.shadowCameraNear = pointLights[ i  * 15 + 13];
		pointLight.shadowCameraFar = pointLights[ i  * 15 + 14];

		directLight.color *= all( bvec2( pointLight.shadow, directLight.visible ) ) ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
		#endif

		RE_Direct( directLight, geometry, material, reflectedLight );

	}

#endif

#if (NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )

	SpotLight spotLight;

	#pragma unroll_loop
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {

		// modified by egret
		// spotLight = spotLights[ i ];
		spotLight.position = vec3(spotLights[ i  * 18 + 0], spotLights[ i  * 18 + 1], spotLights[ i  * 18 + 2]);
		spotLight.direction = vec3(spotLights[ i  * 18 + 3], spotLights[ i  * 18 + 4], spotLights[ i  * 18 + 5]);
		spotLight.color = vec3(spotLights[ i  * 18 + 6], spotLights[ i  * 18 + 7], spotLights[ i  * 18 + 8]);
		spotLight.distance = spotLights[ i  * 18 + 9]
		spotLight.decay = spotLights[ i  * 18 + 10]
		spotLight.coneCos = spotLights[ i  * 18 + 11]
		spotLight.penumbraCos = spotLights[ i  * 18 + 12]

		getSpotDirectLightIrradiance( spotLight, geometry, directLight );

		#ifdef USE_SHADOWMAP
		
 		// modified by egret
		spotLight.shadow = int(spotLights[ i  * 18 + 13]);
		spotLight.shadowBias = spotLights[ i  * 18 + 14];
		spotLight.shadowRadius = spotLights[ i  * 18 + 15];
		spotLight.shadowMapSize = vec2(spotLights[ i  * 18 + 16], spotLights[ i  * 18 + 17]);

		directLight.color *= all( bvec2( spotLight.shadow, directLight.visible ) ) ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotShadowCoord[ i ] ) : 1.0;
		#endif

		RE_Direct( directLight, geometry, material, reflectedLight );

	}

#endif

#if (NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )

	DirectionalLight directionalLight;

	#pragma unroll_loop
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {

 		// modified by egret
		// directionalLight = directionalLights[ i ];
		directionalLight.direction = vec3(directionalLights[ i  * 11 + 0], directionalLights[ i  * 11 + 1], directionalLights[ i  * 11 + 2]);
		directionalLight.color = vec3(directionalLights[ i  * 11 + 3], directionalLights[ i  * 11 + 4], directionalLights[ i  * 11 + 5]);

		getDirectionalDirectLightIrradiance( directionalLight, geometry, directLight );

		#ifdef USE_SHADOWMAP

 		// modified by egret
		directionalLight.shadow = int(directionalLights[ i  * 11 + 6]);
		directionalLight.shadowBias = directionalLights[ i  * 11 + 7];
		directionalLight.shadowRadius = directionalLights[ i  * 11 + 8];
		directionalLight.shadowMapSize = vec2(directionalLights[ i  * 11 + 9], directionalLights[ i  * 11 + 10]);

		directLight.color *= all( bvec2( directionalLight.shadow, directLight.visible ) ) ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif

		RE_Direct( directLight, geometry, material, reflectedLight );

	}

#endif

#if (NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )

	RectAreaLight rectAreaLight;

	#pragma unroll_loop
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {

 		// modified by egret
		// rectAreaLight = rectAreaLights[ i ];
		rectAreaLight.position = vec3(rectAreaLights[ i  * 12 + 0], rectAreaLights[ i  * 12 + 1], rectAreaLights[ i  * 12 + 2]);
		rectAreaLight.color = vec3(rectAreaLights[ i  * 12 + 3], rectAreaLights[ i  * 12 + 4], rectAreaLights[ i  * 12 + 5]);
		rectAreaLight.halfWidth = vec3(rectAreaLights[ i  * 12 + 6], rectAreaLights[ i  * 12 + 7], rectAreaLights[ i  * 12 + 8]);
		rectAreaLight.halfHeight = vec3(rectAreaLights[ i  * 12 + 9], rectAreaLights[ i  * 12 + 10], rectAreaLights[ i  * 12 + 11]);

		RE_Direct_RectArea( rectAreaLight, geometry, material, reflectedLight );

	}

#endif

#if defined( RE_IndirectDiffuse )

	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );

	#if (NUM_HEMI_LIGHTS > 0 )
		
		HemisphereLight hemisphereLight;

		#pragma unroll_loop
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {

 			// modified by egret
			// hemisphereLight = hemisphereLights[ i ];
			hemisphereLight.direction = vec3(hemisphereLights[ i  * 9 + 0], hemisphereLights[ i  * 9 + 1], hemisphereLights[ i  * 9 + 2]);
			hemisphereLight.skyColor = vec3(hemisphereLights[ i  * 9 + 3], hemisphereLights[ i  * 9 + 4], hemisphereLights[ i  * 9 + 5]);
			hemisphereLight.groundColor = vec3(hemisphereLights[ i  * 9 + 6], hemisphereLights[ i  * 9 + 7], hemisphereLights[ i  * 9 + 8]);

			irradiance += getHemisphereLightIrradiance( hemisphereLight, geometry );

		}

	#endif

#endif

#if defined( RE_IndirectSpecular )

	vec3 radiance = vec3( 0.0 );
	vec3 clearCoatRadiance = vec3( 0.0 );

#endif
