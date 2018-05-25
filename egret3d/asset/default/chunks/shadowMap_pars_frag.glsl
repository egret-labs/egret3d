#ifdef USE_SHADOW

    #include <packing>

    #ifdef USE_DIRECT_LIGHT

        uniform sampler2D glstate_directionalShadowMap[ USE_DIRECT_LIGHT ];
        varying vec4 vDirectionalShadowCoord[ USE_DIRECT_LIGHT ];

    #endif

    #ifdef USE_POINT_LIGHT

        uniform samplerCube glstate_pointShadowMap[ USE_POINT_LIGHT ];

    #endif

    #ifdef USE_SPOT_LIGHT

        uniform sampler2D glstate_spotShadowMap[ USE_SPOT_LIGHT ];
        varying vec4 vSpotShadowCoord[ USE_SPOT_LIGHT ];

    #endif

    float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {

        return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );

    }

    float textureCubeCompare( samplerCube depths, vec3 uv, float compare ) {

        return step( compare, unpackRGBAToDepth( textureCube( depths, uv ) ) );

    }

    float getShadow( sampler2D shadowMap, vec4 shadowCoord, float shadowBias, float shadowRadius, vec2 shadowMapSize ) {
        shadowCoord.xyz /= shadowCoord.w;

        float depth = shadowCoord.z + shadowBias;

        bvec4 inFrustumVec = bvec4 ( shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0 );
        bool inFrustum = all( inFrustumVec );

        bvec2 frustumTestVec = bvec2( inFrustum, depth <= 1.0 );

        bool frustumTest = all( frustumTestVec );

        if ( frustumTest ) {
            #ifdef USE_PCF_SOFT_SHADOW
                // TODO x, y not equal
                float texelSize = shadowRadius / shadowMapSize.x;

                vec2 poissonDisk[4];
                poissonDisk[0] = vec2(-0.94201624, -0.39906216);
                poissonDisk[1] = vec2(0.94558609, -0.76890725);
                poissonDisk[2] = vec2(-0.094184101, -0.92938870);
                poissonDisk[3] = vec2(0.34495938, 0.29387760);

                return texture2DCompare( shadowMap, shadowCoord.xy + poissonDisk[0] * texelSize, depth ) * 0.25 +
                    texture2DCompare( shadowMap, shadowCoord.xy + poissonDisk[1] * texelSize, depth ) * 0.25 +
                    texture2DCompare( shadowMap, shadowCoord.xy + poissonDisk[2] * texelSize, depth ) * 0.25 +
                    texture2DCompare( shadowMap, shadowCoord.xy + poissonDisk[3] * texelSize, depth ) * 0.25;
            #else
                return texture2DCompare( shadowMap, shadowCoord.xy, depth );
            #endif
        }

        return 1.0;

    }

    float getPointShadow( samplerCube shadowMap, vec3 V, float shadowBias, float shadowRadius, vec2 shadowMapSize, float shadowCameraNear, float shadowCameraFar ) {

        // depth = normalized distance from light to fragment position
		float depth = ( length( V ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear ); // need to clamp?
		depth += shadowBias;

        V.x = -V.x; // for left-hand?

        #ifdef USE_PCF_SOFT_SHADOW
            // TODO x, y equal force
            float texelSize = shadowRadius / shadowMapSize.x;

            vec3 poissonDisk[4];
    		poissonDisk[0] = vec3(-1.0, 1.0, -1.0);
    		poissonDisk[1] = vec3(1.0, -1.0, -1.0);
    		poissonDisk[2] = vec3(-1.0, -1.0, -1.0);
    		poissonDisk[3] = vec3(1.0, -1.0, 1.0);

            return textureCubeCompare( shadowMap, normalize(V) + poissonDisk[0] * texelSize, depth ) * 0.25 +
                textureCubeCompare( shadowMap, normalize(V) + poissonDisk[1] * texelSize, depth ) * 0.25 +
                textureCubeCompare( shadowMap, normalize(V) + poissonDisk[2] * texelSize, depth ) * 0.25 +
                textureCubeCompare( shadowMap, normalize(V) + poissonDisk[3] * texelSize, depth ) * 0.25;
        #else
            return textureCubeCompare( shadowMap, normalize(V), depth);
        #endif
    }

#endif