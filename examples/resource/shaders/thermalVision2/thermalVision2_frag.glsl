varying vec2 vUv;

uniform sampler2D map;
uniform sampler2D noiseMap;
uniform sampler2D heatLookupMap;
uniform float hotLight;
uniform vec2 rnd;

float Luminance(vec3 rgb)
{
    return dot(rgb, vec3(0.22, 0.707, 0.071));
}

void main(){
    vec2 uv = vUv;
    float depth = Luminance(texture2D(map, uv).rgb);
	depth *= (depth * hotLight);
	
	float heat = depth;

	float interference = -0.5 + texture2D(noiseMap, uv + vec2(rnd.x, rnd.y)).r;
	interference *= interference;
	interference *= 1.0 - heat;
	heat += interference;

	heat = max(0.005, min(0.995, heat));
    gl_FragColor = vec4(texture2D(heatLookupMap, vec2(heat, 0.0)).rgb,1.0);
}