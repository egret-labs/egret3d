#ifdef SKINNING
    tmpvar_1.xyz = calcVertex(_glesVertex,_glesBlendIndex4,_glesBlendWeight4).xyz;
#else
    tmpvar_1.xyz = _glesVertex.xyz;
#endif