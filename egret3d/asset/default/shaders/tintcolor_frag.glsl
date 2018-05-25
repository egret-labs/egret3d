uniform sampler2D _MainTex;
uniform lowp float _AlphaCut;
uniform lowp vec4 _TintColor;

varying highp vec2 xlv_TEXCOORD0;
void main() 
{
    lowp vec4 tmpvar_3 = _TintColor*texture2D(_MainTex, xlv_TEXCOORD0);
    if(tmpvar_3.a < _AlphaCut)
        discard;
    gl_FragData[0] = tmpvar_3;
}