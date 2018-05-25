#ifdef USE_LIGHT    
    vec3 L;
    vec3 light;
    vec3 totalReflect = vec3(0., 0., 0.);

    #ifdef USE_DIRECT_LIGHT
        for(int i = 0; i < USE_DIRECT_LIGHT; i++) {
            light = vec3(glstate_directLights[i * 15 + 6], glstate_directLights[i * 15 + 7], glstate_directLights[i * 15 + 8]) * glstate_directLights[i * 15 + 9];

            L.x = glstate_directLights[i * 15 + 3];
            L.y = glstate_directLights[i * 15 + 4];
            L.z = glstate_directLights[i * 15 + 5];
            L = normalize(-L);

            float dotNL = saturate( dot(N, L) );
            vec3 irradiance = light * dotNL;

            #ifdef USE_PBR
                irradiance *= PI;
            #endif

            #ifdef USE_SHADOW
                irradiance *= bool( glstate_directLights[i * 15 + 10] ) ? getShadow( glstate_directionalShadowMap[ i ], vDirectionalShadowCoord[ i ], glstate_directLights[i * 15 + 11], glstate_directLights[i * 15 + 12], vec2(glstate_directLights[i * 15 + 13], glstate_directLights[i * 15 + 14]) ) : 1.0;
            #endif

            vec3 reflectLight = irradiance * BRDF_Diffuse_Lambert(diffuseColor.xyz);

            totalReflect += reflectLight;
        }
    #endif

    #ifdef USE_POINT_LIGHT
        for(int i = 0; i < USE_POINT_LIGHT; i++) {
            L = vec3(glstate_pointLights[i * 19 + 0], glstate_pointLights[i * 19 + 1], glstate_pointLights[i * 19 + 2]) - xlv_POS;
            float dist = pow(clamp(1. - length(L) / glstate_pointLights[i * 19 + 10], 0.0, 1.0), glstate_pointLights[i * 19 + 11]);
            light = vec3(glstate_pointLights[i * 19 + 6], glstate_pointLights[i * 19 + 7], glstate_pointLights[i * 19 + 8]) * glstate_pointLights[i * 19 + 9] * dist;
            L = normalize(L);

            float dotNL = saturate( dot(N, L) );
            vec3 irradiance = light * dotNL;

            #ifdef USE_PBR
                irradiance *= PI;
            #endif

            #ifdef USE_SHADOW
                vec3 worldV = xlv_POS - vec3(glstate_pointLights[i * 19 + 0], glstate_pointLights[i * 19 + 1], glstate_pointLights[i * 19 + 2]);
                irradiance *= bool( glstate_pointLights[i * 19 + 12] ) ? getPointShadow( glstate_pointShadowMap[ i ], worldV, glstate_pointLights[i * 19 + 13], glstate_pointLights[i * 19 + 14], vec2(glstate_pointLights[i * 19 + 17], glstate_pointLights[i * 19 + 18]), glstate_pointLights[i * 19 + 15], glstate_pointLights[i * 19 + 16]) : 1.0;
            #endif

            vec3 reflectLight = irradiance * BRDF_Diffuse_Lambert(diffuseColor.xyz);

            totalReflect += reflectLight;
        }
    #endif

    #ifdef USE_SPOT_LIGHT
        for(int i = 0; i < USE_SPOT_LIGHT; i++) {
            L = vec3(glstate_spotLights[i * 19 + 0], glstate_spotLights[i * 19 + 1], glstate_spotLights[i * 19 + 2]) - xlv_POS;
            float lightDistance = length(L);
            L = normalize(L);
            float angleCos = dot( L, -normalize(vec3(glstate_spotLights[i * 19 + 3], glstate_spotLights[i * 19 + 4], glstate_spotLights[i * 19 + 5])) );

            if( all( bvec2(angleCos > glstate_spotLights[i * 19 + 12], lightDistance < glstate_spotLights[i * 19 + 10]) ) ) {

                float spotEffect = smoothstep( glstate_spotLights[i * 19 + 12], glstate_spotLights[i * 19 + 13], angleCos );
                float dist = pow(clamp(1. - lightDistance / glstate_spotLights[i * 19 + 10], 0.0, 1.0), glstate_spotLights[i * 19 + 11]);
                light = vec3(glstate_spotLights[i * 19 + 6], glstate_spotLights[i * 19 + 7], glstate_spotLights[i * 19 + 8]) * glstate_spotLights[i * 19 + 9] * dist * spotEffect;

                float dotNL = saturate( dot(N, L) );
                vec3 irradiance = light * dotNL;

                #ifdef USE_PBR
                    irradiance *= PI;
                #endif

                #ifdef USE_SHADOW
                    irradiance *= bool( glstate_spotLights[i * 17 + 14] ) ? getShadow( glstate_spotShadowMap[ i ], vSpotShadowCoord[ i ], glstate_spotLights[i * 17 + 15], glstate_spotLights[i * 17 + 16], vec2(glstate_spotLights[i * 17 + 17], glstate_spotLights[i * 17 + 18])) : 1.0;
                #endif

                vec3 reflectLight = irradiance * BRDF_Diffuse_Lambert(diffuseColor.xyz);

                totalReflect += reflectLight;
            }

        }
    #endif

    outColor.xyz = totalReflect;
#endif