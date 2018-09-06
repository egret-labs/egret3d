#ifdef USE_LIGHTMAP
    highp vec2 beforelightUV = uv2.xy;
    if(lightMapUV == 0.0)
    {
        beforelightUV = uv.xy;
    }
    highp float u = beforelightUV.x * lightMapOffset.x + lightMapOffset.z;
    highp float v = 1.0 - ((1.0 - beforelightUV.y) * lightMapOffset.y + lightMapOffset.w);
    xlv_TEXCOORD1 = vec2(u,v);
#endif