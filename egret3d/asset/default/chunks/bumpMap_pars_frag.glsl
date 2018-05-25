#ifdef USE_BUMPMAP

	uniform sampler2D bumpMap;
	uniform float bumpScale;

	// Derivative maps - bump mapping unparametrized surfaces by Morten Mikkelsen
	// http://mmikkelsen3d.blogspot.sk/2011/07/derivative-maps.html

	// Evaluate the derivative of the height w.r.t. screen-space using forward differencing (listing 2)

	vec2 dHdxy_fwd(vec2 uv) {

		vec2 dSTdx = dFdx( uv );
		vec2 dSTdy = dFdy( uv );

		float Hll = bumpScale * texture2D( bumpMap, uv ).x;
		float dBx = bumpScale * texture2D( bumpMap, uv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, uv + dSTdy ).x - Hll;

		return vec2( dBx, dBy );

	}

	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy) {

		vec3 vSigmaX = dFdx( surf_pos );
		vec3 vSigmaY = dFdy( surf_pos );
		vec3 vN = surf_norm;		// normalized

		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );

		float fDet = dot( vSigmaX, R1 );

		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );

	}

#endif
