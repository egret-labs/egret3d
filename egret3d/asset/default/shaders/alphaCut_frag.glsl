#include <common>
uniform sampler2D _MainTex;
uniform lowp float _AlphaCut;
varying highp vec2 xlv_TEXCOORD0;

void main()
{			
	lowp vec4 outColor=texture2D(_MainTex,xlv_TEXCOORD0);
    if(outColor.a < _AlphaCut)
        discard;
    gl_FragColor = outColor;
}