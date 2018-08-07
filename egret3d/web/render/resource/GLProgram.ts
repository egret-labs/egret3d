namespace egret3d {
    let programMap: { [key: string]: GlProgram } = {};
    let vsShaderMap: { [key: string]: WebGLShader } = {};
    let fsShaderMap: { [key: string]: WebGLShader } = {};

    function parseIncludes(string: string): string {
        const pattern = /#include +<([\w\d.]+)>/g;
        //
        function replace(_match: string, include: string) {
            const replace = (egret3d.ShaderChunk as any)[include];
            if (replace === undefined) {
                throw new Error('Can not resolve #include <' + include + '>');
            }

            return parseIncludes(replace);
        }
        //
        return string.replace(pattern, replace);
    }

    function getWebGLShader(type: number, gl: WebGLRenderingContext, info: gltf.Shader, defines: string): WebGLShader {
        let shader = gl.createShader(type);
        //
        gl.shaderSource(shader, WebGLCapabilities.commonDefines + defines + parseIncludes(info.uri!));
        gl.compileShader(shader);
        let parameter = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!parameter) {
            if (confirm("shader compile:" + info.name + " " + type + " error! ->" + gl.getShaderInfoLog(shader) + "\n" + ". did you want see the code?")) {
                gl.deleteShader(shader);
                alert(info.uri);
            }
            return null!;
        }

        return shader!;
    }
    /**
     * extract attributes
     */
    function extractAttributes(gl: WebGLRenderingContext, program: GlProgram) {
        const webglProgram = program.program;
        const totalAttributes = gl.getProgramParameter(webglProgram, gl.ACTIVE_ATTRIBUTES);
        //
        const attributes: WebGLActiveAttribute[] = [];
        for (let i = 0; i < totalAttributes; i++) {
            const attribData = gl.getActiveAttrib(webglProgram, i)!;
            const location = gl.getAttribLocation(webglProgram, attribData.name);
            attributes.push({ name: attribData.name, type: attribData.type, size: attribData.size, location });
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
        const uniforms: WebGLActiveUniform[] = [];
        for (let i = 0; i < totalUniforms; i++) {
            const uniformData = gl.getActiveUniform(webglProgram, i)!;
            const location = gl.getUniformLocation(webglProgram, uniformData!.name)!;

            uniforms.push({ name: uniformData.name, type: uniformData.type, size: uniformData.size, location });
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
        for (let uniform of activeUniforms) {
            const key = uniform.name;
            if (uniform.type == gltf.UniformType.SAMPLER_2D || uniform.type == gltf.UniformType.SAMPLER_CUBE) {
                if (key.indexOf("[") > -1) {
                    samplerArrayKeys.push(key);
                }
                else {
                    samplerKeys.push(key);
                }
            }
        }

        let allKeys = samplerKeys.concat(samplerArrayKeys);
        let unitNumber: number = 0;
        for (let uniform of activeUniforms) {
            if (allKeys.indexOf(uniform.name) < 0) {
                continue;
            }

            if (!uniform.textureUnits) {
                uniform.textureUnits = [];
            }
            uniform.textureUnits.length = uniform.size;
            for (let i = 0; i < uniform.size; i++) {
                uniform.textureUnits[i] = unitNumber++;
            }
        }
    }
    function getWebGLProgram(gl: WebGLRenderingContext, vs: gltf.Shader, fs: gltf.Shader, defines: string): WebGLProgram {
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
            return null as any;
        }

        return program!;
    }


    export interface WebGLActiveAttribute {
        name: string;
        size: number;
        type: number;
        location: number;
    }
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
        public attributes: WebGLActiveAttribute[] = [];
        /**
         * @internal
         */
        public uniforms: WebGLActiveUniform[] = [];

        public constructor(webglProgram: WebGLProgram) {
            this.program = webglProgram;
        }

        public static getProgram(material: Material, technique: gltf.Technique, defines: string) {
            const shader = material._glTFShader;
            const extensions = shader.config.extensions!.KHR_techniques_webgl;
            const vertexShader = extensions!.shaders[0];
            const fragShader = extensions!.shaders[1];
            const name = vertexShader.name + "_" + fragShader.name + "_" + defines;//TODO材质标脏可以优化
            let program = programMap[name];
            const webgl = WebGLCapabilities.webgl;
            if (!program) {
                const webglProgram = getWebGLProgram(webgl, vertexShader, fragShader, defines);
                program = new GlProgram(webglProgram);
                programMap[name] = program;
                extractAttributes(webgl, program);
                extractUniforms(webgl, program);
                extractTexUnits(program);
            }
            //
            if (technique.program !== program.id) {
                technique.program = program.id;
            }
            return program;
        }
    }
}