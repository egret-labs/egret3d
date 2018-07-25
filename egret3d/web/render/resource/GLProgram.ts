namespace egret3d {
    let _programMap: { [key: string]: GlProgram } = {};
    let vsShaderMap: { [key: string]: WebGLShader } = {};
    let fsShaderMap: { [key: string]: WebGLShader } = {};

    function parseIncludes(string) {
        const pattern = /#include +<([\w\d.]+)>/g;
        //
        function replace(match, include) {
            const replace = egret3d.ShaderChunk[include];
            if (replace === undefined) {
                throw new Error('Can not resolve #include <' + include + '>');
            }

            return parseIncludes(replace);
        }
        //
        return string.replace(pattern, replace);
    }

    function getWebGLShader(type: number, gl: WebGLRenderingContext, info: ShaderInfo, defines: string): WebGLShader {
        let shader = gl.createShader(type);
        //
        gl.shaderSource(shader, WebGLCapabilities.commonDefines + defines + parseIncludes(info.src));
        gl.compileShader(shader);
        let parameter = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!parameter) {
            if (confirm("shader compile:" + info.name + " " + type + " error! ->" + gl.getShaderInfoLog(shader) + "\n" + ". did you want see the code?")) {
                gl.deleteShader(shader);
                alert(info.src);
            }
            return null;
        }

        return shader;
    }
    /**
     * extract attributes
     */
    function extractAttributes(gl: WebGLRenderingContext, program: GlProgram) {
        const webglProgram = program.program;
        const totalAttributes = gl.getProgramParameter(webglProgram, gl.ACTIVE_ATTRIBUTES);
        //
        const attributes: { [key: string]: WebGLActiveAttribute } = {};
        for (var i = 0; i < totalAttributes; i++) {
            var attribData = gl.getActiveAttrib(webglProgram, i);
            const location = gl.getAttribLocation(webglProgram, attribData.name);
            attributes[attribData.name] = { type: attribData.type, size: attribData.size, location };
        }
        program.attributes = attributes;
    }
    /**
     * extract uniforms
     */
    function extractUniforms(gl: WebGLRenderingContext, program: GlProgram, ) {
        const webglProgram = program.program;
        const totalUniforms = gl.getProgramParameter(webglProgram, gl.ACTIVE_UNIFORMS);
        //
        const uniforms: { [key: string]: WebGLActiveUniform } = {};
        for (var i = 0; i < totalUniforms; i++) {
            const uniformData = gl.getActiveUniform(webglProgram, i);
            const location = gl.getUniformLocation(webglProgram, uniformData.name);

            uniforms[uniformData.name] = { type: uniformData.type, size: uniformData.size, location };
        }
        program.uniforms = uniforms;
    }
    /**
     * extract texUnits
     */
    function extractTexUnits(program: GlProgram) {
        const activeUniforms = program.uniforms;
        const samplerArrayKeys: string[] = [];
        const samplerKeys: string[] = [];
        //排序
        for (let key in activeUniforms) {
            const uniform = activeUniforms[key];
            if (uniform.type == gltf.UniformType.SAMPLER_2D || uniform.type == gltf.UniformType.SAMPLER_CUBE) {
                if (key.indexOf("[") > -1) {
                    samplerArrayKeys.push(key);
                }
                else {
                    samplerKeys.push(key);
                }
            }
        }

        program.texUnits = samplerKeys.concat(samplerArrayKeys);
    }
    function allocAttributes(program: GlProgram, technique: gltf.Technique) {
        const attributes = program.attributes;
        for (const name in technique.attributes) {
            const attribute = technique.attributes[name];
            if (attributes[name]) {
                attribute.extensions.paper.enable = true;
                attribute.extensions.paper.location = attributes[name].location;
            }
            else {
                attribute.extensions.paper.enable = false;
            }
        }
    }
    function allocUniforms(program: GlProgram, technique: gltf.Technique) {
        const uniforms = program.uniforms;
        for (const name in technique.uniforms) {
            const uniform = technique.uniforms[name];
            const webglUniform = uniforms[name];
            if (webglUniform) {
                if (webglUniform.type !== uniform.type) {
                    console.error("Uniform类型不匹配 着色器中类型:" + webglUniform.type + " 文件中类型:" + uniform.type);
                }
                if (webglUniform.size > 1) {
                    uniform.count = webglUniform.size;
                }
                uniform.extensions.paper.enable = true;
                uniform.extensions.paper.location = webglUniform.location;
            }
            else {
                uniform.extensions.paper.enable = false;
                uniform.extensions.paper.location = null;
            }
        }
    }
    /**
     * allocTexUnits
     */
    function allocTexUnits(program: GlProgram, technique: gltf.Technique) {
        const uniforms = technique.uniforms;
        let unitNumber: number = 0;
        for (const key of program.texUnits) {
            const uniform = uniforms[key];
            if (uniform && (uniform.type === gltf.UniformType.SAMPLER_2D || uniform.type === gltf.UniformType.SAMPLER_CUBE)) {
                if (!uniform.extensions.paper.textureUnits) {
                    uniform.extensions.paper.textureUnits = [];
                }
                const textureUnits = uniform.extensions.paper.textureUnits;
                const count = uniform.count ? uniform.count : 1;
                textureUnits.length = count;
                for (let i = 0; i < count; i++) {
                    textureUnits[i] = unitNumber++;
                }
            }
            else {
                console.error(technique.name + " technique缺少Uniform定义:" + key);
            }
        }
    }
    function getWebGLProgram(gl: WebGLRenderingContext, vs: ShaderInfo, fs: ShaderInfo, defines: string): WebGLProgram {
        let program = gl.createProgram();

        let key = vs.name + defines;
        let vertexShader = vsShaderMap[key];
        if (!vertexShader) {
            vertexShader = getWebGLShader(gl.VERTEX_SHADER, gl, vs, defines);
            vsShaderMap[key] = vertexShader;
        }

        key = fs.name + defines;
        let fragmentShader = fsShaderMap[key];
        if (!fragmentShader) {
            fragmentShader = getWebGLShader(gl.FRAGMENT_SHADER, gl, fs, defines);
            fsShaderMap[key] = fragmentShader;
        }

        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);

        gl.linkProgram(program);

        let parameter = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (!parameter) {
            alert("program compile: " + vs.name + "_" + fs.name + " error! ->" + gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            return null;
        }

        return program;
    }


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
    let _hashCode: number = 0;//
    /**
     * WebGLProgram的包装类
     */
    export class GlProgram {
        /**
         * @internal
         */
        public id = _hashCode++;
        /**
         * @internal
         */
        public program: WebGLProgram;
        /**
         * @internal
         */
        public attributes: { [key: string]: WebGLActiveAttribute } = {};
        /**
         * @internal
         */
        public uniforms: { [key: string]: WebGLActiveUniform } = {};
        /**
         * @internal
         */
        public texUnits: string[] = [];

        public constructor(webglProgram: WebGLProgram) {
            this.program = webglProgram;
        }

        public static getProgram(context: RenderContext, material: Material, technique: gltf.Technique, defines: string) {
            const shader = material.getShader();
            const name = shader.vertShader.name + "_" + shader.fragShader.name + "_" + defines;//TODO材质标脏可以优化
            let program = _programMap[name];
            const webgl = WebGLCapabilities.webgl;
            if (!program) {
                const webglProgram = getWebGLProgram(webgl, shader.vertShader, shader.fragShader, defines);
                program = new GlProgram(webglProgram);
                _programMap[name] = program;
                extractAttributes(webgl, program);
                extractUniforms(webgl, program);
                extractTexUnits(program);
            }
            //
            if (technique.program !== program) {
                technique.program = program;
                allocAttributes(program, technique);
                allocUniforms(program, technique);
                allocTexUnits(program, technique);
            }
            return program.program;
        }
    }
}