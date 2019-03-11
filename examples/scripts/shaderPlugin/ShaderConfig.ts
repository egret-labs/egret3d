
// import * as gltf from "./GLTF";
/*****************************************系统内置*****************************************************/
export const UNIFORM_TYPE_MAP: { [key: string]: gltf.UniformType } = {};
UNIFORM_TYPE_MAP[" int"] = gltf.UniformType.INT;
UNIFORM_TYPE_MAP[" float"] = gltf.UniformType.FLOAT;
UNIFORM_TYPE_MAP[" vec2"] = gltf.UniformType.FLOAT_VEC2;
UNIFORM_TYPE_MAP[" vec3"] = gltf.UniformType.FLOAT_VEC3;
UNIFORM_TYPE_MAP[" vec4"] = gltf.UniformType.FLOAT_VEC4;
UNIFORM_TYPE_MAP[" ivec2"] = gltf.UniformType.INT_VEC2;
UNIFORM_TYPE_MAP[" ivec3"] = gltf.UniformType.INT_VEC3;
UNIFORM_TYPE_MAP[" ivec4"] = gltf.UniformType.INT_VEC4;
UNIFORM_TYPE_MAP[" bool"] = gltf.UniformType.BOOL;
UNIFORM_TYPE_MAP[" bvec2"] = gltf.UniformType.BOOL_VEC2;
UNIFORM_TYPE_MAP[" bvec3"] = gltf.UniformType.BOOL_VEC3;
UNIFORM_TYPE_MAP[" bvec4"] = gltf.UniformType.BOOL_VEC4;
UNIFORM_TYPE_MAP[" mat2"] = gltf.UniformType.FLOAT_MAT2;
UNIFORM_TYPE_MAP[" mat3"] = gltf.UniformType.FLOAT_MAT3;
UNIFORM_TYPE_MAP[" mat4"] = gltf.UniformType.FLOAT_MAT4;
UNIFORM_TYPE_MAP[" sampler2D"] = gltf.UniformType.SAMPLER_2D;
UNIFORM_TYPE_MAP[" samplerCube"] = gltf.UniformType.SAMPLER_CUBE;
/*****************************************系统内置Attribute*****************************************************/
export const ATTRIBUTE_TEMPLATE: { [key: string]: string } = {};
ATTRIBUTE_TEMPLATE["position"] = gltf.AttributeSemantics.POSITION;
ATTRIBUTE_TEMPLATE["normal"] = gltf.AttributeSemantics.NORMAL;
ATTRIBUTE_TEMPLATE["uv"] = gltf.AttributeSemantics.TEXCOORD_0;
ATTRIBUTE_TEMPLATE["uv2"] = gltf.AttributeSemantics.TEXCOORD_1;
ATTRIBUTE_TEMPLATE["color"] = gltf.AttributeSemantics.COLOR_0;
ATTRIBUTE_TEMPLATE["morphTarget0"] = gltf.AttributeSemantics.MORPHTARGET_0;
ATTRIBUTE_TEMPLATE["morphTarget1"] = gltf.AttributeSemantics.MORPHTARGET_1;
ATTRIBUTE_TEMPLATE["morphTarget2"] = gltf.AttributeSemantics.MORPHTARGET_2;
ATTRIBUTE_TEMPLATE["morphTarget3"] = gltf.AttributeSemantics.MORPHTARGET_3;
ATTRIBUTE_TEMPLATE["morphTarget4"] = gltf.AttributeSemantics.MORPHTARGET_4;
ATTRIBUTE_TEMPLATE["morphTarget5"] = gltf.AttributeSemantics.MORPHTARGET_5;
ATTRIBUTE_TEMPLATE["morphTarget6"] = gltf.AttributeSemantics.MORPHTARGET_6;
ATTRIBUTE_TEMPLATE["morphTarget7"] = gltf.AttributeSemantics.MORPHTARGET_7;
ATTRIBUTE_TEMPLATE["morphNormal0"] = gltf.AttributeSemantics.MORPHNORMAL_0;
ATTRIBUTE_TEMPLATE["morphNormal1"] = gltf.AttributeSemantics.MORPHNORMAL_1;
ATTRIBUTE_TEMPLATE["morphNormal2"] = gltf.AttributeSemantics.MORPHNORMAL_2;
ATTRIBUTE_TEMPLATE["morphNormal3"] = gltf.AttributeSemantics.MORPHNORMAL_3;
ATTRIBUTE_TEMPLATE["skinIndex"] = gltf.AttributeSemantics.JOINTS_0;
ATTRIBUTE_TEMPLATE["skinWeight"] = gltf.AttributeSemantics.WEIGHTS_0;
//
ATTRIBUTE_TEMPLATE["corner"] = gltf.AttributeSemantics._CORNER;
ATTRIBUTE_TEMPLATE["startPosition"] = gltf.AttributeSemantics._START_POSITION;
ATTRIBUTE_TEMPLATE["startVelocity"] = gltf.AttributeSemantics._START_VELOCITY;
ATTRIBUTE_TEMPLATE["startColor"] = gltf.AttributeSemantics._START_COLOR;
ATTRIBUTE_TEMPLATE["startSize"] = gltf.AttributeSemantics._START_SIZE;
ATTRIBUTE_TEMPLATE["startRotation"] = gltf.AttributeSemantics._START_ROTATION;
ATTRIBUTE_TEMPLATE["time"] = gltf.AttributeSemantics._TIME;
ATTRIBUTE_TEMPLATE["random0"] = gltf.AttributeSemantics._RANDOM0;
ATTRIBUTE_TEMPLATE["random1"] = gltf.AttributeSemantics._RANDOM1;
ATTRIBUTE_TEMPLATE["startWorldPosition"] = gltf.AttributeSemantics._WORLD_POSITION;
ATTRIBUTE_TEMPLATE["startWorldRotation"] = gltf.AttributeSemantics._WORLD_ROTATION;
//LINE
ATTRIBUTE_TEMPLATE["lineDistance"] = gltf.AttributeSemantics._INSTANCE_DISTANCE;
ATTRIBUTE_TEMPLATE["instanceStart"] = gltf.AttributeSemantics._INSTANCE_START;
ATTRIBUTE_TEMPLATE["instanceEnd"] = gltf.AttributeSemantics._INSTANCE_END;
ATTRIBUTE_TEMPLATE["instanceColorStart"] = gltf.AttributeSemantics._INSTANCE_COLOR_START;
ATTRIBUTE_TEMPLATE["instanceColorEnd"] = gltf.AttributeSemantics._INSTANCE_COLOR_END;
ATTRIBUTE_TEMPLATE["instanceDistanceStart"] = gltf.AttributeSemantics._INSTANCE_DISTANCE_START;
ATTRIBUTE_TEMPLATE["instanceDistanceEnd"] = gltf.AttributeSemantics._INSTANCE_DISTANCE_END;

/*****************************************系统内置Uniform*****************************************************/
export const UNIFORM_TEMPLATE: { [key: string]: { semantic?: string, value?: {} } } = {};
UNIFORM_TEMPLATE["modelMatrix"] = { semantic: gltf.UniformSemantics.MODEL };
UNIFORM_TEMPLATE["modelViewMatrix"] = { semantic: gltf.UniformSemantics.MODELVIEW };
UNIFORM_TEMPLATE["projectionMatrix"] = { semantic: gltf.UniformSemantics.PROJECTION };
UNIFORM_TEMPLATE["viewMatrix"] = { semantic: gltf.UniformSemantics.VIEW };
UNIFORM_TEMPLATE["normalMatrix"] = { semantic: gltf.UniformSemantics.MODELVIEWINVERSE };
UNIFORM_TEMPLATE["modelViewProjectionMatrix"] = { semantic: gltf.UniformSemantics.MODELVIEWPROJECTION };

UNIFORM_TEMPLATE["viewProjectionMatrix"] = { semantic: gltf.UniformSemantics._VIEWPROJECTION };
UNIFORM_TEMPLATE["cameraPosition"] = { semantic: gltf.UniformSemantics._CAMERA_POS };
UNIFORM_TEMPLATE["cameraForward"] = { semantic: gltf.UniformSemantics._CAMERA_FORWARD };
UNIFORM_TEMPLATE["cameraUp"] = { semantic: gltf.UniformSemantics._CAMERA_UP };
UNIFORM_TEMPLATE["ambientLightColor"] = { semantic: gltf.UniformSemantics._AMBIENTLIGHTCOLOR };
UNIFORM_TEMPLATE["directionalLights[0]"] = { semantic: gltf.UniformSemantics._DIRECTLIGHTS };//
UNIFORM_TEMPLATE["pointLights[0]"] = { semantic: gltf.UniformSemantics._POINTLIGHTS };//
UNIFORM_TEMPLATE["spotLights[0]"] = { semantic: gltf.UniformSemantics._SPOTLIGHTS };//
UNIFORM_TEMPLATE["ltc_1"] = { semantic: "Unknown" };
UNIFORM_TEMPLATE["ltc_2"] = { semantic: "Unknown" };
UNIFORM_TEMPLATE["rectAreaLights[0]"] = { semantic: "Unknown" };//
UNIFORM_TEMPLATE["hemisphereLights[0]"] = { semantic: "Unknown" };//

// UNIFORM_TEMPLATE["bindMatrix"] = { semantic: gltf.UniformSemantics._BINDMATRIX };
// UNIFORM_TEMPLATE["bindMatrixInverse"] = { semantic: gltf.UniformSemantics._BINDMATRIXINVERSE };
UNIFORM_TEMPLATE["boneTexture"] = {  semantic: gltf.UniformSemantics._BONETEXTURE };
UNIFORM_TEMPLATE["boneTextureSize"] = { semantic: gltf.UniformSemantics._BONETEXTURESIZE };
UNIFORM_TEMPLATE["boneMatrices[0]"] = { semantic: gltf.UniformSemantics.JOINTMATRIX };

UNIFORM_TEMPLATE["directionalShadowMatrix[0]"] = { semantic: gltf.UniformSemantics._DIRECTIONSHADOWMAT };
UNIFORM_TEMPLATE["spotShadowMatrix[0]"] = { semantic: gltf.UniformSemantics._SPOTSHADOWMAT };
UNIFORM_TEMPLATE["pointShadowMatrix[0]"] = { semantic: gltf.UniformSemantics._POINTSHADOWMAT };
UNIFORM_TEMPLATE["directionalShadowMap[0]"] = { semantic: gltf.UniformSemantics._DIRECTIONSHADOWMAP };
UNIFORM_TEMPLATE["spotShadowMap[0]"] = { semantic: gltf.UniformSemantics._SPOTSHADOWMAP };
UNIFORM_TEMPLATE["pointShadowMap[0]"] = { semantic: gltf.UniformSemantics._POINTSHADOWMAP };
UNIFORM_TEMPLATE["lightMap"] = { semantic: gltf.UniformSemantics._LIGHTMAPTEX };
UNIFORM_TEMPLATE["lightMapIntensity"] = { semantic: gltf.UniformSemantics._LIGHTMAPINTENSITY };
UNIFORM_TEMPLATE["lightMapScaleOffset"] = { semantic: gltf.UniformSemantics._LIGHTMAP_SCALE_OFFSET };


UNIFORM_TEMPLATE["referencePosition"] = { semantic: gltf.UniformSemantics._REFERENCEPOSITION };
UNIFORM_TEMPLATE["nearDistance"] = { semantic: gltf.UniformSemantics._NEARDICTANCE };
UNIFORM_TEMPLATE["farDistance"] = { semantic: gltf.UniformSemantics._FARDISTANCE };
// fog TODO
UNIFORM_TEMPLATE["fogColor"] = { semantic: gltf.UniformSemantics._FOG_COLOR };
UNIFORM_TEMPLATE["fogDensity"] = { semantic: gltf.UniformSemantics._FOG_DENSITY };
UNIFORM_TEMPLATE["fogNear"] = { semantic: gltf.UniformSemantics._FOG_NEAR };
UNIFORM_TEMPLATE["fogFar"] = { semantic: gltf.UniformSemantics._FOG_FAR };

//
UNIFORM_TEMPLATE["toneMappingExposure"] = { semantic: gltf.UniformSemantics._TONE_MAPPING_EXPOSURE };
UNIFORM_TEMPLATE["toneMappingWhitePoint"] = { semantic: gltf.UniformSemantics._TONE_MAPPING_WHITE_POINT };
//
UNIFORM_TEMPLATE["logDepthBufFC"] = { semantic: gltf.UniformSemantics._LOG_DEPTH_BUFFC };
//
UNIFORM_TEMPLATE["specular"] = { value: [0.066666, 0.066666, 0.066666] };
UNIFORM_TEMPLATE["shininess"] = { value: 30.0 };
UNIFORM_TEMPLATE["opacity"] = { value: 1.0 };
UNIFORM_TEMPLATE["normalScale"] = { value: [1.0, 1.0] };
//
UNIFORM_TEMPLATE["roughness"] = { value: 0.5 };
UNIFORM_TEMPLATE["metalness"] = { value: 0.5 };
UNIFORM_TEMPLATE["bumpScale"] = { value: 1.0 };
UNIFORM_TEMPLATE["displacementScale"] = { value: 1.0 };
UNIFORM_TEMPLATE["displacementBias"] = { value: 0.0 };
//
UNIFORM_TEMPLATE["clearCoat"] = { value: 0.0 };
UNIFORM_TEMPLATE["clearCoatRoughness"] = { value: 0.0 };

UNIFORM_TEMPLATE["uvTransform"] = { value: [1, 0, 0, 0, 1, 0, 0, 0, 1] };
UNIFORM_TEMPLATE["diffuse"] = { value: [1, 1, 1] };
UNIFORM_TEMPLATE["emissive"] = { value: [0, 0, 0] };
UNIFORM_TEMPLATE["emissiveIntensity"] = { value: 1 };
UNIFORM_TEMPLATE["opacity"] = { value: 1 };
UNIFORM_TEMPLATE["aoMapIntensity"] = { value: 1 };
UNIFORM_TEMPLATE["reflectivity"] = { value: 1 };
UNIFORM_TEMPLATE["refractionRatio"] = { value: 0.98 };
UNIFORM_TEMPLATE["envMapIntensity"] = { value: 1 };
UNIFORM_TEMPLATE["flipEnvMap"] = { value: 1 };
UNIFORM_TEMPLATE["maxMipLevel"] = { value: 0 };

// particle
UNIFORM_TEMPLATE["u_worldPosition"] = { value: [0, 0, 0] };
UNIFORM_TEMPLATE["u_worldRotation"] = { value: [0, 0, 0, 1] };
// cube
UNIFORM_TEMPLATE["tFlip"] = { value: 1.0 };

// line
UNIFORM_TEMPLATE["resolution"] = { semantic: gltf.UniformSemantics._RESOLUTION };
UNIFORM_TEMPLATE["scale"] = { value: 1 };
UNIFORM_TEMPLATE["linewidth"] = { value: 1 };
UNIFORM_TEMPLATE["dashScale"] = { value: 1 };
UNIFORM_TEMPLATE["dashSize"] = { value: 1 };
UNIFORM_TEMPLATE["gapSize"] = { value: 1 };
UNIFORM_TEMPLATE["totalSize"] = { value: 1 };
//old
// UNIFORM_TEMPLATE["lightMapOffset"] = { semantic: gltf.UniformSemantics._LIGHTMAPOFFSET };
// UNIFORM_TEMPLATE["lightMapUV"] = { semantic: gltf.UniformSemantics._LIGHTMAPUV };
// UNIFORM_TEMPLATE["glstate_vec4_bones[0]"] = { semantic: gltf.UniformSemantics._BONESVEC4 };
// UNIFORM_TEMPLATE["_MainTex_ST"] = { value: [1, 1, 0, 0] };
// UNIFORM_TEMPLATE["_MainColor"] = { value: [1, 1, 1, 1] };
// UNIFORM_TEMPLATE["_AlphaCut"] = { value: 0 };

/******************************************用户定义****************************************************/
//用户自定义Attribute
export const CUSTOM_ATTRIBUTE_TEMPLATE: { [key: string]: string } = {};
// CUSTOM_ATTRIBUTE_TEMPLATE["position"] = "POSITION";


//用户自定义Uniform
export const CUSTOM_UNIFORM_TEMPLATE: { [key: string]: { semantic?: string, value?: {} } } = {};
// CUSTOM_UNIFORM_TEMPLATE["_AlphaCut"] = { value: 0 };