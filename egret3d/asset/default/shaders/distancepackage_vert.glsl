#include <common>
attribute vec3 position;

uniform mat4 modelViewProjectionMatrix;
uniform mat4 modelMatrix;

varying vec3 xlv_POS;

void main() {   
    xlv_POS = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = modelViewProjectionMatrix * vec4(position, 1.0);
}