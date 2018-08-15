vec3 transformedNormal = normalMatrix * objectNormal;
// vec3 transformedNormal = objectNormal;

#ifdef FLIP_SIDED

	transformedNormal = - transformedNormal;

#endif
