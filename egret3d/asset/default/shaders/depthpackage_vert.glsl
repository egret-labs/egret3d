attribute vec3 _glesVertex;

uniform mat4 glstate_matrix_mvp;

void main() { 
    gl_Position = glstate_matrix_mvp * vec4(_glesVertex, 1.0);
}