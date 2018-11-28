uniform mat4 textureMatrix;
uniform mat4 viewProjectionMatrix;
varying vec4 vUvA;
varying vec4 vUvB;

void main() {
    vec4 v1 = vec4(0.5, 0.0, 0.0, 0.0);
    vec4 v2 = vec4(0.0, -0.5, 0.0, 0.0);
    vec4 v3 = vec4(0.0, 0.0, 0.5, 0.0);
    vec4 v4 = vec4(0.5, 0.5, 0.5, 1.0);
    mat4 scale = mat4(v1, v2, v3, v4);

    vUvA = scale * viewProjectionMatrix * modelMatrix * vec4( position, 1.0 ) ;
    vUvB = textureMatrix * vec4( position, 1.0 );
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}