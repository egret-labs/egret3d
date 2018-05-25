namespace egret3d {
    /**
     * uniform类型枚举
     */
    export enum UniformTypeEnum {
        Texture,
        Float,
        Floatv,
        Float4,
        Float4v,
        Float4x4,
        Float4x4v,
    }

    export enum ShowFaceStateEnum {
        ALL,
        CCW,
        CW,
    }

    export enum DrawModeEnum {
        VboTri,
        VboLine,
        EboTri,
        EboLine,
    }

    export enum BlendModeEnum {
        Close,
        Blend,
        Blend_PreMultiply,
        Add,
        Add_PreMultiply,
    }

    export class DrawPass {

        public state_showface: ShowFaceStateEnum = ShowFaceStateEnum.CCW;
        public state_zwrite: boolean = false;
        public state_ztest: boolean = false;
        public state_ztest_method: number = WebGLKit.LEQUAL;
        public state_blend: boolean = false;
        public state_blendEquation: number = 0;
        public state_blendSrcRGB: number = 0;
        public state_blendDestRGB: number = 0;
        public state_blendSrcAlpha: number = 0;
        public state_blendDestALpha: number = 0;

        public vShaderInfo: ShaderInfo;
        public fShaderInfo: ShaderInfo;

        constructor(vShaderInfo: ShaderInfo, fShaderInfo: ShaderInfo) {
            this.vShaderInfo = vShaderInfo;
            this.fShaderInfo = fShaderInfo;
        }

        public setAlphaBlend(mode: BlendModeEnum) {
            if (mode === BlendModeEnum.Add) {
                this.state_blend = true;
                this.state_blendEquation = WebGLKit.FUNC_ADD;
                this.state_blendSrcRGB = WebGLKit.SRC_ALPHA;
                this.state_blendDestRGB = WebGLKit.ONE;
                this.state_blendSrcAlpha = WebGLKit.SRC_ALPHA;
                this.state_blendDestALpha = WebGLKit.ONE;
            }
            else if (mode === BlendModeEnum.Add_PreMultiply) {
                this.state_blend = true;
                this.state_blendEquation = WebGLKit.FUNC_ADD;
                this.state_blendSrcRGB = WebGLKit.ONE;
                this.state_blendDestRGB = WebGLKit.ONE;
                this.state_blendSrcAlpha = WebGLKit.ONE;
                this.state_blendDestALpha = WebGLKit.ONE;
            }
            else if (mode === BlendModeEnum.Blend) {
                this.state_blend = true;
                this.state_blendEquation = WebGLKit.FUNC_ADD;
                this.state_blendSrcRGB = WebGLKit.SRC_ALPHA;
                this.state_blendDestRGB = WebGLKit.ONE_MINUS_SRC_ALPHA;
                this.state_blendSrcAlpha = WebGLKit.ONE;
                this.state_blendDestALpha = WebGLKit.ONE_MINUS_SRC_ALPHA;
            }
            else if (mode === BlendModeEnum.Blend_PreMultiply) {
                this.state_blend = true;
                this.state_blendEquation = WebGLKit.FUNC_ADD;
                this.state_blendSrcRGB = WebGLKit.ONE;
                this.state_blendDestRGB = WebGLKit.ONE_MINUS_SRC_ALPHA;
                this.state_blendSrcAlpha = WebGLKit.ONE;
                this.state_blendDestALpha = WebGLKit.ONE_MINUS_SRC_ALPHA;
            }
            else if (mode === BlendModeEnum.Close) {
                this.state_blend = false;
            }
        }
    }
}
