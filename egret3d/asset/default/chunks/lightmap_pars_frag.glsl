#ifdef LIGHTMAP
    uniform sampler2D lightMap;
    uniform lowp float lightMapIntensity;
    varying highp vec2 xlv_TEXCOORD1;

    lowp vec3 decode_hdr(lowp vec4 data, lowp float intensity)
    {
        highp float power =pow( 2.0 ,data.a * 255.0 - 128.0);
        return data.rgb * power * intensity;
    }
#endif