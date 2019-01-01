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

#if NUM_POINT_LIGHTS > 0
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

		dotNL = dot( geometry.normal, directLight.direction );
		directLightColor_Diffuse = PI * directLight.color;

		vLightFront += saturate( dotNL ) * directLightColor_Diffuse;

		#ifdef DOUBLE_SIDED

			vLightBack += saturate( -dotNL ) * directLightColor_Diffuse;

		#endif

	}

#endif

#if NUM_SPOT_LIGHTS > 0
	SpotLight spotLight;
	#pragma unroll_loop
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {

 		// modified by egret
		// spotLight = spotLights[ i ];
		spotLight.position = vec3(spotLights[ i  * 18 + 0], spotLights[ i  * 18 + 1], spotLights[ i  * 18 + 2]);
		spotLight.direction = vec3(spotLights[ i  * 18 + 3], spotLights[ i  * 18 + 4], spotLights[ i  * 18 + 5]);
		spotLight.color = vec3(spotLights[ i  * 18 + 6], spotLights[ i  * 18 + 7], spotLights[ i  * 18 + 8]);
		spotLight.distance = spotLights[ i  * 18 + 9];
		spotLight.decay = spotLights[ i  * 18 + 10];
		spotLight.coneCos = spotLights[ i  * 18 + 11];
		spotLight.penumbraCos = spotLights[ i  * 18 + 12];

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

#if NUM_DIR_LIGHTS > 0
	DirectionalLight directionalLight;
	#pragma unroll_loop
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {

 		// modified by egret
		// directionalLight = directionalLights[ i ];
		directionalLight.direction = vec3(directionalLights[ i  * 11 + 0], directionalLights[ i  * 11 + 1], directionalLights[ i  * 11 + 2]);
		directionalLight.color = vec3(directionalLights[ i  * 11 + 3], directionalLights[ i  * 11 + 4], directionalLights[ i  * 11 + 5]);
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

#if NUM_HEMI_LIGHTS > 0

	HemisphereLight hemisphereLight;
	
	#pragma unroll_loop
	for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {

		// modified by egret
		// hemisphereLight = hemisphereLights[ i ];
		hemisphereLight.direction = vec3(hemisphereLights[ i  * 9 + 0], hemisphereLights[ i  * 9 + 1], hemisphereLights[ i  * 9 + 2]);
		hemisphereLight.skyColor = vec3(hemisphereLights[ i  * 9 + 3], hemisphereLights[ i  * 9 + 4], hemisphereLights[ i  * 9 + 5]);
		hemisphereLight.groundColor = vec3(hemisphereLights[ i  * 9 + 6], hemisphereLights[ i  * 9 + 7], hemisphereLights[ i  * 9 + 8]);

		vLightFront += getHemisphereLightIrradiance( hemisphereLight, geometry );

		#ifdef DOUBLE_SIDED

			vLightBack += getHemisphereLightIrradiance( hemisphereLight, backGeometry );

		#endif

	}

#endif
