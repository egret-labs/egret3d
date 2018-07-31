#ifdef LIGHTMAP
    lowp vec4 lightmap = texture2D(_LightmapTex, xlv_TEXCOORD1);
    outColor.xyz *= decode_hdr(lightmap, _LightmapIntensity);
    gl_FragData[0] = outColor;
#else
    gl_FragData[0] = outColor;
#endif