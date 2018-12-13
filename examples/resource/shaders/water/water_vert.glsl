uniform vec3 lightDir;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewDir;
varying vec3 vLightDir;
varying vec3 vViewPosition;

void main() {
    vec4 worldPos = modelMatrix * vec4( position, 1.0 );
    vec3 viewDirForLight = cameraPosition - worldPos.xyz;
    vec3 worldLightDir = -lightDir;

	vUv = uv;
    vLightDir = worldLightDir;
    vViewDir = normalize(normalize(viewDirForLight) + normalize(worldLightDir));
    vNormal = normalize(normalMatrix * normal);
    //
    vec4 viewPos = viewMatrix * worldPos;
    vViewPosition = -viewPos.xyz;

	gl_Position = projectionMatrix * viewPos;
}