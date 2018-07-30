#include <common>
uniform sampler2D _MainTex;
uniform sampler2D _LightmapTex;
uniform lowp float _LightmapIntensity;
uniform lowp float _AlphaCut;
varying highp vec2 xlv_TEXCOORD0;
varying highp vec2 xlv_TEXCOORD1;
lowp vec3 decode_hdr(lowp vec4 data, lowp float intensity)
{
    highp float power =pow( 2.0 ,data.a * 255.0 - 128.0);
    return data.rgb * power * intensity;
}
void main() 
{
    lowp vec4 outColor = texture2D(_MainTex, xlv_TEXCOORD0);
    if(outColor.a < _AlphaCut)
        discard;
    lowp vec4 lightmap = texture2D(_LightmapTex, xlv_TEXCOORD1);
    outColor.xyz *= decode_hdr(lightmap, _LightmapIntensity);
    gl_FragData[0] = outColor;
}