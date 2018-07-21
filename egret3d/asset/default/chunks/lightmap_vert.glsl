#ifdef LIGHTMAP
    highp vec2 beforelightUV = _glesMultiTexCoord1.xy;
    if(glstate_lightmapUV == 0.0)
    {
        beforelightUV = _glesMultiTexCoord0.xy;
    }
    highp float u = beforelightUV.x * glstate_lightmapOffset.x + glstate_lightmapOffset.z;
    highp float v = 1.0 - ((1.0 - beforelightUV.y) * glstate_lightmapOffset.y + glstate_lightmapOffset.w);
    xlv_TEXCOORD1 = vec2(u,v);
#endif