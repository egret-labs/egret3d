#ifdef SKINNING
    tmpNormal = vec4((mat* vec4(normal, 0.0))).xyz;
    // tmpNormal = normal; 
#else
    tmpNormal = normal;    
#endif