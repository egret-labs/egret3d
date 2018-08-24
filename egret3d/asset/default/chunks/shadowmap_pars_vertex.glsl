#ifdef USE_SHADOWMAP

	#if defined(NUM_DIR_LIGHTS) && NUM_DIR_LIGHTS > 0

		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHTS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHTS ];

	#endif

	#if defined(NUM_SPOT_LIGHTS) && NUM_SPOT_LIGHTS > 0

		uniform mat4 spotShadowMatrix[ NUM_SPOT_LIGHTS ];
		varying vec4 vSpotShadowCoord[ NUM_SPOT_LIGHTS ];

	#endif

	#if defined(NUM_POINT_LIGHTS) && NUM_POINT_LIGHTS > 0

		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHTS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHTS ];

	#endif

	/*
	#if NUM_RECT_AREA_LIGHTS > 0

		// TODO (abelnation): uniforms for area light shadows

	#endif
	*/

#endif
