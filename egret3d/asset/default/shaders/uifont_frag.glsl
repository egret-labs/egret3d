precision mediump float;
uniform sampler2D _MainTex;
varying lowp vec4 xlv_COLOR;
varying lowp vec4 xlv_COLOREx;
varying highp vec2 xlv_TEXCOORD0;  
void main() {
    float scale = 10.0;
    float d = (texture2D(_MainTex, xlv_TEXCOORD0).r - 0.5) * scale;  //0.5
    float bd = (texture2D(_MainTex, xlv_TEXCOORD0).r - 0.34) * scale;  //0.34

    float c=xlv_COLOR.a * clamp ( d,0.0,1.0);
    float bc=xlv_COLOREx.a * clamp ( bd,0.0,1.0);
    bc =min(1.0-c,bc);

    gl_FragData[0] =xlv_COLOR*c + xlv_COLOREx*bc;
}