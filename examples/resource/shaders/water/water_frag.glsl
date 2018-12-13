#include <common>
uniform vec4 _Color;
uniform sampler2D _MainTex;
uniform sampler2D _NormalTex1;
uniform vec4 _NormalTex1_ST;
uniform sampler2D _NormalTex2;
uniform vec4 _NormalTex2_ST;
uniform float _Shininess;
uniform float _time;
uniform vec3 lightColor;

uniform mat3 normalMatrix;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewDir;
varying vec3 vLightDir;
varying vec3 vViewPosition;

vec3 perturbNormal2Arb( vec3 eye_pos, vec3 surf_norm, vec2 uv, sampler2D normalMap ) {

	// Workaround for Adreno 3XX dFd*( vec3 ) bug. See #9988

	vec3 q0 = vec3( dFdx( eye_pos.x ), dFdx( eye_pos.y ), dFdx( eye_pos.z ) );
	vec3 q1 = vec3( dFdy( eye_pos.x ), dFdy( eye_pos.y ), dFdy( eye_pos.z ) );
	vec2 st0 = dFdx( uv.st );
	vec2 st1 = dFdy( uv.st );

	float scale = sign( st1.t * st0.s - st0.t * st1.s ); // we do not care about the magnitude

	vec3 S = normalize( ( q0 * st1.t - q1 * st0.t ) * scale );
	vec3 T = normalize( ( - q0 * st1.s + q1 * st0.s ) * scale );
	vec3 N = normalize( surf_norm );
	mat3 tsn = mat3( S, T, N );

	vec3 mapN = texture2D( normalMap, uv ).xyz * 2.0 - 1.0;

	// mapN.xy *= normalScale;
	mapN.xy *= ( float( gl_FrontFacing ) * 2.0 - 1.0 );

	return normalize( tsn * mapN );

}

void main()
{
    //
    vec3 viewDir = normalize(vViewDir);
    vec3 lightDir = normalize(vLightDir);
    vec3 eye_pos = -vViewPosition;

    vec3 albedo = _Color.rgb;
    vec3 diffuse = texture2D(_MainTex, vUv).rgb;
    float alpha = diffuse.r * _Color.a;
    vec2 uv1 = vUv * _NormalTex1_ST.xy + _NormalTex1_ST.zw * _time;
    vec3 bump1 = perturbNormal2Arb(eye_pos,vNormal,uv1, _NormalTex1);
    vec2 uv2 = vUv * _NormalTex2_ST.xy + _NormalTex2_ST.zw * _time;
    vec3 bump2 = perturbNormal2Arb(eye_pos,vNormal,uv2, _NormalTex2);
    vec3 normal = normalize(bump1 + bump2);

    float irim = 1.0 - saturate(dot(viewDir, normal));
    vec3 H = normalize(lightDir + viewDir);
    float S = max(dot(H, normal), 0.0);
    float ispe = pow(S, _Shininess * 128.0);
    vec4 c;
    c.rgb = albedo * 0.5;
    c.rgb += albedo * irim * 2.0;
    // c.rgb += _LightColor0.rgb * atten * ispe;
    c.rgb += lightColor * ispe;
    c.a = alpha;
    // gl_FragColor = vec4(albedo * 0.5,alpha);
    // c.rgb = vec3(normal.x, normal.y,normal.z);
    // c.rgb = vec3(lightDir);
    // gl_FragColor = vec4(vec3(bump1),alpha);
    // gl_FragColor = vec4(viewDir,alpha);
    gl_FragColor = c;
}