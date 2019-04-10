//modify by egret
#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP )

	mat4 modelMatrix = mat4(modelMatrix0,modelMatrix1,modelMatrix2,modelMatrix3);

#endif

mat4 modelViewMatrix = mat4(modelViewMatrix0,modelViewMatrix1,modelViewMatrix2,modelViewMatrix3);