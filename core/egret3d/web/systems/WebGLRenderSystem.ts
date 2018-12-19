namespace egret3d.web {
    const _patternA = /#include +<([\w\d.]+)>/g;
    const _patternB = /#pragma unroll_loop[\s]+?for \( int i \= (\d+)\; i < (\d+)\; i \+\+ \) \{([\s\S]+?)(?=\})\}/g;

    function _loopReplace(match: string, start: string, end: string, snippet: string) {
        let unroll = "";
        for (var i = parseInt(start); i < parseInt(end); i++) {
            unroll += snippet.replace(/\[ i \]/g, '[ ' + i + ' ]');
        }

        return unroll;
    }

    function _replace(match: string, include: string): string {
        let flag = true;
        let chunk = "";

        if (include in ShaderChunk) {
            chunk = (ShaderChunk as any)[include];
        }
        else if (include in renderState.defaultCustomShaderChunks) {
            flag = false;
            chunk = renderState.customShaderChunks ? renderState.customShaderChunks[include] || "" : "";
        }

        if (chunk) {
            return chunk.replace(_patternA, _replace);
        }

        if (flag) {
            console.error(`Can not resolve #include <${include}>`);
        }

        return "";
    }

    function _parseIncludes(string: string): string {
        return string.replace(_patternA, _replace);
    }

    function _unrollLoops(string: string) {
        return string.replace(_patternB, _loopReplace);
    }
    /**
     * @internal
     */
    export class WebGLRenderSystem extends paper.BaseSystem implements IRenderSystem {
        public readonly interests = [
            [
                { componentClass: Camera }
            ],
            [
                { componentClass: Egret2DRenderer }
            ],
            [
                { componentClass: [DirectionalLight, SpotLight, PointLight] }
            ]
        ];
        private _egret2DOrderCount: number = 0;
        private readonly _drawCallCollecter: DrawCallCollecter = paper.GameObject.globalGameObject.getOrAddComponent(DrawCallCollecter);
        private readonly _cameraAndLightCollecter: CameraAndLightCollecter = paper.GameObject.globalGameObject.getOrAddComponent(CameraAndLightCollecter);
        private readonly _renderState: WebGLRenderState = paper.GameObject.globalGameObject.getOrAddComponent(RenderState) as WebGLRenderState;
        private readonly _lightCamera: Camera = paper.GameObject.globalGameObject.getOrAddComponent(Camera);
        //
        public readonly _matrix_mv: Matrix4 = Matrix4.create();
        public readonly _matrix_mvp: Matrix4 = Matrix4.create();
        public readonly _matrix_mv_inverse: Matrix3 = Matrix3.create();
        //
        private _cacheProgram: WebGLProgramBinder | null = null;
        private _cacheScene: paper.Scene | null = null;
        private _cacheCamera: Camera | null = null;
        //
        private _cacheMesh: Mesh | null = null;
        private _cacheSubMeshIndex: int = -1;
        //
        private _cacheMaterial: Material | null = null;
        //
        private _cacheLightmapIndex: int = -1;

        // private _renderLightShadow(light: BaseLight) {
        // const camera = this._lightCamera;
        // const renderState = this._renderState;
        // const isPointLight = light.constructor === PointLight;
        // const shadowMaterial = isPointLight ? DefaultMaterials.SHADOW_DISTANCE : DefaultMaterials.SHADOW_DEPTH;
        // const drawCalls = this._drawCallCollecter;
        // const shadowCalls = drawCalls.shadowCalls;
        // const webgl = WebGLRenderState.webgl!;

        // light.updateShadow(camera);
        // light.renderTarget.use();
        // renderState.clearBuffer(gltf.BufferBit.DEPTH_BUFFER_BIT | gltf.BufferBit.COLOR_BUFFER_BIT, Color.WHITE);

        // for (let i = 0, l = isPointLight ? 6 : 1; i < l; ++i) {
        //     const context = camera.context;
        //     if (isPointLight) {
        //         light.updateFace(camera, i);
        //     }
        //     webgl.viewport(light.viewPortPixel.x, light.viewPortPixel.y, light.viewPortPixel.w, light.viewPortPixel.h);
        //     webgl.depthRange(0, 1);
        //     drawCalls.shadowFrustumCulling(camera);

        //     for (const drawCall of shadowCalls) {
        //         this._draw(context, drawCall, shadowMaterial);
        //     }
        // }

        // webgl.bindFramebuffer(webgl.FRAMEBUFFER, null);
        // }

        private _getWebGLShader(gltfShader: gltf.Shader, defines: string) {
            const webgl = WebGLRenderState.webgl!;
            const shader = webgl.createShader(gltfShader.type)!;
            let shaderContent = _parseIncludes(gltfShader.uri!);
            shaderContent = _unrollLoops(shaderContent);
            webgl.shaderSource(shader, defines + shaderContent);
            webgl.compileShader(shader);

            const parameter = webgl.getShaderParameter(shader, gltf.Status.CompileStatus);
            if (!parameter) {
                console.error("Shader compile:" + gltfShader.name + " error! ->" + webgl.getShaderInfoLog(shader) + "\n" + ". did you want see the code?");
                // if (confirm("Shader compile:" + gltfShader.name + " error! ->" + webgl.getShaderInfoLog(shader) + "\n" + ". did you want see the code?")) {
                //     alert(gltfShader.uri);
                // }

                webgl.deleteShader(shader);

                return null;
            }

            return shader;
        }

        private _updateGlobalUniforms(program: WebGLProgramBinder, context: CameraRenderContext, drawCall: DrawCall, renderer: paper.BaseRenderer | null, scene: paper.Scene, forceUpdate: boolean) {
            // if (renderer && renderer.receiveShadows && this.lightCastShadows) {
            //     shaderContextDefine += "#define USE_SHADOWMAP \n";
            //     shaderContextDefine += "#define SHADOWMAP_TYPE_PCF \n";
            // }
            const webgl = WebGLRenderState.webgl!;
            const renderState = this._renderState;
            const camera = context.camera;
            const matrix = drawCall.matrix;
            const globalUniforms = program.globalUniforms;
            let i = 0, l = globalUniforms.length;

            if (forceUpdate) {
                i = l;

                while (i--) {
                    const { semantic, location } = globalUniforms[i];

                    switch (semantic!) {
                        case gltf.UniformSemantics._TONE_MAPPING_EXPOSURE:
                            webgl.uniform1f(location, renderState.toneMappingExposure);
                            break;

                        case gltf.UniformSemantics._TONE_MAPPING_WHITE_POINT:
                            webgl.uniform1f(location, renderState.toneMappingWhitePoint);
                            break;
                    }
                }
            }

            if (scene !== this._cacheScene) {
                const fog = scene.fog;
                i = l;

                while (i--) {
                    const { semantic, location } = globalUniforms[i];

                    switch (semantic) {
                        case gltf.UniformSemantics._AMBIENTLIGHTCOLOR:
                            const currenAmbientColor = scene.ambientColor;
                            webgl.uniform3f(location, currenAmbientColor.r, currenAmbientColor.g, currenAmbientColor.b);
                            break;

                        case gltf.UniformSemantics._LIGHTMAPINTENSITY:
                            webgl.uniform1f(location, scene.lightmapIntensity);
                            break;

                        case gltf.UniformSemantics._FOG_NEAR:
                            webgl.uniform1f(location, fog.near);
                            break;

                        case gltf.UniformSemantics._FOG_FAR:
                            webgl.uniform1f(location, fog.far);
                            break;

                        case gltf.UniformSemantics._FOG_DENSITY:
                            webgl.uniform1f(location, fog.density);
                            break;

                        case gltf.UniformSemantics._FOG_COLOR:
                            const fogColor = fog.color;
                            webgl.uniform3f(location, fogColor.r, fogColor.g, fogColor.b);
                            break;
                    }
                }

                this._cacheScene = scene;
            }

            if (camera !== this._cacheCamera) {
                const rawData = camera.cameraToWorldMatrix.rawData;
                i = l;

                while (i--) {
                    const { semantic, location } = globalUniforms[i];

                    switch (semantic) {
                        case gltf.UniformSemantics.VIEW:
                            webgl.uniformMatrix4fv(location, false, camera.worldToCameraMatrix.rawData);
                            break;

                        case gltf.UniformSemantics.PROJECTION:
                            webgl.uniformMatrix4fv(location, false, camera.projectionMatrix.rawData);
                            break;

                        case gltf.UniformSemantics._VIEWPROJECTION:
                            webgl.uniformMatrix4fv(location, false, camera.worldToClipMatrix.rawData);
                            break;

                        case gltf.UniformSemantics._CAMERA_FORWARD:
                            webgl.uniform3f(location, rawData[4], rawData[5], rawData[6]);
                            break;

                        case gltf.UniformSemantics._CAMERA_UP:
                            webgl.uniform3f(location, -rawData[8], -rawData[9], -rawData[10]);
                            break;

                        case gltf.UniformSemantics._CAMERA_POS:
                            webgl.uniform3f(location, rawData[12], rawData[13], rawData[14]);
                            break;

                        case gltf.UniformSemantics._DIRECTLIGHTS:
                            if (context.directLightCount > 0) {
                                webgl.uniform1fv(location, context.directLightArray);
                            }
                            break;

                        case gltf.UniformSemantics._POINTLIGHTS:
                            if (context.pointLightCount > 0) {
                                webgl.uniform1fv(location, context.pointLightArray);
                            }
                            break;

                        case gltf.UniformSemantics._SPOTLIGHTS:
                            if (context.spotLightCount > 0) {
                                webgl.uniform1fv(location, context.spotLightArray);
                            }
                            break;

                        case gltf.UniformSemantics._LOG_DEPTH_BUFFC:
                            webgl.uniform1f(location, context.logDepthBufFC);
                            break;
                    }
                }

                this._cacheCamera = camera;
            }

            this._matrix_mv.multiply(camera.worldToCameraMatrix, matrix);
            this._matrix_mvp.multiply(camera.worldToClipMatrix, matrix);
            this._matrix_mv_inverse.getNormalMatrix(this._matrix_mv);

            i = l;

            while (i--) {
                const uniform = globalUniforms[i];
                const { semantic, location } = uniform;

                switch (semantic) {
                    case gltf.UniformSemantics.MODEL:
                        webgl.uniformMatrix4fv(location, false, matrix.rawData);
                        break;

                    case gltf.UniformSemantics.MODELVIEW:
                        webgl.uniformMatrix4fv(location, false, this._matrix_mv.rawData);
                        break;

                    case gltf.UniformSemantics.MODELVIEWPROJECTION:
                        webgl.uniformMatrix4fv(location, false, this._matrix_mvp.rawData);
                        break;

                    case gltf.UniformSemantics.MODELVIEWINVERSE:
                        webgl.uniformMatrix3fv(location, false, this._matrix_mv_inverse.rawData);
                        break;

                    case gltf.UniformSemantics.JOINTMATRIX:
                        const skinnedMeshRenderer = (renderer as SkinnedMeshRenderer).source || (renderer as SkinnedMeshRenderer);
                        webgl.uniformMatrix4fv(location, false, skinnedMeshRenderer.boneMatrices!);
                        break;

                    case gltf.UniformSemantics._LIGHTMAPTEX:
                        const lightmapIndex = (renderer as MeshRenderer).lightmapIndex;
                        if (lightmapIndex >= 0 && lightmapIndex !== this._cacheLightmapIndex) {
                            if (uniform.textureUnits && uniform.textureUnits.length === 1) {
                                const texture = scene.lightmaps[lightmapIndex]!;
                                const unit = uniform.textureUnits[0];
                                webgl.uniform1i(location, unit);

                                if ((texture as WebGLTexture).dirty) {
                                    texture.setupTexture(unit);
                                }
                                else {
                                    webgl.activeTexture(webgl.TEXTURE0 + unit);
                                    webgl.bindTexture(webgl.TEXTURE_2D, (texture as WebGLTexture).webglTexture);
                                }
                            }
                            else {
                                console.error("Error texture unit.");
                            }

                            this._cacheLightmapIndex = lightmapIndex;
                        }
                        break;

                    case gltf.UniformSemantics._LIGHTMAP_SCALE_OFFSET:
                        const lightmapScaleOffset = (renderer as MeshRenderer).lightmapScaleOffset;
                        webgl.uniform4f(location, lightmapScaleOffset.x, lightmapScaleOffset.y, lightmapScaleOffset.z, lightmapScaleOffset.w);
                        break;

                    // case gltf.UniformSemantics._NEARDICTANCE:
                    //     webgl.uniform1f(location, context.lightShadowCameraNear);
                    //     break;

                    // case gltf.UniformSemantics._FARDISTANCE:
                    //     webgl.uniform1f(location, context.lightShadowCameraFar);
                    //     break;

                    // case gltf.UniformSemantics._DIRECTIONSHADOWMAT:
                    //     webgl.uniformMatrix4fv(location, false, context.directShadowMatrix);
                    //     break;
                    // case gltf.UniformSemantics._SPOTSHADOWMAT:
                    //     webgl.uniformMatrix4fv(location, false, context.spotShadowMatrix);
                    //     break;
                    // case gltf.UniformSemantics._POINTSHADOWMAT:
                    //     webgl.uniformMatrix4fv(location, false, context.pointShadowMatrix);
                    //     break;

                    // case gltf.UniformSemantics._DIRECTIONSHADOWMAP:
                    //     const directShadowLen = context.directShadowMaps.length;
                    //     if (directShadowLen > 0 && glUniform.textureUnits) {
                    //         const units = glUniform.textureUnits;
                    //         webgl.uniform1iv(location, units);

                    //         for (let i = 0, l = units.length; i < l; i++) {
                    //             if (context.directShadowMaps[i]) {
                    //                 const unit = units[i];
                    //                 const texture = context.directShadowMaps[i] as WebGLTexture;
                    //                 if (texture.dirty) {
                    //                     texture.setupTexture(unit);
                    //                 }
                    //                 else {
                    //                     webgl.activeTexture(webgl.TEXTURE0 + unit);
                    //                     webgl.bindTexture(webgl.TEXTURE_2D, texture.webglTexture);
                    //                 }
                    //             }
                    //         }
                    //     }
                    //     break;

                    // case gltf.UniformSemantics._POINTSHADOWMAP:
                    //     const pointShadowLen = context.pointShadowMaps.length;
                    //     if (pointShadowLen > 0 && glUniform.textureUnits) {
                    //         const units = glUniform.textureUnits;
                    //         webgl.uniform1iv(location, units);

                    //         for (let i = 0, l = units.length; i < l; i++) {
                    //             if (context.pointShadowMaps[i]) {
                    //                 const unit = units[i];
                    //                 const texture = context.pointShadowMaps[i] as WebGLTexture;
                    //                 if (texture.dirty) {
                    //                     texture.setupTexture(unit);
                    //                 }
                    //                 else {
                    //                     webgl.activeTexture(webgl.TEXTURE0 + unit);
                    //                     webgl.bindTexture(webgl.TEXTURE_2D, texture.webglTexture);
                    //                 }
                    //             }
                    //         }
                    //     }
                    //     break;

                    // case gltf.UniformSemantics._SPOTSHADOWMAP:
                    //     const spotShadowLen = context.spotShadowMaps.length;
                    //     if (spotShadowLen > 0 && glUniform.textureUnits) {
                    //         const units = glUniform.textureUnits;
                    //         webgl.uniform1iv(location, units);

                    //         for (let i = 0, l = units.length; i < l; i++) {
                    //             if (context.spotShadowMaps[i]) {
                    //                 const unit = units[i];
                    //                 const texture = context.spotShadowMaps[i] as WebGLTexture;
                    //                 if (texture.dirty) {
                    //                     texture.setupTexture(unit);
                    //                 }
                    //                 else {
                    //                     webgl.activeTexture(webgl.TEXTURE0 + unit);
                    //                     webgl.bindTexture(webgl.TEXTURE_2D, texture.webglTexture);
                    //                 }
                    //             }
                    //         }
                    //     }
                    //     break;
                }
            }
        }

        private _updateUniforms(program: WebGLProgramBinder, technique: gltf.Technique) {
            const webgl = WebGLRenderState.webgl!;
            const unifroms = technique.uniforms;

            for (const globalUniform of program.uniforms) {
                const uniform = unifroms[globalUniform.name];
                if (uniform.semantic) {
                    continue;
                }

                const location = globalUniform.location;
                const value = uniform.value;
                switch (uniform.type) {
                    case gltf.UniformType.BOOL:
                    case gltf.UniformType.INT:
                        if (globalUniform.size > 1) {
                            webgl.uniform1iv(location, value);
                        }
                        else {
                            webgl.uniform1i(location, value);
                        }
                        break;
                    case gltf.UniformType.BOOL_VEC2:
                    case gltf.UniformType.INT_VEC2:
                        webgl.uniform2iv(location, value);
                        break;
                    case gltf.UniformType.BOOL_VEC3:
                    case gltf.UniformType.INT_VEC3:
                        webgl.uniform3iv(location, value);
                        break;
                    case gltf.UniformType.BOOL_VEC4:
                    case gltf.UniformType.INT_VEC4:
                        webgl.uniform4iv(location, value);
                        break;
                    case gltf.UniformType.FLOAT:
                        if (globalUniform.size > 1) {
                            webgl.uniform1fv(location, value);
                        }
                        else {
                            webgl.uniform1f(location, value);
                        }
                        break;
                    case gltf.UniformType.FLOAT_VEC2:
                        webgl.uniform2fv(location, value);
                        break;
                    case gltf.UniformType.FLOAT_VEC3:
                        webgl.uniform3fv(location, value);
                        break;
                    case gltf.UniformType.FLOAT_VEC4:
                        webgl.uniform4fv(location, value);
                        break;
                    case gltf.UniformType.FLOAT_MAT2:
                        webgl.uniformMatrix2fv(location, false, value);
                        break;
                    case gltf.UniformType.FLOAT_MAT3:
                        webgl.uniformMatrix3fv(location, false, value);
                        break;
                    case gltf.UniformType.FLOAT_MAT4:
                        webgl.uniformMatrix4fv(location, false, value);
                        break;

                    case gltf.UniformType.SAMPLER_2D:
                        if (globalUniform.textureUnits && globalUniform.textureUnits.length === 1) {
                            const texture = value as WebGLTexture;
                            const unit = globalUniform.textureUnits[0];
                            webgl.uniform1i(location, unit);

                            if (texture.dirty) {
                                texture.setupTexture(unit);
                            }
                            else {
                                webgl.activeTexture(webgl.TEXTURE0 + unit);
                                webgl.bindTexture(webgl.TEXTURE_2D, texture.webglTexture);
                            }
                        }
                        else {
                            console.error("Error texture unit");
                        }
                        break;
                }
            }
        }

        private _updateAttributes(program: WebGLProgramBinder, mesh: Mesh, subMeshIndex: number) {
            const webgl = WebGLRenderState.webgl!;
            const attributes = mesh.glTFMesh.primitives[subMeshIndex].attributes;
            //
            if (!(mesh as WebGLMesh).vbo && !mesh.isDisposed) {
                (mesh as WebGLMesh).createBuffer();
            }
            // vbo.
            webgl.bindBuffer(gltf.BufferViewTarget.ArrayBuffer, (mesh as WebGLMesh).vbo);

            for (const attribute of program.attributes) {
                const location = attribute.location;
                const accessorIndex = attributes[attribute.semantic];

                if (accessorIndex !== undefined) {
                    const accessor = mesh.getAccessor(accessorIndex);
                    webgl.vertexAttribPointer(
                        location,
                        accessor.typeCount!,
                        accessor.componentType,
                        accessor.normalized !== undefined ? accessor.normalized : false,
                        0, mesh.getBufferOffset(accessor)
                    ); // TODO normalized应该来源于mesh，应该还没有
                    webgl.enableVertexAttribArray(location);
                }
                else {
                    webgl.disableVertexAttribArray(location);
                }
            }
            // ibo.
            const ibo = (mesh as WebGLMesh).ibos[subMeshIndex];
            if (ibo) {
                webgl.bindBuffer(gltf.BufferViewTarget.ElementArrayBuffer, ibo);
            }
        }

        private _render(camera: Camera, renderTarget: RenderTexture | null, material: Material | null) {
            const renderState = this._renderState;
            renderState.updateViewport(camera.viewport, renderTarget);
            renderState.clearBuffer(camera.bufferMask, camera.backgroundColor);
            // Step 1 draw opaques.
            for (const drawCall of camera.context.opaqueCalls) {
                this.draw(drawCall, material);
            }
            // Step 2 draw transparents.
            for (const drawCall of camera.context.transparentCalls) {
                this.draw(drawCall, material);
            }
            //
            if (renderTarget && renderTarget.generateMipmap()) {
                renderState.clearState(); // Fixed there is no texture bound to the unit 0 error.
            }
            // Render 2D.
            const webgl = WebGLRenderState.webgl!;
            webgl.pixelStorei(webgl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1); // TODO 解决字体模糊。

            for (const gameObject of this.groups[1].gameObjects) {
                const egret2DRenderer = gameObject.getComponent(Egret2DRenderer) as Egret2DRenderer;
                if (camera.cullingMask & egret2DRenderer.gameObject.layer) {
                    if (egret2DRenderer._order < 0) {
                        egret2DRenderer._order = this._egret2DOrderCount++;
                    }

                    egret2DRenderer._draw();
                    renderState.clearState();
                }
            }
            //
            this._cacheProgram = null;
        }

        public render(camera: Camera, material: Material | null = null) {
            if (Camera.current !== camera) {
                Camera.current = camera;
                camera._update();
                //
                if (this._cameraAndLightCollecter.lightDirty) {
                    camera.context.updateLights(this._cameraAndLightCollecter.lights); // TODO 性能优化
                }
                //
                let isAnyActivated = false;
                const postprocessings = camera.gameObject.getComponents(CameraPostprocessing as any, true) as CameraPostprocessing[];

                if (postprocessings.length > 0) {
                    for (const postprocessing of postprocessings) {
                        if (postprocessing.isActiveAndEnabled) {
                            isAnyActivated = true;
                            break;
                        }
                    }
                }

                if (!isAnyActivated) {
                    this._render(camera, camera.renderTarget, material);
                }
                else {
                    this._render(camera, camera._readRenderTarget, material);

                    for (const postprocessing of postprocessings) {
                        if (postprocessing.isActiveAndEnabled) {
                            postprocessing.render(camera);
                        }
                    }

                    const temp = camera._readRenderTarget;
                    camera._readRenderTarget = camera._writeRenderTarget;
                    camera._writeRenderTarget = temp;
                }
            }
            else {
                this._render(camera, camera.renderTarget, material);
            }
            //
            Camera.current = null;
        }

        public draw(drawCall: DrawCall, material: Material | null = null) {
            const renderer = drawCall.renderer;
            material = material || drawCall.material;

            if (renderer && renderer.gameObject._beforeRenderBehaviors.length > 0) {
                let flag = false;

                for (const behaviour of renderer.gameObject._beforeRenderBehaviors) {
                    flag = !behaviour.onBeforeRender!() || flag;
                }

                if (flag) {
                    return;
                }
            }

            const webgl = WebGLRenderState.webgl!;
            const renderState = this._renderState;
            const camera = Camera.current!;
            const context = camera.context;
            const scene = renderer ? renderer.gameObject.scene : camera.gameObject.scene; // 后期渲染renderer为空，取camera的场景
            //
            const shader = material._shader as WebGLShader;
            const programs = shader.programs;
            const programKey = context.defines.definesMask + material.defines.definesMask + (renderer ? renderer.defines.definesMask : "") + scene.defines.definesMask;
            let program: WebGLProgramBinder | null = null;

            if (programKey in programs) {
                program = programs[programKey];
            }
            else {
                const webgl = WebGLRenderState.webgl!;
                const renderState = this._renderState;
                renderState.customShaderChunks = shader.customs;

                const defines = context.defines.definesString + material.defines.definesString + (renderer ? renderer.defines.definesString : "") + scene.defines.definesString;
                const extensions = shader.config.extensions!.KHR_techniques_webgl;
                const vertexWebGLShader = this._getWebGLShader(extensions!.shaders[0], renderState.getPrefixVertex(defines))!; // TODO 顺序依赖
                const fragmentWebGLShader = this._getWebGLShader(extensions!.shaders[1], renderState.getPrefixFragment(defines))!;  // TODO 顺序依赖

                if (vertexWebGLShader && fragmentWebGLShader) {
                    const webGLProgram = webgl.createProgram()!;
                    webgl.attachShader(webGLProgram, vertexWebGLShader);
                    webgl.attachShader(webGLProgram, fragmentWebGLShader);
                    webgl.linkProgram(webGLProgram);

                    const parameter = webgl.getProgramParameter(webGLProgram, gltf.Status.LinkStatus);
                    if (parameter) {
                        program = new WebGLProgramBinder(webGLProgram, vertexWebGLShader, fragmentWebGLShader).extract(material.technique);
                    }
                    else {
                        console.error("program compile: " + shader.name + " error! ->" + webgl.getProgramInfoLog(webGLProgram));
                        webgl.deleteProgram(webGLProgram);
                        webgl.deleteShader(vertexWebGLShader);
                        webgl.deleteShader(fragmentWebGLShader);
                    }
                }

                programs[programKey] = program;
            }
            //
            if (program) {
                let forceUpdate = false;
                if (program !== this._cacheProgram) {
                    webgl.useProgram(program.program);
                    this._cacheProgram = program;
                    this._cacheScene = null;
                    this._cacheCamera = null;
                    this._cacheMesh = null;
                    this._cacheMaterial = null;
                    this._cacheLightmapIndex = -1;
                    forceUpdate = true;
                }
                //
                const mesh = drawCall.mesh;
                const subMeshIndex = drawCall.subMeshIndex;
                const primitive = mesh.glTFMesh.primitives[subMeshIndex];
                const drawMode = primitive.mode === undefined ? gltf.MeshPrimitiveMode.Triangles : primitive.mode;
                const vertexAccessor = mesh.getAccessor(primitive.attributes.POSITION || 0); //
                const bufferOffset = mesh.getBufferOffset(vertexAccessor);
                // Update global uniforms.
                this._updateGlobalUniforms(program, context, drawCall, renderer, scene, forceUpdate);
                // Update attributes.
                if (this._cacheMesh !== mesh || this._cacheSubMeshIndex !== subMeshIndex) {
                    this._updateAttributes(program, mesh, subMeshIndex);
                    this._cacheSubMeshIndex = subMeshIndex;
                    this._cacheMesh = mesh;
                }
                // Update uniforms.
                if (this._cacheMaterial !== material) {
                    const technique = material.technique;
                    const techniqueState = technique.states || null;

                    this._updateUniforms(program, technique);
                    this._cacheMaterial = material;
                    // Update states.
                    renderState.updateState(techniqueState);
                    // 
                    if (technique.program !== program.id) {
                        technique.program = program.id;
                    }
                }
                //  TODO
                // if (techniqueState && renderer.transform._worldMatrixDeterminant < 0) {
                //     if (techniqueState.functions!.frontFace[0] === CCW) {
                //         webgl.frontFace(CW);
                //     }
                //     else {
                //         webgl.frontFace(CCW);
                //     }
                // }
                // Draw.
                if (primitive.indices !== undefined) {
                    const indexAccessor = mesh.getAccessor(primitive.indices);
                    webgl.drawElements(drawMode, indexAccessor.count, indexAccessor.componentType, bufferOffset);
                }
                else {
                    webgl.drawArrays(drawMode, bufferOffset, vertexAccessor.count);
                }

                if (DEBUG && drawCall.drawCount >= 0) {
                    drawCall.drawCount++;
                }
            }
        }

        public onAwake() {
            const renderState = this._renderState;
            renderState.render = this.render.bind(this);
            renderState.draw = this.draw.bind(this);
        }

        public onUpdate() {
            if (!WebGLRenderState.webgl) {
                return;
            }

            const isPlayerMode = paper.Application.playerMode === paper.PlayerMode.Player;
            const drawCallCollecter = this._drawCallCollecter;
            const { cameras, lights } = this._cameraAndLightCollecter;
            const renderState = this._renderState;
            const editorScene = paper.Application.sceneManager.editorScene;
            //
            if (!renderState.standardDerivativesEnabled) {
                for (const drawCall of drawCallCollecter.addDrawCalls) {
                    if (drawCall) {
                        drawCall.material
                            .removeDefine(ShaderDefine.USE_NORMALMAP)
                            .removeDefine(ShaderDefine.USE_BUMPMAP)
                            .removeDefine(ShaderDefine.FLAT_SHADED)
                            .removeDefine(ShaderDefine.ENVMAP_TYPE_CUBE_UV);
                    }
                }
            }
            //
            drawCallCollecter._update();
            // Render lights shadow.
            if (lights.length > 0) {
                for (const light of lights) {
                    if (!light.castShadows) {
                        continue;
                    }

                    // this._renderLightShadow(light);
                }
            }
            // Render cameras.
            if (cameras.length > 0) {
                this._egret2DOrderCount = 0;

                for (const camera of cameras) {
                    const scene = camera.gameObject.scene;

                    if (isPlayerMode ? scene !== editorScene : scene === editorScene) {
                        this.render(camera);
                    }
                }
            }
            else {
                renderState.clearBuffer(gltf.BufferMask.Depth | gltf.BufferMask.Color, Color.BLACK);
            }
        }
    }
}
