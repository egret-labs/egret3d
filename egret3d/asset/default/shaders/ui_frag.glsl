uniform sampler2D _MainTex;
varying lowp vec4 xlv_COLOR;
varying highp vec2 xlv_TEXCOORD0;
void main() {
    lowp vec4 tmpvar_3;
    tmpvar_3 = (xlv_COLOR * texture2D(_MainTex, xlv_TEXCOORD0));
    gl_FragData[0] = tmpvar_3;
}