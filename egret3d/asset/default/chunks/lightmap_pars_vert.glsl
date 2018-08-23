#ifdef USE_LIGHTMAP
    attribute vec4 uv2;
    uniform highp vec4 lightMapOffset;
    uniform lowp float lightMapUV;
    varying highp vec2 xlv_TEXCOORD1;
#endif