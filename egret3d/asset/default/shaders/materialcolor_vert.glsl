#include <common>
attribute vec4 _glesVertex;
uniform vec4 _Color;
uniform highp mat4 glstate_matrix_mvp;
varying lowp vec4 xlv_COLOR;
void main() {
    highp vec4 tmpvar_1;
    tmpvar_1.w = 1.0;
    tmpvar_1.xyz = _glesVertex.xyz;
    xlv_COLOR = _Color;
    gl_Position = (glstate_matrix_mvp * tmpvar_1);
}