#ifdef USE_DIRECT_LIGHT
    uniform float glstate_directLights[USE_DIRECT_LIGHT * 15];
#endif

#ifdef USE_POINT_LIGHT
    uniform float glstate_pointLights[USE_POINT_LIGHT * 19];
#endif

#ifdef USE_SPOT_LIGHT
    uniform float glstate_spotLights[USE_SPOT_LIGHT * 19];
#endif