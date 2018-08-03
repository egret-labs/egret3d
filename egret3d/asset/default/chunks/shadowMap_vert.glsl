#ifdef USE_SHADOW

    vec4 worldPosition = glstate_matrix_model * tmpVertex;

    #ifdef USE_DIRECT_LIGHT

        for ( int i = 0; i < USE_DIRECT_LIGHT; i ++ ) {

            vDirectionalShadowCoord[ i ] = glstate_directionalShadowMatrix[ i ] * worldPosition;

        }

    #endif

    #ifdef USE_POINT_LIGHT

        // nothing

    #endif

    #ifdef USE_SPOT_LIGHT

        for ( int i = 0; i < USE_SPOT_LIGHT; i ++ ) {

            vSpotShadowCoord[ i ] = glstate_spotShadowMatrix[ i ] * worldPosition;

        }

    #endif

#endif