#include <common>
attribute vec3 _glesVertex;

uniform mat4 modelViewProjectionMatrix;
uniform mat4 modelMatrix;

varying vec3 xlv_POS;

void main() {   
    xlv_POS = (modelMatrix * vec4(_glesVertex, 1.0)).xyz;
    gl_Position = modelViewProjectionMatrix * vec4(_glesVertex, 1.0);
}