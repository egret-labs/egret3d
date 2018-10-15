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

#if (defined(NUM_POINT_LIGHTS) && NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )

	PointLight pointLight;

	// #pragma unroll_loop
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {

		// pointLight = pointLights[ i ];
		pointLight.position = vec3(pointLights[i* 15 + 0], pointLights[i * 15 + 1], pointLights[i * 15 + 2]);
		pointLight.color = vec3(pointLights[i* 15 + 3], pointLights[i * 15 + 4], pointLights[i * 15 + 5]);
		pointLight.distance = pointLights[i * 15 + 6];
		pointLight.decay = pointLights[i * 15 + 7];

		getPointDirectLightIrradiance( pointLight, geometry, directLight );

		#ifdef USE_SHADOWMAP
		directLight.color *= all( bvec2( pointLight.shadow, directLight.visible ) ) ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
		#endif

		RE_Direct( directLight, geometry, material, reflectedLight );

	}

#endif

#if (defined(NUM_SPOT_LIGHTS) && NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )

	SpotLight spotLight;

	// #pragma unroll_loop
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {

		// spotLight = spotLights[ i ];
		spotLight.position = vec3(spotLights[i * 18 + 0], spotLights[i * 18 + 1], spotLights[i * 18 + 2]);
		spotLight.direction = vec3(spotLights[i * 18 + 3], spotLights[i * 18 + 4], spotLights[i * 18 + 5]);
		spotLight.color = vec3(spotLights[i * 18 + 6], spotLights[i * 18 + 7], spotLights[i * 18 + 8]);
		spotLight.distance = spotLights[i * 18 + 9];
		spotLight.decay = spotLights[i * 18 + 10];
		spotLight.coneCos = spotLights[i * 18 + 11];
		spotLight.penumbraCos = spotLights[i * 18 + 12];
		getSpotDirectLightIrradiance( spotLight, geometry, directLight );

		#ifdef USE_SHADOWMAP
		directLight.color *= all( bvec2( spotLight.shadow, directLight.visible ) ) ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotShadowCoord[ i ] ) : 1.0;
		#endif

		RE_Direct( directLight, geometry, material, reflectedLight );

	}

#endif

#if (defined(NUM_DIR_LIGHTS) && NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )

	DirectionalLight directionalLight;

	// #pragma unroll_loop
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {

		// directionalLight = directionalLights[ i ];
		directionalLight.direction = vec3(directionalLights[i * 11 + 0], directionalLights[i * 11 + 1], directionalLights[i * 11 + 2]);
		directionalLight.color = vec3(directionalLights[i * 11 + 3], directionalLights[i * 11 + 4], directionalLights[i * 11 + 5]);
		getDirectionalDirectLightIrradiance( directionalLight, geometry, directLight );

		#ifdef USE_SHADOWMAP
		directLight.color *= all( bvec2( directionalLight.shadow, directLight.visible ) ) ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif

		RE_Direct( directLight, geometry, material, reflectedLight );

	}

#endif

#if (defined(NUM_RECT_AREA_LIGHTS) &&  NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )

	RectAreaLight rectAreaLight;

	// #pragma unroll_loop
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {

		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometry, material, reflectedLight );

	}

#endif

#if defined( RE_IndirectDiffuse )

	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );

	#if (defined(NUM_HEMI_LIGHTS) &&  NUM_HEMI_LIGHTS > 0 )

		// #pragma unroll_loop
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {

			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometry );

		}

	#endif

#endif

#if defined( RE_IndirectSpecular )

	vec3 radiance = vec3( 0.0 );
	vec3 clearCoatRadiance = vec3( 0.0 );

#endif
