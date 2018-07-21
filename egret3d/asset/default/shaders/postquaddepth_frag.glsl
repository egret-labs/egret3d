#include <common>
precision mediump float;
varying highp vec2 xlv_TEXCOORD0;       
uniform sampler2D _DepthTex;   
uniform sampler2D _MainTex;  


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


float planeDistance(const in vec3 positionA, const in vec3 normalA, 
                    const in vec3 positionB, const in vec3 normalB) 
{
  vec3 positionDelta = positionB-positionA;
  float planeDistanceDelta = max(abs(dot(positionDelta, normalA)), abs(dot(positionDelta, normalB)));
  return planeDistanceDelta;
}

void main()         
{
    lowp vec4 c1=texture2D(_DepthTex, xlv_TEXCOORD0+vec2(0.001,0));
    lowp vec4 c2=texture2D(_DepthTex, xlv_TEXCOORD0+vec2(-0.001,0));
    lowp vec4 c3=texture2D(_DepthTex, xlv_TEXCOORD0+vec2(0,0.001));
    lowp vec4 c4=texture2D(_DepthTex, xlv_TEXCOORD0+vec2(0,-0.001));
    highp float z1 = unpackRGBAToDepth(c1);
    highp float z2 = unpackRGBAToDepth(c2);
    highp float z3 = unpackRGBAToDepth(c3);
    highp float z4 = unpackRGBAToDepth(c4);
    highp float d = clamp(  (abs(z2-z1)+abs(z4-z3))*10.0,0.0,1.0);
    lowp vec4 c=texture2D(_MainTex, xlv_TEXCOORD0);
    lowp float g = c.r*0.3+c.g*0.6+c.b*0.1;

    gl_FragColor =mix(vec4(g,g,g,1.),vec4(1.0,1.0,0.0,1.0),d);// vec4(g*d,g*d,g*d,1.0);
}