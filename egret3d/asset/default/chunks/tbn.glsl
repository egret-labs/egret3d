mat3 tbn(vec3 N, vec3 p, vec2 uv) {
    vec3 dp1 = dFdx(p.xyz);
    vec3 dp2 = dFdy(p.xyz);
    vec2 duv1 = dFdx(uv.st);
    vec2 duv2 = dFdy(uv.st);
    vec3 dp2perp = cross(dp2, N);
    vec3 dp1perp = cross(N, dp1);
    vec3 T = dp2perp * duv1.x + dp1perp * duv2.x;
    vec3 B = dp2perp * duv1.y + dp1perp * duv2.y;
    float invmax = 1.0 / sqrt(max(dot(T,T), dot(B,B)));
    return mat3(T * invmax, B * invmax, N);
}