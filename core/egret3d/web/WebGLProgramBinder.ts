namespace egret3d {
    // 运行时 draw call 排序优化使用。
    let _hashCode: uint = 0;
    /**
     * @private
     */
    export interface WebGLActiveAttribute {
        name: string;
        size: number;
        type: number;
        location: number;
        semantic: string;
    }
    /**
     * @private
     */
    export interface WebGLActiveUniform {
        name: string;
        size: number;
        type: number;
        location: WebGLUniformLocation;
        semantic?: string;
        textureUnits?: number[];
    }
    /**
     * @private
     */
    export class WebGLProgramBinder {
        public readonly id: uint = _hashCode++;
        public readonly attributes: WebGLActiveAttribute[] = [];
        public readonly contextUniforms: WebGLActiveUniform[] = [];
        public readonly uniforms: WebGLActiveUniform[] = [];
        public readonly program: WebGLProgram;

        public constructor(webglProgram: WebGLProgram) {
            this.program = webglProgram;
        }
    }
}