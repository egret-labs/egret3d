#ifdef DOUBLE_SIDED
    float flipNormal = ( float( gl_FrontFacing ) * 2.0 - 1.0 );
#else
    float flipNormal = 1.0;
#endif
#ifdef FLAT_SHADED
    // Workaround for Adreno/Nexus5 not able able to do dFdx( vViewPosition ) ...
    vec3 fdx = vec3( dFdx( xlv_POS.x ), dFdx( xlv_POS.y ), dFdx( xlv_POS.z ) );
    vec3 fdy = vec3( dFdy( xlv_POS.x ), dFdy( xlv_POS.y ), dFdy( xlv_POS.z ) );
    vec3 N = normalize( cross( fdx, fdy ) );
#else
    vec3 N = normalize(xlv_NORMAL) * flipNormal;
#endif
#ifdef USE_NORMAL_MAP
    vec3 normalMapColor = texture2D(_NormalTex, xlv_TEXCOORD0).rgb;
    // for now, uv coord is flip Y
    mat3 tspace = tsn(N, -xlv_POS, vec2(xlv_TEXCOORD0.x, 1.0 - xlv_TEXCOORD0.y));
    // mat3 tspace = tbn(normalize(v_Normal), v_ViewModelPos, vec2(xlv_TEXCOORD0.x, 1.0 - xlv_TEXCOORD0.y));
    N = normalize(tspace * (normalMapColor * 2.0 - 1.0));
#elif defined(USE_BUMPMAP)
    N = perturbNormalArb(-xlv_POS, N, dHdxy_fwd(xlv_TEXCOORD0));
#endif