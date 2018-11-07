vec3 diffuse = vec3( 1.0 );

GeometricContext geometry;
geometry.position = mvPosition.xyz;
geometry.normal = normalize( transformedNormal );
geometry.viewDir = normalize( -mvPosition.xyz );

GeometricContext backGeometry;
backGeometry.position = geometry.position;
backGeometry.normal = -geometry.normal;
backGeometry.viewDir = geometry.viewDir;

vLightFront = vec3( 0.0 );

#ifdef DOUBLE_SIDED
	vLightBack = vec3( 0.0 );
#endif

IncidentLight directLight;
float dotNL;
vec3 directLightColor_Diffuse;

#if defined(NUM_POINT_LIGHTS) && NUM_POINT_LIGHTS > 0
	PointLight pointLight;
	#pragma unroll_loop
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {

		pointLight.position = vec3(pointLights[i * 15 + 0], pointLights[i * 15 + 1], pointLights[i * 15 + 2]);
		pointLight.color = vec3(pointLights[i * 15 + 3], pointLights[i * 15 + 4], pointLights[i * 15 + 5]);
		pointLight.distance = pointLights[i * 15 + 6];
		pointLight.decay = pointLights[i * 15 + 7];
		getPointDirectLightIrradiance( pointLight, geometry, directLight );

		dotNL = dot( geometry.normal, directLight.direction );
		directLightColor_Diffuse = PI * directLight.color;

		vLightFront += saturate( dotNL ) * directLightColor_Diffuse;

		#ifdef DOUBLE_SIDED

			vLightBack += saturate( -dotNL ) * directLightColor_Diffuse;

		#endif

	}

#endif

#if defined(NUM_SPOT_LIGHTS) && NUM_SPOT_LIGHTS > 0
	SpotLight spotLight;
	#pragma unroll_loop
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight.position = vec3(spotLights[i * 18 + 0], spotLights[i * 18 + 1], spotLights[i * 18 + 2]);
		spotLight.direction = vec3(spotLights[i * 18 + 3], spotLights[i * 18 + 4], spotLights[i * 18 + 5]);
		spotLight.color = vec3(spotLights[i * 18 + 6], spotLights[i * 18 + 7], spotLights[i * 18 + 8]);
		spotLight.distance = spotLights[i * 18 + 9];
		spotLight.decay = spotLights[i * 18 + 10];
		spotLight.coneCos = spotLights[i * 18 + 11];
		spotLight.penumbraCos = spotLights[i * 18 + 12];

		getSpotDirectLightIrradiance( spotLight, geometry, directLight );

		dotNL = dot( geometry.normal, directLight.direction );
		directLightColor_Diffuse = PI * directLight.color;

		vLightFront += saturate( dotNL ) * directLightColor_Diffuse;

		#ifdef DOUBLE_SIDED

			vLightBack += saturate( -dotNL ) * directLightColor_Diffuse;

		#endif
	}

#endif

/*
#if NUM_RECT_AREA_LIGHTS > 0

	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {

		// TODO (abelnation): implement

	}

#endif
*/

#if defined(NUM_DIR_LIGHTS) && NUM_DIR_LIGHTS > 0
	DirectionalLight directionalLight;
	#pragma unroll_loop
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {

		directionalLight.direction = vec3(directionalLights[i * 11 + 0], directionalLights[i * 11 + 1], directionalLights[i * 11 + 2]);
		directionalLight.color = vec3(directionalLights[i * 11 + 3], directionalLights[i * 11 + 4], directionalLights[i * 11 + 5]);
		getDirectionalDirectLightIrradiance( directionalLight, geometry, directLight );

		dotNL = dot( geometry.normal, directLight.direction );
		directLightColor_Diffuse = PI * directLight.color;
		// directLightColor_Diffuse = directLight.color;

		vLightFront += saturate( dotNL ) * directLightColor_Diffuse;
		// vLightFront += directLightColor_Diffuse;

		#ifdef DOUBLE_SIDED

			vLightBack += saturate( -dotNL ) * directLightColor_Diffuse;

		#endif

	}

#endif

#if defined(NUM_HEMI_LIGHTS) && NUM_HEMI_LIGHTS > 0

	#pragma unroll_loop
	for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {

		vLightFront += getHemisphereLightIrradiance( hemisphereLights[ i ], geometry );

		#ifdef DOUBLE_SIDED

			vLightBack += getHemisphereLightIrradiance( hemisphereLights[ i ], backGeometry );

		#endif

	}

#endif
