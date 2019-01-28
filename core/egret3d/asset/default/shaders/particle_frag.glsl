//inspired by layaair:https://github.com/layabox/layaair/blob/master/src/d3/src/laya/d3/shader/files/ParticleShuriKen.ps
#include <common>
#include <fog_pars_fragment>
uniform sampler2D map;
uniform vec3 diffuse;
uniform float opacity;
varying float v_discard;
varying vec4 v_color;
varying vec2 v_texcoord;

#ifdef RENDERMESH
	varying vec4 v_mesh_color;
#endif

void main()
{	
	#ifdef RENDERMESH
		gl_FragColor=v_mesh_color;
	#else
		gl_FragColor=vec4(1.0);	
	#endif

	if(v_discard!=0.0)
		discard;
	gl_FragColor*=texture2D(map,v_texcoord)*vec4(diffuse, opacity)*v_color*2.0;
	#include <fog_fragment>
}