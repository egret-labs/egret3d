precision highp float;
//varying highp vec3 xlv_Normal;   

const float PackUpscale = 256. / 255.; 
// fraction -> 0..1 (including 1)
const float UnpackDownscale = 255. / 256.; 
// 0..1 -> fraction (excluding 1)
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256.,  256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) 
{
    vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;
 // tidy overflow
    return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) 
{
    return dot( v, UnpackFactors );
}
vec2 packDepthToRG( const in float v ) 
{
    vec2 r = vec2( fract( v * PackFactors.z ), v );
	r.y -= r.x * ShiftRight8;
    return r * PackUpscale;
}
float unpackRGToDepth( const in vec2 v ) 
{
    return dot( v.xy, UnpackFactors.zw );
}
vec3 packDepthToRGB( const in float v ) 
{
    vec3 r = vec3( fract( v * PackFactors.yz ), v );
	r.yz -= r.xy * ShiftRight8;
 // tidy overflow
    return r * PackUpscale;
}
float unpackRGBToDepth( const in vec3 v ) 
{
    return dot( v.xyz, UnpackFactors.yzw );
}
void main() 
{
    float z = gl_FragCoord.z;// fract(gl_FragCoord.z *256.*256.);
    // highp vec2 normal =xlv_Normal.xy;
    gl_FragColor=packDepthToRGBA(z);
}