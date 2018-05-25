mat3 tsn(vec3 N, vec3 V, vec2 uv) {

    vec3 q0 = dFdx( V.xyz );
    vec3 q1 = dFdy( V.xyz );
    vec2 st0 = dFdx( uv.st );
    vec2 st1 = dFdy( uv.st );

    vec3 S = normalize( q0 * st1.t - q1 * st0.t );
    vec3 T = normalize( -q0 * st1.s + q1 * st0.s );
    // vec3 N = normalize( N );

    mat3 tsn = mat3( S, T, N );
    return tsn;
}