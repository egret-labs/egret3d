namespace egret3d {

    export enum WEBGL_UNIFORM_TYPE {
        FLOAT_VEC2 = 0x8B50,
        FLOAT_VEC3 = 0x8B51,
        FLOAT_VEC4 = 0x8B52,
        INT_VEC2 = 0x8B53,
        INT_VEC3 = 0x8B54,
        INT_VEC4 = 0x8B55,
        BOOL = 0x8B56,
        BOOL_VEC2 = 0x8B57,
        BOOL_VEC3 = 0x8B58,
        BOOL_VEC4 = 0x8B59,
        FLOAT_MAT2 = 0x8B5A,
        FLOAT_MAT3 = 0x8B5B,
        FLOAT_MAT4 = 0x8B5C,
        SAMPLER_2D = 0x8B5E,
        SAMPLER_CUBE = 0x8B60,
        BYTE = 0xffff,
        UNSIGNED_BYTE = 0x1401,
        SHORT = 0x1402,
        UNSIGNED_SHORT = 0x1403,
        INT = 0x1404,
        UNSIGNED_INT = 0x1405,
        FLOAT = 0x1406
    }

    export class WebGLUniform {
        public gl:WebGLRenderingContext;
        public name:string;
        public type:WEBGL_UNIFORM_TYPE;
        public size:number;
        public location:WebGLUniformLocation;
        public value:any;
        constructor(gl:WebGLRenderingContext, program:WebGLProgram, uniformData:WebGLActiveInfo) {
            this.gl = gl;
            this.name = uniformData.name;
            this.type = uniformData.type;
            this.size = uniformData.size;
            this.location = gl.getUniformLocation(program, this.name);
        }
    }

}