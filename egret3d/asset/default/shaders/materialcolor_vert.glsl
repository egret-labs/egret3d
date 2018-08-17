#include <common>
attribute vec4 position;
uniform vec4 _Color;
uniform highp mat4 modelViewProjectionMatrix;
varying lowp vec4 xlv_COLOR;
void main() {
    highp vec4 tmpvar_1;
    tmpvar_1.w = 1.0;
    tmpvar_1.xyz = position.xyz;
    xlv_COLOR = _Color;
    gl_Position = (modelViewProjectionMatrix * tmpvar_1);
}