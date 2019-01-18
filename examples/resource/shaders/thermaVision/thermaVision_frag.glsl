varying vec2 vUv;

uniform sampler2D map;
uniform float thermaValue;

void main(){
    vec2 uv = vUv;
    vec4 pixcol = texture2D(map, uv);
    vec4 colors[3];
    colors[0] = vec4(0.,0.,1.,1.);
    colors[1] = vec4(1.,1.,0.,1.);
    colors[2] = vec4(1.,0.,0.,1.);
    float lum = (pixcol.r+pixcol.g+pixcol.b)/3.;
    vec4 thermal;
    // if (lum<thermaValue) thermal = mix(colors[0],colors[2],(lum-float(0)*thermaValue)/thermaValue);
    // if (lum>=thermaValue) thermal = mix(colors[1],colors[2],(lum-float(1)*thermaValue)/thermaValue);
    // gl_FragColor = thermal;
    int threshold = (lum < thermaValue)? 0:1; 
    vec3 result = lerp(colors[threshold], colors[threshold + 1], (lum-float(threshold) * 0.5f) / 0.5f);
    gl_FragColor = vec4(result, 1.0);
}