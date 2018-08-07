namespace egret3d {
    /**
     * @internal
     */
    export interface WebGLActiveAttribute {
        name: string;
        size: number;
        type: number;
        location: number;
    }
    /**
     * @internal
     */
    export interface WebGLActiveUniform {
        name: string;
        size: number;
        type: number;
        location: WebGLUniformLocation;
        textureUnits?: number[];
    }

    //TODO 运行时DrawCall排序优化使用
    let _hashCode: number = 0;//
    /**
     * @internal
     * WebGLProgram的包装类
     */
    export class GlProgram {
        public id = _hashCode++;
        public program: WebGLProgram;
        public attributes: WebGLActiveAttribute[] = [];
        public uniforms: WebGLActiveUniform[] = [];

        public constructor(webglProgram: WebGLProgram) {
            this.program = webglProgram;
        }
    }
}