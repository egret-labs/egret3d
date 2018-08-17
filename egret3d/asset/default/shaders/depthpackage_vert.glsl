#include <common>
attribute vec3 _glesVertex;

uniform mat4 modelViewProjectionMatrix;

void main() { 
    gl_Position = modelViewProjectionMatrix * vec4(_glesVertex, 1.0);
}