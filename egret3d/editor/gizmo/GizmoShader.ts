namespace paper.editor {
    export class GizmoShader {

        public prg: WebGLProgram;
        private gl: WebGLRenderingContext;

        constructor(gl: WebGLRenderingContext, vshader: string, fshader: string) {
            this.gl = gl;
            this.prg = this.createProgram(vshader, fshader);
        }

        private createProgram(vshader: string, fshader: string) {
            let gl = this.gl;
            let prg = gl.createProgram();
            let vertexShader = this.createShader(gl.VERTEX_SHADER, vshader);
            let fragmentShader = this.createShader(gl.FRAGMENT_SHADER, fshader);
            gl.attachShader(prg, vertexShader);
            gl.attachShader(prg, fragmentShader);
            gl.linkProgram(prg);
            if (!gl.getProgramParameter(prg, gl.LINK_STATUS)) {
                alert("Could not initialise shaders");
            }
            return prg;
        }

        private createShader(type: number, str: string) {
            let gl = this.gl;
            let shader = gl.createShader(type);
            gl.shaderSource(shader, str);
            gl.compileShader(shader);
            let parameter = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
            if (!parameter) {
                if (confirm("shader compile:" + gl.getShaderInfoLog(shader) + "\n")) {
                    gl.deleteShader(shader);
                }
                return null;
            }
            return shader;
        }

        public use() {
            this.gl.useProgram(this.prg);
        }

        public setFloat(name: string, value: number) {
            let gl = this.gl;
            gl.uniform1f(gl.getUniformLocation(this.prg, name), value);
        }
        public setInt(name: string, value: number) {
            let gl = this.gl;
            gl.uniform1i(gl.getUniformLocation(this.prg, name), value);
        }
        public setBool(name: string, value: boolean) {
            let gl = this.gl;
            gl.uniform1i(gl.getUniformLocation(this.prg, name), value ? 1 : 0);
        }
        public setVec3(name: string, value: egret3d.Vector3) {
            let gl = this.gl;
            gl.uniform3f(gl.getUniformLocation(this.prg, name), value.x, value.y, value.z);
        }
        public setVec4(name: string, value: egret3d.Vector4) {
            let gl = this.gl;
            gl.uniform4f(gl.getUniformLocation(this.prg, name), value.x, value.y, value.z, value.w);
        }
        public setColor(name: string, value: number[]) {
            let gl = this.gl;
            gl.uniform4f(gl.getUniformLocation(this.prg, name), value[0], value[1], value[2], value[3]);
        }
        //public setColor (name: string, value: egret3d.Color) {
        //let gl = this.gl;
        //gl.uniform4f(gl.getUniformLocation(this.prg, name), value.r, value.g, value.b, value.a);
        //}
        public setMatrix(name: string, value: egret3d.Matrix4) {
            let gl = this.gl;
            gl.uniformMatrix4fv(gl.getUniformLocation(this.prg, name), false, value.rawData);
        }
        public setTexture(name: string, value: number) {
            let gl = this.gl;
            gl.uniform1i(gl.getUniformLocation(this.prg, name), value);
        }
    }
}