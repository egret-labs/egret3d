#include <common>
attribute vec4 position;   
attribute vec4 normal;   
attribute vec4 color;                  
attribute vec4 uv;        
uniform highp mat4 modelViewProjectionMatrix;   
uniform highp vec4 _MainTex_ST;       

varying lowp vec4 xlv_COLOR;                
varying highp vec2 xlv_TEXCOORD0;   

void main()                                     
{                                               
    highp vec4 tmpvar_1;                        
    tmpvar_1.w = 1.0;                           
    tmpvar_1.xyz = position.xyz;             
    xlv_COLOR = color;                     
    xlv_TEXCOORD0 = uv.xy * _MainTex_ST.xy + _MainTex_ST.zw;   

    //xlv_COLOR.xyz =pos.xyz;
    gl_Position = (modelViewProjectionMatrix * tmpvar_1);  
}
