uniform float c;
uniform float p;
varying float intensity;

void main()
{
    vec3 normalA = normalize( normalMatrix * normal );
    vec3 normalB = normalize( normalMatrix * (cameraPosition - modelMatrix[2].xyz) );
    intensity = pow( c - dot(normalA, normalB), p );
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}