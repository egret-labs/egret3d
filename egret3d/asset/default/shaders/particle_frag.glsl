
uniform sampler2D _MainTex;
uniform vec4 _TintColor;

varying float v_discard;
varying vec4 v_color;
varying vec2 v_texcoord;

void main()
{			
	if(v_discard!=0.0)
		discard;
	gl_FragColor=texture2D(_MainTex,v_texcoord)*_TintColor*v_color*2.0;
}