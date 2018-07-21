namespace egret3d {
    // export class WebGLAttribute {
    //     public gl:WebGLRenderingContext;
    //     public name:string;
    //     public type:WEBGL_ATTRIBUTE_TYPE;
    //     public size:number;
    //     public location:number;
    //     public count:number;
    //     public format:number;
    //     constructor(gl:WebGLRenderingContext, program:WebGLProgram, attributeData:WebGLActiveInfo) {
    //         this.gl = gl;
    //         this.name = attributeData.name;
    //         this.type = attributeData.type;
    //         this.size = attributeData.size;
    //         this.location = gl.getAttribLocation(program, this.name);
    //         this.count = this._initCount(this.type);
    //         this.format = this._initFormat(gl, this.type);
    //     }
    //     private _initCount(type:number):number {
    //         let count = 0;
    //         switch (type) {
    //             case WEBGL_ATTRIBUTE_TYPE.FLOAT:
    //             case WEBGL_ATTRIBUTE_TYPE.BYTE:
    //             case WEBGL_ATTRIBUTE_TYPE.UNSIGNED_BYTE:
    //             case WEBGL_ATTRIBUTE_TYPE.UNSIGNED_SHORT:
    //                 count = 1;
    //                 break;
    //             case WEBGL_ATTRIBUTE_TYPE.FLOAT_VEC2:
    //                 count = 2;
    //                 break;
    //             case WEBGL_ATTRIBUTE_TYPE.FLOAT_VEC3:
    //                 count = 3;
    //                 break;
    //             case WEBGL_ATTRIBUTE_TYPE.FLOAT_VEC4:
    //                 count = 4;
    //                 break;
    //         }
    //         return count;
    //     }
    //     private _initFormat(gl:WebGLRenderingContext, type:number):number {
    //         let format:number;
    //         switch (type) {
    //             case WEBGL_ATTRIBUTE_TYPE.FLOAT:
    //             case WEBGL_ATTRIBUTE_TYPE.FLOAT_VEC2:
    //             case WEBGL_ATTRIBUTE_TYPE.FLOAT_VEC3:
    //             case WEBGL_ATTRIBUTE_TYPE.FLOAT_VEC4:
    //                 format = gl.FLOAT;
    //                 break;
    //             case WEBGL_ATTRIBUTE_TYPE.UNSIGNED_BYTE:
    //                 format = gl.UNSIGNED_BYTE;
    //                 break;
    //             case WEBGL_ATTRIBUTE_TYPE.UNSIGNED_SHORT:
    //                 format = gl.UNSIGNED_SHORT;
    //                 break;
    //             case WEBGL_ATTRIBUTE_TYPE.BYTE:
    //                 format = gl.BYTE;
    //                 break;
    //         }
    //         return format;
    //     }
    // }
}