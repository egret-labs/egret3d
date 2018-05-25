attribute vec3 _glesVertex;

uniform mat4 glstate_matrix_mvp;
uniform mat4 glstate_matrix_model;

varying vec3 xlv_POS;

void main() {   
    xlv_POS = (glstate_matrix_model * vec4(_glesVertex, 1.0)).xyz;
    gl_Position = glstate_matrix_mvp * vec4(_glesVertex, 1.0);
}