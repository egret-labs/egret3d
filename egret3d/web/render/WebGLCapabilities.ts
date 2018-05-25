namespace egret3d {

    /**
     * get max precision
     * @param gl
     * @param precision {string} the expect precision, can be: "highp"|"mediump"|"lowp"
     */
    function getMaxPrecision(gl:WebGLRenderingContext, precision:string = "highp") {
        if (precision === 'highp') {
            if (gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT).precision > 0 &&
                gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT).precision > 0) {
                return 'highp';
            }
            precision = 'mediump';
        }
        if (precision === 'mediump') {
            if (gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT).precision > 0 &&
                gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT).precision > 0) {
                return 'mediump';
            }
        }
        return 'lowp';
    }

    function getExtension(gl:WebGLRenderingContext, name:string) {
        let browserPrefixes = [
            "",
            "MOZ_",
            "OP_",
            "WEBKIT_"
        ];
        for (let ii = 0; ii < browserPrefixes.length; ++ii) {
            let prefixedName = browserPrefixes[ii] + name;
            let ext = gl.getExtension(prefixedName);
            if (ext) {
                return ext;
            }
        }
        return null;
    }

    export class WebGLCapabilities {

        public version:number;

        public precision:string = "highp";

        public maxPrecision:string;

        public maxTextures:number;

        public maxVertexTextures:number;

        public maxTextureSize: number;

        public maxCubemapSize: number;

        public maxVertexUniformVectors:number;

        public floatTextures:boolean;

        public anisotropyExt:EXT_texture_filter_anisotropic;

        public shaderTextureLOD:any;

        public maxAnisotropy: number;

        public maxRenderTextureSize: number;
        public standardDerivatives: boolean;
        public s3tc: WEBGL_compressed_texture_s3tc;
        public textureFloat: boolean;
        public textureAnisotropicFilterExtension: EXT_texture_filter_anisotropic;

        public initialize(gl:WebGLRenderingContext) {
            this.version = parseFloat(/^WebGL\ ([0-9])/.exec(gl.getParameter(gl.VERSION))[1]);

            this.maxPrecision = getMaxPrecision(gl, this.precision);

            this.maxTextures = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);

            this.maxVertexTextures = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);

            this.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
            this.maxCubemapSize = gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE);

            this.maxVertexUniformVectors = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);

            this.floatTextures = !!getExtension(gl, 'OES_texture_float');

            this.anisotropyExt = getExtension(gl, 'EXT_texture_filter_anisotropic');

            this.shaderTextureLOD = getExtension(gl, 'EXT_shader_texture_lod');

            this.maxAnisotropy = (this.anisotropyExt !== null) ? gl.getParameter(this.anisotropyExt.MAX_TEXTURE_MAX_ANISOTROPY_EXT) : 0;

            // use dfdx and dfdy must enable OES_standard_derivatives
            getExtension(gl, "OES_standard_derivatives");
            // GL_OES_standard_derivatives
            getExtension(gl, "GL_OES_standard_derivatives");
        }
    }
}