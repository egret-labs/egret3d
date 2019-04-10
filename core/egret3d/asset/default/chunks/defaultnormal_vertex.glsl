#ifdef USE_INSTANCED
	mat3 normalMatrix = transposeMat3(inverseMat3(modelViewMatrix));
#endif
vec3 transformedNormal = normalMatrix * objectNormal;

#ifdef FLIP_SIDED

	transformedNormal = - transformedNormal;

#endif
