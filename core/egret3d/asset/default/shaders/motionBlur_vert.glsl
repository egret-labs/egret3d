varying vec2 vUv;
			
void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
	vUv = vec2(uv.x, uv.y);
}