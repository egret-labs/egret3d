varying vec2 vUv;

uniform sampler2D map;
uniform vec3 matrix9[4];
uniform float fadeFX;
uniform float time;

float rand(vec2 n, float time)
{
    return 0.5 + 0.5 * fract(sin(dot(n.xy, vec2(12.9898, 78.233)))* 43758.5453 + time);
}

void main(){
    vec2 uv = vUv;
    vec4 col = texture2D(map, uv);
    vec3 c_r = matrix9[0];
    vec3 c_g = matrix9[1];
    vec3 c_b = matrix9[2];
    vec3 c_rgb = matrix9[3];
    vec3 rgb = vec3( dot(col.rgb,c_r)+c_rgb.r, dot(col.rgb,c_g)+c_rgb.g, dot(col.rgb,c_b)+c_rgb.b );
    float noise = rand(uv * vec2(0.1, 1.0), time * 1.0);
    noise = 1.0 -noise * 0.5;
    rgb=mix(col.rgb,rgb*vec3(noise,noise,noise),fadeFX);
    gl_FragColor = vec4(rgb, 1.0);
}