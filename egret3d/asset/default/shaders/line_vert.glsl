#include <common>
attribute vec4 _glesVertex;
attribute vec4 _glesColor;
uniform highp mat4 modelViewProjectionMatrix;
varying lowp vec4 xlv_COLOR;
void main() {
    highp vec4 tmpvar_1;
    tmpvar_1.w = 1.0;
    tmpvar_1.xyz = _glesVertex.xyz;
    xlv_COLOR = _glesColor;
    gl_Position = (modelViewProjectionMatrix * tmpvar_1);
}