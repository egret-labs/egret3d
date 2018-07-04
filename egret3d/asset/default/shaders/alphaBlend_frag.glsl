
uniform sampler2D _MainTex;
uniform vec4 _TintColor;
varying highp vec2 xlv_TEXCOORD0;

void main()
{			
	gl_FragColor=texture2D(_MainTex,xlv_TEXCOORD0)*_TintColor*2.0;
    gl_FragColor.a = clamp(gl_FragColor.a, 0.0, 1.0);
}