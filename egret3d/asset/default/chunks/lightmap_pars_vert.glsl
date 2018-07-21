#ifdef LIGHTMAP
attribute vec4 _glesVertex;
uniform highp vec4 glstate_lightmapOffset;
uniform lowp float glstate_lightmapUV;
varying highp vec2 xlv_TEXCOORD1;
#endif