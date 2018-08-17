#ifdef LIGHTMAP
    lowp vec4 lightmap = texture2D(lightMap, xlv_TEXCOORD1);
    outColor.xyz *= decode_hdr(lightmap, lightMapIntensity);
    gl_FragData[0] = outColor;
#else
    gl_FragData[0] = outColor;
#endif