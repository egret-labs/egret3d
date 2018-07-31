
//inspired by layaair:https://github.com/layabox/layaair/blob/master/src/d3/src/laya/d3/shader/files/ParticleShuriKen.ps
#include <common>
uniform sampler2D _MainTex;
uniform vec4 _TintColor;
varying float v_discard;
varying vec4 v_color;
varying vec2 v_texcoord;

#ifdef RENDERMODE_MESH
	varying vec4 v_mesh_color;
#endif

void main()
{	
	#ifdef RENDERMODE_MESH
		gl_FragColor=v_mesh_color;
	#else
		gl_FragColor=vec4(1.0);	
	#endif

	if(v_discard!=0.0)
		discard;
	gl_FragColor*=texture2D(_MainTex,v_texcoord)*_TintColor*v_color*2.0;
}