#include <common>
uniform sampler2D map;                                                 
varying lowp vec4 xlv_COLOR;                                                 
varying highp vec2 xlv_TEXCOORD0;   
void main() 
{
    lowp vec4 col_1;    
    mediump vec4 prev_2;
    lowp vec4 tmpvar_3;

    tmpvar_3 = (texture2D(map, xlv_TEXCOORD0));
    //prev_2 = tmpvar_3;
    //mediump vec4 tmpvar_4;
    //tmpvar_4 = mix(vec4(1.0, 1.0, 1.0, 1.0), prev_2, prev_2.wwww);
    //col_1 = tmpvar_4;
    //col_1.x = xlv_TEXCOORD0.x;
    //col_1.y = xlv_TEXCOORD0.y;
    gl_FragData[0] = tmpvar_3;
}