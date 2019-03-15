"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*****************************************系统内置*****************************************************/
exports.UNIFORM_TYPE_MAP = {};
exports.UNIFORM_TYPE_MAP[" int"] = 5124 /* INT */;
exports.UNIFORM_TYPE_MAP[" float"] = 5126 /* FLOAT */;
exports.UNIFORM_TYPE_MAP[" vec2"] = 35664 /* FLOAT_VEC2 */;
exports.UNIFORM_TYPE_MAP[" vec3"] = 35665 /* FLOAT_VEC3 */;
exports.UNIFORM_TYPE_MAP[" vec4"] = 35666 /* FLOAT_VEC4 */;
exports.UNIFORM_TYPE_MAP[" ivec2"] = 35667 /* INT_VEC2 */;
exports.UNIFORM_TYPE_MAP[" ivec3"] = 35668 /* INT_VEC3 */;
exports.UNIFORM_TYPE_MAP[" ivec4"] = 35669 /* INT_VEC4 */;
exports.UNIFORM_TYPE_MAP[" bool"] = 35670 /* BOOL */;
exports.UNIFORM_TYPE_MAP[" bvec2"] = 35671 /* BOOL_VEC2 */;
exports.UNIFORM_TYPE_MAP[" bvec3"] = 35672 /* BOOL_VEC3 */;
exports.UNIFORM_TYPE_MAP[" bvec4"] = 35673 /* BOOL_VEC4 */;
exports.UNIFORM_TYPE_MAP[" mat2"] = 35674 /* FLOAT_MAT2 */;
exports.UNIFORM_TYPE_MAP[" mat3"] = 35675 /* FLOAT_MAT3 */;
exports.UNIFORM_TYPE_MAP[" mat4"] = 35676 /* FLOAT_MAT4 */;
exports.UNIFORM_TYPE_MAP[" sampler2D"] = 35678 /* SAMPLER_2D */;
exports.UNIFORM_TYPE_MAP[" samplerCube"] = 35680 /* SAMPLER_CUBE */;
/*****************************************系统内置Attribute*****************************************************/
exports.ATTRIBUTE_TEMPLATE = {};
exports.ATTRIBUTE_TEMPLATE["corner"] = "_CORNER" /* _CORNER */;
exports.ATTRIBUTE_TEMPLATE["position"] = "POSITION" /* POSITION */;
exports.ATTRIBUTE_TEMPLATE["normal"] = "NORMAL" /* NORMAL */;
exports.ATTRIBUTE_TEMPLATE["uv"] = "TEXCOORD_0" /* TEXCOORD_0 */;
exports.ATTRIBUTE_TEMPLATE["uv2"] = "TEXCOORD_1" /* TEXCOORD_1 */;
exports.ATTRIBUTE_TEMPLATE["color"] = "COLOR_0" /* COLOR_0 */;
exports.ATTRIBUTE_TEMPLATE["morphTarget0"] = "WEIGHTS_0" /* MORPHTARGET_0 */;
exports.ATTRIBUTE_TEMPLATE["morphTarget1"] = "WEIGHTS_1" /* MORPHTARGET_1 */;
exports.ATTRIBUTE_TEMPLATE["morphTarget2"] = "WEIGHTS_2" /* MORPHTARGET_2 */;
exports.ATTRIBUTE_TEMPLATE["morphTarget3"] = "WEIGHTS_3" /* MORPHTARGET_3 */;
exports.ATTRIBUTE_TEMPLATE["morphTarget4"] = "WEIGHTS_4" /* MORPHTARGET_4 */;
exports.ATTRIBUTE_TEMPLATE["morphTarget5"] = "WEIGHTS_5" /* MORPHTARGET_5 */;
exports.ATTRIBUTE_TEMPLATE["morphTarget6"] = "WEIGHTS_6" /* MORPHTARGET_6 */;
exports.ATTRIBUTE_TEMPLATE["morphTarget7"] = "WEIGHTS_7" /* MORPHTARGET_7 */;
exports.ATTRIBUTE_TEMPLATE["morphNormal0"] = "MORPHNORMAL_0" /* MORPHNORMAL_0 */;
exports.ATTRIBUTE_TEMPLATE["morphNormal1"] = "MORPHNORMAL_1" /* MORPHNORMAL_1 */;
exports.ATTRIBUTE_TEMPLATE["morphNormal2"] = "MORPHNORMAL_2" /* MORPHNORMAL_2 */;
exports.ATTRIBUTE_TEMPLATE["morphNormal3"] = "MORPHNORMAL_3" /* MORPHNORMAL_3 */;
exports.ATTRIBUTE_TEMPLATE["skinIndex"] = "JOINTS_0" /* JOINTS_0 */;
exports.ATTRIBUTE_TEMPLATE["skinWeight"] = "WEIGHTS_0" /* WEIGHTS_0 */;
//
exports.ATTRIBUTE_TEMPLATE["startPosition"] = "_START_POSITION" /* _START_POSITION */;
exports.ATTRIBUTE_TEMPLATE["startVelocity"] = "_START_VELOCITY" /* _START_VELOCITY */;
exports.ATTRIBUTE_TEMPLATE["startColor"] = "_START_COLOR" /* _START_COLOR */;
exports.ATTRIBUTE_TEMPLATE["startSize"] = "_START_SIZE" /* _START_SIZE */;
exports.ATTRIBUTE_TEMPLATE["startRotation"] = "_START_ROTATION" /* _START_ROTATION */;
exports.ATTRIBUTE_TEMPLATE["time"] = "_TIME" /* _TIME */;
exports.ATTRIBUTE_TEMPLATE["random0"] = "_RANDOM0" /* _RANDOM0 */;
exports.ATTRIBUTE_TEMPLATE["random1"] = "_RANDOM1" /* _RANDOM1 */;
exports.ATTRIBUTE_TEMPLATE["startWorldPosition"] = "_WORLD_POSITION" /* _WORLD_POSITION */;
exports.ATTRIBUTE_TEMPLATE["startWorldRotation"] = "_WORLD_ROTATION" /* _WORLD_ROTATION */;
//LINE
exports.ATTRIBUTE_TEMPLATE["lineDistance"] = "_INSTANCE_DISTANCE" /* _INSTANCE_DISTANCE */;
exports.ATTRIBUTE_TEMPLATE["instanceStart"] = "_INSTANCE_START" /* _INSTANCE_START */;
exports.ATTRIBUTE_TEMPLATE["instanceEnd"] = "_INSTANCE_END" /* _INSTANCE_END */;
exports.ATTRIBUTE_TEMPLATE["instanceColorStart"] = "_INSTANCE_COLOR_START" /* _INSTANCE_COLOR_START */;
exports.ATTRIBUTE_TEMPLATE["instanceColorEnd"] = "_INSTANCE_COLOR_END" /* _INSTANCE_COLOR_END */;
exports.ATTRIBUTE_TEMPLATE["instanceDistanceStart"] = "_INSTANCE_DISTANCE_START" /* _INSTANCE_DISTANCE_START */;
exports.ATTRIBUTE_TEMPLATE["instanceDistanceEnd"] = "_INSTANCE_DISTANCE_END" /* _INSTANCE_DISTANCE_END */;
/*****************************************系统内置Uniform*****************************************************/
exports.UNIFORM_TEMPLATE = {};
exports.UNIFORM_TEMPLATE["modelMatrix"] = { semantic: "MODEL" /* MODEL */ };
exports.UNIFORM_TEMPLATE["modelViewMatrix"] = { semantic: "MODELVIEW" /* MODELVIEW */ };
exports.UNIFORM_TEMPLATE["projectionMatrix"] = { semantic: "PROJECTION" /* PROJECTION */ };
exports.UNIFORM_TEMPLATE["viewMatrix"] = { semantic: "VIEW" /* VIEW */ };
exports.UNIFORM_TEMPLATE["normalMatrix"] = { semantic: "MODELVIEWINVERSE" /* MODELVIEWINVERSE */ };
exports.UNIFORM_TEMPLATE["modelViewProjectionMatrix"] = { semantic: "MODELVIEWPROJECTION" /* MODELVIEWPROJECTION */ };
exports.UNIFORM_TEMPLATE["viewProjectionMatrix"] = { semantic: "_VIEWPROJECTION" /* _VIEWPROJECTION */ };
exports.UNIFORM_TEMPLATE["cameraPosition"] = { semantic: "_CAMERA_POS" /* _CAMERA_POS */ };
exports.UNIFORM_TEMPLATE["cameraForward"] = { semantic: "_CAMERA_FORWARD" /* _CAMERA_FORWARD */ };
exports.UNIFORM_TEMPLATE["cameraUp"] = { semantic: "_CAMERA_UP" /* _CAMERA_UP */ };
exports.UNIFORM_TEMPLATE["ambientLightColor"] = { semantic: "_AMBIENTLIGHTCOLOR" /* _AMBIENTLIGHTCOLOR */ };
exports.UNIFORM_TEMPLATE["directionalLights[0]"] = { semantic: "_DIRECTLIGHTS" /* _DIRECTLIGHTS */ }; //
exports.UNIFORM_TEMPLATE["pointLights[0]"] = { semantic: "_POINTLIGHTS" /* _POINTLIGHTS */ }; //
exports.UNIFORM_TEMPLATE["spotLights[0]"] = { semantic: "_SPOTLIGHTS" /* _SPOTLIGHTS */ }; //
exports.UNIFORM_TEMPLATE["hemisphereLights[0]"] = { semantic: "_HEMILIGHTS" /* _HEMILIGHTS */ }; //
exports.UNIFORM_TEMPLATE["rectAreaLights[0]"] = { semantic: "Unknown" }; //
exports.UNIFORM_TEMPLATE["ltc_1"] = { semantic: "Unknown" };
exports.UNIFORM_TEMPLATE["ltc_2"] = { semantic: "Unknown" };
// UNIFORM_TEMPLATE["bindMatrix"] = { semantic: gltf.UniformSemanticType._BINDMATRIX };
// UNIFORM_TEMPLATE["bindMatrixInverse"] = { semantic: gltf.UniformSemanticType._BINDMATRIXINVERSE };
exports.UNIFORM_TEMPLATE["boneTexture"] = {  semantic: "_BONETEXTURE" };
exports.UNIFORM_TEMPLATE["boneTextureSize"] = { semantic: "_BONETEXTURESIZE" };
exports.UNIFORM_TEMPLATE["boneMatrices[0]"] = { semantic: "JOINTMATRIX" /* JOINTMATRIX */ };
exports.UNIFORM_TEMPLATE["directionalShadowMatrix[0]"] = { semantic: "_DIRECTIONSHADOWMAT" /* _DIRECTIONSHADOWMAT */ };
exports.UNIFORM_TEMPLATE["spotShadowMatrix[0]"] = { semantic: "_SPOTSHADOWMAT" /* _SPOTSHADOWMAT */ };
exports.UNIFORM_TEMPLATE["pointShadowMatrix[0]"] = { semantic: "_POINTSHADOWMAT" /* _POINTSHADOWMAT */ };
exports.UNIFORM_TEMPLATE["directionalShadowMap[0]"] = { semantic: "_DIRECTIONSHADOWMAP" /* _DIRECTIONSHADOWMAP */ };
exports.UNIFORM_TEMPLATE["spotShadowMap[0]"] = { semantic: "_SPOTSHADOWMAP" /* _SPOTSHADOWMAP */ };
exports.UNIFORM_TEMPLATE["pointShadowMap[0]"] = { semantic: "_POINTSHADOWMAP" /* _POINTSHADOWMAP */ };
exports.UNIFORM_TEMPLATE["lightMap"] = { semantic: "_LIGHTMAPTEX" /* _LIGHTMAPTEX */ };
exports.UNIFORM_TEMPLATE["lightMapIntensity"] = { semantic: "_LIGHTMAPINTENSITY" /* _LIGHTMAPINTENSITY */ };
exports.UNIFORM_TEMPLATE["lightMapScaleOffset"] = { semantic: "_LIGHTMAP_SCALE_OFFSET" /* _LIGHTMAP_SCALE_OFFSET */ };
exports.UNIFORM_TEMPLATE["referencePosition"] = { semantic: "_REFERENCEPOSITION" /* _REFERENCEPOSITION */ };
exports.UNIFORM_TEMPLATE["nearDistance"] = { semantic: "_NEARDICTANCE" /* _NEARDICTANCE */ };
exports.UNIFORM_TEMPLATE["farDistance"] = { semantic: "_FARDISTANCE" /* _FARDISTANCE */ };
// fog TODO
exports.UNIFORM_TEMPLATE["fogColor"] = { semantic: "_FOG_COLOR" /* _FOG_COLOR */ };
exports.UNIFORM_TEMPLATE["fogDensity"] = { semantic: "_FOG_DENSITY" /* _FOG_DENSITY */ };
exports.UNIFORM_TEMPLATE["fogNear"] = { semantic: "_FOG_NEAR" /* _FOG_NEAR */ };
exports.UNIFORM_TEMPLATE["fogFar"] = { semantic: "_FOG_FAR" /* _FOG_FAR */ };
//
exports.UNIFORM_TEMPLATE["toneMappingExposure"] = { semantic: "_TONE_MAPPING_EXPOSURE" /* _TONE_MAPPING_EXPOSURE */ };
exports.UNIFORM_TEMPLATE["toneMappingWhitePoint"] = { semantic: "_TONE_MAPPING_WHITE_POINT" /* _TONE_MAPPING_WHITE_POINT */ };
//
exports.UNIFORM_TEMPLATE["logDepthBufFC"] = { semantic: "_LOG_DEPTH_BUFFC" /* _LOG_DEPTH_BUFFC */ };
//
exports.UNIFORM_TEMPLATE["rotation"] = { semantic: "_ROTATION" };
exports.UNIFORM_TEMPLATE["scale2D"] = { semantic: "_SCALE2D" };

//
exports.UNIFORM_TEMPLATE["specular"] = { value: [0.066666, 0.066666, 0.066666] };
exports.UNIFORM_TEMPLATE["shininess"] = { value: 30.0 };
exports.UNIFORM_TEMPLATE["opacity"] = { value: 1.0 };
exports.UNIFORM_TEMPLATE["normalScale"] = { value: [1.0, 1.0] };
//
exports.UNIFORM_TEMPLATE["roughness"] = { value: 0.5 };
exports.UNIFORM_TEMPLATE["metalness"] = { value: 0.5 };
exports.UNIFORM_TEMPLATE["bumpScale"] = { value: 1.0 };
exports.UNIFORM_TEMPLATE["displacementScale"] = { value: 1.0 };
exports.UNIFORM_TEMPLATE["displacementBias"] = { value: 0.0 };
//
exports.UNIFORM_TEMPLATE["clearCoat"] = { value: 0.0 };
exports.UNIFORM_TEMPLATE["clearCoatRoughness"] = { value: 0.0 };
exports.UNIFORM_TEMPLATE["uvTransform"] = { value: [1, 0, 0, 0, 1, 0, 0, 0, 1] };
exports.UNIFORM_TEMPLATE["diffuse"] = { value: [1, 1, 1] };
exports.UNIFORM_TEMPLATE["emissive"] = { value: [0, 0, 0] };
exports.UNIFORM_TEMPLATE["emissiveIntensity"] = { value: 1 };
exports.UNIFORM_TEMPLATE["opacity"] = { value: 1 };
exports.UNIFORM_TEMPLATE["aoMapIntensity"] = { value: 1 };
exports.UNIFORM_TEMPLATE["reflectivity"] = { value: 1 };
exports.UNIFORM_TEMPLATE["refractionRatio"] = { value: 0.98 };
exports.UNIFORM_TEMPLATE["envMapIntensity"] = { value: 1 };
exports.UNIFORM_TEMPLATE["flipEnvMap"] = { value: 1 };
exports.UNIFORM_TEMPLATE["maxMipLevel"] = { value: 0 };
//particle
exports.UNIFORM_TEMPLATE["u_worldPosition"] = { value: [0, 0, 0] };
exports.UNIFORM_TEMPLATE["u_worldRotation"] = { value: [0, 0, 0, 1] };
// cube
exports.UNIFORM_TEMPLATE["tFlip"] = { value: 1.0 };
//line
exports.UNIFORM_TEMPLATE["resolution"] = { semantic: "_RESOLUTION" /* _RESOLUTION */ };
exports.UNIFORM_TEMPLATE["scale"] = { value: 1 };
exports.UNIFORM_TEMPLATE["linewidth"] = { value: 1 };
exports.UNIFORM_TEMPLATE["dashScale"] = { value: 1 };
exports.UNIFORM_TEMPLATE["dashSize"] = { value: 1 };
exports.UNIFORM_TEMPLATE["gapSize"] = { value: 1 };
exports.UNIFORM_TEMPLATE["totalSize"] = { value: 1 };


exports.UNIFORM_TEMPLATE["center"] = { value: [0.5, 0.5] };
//old
// UNIFORM_TEMPLATE["lightMapOffset"] = { semantic: gltf.UniformSemanticType._LIGHTMAPOFFSET };
// UNIFORM_TEMPLATE["lightMapUV"] = { semantic: gltf.UniformSemanticType._LIGHTMAPUV };
// UNIFORM_TEMPLATE["glstate_vec4_bones[0]"] = { semantic: gltf.UniformSemanticType._BONESVEC4 };
// UNIFORM_TEMPLATE["_MainTex_ST"] = { value: [1, 1, 0, 0] };
// UNIFORM_TEMPLATE["_MainColor"] = { value: [1, 1, 1, 1] };
// UNIFORM_TEMPLATE["_AlphaCut"] = { value: 0 };
/******************************************用户定义****************************************************/
//用户自定义Attribute
exports.CUSTOM_ATTRIBUTE_TEMPLATE = {};
// CUSTOM_ATTRIBUTE_TEMPLATE["position"] = "POSITION";
//用户自定义Uniform
exports.CUSTOM_UNIFORM_TEMPLATE = {};
// CUSTOM_UNIFORM_TEMPLATE["_AlphaCut"] = { value: 0 };
