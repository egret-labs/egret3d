namespace egret3d {
    export interface WebGLActiveAttribute {
        size: number;
        type: number;
        location: number;
    }

    export interface WebGLActiveUniform {
        size: number;
        type: number;
        location: WebGLUniformLocation;
    }

    //TODO 运行时DrawCall排序优化使用
    let _hashCode:number = 0;//
    /**
     * 
     * WebGLProgram的包装类
     */
    export class GlProgram {
        /**
         * @internal
         */
        public id = _hashCode++;
        public program: WebGLProgram;
        public attributes: { [key: string]: WebGLActiveAttribute } = {};
        public uniforms: { [key: string]: WebGLActiveUniform } = {};
        public texUnits: string[] = [];
        public constructor(webglProgram: WebGLProgram) {
            this.program = webglProgram;
        }
    }
}