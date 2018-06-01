namespace paper.editor {
    export const icon_frag = `
        #ifdef GL_ES
        precision highp float;
        #endif
        uniform sampler2D PointTexture;
        uniform bool hasColor;
        uniform vec4 iconColor;
        void main(void) {
            vec4 tex = texture2D(PointTexture, gl_PointCoord);
            gl_FragColor = tex;
            if (hasColor) {
                if (gl_FragColor.a >= 0.1) {
                    gl_FragColor = iconColor;
                } else {
                    gl_FragColor.a = 0.0;
                }
            }
        }`;
    export const icon_vert = `
        attribute vec3 aVertexPosition; 
        uniform mat4 mvpMat;
        uniform float pointSize;
        void main(void) {
            gl_Position = mvpMat * vec4(aVertexPosition,1.0);
            gl_PointSize = pointSize; 
        }`;
    export const line_frag = `
        #ifdef GL_ES
        precision highp float;
        #endif
        uniform vec4 lineColor;
        void main(void) {
            gl_FragColor = lineColor;
        }`;
    export const line_vert = `
        attribute vec3 aVertexPosition; 
        uniform mat4 mvpMat;
        void main(void) {
            gl_Position = mvpMat * vec4(aVertexPosition,1.0);
        }`;
}