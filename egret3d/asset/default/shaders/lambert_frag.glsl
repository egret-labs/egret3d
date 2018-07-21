// #extension GL_OES_standard_derivatives : enable
#include <common>
uniform sampler2D _MainTex;
uniform vec4 _Color;         

#include <bsdfs>
#include <light_pars_frag>
#include <shadowMap_pars_frag>

varying vec3 xlv_POS;
varying vec3 xlv_NORMAL;                
varying vec2 xlv_TEXCOORD0;

#ifdef USE_NORMAL_MAP
    #include <tbn>
    #include <tsn>
    uniform sampler2D _NormalTex;
#endif

#include <bumpMap_pars_frag>

void main() {
    vec4 outColor = vec4(0., 0., 0., 1.);

    vec4 diffuseColor = _Color * texture2D(_MainTex, xlv_TEXCOORD0);

    #include <normal_frag>
    #include <light_frag>
    
    outColor.a = diffuseColor.a;

    gl_FragColor = outColor;
}