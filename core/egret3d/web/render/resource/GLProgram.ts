namespace egret3d {
    /**
     * @private
     */
    export interface WebGLActiveAttribute {
        name: string;
        size: number;
        type: number;
        location: number;
    }
    /**
     * @private
     */
    export interface WebGLActiveUniform {
        name: string;
        size: number;
        type: number;
        location: WebGLUniformLocation;
        textureUnits?: number[];
    }
    // 运行时 draw call 排序优化使用。
    let _hashCode: number = 0;
    /**
     * @private
     */
    export class GlProgram {
        public readonly id: number = _hashCode++;
        public readonly attributes: WebGLActiveAttribute[] = [];
        public readonly contextUniforms: WebGLActiveUniform[] = [];
        public readonly uniforms: WebGLActiveUniform[] = [];
        public readonly program: WebGLProgram;

        public constructor(webglProgram: WebGLProgram) {
            this.program = webglProgram;
        }
    }
}