#ifdef SKINNING
    tmpNormal = vec4((mat* vec4(_glesNormal, 0.0))).xyz;
    // tmpNormal = _glesNormal; 
#else
    tmpNormal = _glesNormal;    
#endif