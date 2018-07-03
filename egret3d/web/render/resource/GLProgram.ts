namespace egret3d {

    const _attributeInfos: { [key: string]: { name: gltf.MeshAttributeType | string, normalized: boolean } } = {
        "_glesVertex": { name: gltf.MeshAttributeType.POSITION, normalized: false },
        "_glesNormal": { name: gltf.MeshAttributeType.NORMAL, normalized: true },
        "_glesTangent": { name: gltf.MeshAttributeType.TANGENT, normalized: true },
        "_glesMultiTexCoord0": { name: gltf.MeshAttributeType.TEXCOORD_0, normalized: false },
        "_glesMultiTexCoord1": { name: gltf.MeshAttributeType.TEXCOORD_1, normalized: false },
        "_glesColor": { name: gltf.MeshAttributeType.COLOR_0, normalized: false },
        "_glesColorEx": { name: gltf.MeshAttributeType.COLOR_1, normalized: false },
        "_glesBlendIndex4": { name: gltf.MeshAttributeType.JOINTS_0, normalized: false },
        "_glesBlendWeight4": { name: gltf.MeshAttributeType.WEIGHTS_0, normalized: false },
        "_glesCorner": { name: particle.ParticleMaterialAttribute.CORNER, normalized: false },
        "_startPosition": { name: particle.ParticleMaterialAttribute.START_POSITION, normalized: false },
        "_startVelocity": { name: particle.ParticleMaterialAttribute.START_VELOCITY, normalized: false },
        "_startColor": { name: particle.ParticleMaterialAttribute.START_COLOR, normalized: false },
        "_startSize": { name: particle.ParticleMaterialAttribute.START_SIZE, normalized: false },
        "_startRotation": { name: particle.ParticleMaterialAttribute.START_ROTATION, normalized: false },
        "_time": { name: particle.ParticleMaterialAttribute.TIME, normalized: false },
        "_random0": { name: particle.ParticleMaterialAttribute.RANDOM0, normalized: false },
        "_random1": { name: particle.ParticleMaterialAttribute.RANDOM1, normalized: false },
        "_startWorldPosition": { name: particle.ParticleMaterialAttribute.WORLD_POSITION, normalized: false },
        "_startWorldRotation": { name: particle.ParticleMaterialAttribute.WORLD_ROTATION, normalized: false },
    };
    const _uniformsKeyConvert: { [key: string]: string } = {
        "u_velocityCurveX[0]": "u_velocityCurveX",
        "u_velocityCurveY[0]": "u_velocityCurveY",
        "u_velocityCurveZ[0]": "u_velocityCurveZ",
        "u_velocityCurveMaxX[0]": "u_velocityCurveMaxX",
        "u_velocityCurveMaxY[0]": "u_velocityCurveMaxY",
        "u_velocityCurveMaxZ[0]": "u_velocityCurveMaxZ",
        "u_alphaGradient[0]": "u_alphaGradient",
        "u_colorGradient[0]": "u_colorGradient",
        "u_alphaGradientMax[0]": "u_alphaGradientMax",
        "u_colorGradientMax[0]": "u_colorGradientMax",
        "u_sizeCurve[0]": "u_sizeCurve",
        "u_sizeCurveMax[0]": "u_sizeCurveMax",
        "u_sizeCurveX[0]": "u_sizeCurveX",
        "u_sizeCurveY[0]": "u_sizeCurveY",
        "u_sizeCurveZ[0]": "u_sizeCurveZ",
        "u_sizeCurveMaxX[0]": "u_sizeCurveMaxX",
        "u_sizeCurveMaxY[0]": "u_sizeCurveMaxY",
        "u_sizeCurveMaxZ[0]": "u_sizeCurveMaxZ",
        "u_rotationCurve[0]": "u_rotationCurve",
        "u_rotationCurveMax[0]": "u_rotationCurveMax",
        "u_rotationCurveX[0]": "u_rotationCurveX",
        "u_rotationCurveY[0]": "u_rotationCurveY",
        "u_rotationCurveZ[0]": "u_rotationCurveZ",
        "u_rotationCurveW[0]": "u_rotationCurveW",
        "u_rotationCurveMaxX[0]": "u_rotationCurveMaxX",
        "u_rotationCurveMaxY[0]": "u_rotationCurveMaxY",
        "u_rotationCurveMaxZ[0]": "u_rotationCurveMaxZ",
        "u_rotationCurveMaxW[0]": "u_rotationCurveMaxW",
        "u_uvCurve[0]": "u_uvCurve",
        "u_uvCurveMax[0]": "u_uvCurveMax",
    };
    let _vsShaderMap: { [key: string]: WebGLShader } = {};
    let _fsShaderMap: { [key: string]: WebGLShader } = {};

    var parseIncludes = function (string) {

        var pattern = /#include +<([\w\d.]+)>/g;

        function replace(match, include) {

            var replace = egret3d.ShaderChunk[include];

            if (replace === undefined) {

                throw new Error('Can not resolve #include <' + include + '>');

            }

            return parseIncludes(replace);

        }

        return string.replace(pattern, replace);

    }

    let constDefines: string;

    function createConstDefines(): string {
        let defines = "precision " + WebGLKit.capabilities.maxPrecision + " float; \n";
        defines += "precision " + WebGLKit.capabilities.maxPrecision + " int; \n";

        defines += '#define PI 3.14159265359 \n';
        defines += '#define EPSILON 1e-6 \n';
        defines += 'float pow2( const in float x ) { return x*x; } \n';
        defines += '#define LOG2 1.442695 \n';
        defines += '#define RECIPROCAL_PI 0.31830988618 \n';
        defines += '#define saturate(a) clamp( a, 0.0, 1.0 ) \n';
        defines += '#define whiteCompliment(a) ( 1.0 - saturate( a ) ) \n';
        // defines += '#extension GL_OES_standard_derivatives : enable \n';

        return defines;
    }

    function buildDefines(context: RenderContext, material: Material): string {
        let defines = "";

        if (context.lightCount > 0) {
            defines += "#define USE_LIGHT " + context.lightCount + "\n";

            if (context.directLightCount > 0) {
                defines += "#define USE_DIRECT_LIGHT " + context.directLightCount + "\n";
            }
            if (context.pointLightCount > 0) {
                defines += "#define USE_POINT_LIGHT " + context.pointLightCount + "\n";
            }
            if (context.spotLightCount > 0) {
                defines += "#define USE_SPOT_LIGHT " + context.spotLightCount + "\n";
            }

            if (context.receiveShadow) {
                defines += "#define USE_SHADOW \n";
                defines += "#define USE_PCF_SOFT_SHADOW \n";
            }
        }

        //自定义的宏定义TODO
        defines += material.shaderDefine;

        return defines;
    }

    function getWebGLShader(type: number, gl: WebGLRenderingContext, info: ShaderInfo, defines: string): WebGLShader {
        let shader = gl.createShader(type);

        if (!constDefines) {
            constDefines = createConstDefines();
        }

        gl.shaderSource(shader, constDefines + defines + parseIncludes(info.src));
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

    function getWebGLProgram(gl: WebGLRenderingContext, vs: ShaderInfo, fs: ShaderInfo, defines: string): WebGLProgram {
        let program = gl.createProgram();

        let key: string;

        key = vs.name + defines;
        let vertexShader = _vsShaderMap[key];
        if (!vertexShader) {
            let key = vs.name + defines;
            vertexShader = getWebGLShader(gl.VERTEX_SHADER, gl, vs, defines);
            _vsShaderMap[key] = vertexShader;
        }

        key = fs.name + defines;
        let fragmentShader = _fsShaderMap[key];
        if (!fragmentShader) {
            let key = fs.name + defines;
            fragmentShader = getWebGLShader(gl.FRAGMENT_SHADER, gl, fs, defines);
            _fsShaderMap[key] = fragmentShader;
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

    /**
     * extract attributes
     */
    function extractAttributes(gl: WebGLRenderingContext, program: WebGLProgram): { [key: string]: WebGLAttribute } {
        var attributes: { [key: string]: WebGLAttribute } = {};

        var totalAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);

        for (var i = 0; i < totalAttributes; i++) {
            var attribData = gl.getActiveAttrib(program, i);
            var name = attribData.name;
            var attribute = new WebGLAttribute(gl, program, attribData);
            attributes[name] = attribute;
        }

        return attributes;
    }

    /**
     * extract uniforms
     */
    function extractUniforms(gl: WebGLRenderingContext, program: WebGLProgram): { [key: string]: WebGLUniform } {
        var uniforms: { [key: string]: WebGLUniform } = {};

        var totalUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

        for (var i = 0; i < totalUniforms; i++) {
            var uniformData = gl.getActiveUniform(program, i);
            var name = _uniformsKeyConvert[uniformData.name] ? _uniformsKeyConvert[uniformData.name] : uniformData.name;
            var uniform = new WebGLUniform(gl, program, uniformData);
            uniforms[name] = uniform;
        }

        return uniforms;
    }

    /**
     * 
     * WebGLProgram的包装类，可以批量上传数据并具有标脏功能
     */
    export class GlProgram {

        private static _programMap: { [key: string]: GlProgram } = {};

        public static get(pass: DrawPass, context: RenderContext, material: Material): GlProgram {
            let defines = buildDefines(context, material);
            let name = pass.vShaderInfo.name + "_" + pass.fShaderInfo.name + "_" + defines;
            if (!this._programMap[name]) {
                this._programMap[name] = new GlProgram(WebGLKit.webgl, pass.vShaderInfo, pass.fShaderInfo, defines);
            }
            return this._programMap[name];
        }

        private gl: WebGLRenderingContext;

        public program: WebGLProgram;

        private _attributes: { [key: string]: WebGLAttribute };
        private _uniforms: { [key: string]: WebGLUniform };

        private _cacheContext: RenderContext;
        private _cacheContextVer: number = -1;

        private _cacheMesh: Mesh;
        private _cacheMeshVer: number = -1;
        private _cacheMeshEbo: number = -1;

        private _cacheMaterial: Material;
        private _cacheMaterialVer: number = -1;

        private constructor(gl: WebGLRenderingContext, vShaderInfo: ShaderInfo, fShaderInfo: ShaderInfo, defines: string) {
            this.gl = gl;

            let program = getWebGLProgram(gl, vShaderInfo, fShaderInfo, defines);
            this.program = program;

            this._attributes = extractAttributes(gl, program);
            this._uniforms = extractUniforms(gl, program);

            this._allocTexUnits();
        }

        private _samplerUnitMap: { [key: string]: number } = {};
        private _allocTexUnits(): void {
            // sampler数组中使用unit0会导致错误？
            let samplerArrayKeys = [];
            let samplerKeys = [];
            for (let key in this._uniforms) {
                if (this._uniforms[key].type == WEBGL_UNIFORM_TYPE.SAMPLER_2D || this._uniforms[key].type == WEBGL_UNIFORM_TYPE.SAMPLER_CUBE) {
                    if (key.indexOf("[") > -1) {
                        samplerArrayKeys.push(key);
                    } else {
                        samplerKeys.push(key);
                    }
                }
            }

            let allKeys = samplerKeys.concat(samplerArrayKeys);
            let unitNumber: number = 0;
            allKeys.forEach(key => {
                this._samplerUnitMap[key] = unitNumber;
                unitNumber++;
            });
        }

        public bindAttributes(mesh: Mesh, subMeshIndex: number = 0, forceUpdate: boolean = false) {
            if (!forceUpdate && this._cacheMesh == mesh && this._cacheMeshVer == mesh._version && this._cacheMeshEbo == subMeshIndex) {
                return;
            }

            // MD mesh
            // this._cacheMesh = mesh;
            // this._cacheMeshVer = mesh._version;
            // this._cacheMeshEbo = subMeshIndex;

            // let gl = this.gl;
            // gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vbo);
            // if (bindEbo >= 0) {
            //     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.ibos[bindEbo]);
            // }

            // let meshVertexFormat = mesh.vertexFormatData;
            // let info: { size: number, normalized: boolean, stride: number, offset: number }, attribute: WebGLAttribute;
            // for (let key in this._attributes) {
            //     attribute = this._attributes[key];
            //     info = meshVertexFormat[key];
            //     if (info) {
            //         if (attribute.count !== info.size) {
            //             // console.warn("Renderer: attribute " + name + " size not match! attribute-count:" + attribute.count + ", info-size:" + info.size);
            //         }
            //         gl.vertexAttribPointer(attribute.location, info.size, attribute.format, info.normalized, info.stride, info.offset);
            //         gl.enableVertexAttribArray(attribute.location);
            //     } else {
            //         gl.disableVertexAttribArray(attribute.location);
            //     }
            // }

            if (0 <= subMeshIndex && subMeshIndex < mesh.glTFMesh.primitives.length) {
                this._cacheMesh = mesh;
                this._cacheMeshVer = mesh._version;
                this._cacheMeshEbo = subMeshIndex;

                const gl = this.gl;
                const glTFAsset = mesh.glTFAsset;
                const primitive = mesh.glTFMesh.primitives[subMeshIndex];
                const ibo = mesh.ibos[subMeshIndex];

                gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vbo);

                if (ibo) {
                    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
                }

                for (const k in this._attributes) {
                    const webGLAttribute = this._attributes[k];
                    const location = webGLAttribute.location;
                    const name = webGLAttribute.name;
                    const attributeInfo = _attributeInfos[name];
                    const accessorIndex = primitive.attributes[attributeInfo.name];

                    if (accessorIndex !== undefined) {
                        const accessor = glTFAsset.getAccessor(accessorIndex);
                        const bufferOffset = glTFAsset.getBufferOffset(accessor);
                        const typeCount = GLTFAsset.getAccessorTypeCount(accessor.type);
                        gl.vertexAttribPointer(location, typeCount, webGLAttribute.format, attributeInfo.normalized, 0, bufferOffset);
                        gl.enableVertexAttribArray(location);
                    }
                    else {
                        gl.disableVertexAttribArray(location);
                    }
                }
            }
            else {
                console.warn("Error arguments.");
            }
        }

        private _updateRenderContextUniforms(context: RenderContext) {

            for (let key in this._uniforms) {
                switch (key) {
                    case "glstate_matrix_model":
                        this.setMatrix4(key, context.matrix_m);
                        break;
                    case "glstate_matrix_mvp":
                        this.setMatrix4(key, context.matrix_mvp);
                        break;
                    case "glstate_matrix_vp":
                        this.setMatrix4(key, context.matrix_vp);
                        break;
                    case "glstate_cameraPos":
                        this.setVector3(key, context.cameraPosition);
                        break;
                    case "glstate_cameraForward":
                        this.setVector3(key, context.cameraForward);
                        break;
                    case "glstate_cameraUp":
                        this.setVector3(key, context.cameraUp);
                        break;
                    case "glstate_directLights[0]":
                        if (context.directLightCount > 0) {
                            this.setFloatv(key, context.directLightArray);
                        }
                        break;
                    case "glstate_pointLights[0]":
                        if (context.pointLightCount > 0) {
                            this.setFloatv(key, context.pointLightArray);
                        }
                        break;
                    case "glstate_spotLights[0]":
                        if (context.spotLightCount > 0) {
                            this.setFloatv(key, context.spotLightArray);
                        }
                        break;
                    case "glstate_lightCount":
                        this.setFloat(key, context.lightCount);
                        break;
                    case "glstate_directionalShadowMatrix[0]":
                        this.setMatrix4v(key, context.directShadowMatrix);
                        break;
                    case "glstate_spotShadowMatrix[0]":
                        this.setMatrix4v(key, context.spotShadowMatrix);
                        break;
                    case "glstate_directionalShadowMap[0]":
                        for (let i = 0; i < context.directShadowMaps.length; i++) {
                            if (context.directShadowMaps[i]) {
                                this.setWebGLTexture("glstate_directionalShadowMap[" + i + "]", context.directShadowMaps[i]);
                            }
                        }
                        break;
                    case "glstate_pointShadowMap[0]":
                        for (let i = 0; i < context.pointShadowMaps.length; i++) {
                            if (context.pointShadowMaps[i]) {
                                this.setWebGLTexture("glstate_pointShadowMap[" + i + "]", context.pointShadowMaps[i]);
                            }
                        }
                        break;
                    case "glstate_spotShadowMap[0]":
                        for (let i = 0; i < context.spotShadowMaps.length; i++) {
                            if (context.spotShadowMaps[i]) {
                                this.setWebGLTexture("glstate_spotShadowMap[" + i + "]", context.spotShadowMaps[i]);
                            }
                        }
                        break;
                    case "_LightmapTex":
                        this.setTexture(key, context.lightmap);
                        break;
                    case "_LightmapIntensity":
                        this.setFloat(key, context.lightmapIntensity);
                        break;
                    case "glstate_lightmapOffset":
                        if (context.lightmapOffset) {
                            this.setVector4_2(key, context.lightmapOffset);
                        }
                        else {
                            console.debug("Error light map scale and offset.");
                        }
                        break;
                    case "glstate_lightmapUV":
                        this.setFloat(key, context.lightmapUV);
                        break;
                    case "glstate_vec4_bones[0]":
                        this.setVector4v(key, context.boneData);
                        break;
                    case "glstate_matrix_bones":
                        this.setVector4v(key, context.boneData);
                        break;
                    case "glstate_referencePosition":
                        this.setVector4_2(key, context.lightPosition);
                        break;
                    case "glstate_nearDistance":
                        this.setFloat(key, context.lightShadowCameraNear);
                        break;
                    case "glstate_farDistance":
                        this.setFloat(key, context.lightShadowCameraFar);
                        break;
                }
            }
        }

        private setInt(key: string, value: number) {
            if (this._uniforms[key].value != value) {
                let uniform = this._uniforms[key];
                uniform.value = value;
                this.gl.uniform1i(uniform.location, uniform.value);
            }
        }

        private setFloat(key: string, value: number) {
            if (this._uniforms[key].value != value) {
                let uniform = this._uniforms[key];
                uniform.value = value;
                this.gl.uniform1f(uniform.location, uniform.value);
            }
        }

        private setFloatv(key: string, value: Float32Array) {
            let uniform = this._uniforms[key];
            uniform.value = value;
            this.gl.uniform1fv(uniform.location, uniform.value);
        }

        private setMatrix4(key: string, value: Matrix) {
            let uniform = this._uniforms[key];
            uniform.value = value.rawData;
            this.gl.uniformMatrix4fv(uniform.location, false, uniform.value);
        }

        private setMatrix4v(key: string, value: Float32Array) {
            let uniform = this._uniforms[key];
            uniform.value = value;
            this.gl.uniformMatrix4fv(uniform.location, false, uniform.value);
        }

        private setVector2(key: string, value: Vector2) {
            let uniform = this._uniforms[key];
            let letray = uniform.value;
            if (!letray) {
                uniform.value = [value.x, value.y];
                this.gl.uniform2fv(uniform.location, uniform.value);
            } else {
                if (letray[0] != value.x || letray[1] != value.y) {
                    letray[0] = value.x;
                    letray[1] = value.y;
                    this.gl.uniform2fv(uniform.location, uniform.value);
                }
            }
        }

        private setVector2v(key: string, value: Float32Array) {
            let uniform = this._uniforms[key];
            uniform.value = value;
            this.gl.uniform2fv(uniform.location, uniform.value);
        }

        private setVector3v(key: string, value: Float32Array) {
            let uniform = this._uniforms[key];
            uniform.value = value;
            this.gl.uniform3fv(uniform.location, uniform.value);
        }

        private setVector3(key: string, value: Vector3) {
            let uniform = this._uniforms[key];
            let letray = uniform.value;
            if (!letray) {
                uniform.value = [value.x, value.y, value.z];
                this.gl.uniform3fv(uniform.location, uniform.value);
            } else {
                if (letray[0] != value.x || letray[1] != value.y || letray[2] != value.z) {
                    letray[0] = value.x;
                    letray[1] = value.y;
                    letray[2] = value.z;
                    this.gl.uniform3fv(uniform.location, uniform.value);
                }
            }
        }

        private setVector4v(key: string, value: Float32Array) {
            let uniform = this._uniforms[key];
            uniform.value = value;
            this.gl.uniform4fv(uniform.location, uniform.value);
        }

        private setVector4_2(key: string, value: ImmutableVector4) {
            let uniform = this._uniforms[key];
            let letray = uniform.value;
            if (!letray) {
                uniform.value = value
                this.gl.uniform4fv(uniform.location, uniform.value);
            } else {
                // if (letray[0] != value[0] || letray[1] != value[1] || letray[2] != value[2] || letray[3] != value[3]) {
                uniform.value = value;
                this.gl.uniform4fv(uniform.location, uniform.value);
                // }
            }
        }

        private setVector4(key: string, value: Vector4) {
            let uniform = this._uniforms[key];
            let letray = uniform.value;
            if (!letray) {
                uniform.value = [value.x, value.y, value.z, value.w];
                this.gl.uniform4fv(uniform.location, uniform.value);
            } else {
                if (letray[0] != value.x || letray[1] != value.y || letray[2] != value.z || letray[3] != value.w) {
                    letray[0] = value.x;
                    letray[1] = value.y;
                    letray[2] = value.z;
                    letray[3] = value.w;
                    this.gl.uniform4fv(uniform.location, uniform.value);
                }
            }
        }

        private setTexture(key: string, value: Texture) {
            const uniform = this._uniforms[key];

            uniform.value = value ? value.glTexture : null;

            const index = this._samplerUnitMap[key];
            const tex = uniform.value != null ? (uniform.value as ITexture).texture : null;

            // 只标记对应的纹理单元，之后再统一上传纹理
            const cacheTextureUniform = this._cacheTextureUniforms[index];
            if (!cacheTextureUniform) {
                this.gl.uniform1i(uniform.location, index);
                this._cacheTextureUniforms[index] = { dirty: true, texture: tex, cube: uniform.type === WEBGL_UNIFORM_TYPE.SAMPLER_CUBE };
            } else {
                cacheTextureUniform.texture = tex;
                cacheTextureUniform.dirty = true;
            }
        }

        private setWebGLTexture(key: string, value: WebGLTexture) {
            let uniform = this._uniforms[key];

            uniform.value = value;

            let index = this._samplerUnitMap[key];
            let tex = uniform.value != null ? value : null;

            // 只标记对应的纹理单元，之后再统一上传纹理
            const cacheTextureUniform = this._cacheTextureUniforms[index];
            if (!cacheTextureUniform) {
                this.gl.uniform1i(uniform.location, index);
                this._cacheTextureUniforms[index] = { dirty: true, texture: tex, cube: uniform.type === WEBGL_UNIFORM_TYPE.SAMPLER_CUBE };
            } else {
                cacheTextureUniform.texture = tex;
                cacheTextureUniform.dirty = true;
            }
        }

        private _updateUniforms(unifroms: { [name: string]: { type: UniformTypeEnum, value: any } }) {
            for (let key in unifroms) {
                let type = unifroms[key].type;
                let value = unifroms[key].value;
                let target = this._uniforms[key];
                if (target == null) {
                    continue;
                }
                switch (type) {
                    case UniformTypeEnum.Boolean:
                        this.setInt(key, value);
                        break;
                    case UniformTypeEnum.Int:
                        this.setInt(key, value);
                        break;
                    case UniformTypeEnum.Float:
                        this.setFloat(key, value);
                        break;
                    case UniformTypeEnum.Floatv:
                        this.setFloatv(key, value);
                        break;
                    case UniformTypeEnum.Float2:
                        this.setVector2(key, value);
                        break;
                    case UniformTypeEnum.Float2v:
                        this.setVector2v(key, value);
                        break;
                    case UniformTypeEnum.Float3:
                        this.setVector3(key, value);
                        break;
                    case UniformTypeEnum.Float3v:
                        this.setVector3v(key, value);
                        break;
                    case UniformTypeEnum.Float4:
                        this.setVector4(key, value);
                        break;
                    case UniformTypeEnum.Float4v:
                        this.setVector4v(key, value);
                        break;
                    case UniformTypeEnum.Float4x4:
                        this.setMatrix4(key, value);
                        break;
                    case UniformTypeEnum.Float4x4v:
                        this.setMatrix4(key, value);
                        break;
                    case UniformTypeEnum.Texture:
                        this.setTexture(key, value);
                        break;
                }
            }
        }

        private _cacheTextureUniforms: { dirty: boolean, texture: WebGLTexture, cube: boolean }[] = [];

        public uploadUniforms(material: Material, context: RenderContext, forceUpdate: boolean = false) {

            let materialChange: boolean = this._cacheMaterial !== material || this._cacheMaterialVer !== material.version;
            if (materialChange) {
                this._updateUniforms(material.$uniforms);
                this._cacheMaterial = material;
                this._cacheMaterialVer = material.version;
            }

            let contextChange: boolean = this._cacheContext != context || this._cacheContextVer != context.version;
            if (contextChange) {
                this._updateRenderContextUniforms(context);
                this._cacheContext = context;
                this._cacheContextVer = context.version;
            }

            // 纹理上传特殊处理
            // shader切换的情况下，只需要重新上传纹理到对应的纹理单元即可
            // 并不需要调用unifrom函数
            if (forceUpdate) {
                for (let i = 0; i < this._cacheTextureUniforms.length; i++) {
                    let info = this._cacheTextureUniforms[i];
                    if (info) {
                        WebGLKit.activeTexture(i);
                        this.gl.bindTexture(info.cube ? this.gl.TEXTURE_CUBE_MAP : this.gl.TEXTURE_2D, info.texture);
                    }
                }
            } else if (materialChange || contextChange) {
                for (let i = 0; i < this._cacheTextureUniforms.length; i++) {
                    let info = this._cacheTextureUniforms[i];
                    if (info && info.dirty) {
                        WebGLKit.activeTexture(i);
                        this.gl.bindTexture(info.cube ? this.gl.TEXTURE_CUBE_MAP : this.gl.TEXTURE_2D, info.texture);
                    }
                }
            } else {
                // TODO 判断纹理标脏上传
            }
        }
    }
}