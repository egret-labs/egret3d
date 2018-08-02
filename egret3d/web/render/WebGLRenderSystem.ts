namespace egret3d {
    /**
     * WebGL 渲染系统
     */
    export class WebGLRenderSystem extends paper.BaseSystem {
        protected readonly _interests = [
            [
                { componentClass: Camera }
            ],
            [
                { componentClass: Egret2DRenderer }
            ],
            [
                { componentClass: [DirectLight, SpotLight, PointLight] }
            ]
        ];
        private readonly _webgl: WebGLRenderingContext = WebGLCapabilities.webgl;
        private readonly _camerasAndLights: CamerasAndLights = this._globalGameObject.getOrAddComponent(CamerasAndLights);
        private readonly _drawCalls: DrawCalls = this._globalGameObject.getOrAddComponent(DrawCalls);
        private readonly _lightCamera: Camera = this._globalGameObject.getOrAddComponent(Camera);
        private readonly _stateEnables: gltf.EnableState[] = [gltf.EnableState.BLEND, gltf.EnableState.CULL_FACE, gltf.EnableState.DEPTH_TEST];
        //
        private readonly _filteredLights: BaseLight[] = [];
        private readonly _cacheStateEnable: { [key: string]: boolean | undefined } = {};
        private _cacheDefines: string;
        private _cacheContextVersion: number = -1;
        private _cacheMaterialVerision: number = -1;
        private _cacheMeshVersion: number = -1;
        private _cacheProgram: GlProgram | undefined;
        private _cacheContext: RenderContext | undefined;
        private _cacheMaterial: Material | undefined;
        private _cacheMesh: Mesh | undefined;
        private _cacheState: gltf.States | undefined;
        //
        private _updateState(state: gltf.States) {
            if (this._cacheState === state) {
                return;
            }
            this._cacheState = state;
            const webgl = this._webgl;
            const stateEnables = this._stateEnables;
            const cacheStateEnable = this._cacheStateEnable;
            //TODO WebGLKit.draw(context, drawCall.material, drawCall.mesh, drawCall.subMeshIndex, drawType, transform._worldMatrixDeterminant < 0);
            for (const e of stateEnables) {
                const b = state.enable && state.enable.indexOf(e) >= 0;
                if (cacheStateEnable[e] !== b) {
                    cacheStateEnable[e] = b!;
                    b ? webgl.enable(e) : webgl.disable(e);
                }
            }

            //functions
            const functions = state.functions;
            if (functions) {
                for (const fun in functions) {
                    //
                    (webgl[fun] as Function).apply(webgl, functions[fun]);
                }
            }

        }

        private _updateContextDefines(context: RenderContext, material: Material) {
            this._cacheDefines = "";
            if (context.lightCount > 0) {
                this._cacheDefines += "#define USE_LIGHT " + context.lightCount + "\n";

                if (context.directLightCount > 0) {
                    this._cacheDefines += "#define USE_DIRECT_LIGHT " + context.directLightCount + "\n";
                }
                if (context.pointLightCount > 0) {
                    this._cacheDefines += "#define USE_POINT_LIGHT " + context.pointLightCount + "\n";
                }
                if (context.spotLightCount > 0) {
                    this._cacheDefines += "#define USE_SPOT_LIGHT " + context.spotLightCount + "\n";
                }
                if (context.drawCall.renderer.receiveShadows) {
                    this._cacheDefines += "#define USE_SHADOW \n";
                    this._cacheDefines += "#define USE_PCF_SOFT_SHADOW \n";
                }
            }
            //自定义的宏定义TODO
            this._cacheDefines += material.shaderDefine;
        }

        private _updateContextUniforms(program: GlProgram, context: RenderContext, technique: gltf.Technique, forceUpdate: boolean) {
            const needUpdate = this._cacheContext !== context || this._cacheContextVersion !== context.version || forceUpdate;
            if (!needUpdate) {
                return;
            }

            this._cacheContext = context;
            this._cacheContextVersion = context.version;
            const webgl = this._webgl;

            const uniforms = technique.uniforms;
            const glUniforms = program.uniforms;
            for (const glUniform of glUniforms) {
                const uniform = uniforms[glUniform.name];
                if (!uniform.semantic) {
                    continue;
                }
                const location = glUniform.location;
                switch (uniform.semantic) {
                    case gltf.UniformSemanticType.MODEL:
                        webgl.uniformMatrix4fv(location, false, context.matrix_m.rawData);
                        break;
                    case gltf.UniformSemanticType.VIEW:
                        webgl.uniformMatrix4fv(location, false, context.matrix_v.rawData);
                        break;
                    case gltf.UniformSemanticType.PROJECTION:
                        webgl.uniformMatrix4fv(location, false, context.matrix_p.rawData);
                        break;
                    case gltf.UniformSemanticType._VIEWPROJECTION:
                        webgl.uniformMatrix4fv(location, false, context.matrix_vp.rawData);
                        break;
                    case gltf.UniformSemanticType.MODELVIEWPROJECTION:
                        webgl.uniformMatrix4fv(location, false, context.matrix_mvp.rawData);
                        break;
                    case gltf.UniformSemanticType._CAMERA_POS:
                        webgl.uniform3fv(location, context.cameraPosition);
                        break;
                    case gltf.UniformSemanticType._CAMERA_FORWARD:
                        webgl.uniform3fv(location, context.cameraForward);
                        break;
                    case gltf.UniformSemanticType._CAMERA_UP:
                        webgl.uniform3fv(location, context.cameraUp);
                        break;
                    case gltf.UniformSemanticType._LIGHTCOUNT:
                        webgl.uniform1f(location, context.lightCount);
                        break;
                    case gltf.UniformSemanticType._DIRECTLIGHTS:
                        if (context.directLightCount > 0) {
                            webgl.uniform1fv(location, context.directLightArray);
                        }
                        break;
                    case gltf.UniformSemanticType._POINTLIGHTS:
                        if (context.pointLightCount > 0) {
                            webgl.uniform1fv(location, context.pointLightArray);
                        }
                        break;
                    case gltf.UniformSemanticType._SPOTLIGHTS:
                        if (context.spotLightCount > 0) {
                            webgl.uniform1fv(location, context.spotLightArray);
                        }
                        break;
                    case gltf.UniformSemanticType._DIRECTIONSHADOWMAT:
                        webgl.uniformMatrix4fv(location, false, context.directShadowMatrix);
                        break;
                    case gltf.UniformSemanticType._SPOTSHADOWMAT:
                        webgl.uniformMatrix4fv(location, false, context.spotShadowMatrix);
                        break;
                    case gltf.UniformSemanticType._DIRECTIONSHADOWMAP:
                        const directShadowLen = context.directShadowMaps.length;
                        if (directShadowLen > 0 && glUniform.textureUnits) {
                            const units = glUniform.textureUnits;
                            webgl.uniform1iv(location, units);

                            for (let i = 0, l = units.length; i < l; i++) {
                                if (context.directShadowMaps[i]) {
                                    webgl.activeTexture(webgl.TEXTURE0 + units[i]);
                                    webgl.bindTexture(webgl.TEXTURE_2D, context.directShadowMaps[i]);
                                }
                            }
                        }
                        break;
                    case gltf.UniformSemanticType._POINTSHADOWMAP:
                        const pointShadowLen = context.pointShadowMaps.length;
                        if (pointShadowLen > 0 && glUniform.textureUnits) {
                            const units = glUniform.textureUnits;
                            webgl.uniform1iv(location, units);

                            for (let i = 0, l = units.length; i < l; i++) {
                                if (context.pointShadowMaps[i]) {
                                    webgl.activeTexture(webgl.TEXTURE0 + units[i]);
                                    webgl.bindTexture(webgl.TEXTURE_2D, context.pointShadowMaps[i]);
                                }
                            }
                        }
                        break;
                    case gltf.UniformSemanticType._SPOTSHADOWMAP:
                        const spotShadowLen = context.spotShadowMaps.length;
                        if (spotShadowLen > 0 && glUniform.textureUnits) {
                            const units = glUniform.textureUnits;
                            webgl.uniform1iv(location, units);

                            for (let i = 0, l = units.length; i < l; i++) {
                                if (context.spotShadowMaps[i]) {
                                    webgl.activeTexture(webgl.TEXTURE0 + units[i]);
                                    webgl.bindTexture(webgl.TEXTURE_2D, context.spotShadowMaps[i]);
                                }
                            }
                        }
                        break;
                    case gltf.UniformSemanticType._LIGHTMAPTEX:
                        if (glUniform.textureUnits && glUniform.textureUnits.length === 1 && context.lightmap) {
                            const unit = glUniform.textureUnits[0];
                            webgl.uniform1i(location, unit);
                            webgl.activeTexture(webgl.TEXTURE0 + unit);
                            webgl.bindTexture(webgl.TEXTURE_2D, context.lightmap);
                        }
                        else {
                            console.error("Error texture unit");
                        }
                        break;
                    case gltf.UniformSemanticType._LIGHTMAPINTENSITY:
                        webgl.uniform1f(location, context.lightmapIntensity);
                        break;
                    case gltf.UniformSemanticType._LIGHTMAPOFFSET:
                        if (context.lightmapOffset) {
                            webgl.uniform4fv(location, context.lightmapOffset);
                        }
                        else {
                            console.debug("Error light map scale and offset.");
                        }
                        break;
                    case gltf.UniformSemanticType._LIGHTMAPUV:
                        webgl.uniform1f(location, context.lightmapUV);
                        break;
                    case gltf.UniformSemanticType._BONESVEC4:
                        webgl.uniform4fv(location, context.boneData!);
                        break;
                    case gltf.UniformSemanticType._REFERENCEPOSITION:
                        webgl.uniform4fv(location, context.lightPosition);
                        break;
                    case gltf.UniformSemanticType._NEARDICTANCE:
                        webgl.uniform1f(location, context.lightShadowCameraNear);
                        break;
                    case gltf.UniformSemanticType._FARDISTANCE:
                        webgl.uniform1f(location, context.lightShadowCameraFar);
                        break;
                }
            }
        }

        private _updateUniforms(program: GlProgram, material: Material, technique: gltf.Technique, forceUpdate: boolean) {
            const needUpdate = this._cacheMaterial !== material || this._cacheMaterialVerision !== material.version || forceUpdate;
            if (!needUpdate) {
                return;
            }

            this._cacheMaterial = material;
            this._cacheMaterialVerision = material.version;
            const webgl = this._webgl;
            const unifroms = technique.uniforms;
            const glUniforms = program.uniforms;
            for (const glUniform of glUniforms) {
                const uniform = unifroms[glUniform.name];
                if (uniform.semantic) {
                    continue;
                }

                const location = glUniform.location;
                const value = uniform.value;
                switch (uniform.type) {
                    case gltf.UniformType.BOOL:
                    case gltf.UniformType.Int:
                        if (glUniform.size > 1) {
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
                        if (glUniform.size > 1) {
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
                        if (glUniform.textureUnits && glUniform.textureUnits.length === 1) {
                            const unit = glUniform.textureUnits[0];
                            webgl.uniform1i(location, unit);
                            webgl.activeTexture(webgl.TEXTURE0 + unit);
                            webgl.bindTexture(webgl.TEXTURE_2D, (value as Texture).glTexture.texture);
                        }
                        else {
                            console.error("Error texture unit");
                        }
                        break;
                }
            }
        }

        private _updateAttributes(program: GlProgram, mesh: Mesh, subMeshIndex: number, technique: gltf.Technique, forceUpdate: boolean) {
            const needUpdate = this._cacheMesh !== mesh || this._cacheMeshVersion !== mesh._version || forceUpdate;
            if (!needUpdate) {
                return;
            }

            this._cacheMesh = mesh;
            this._cacheMeshVersion = mesh._version;
            if (0 <= subMeshIndex && subMeshIndex < mesh.glTFMesh.primitives.length) {
                const glTFAsset = mesh.glTFAsset;
                const primitive = mesh.glTFMesh.primitives[subMeshIndex];
                const ibo = mesh.ibos[subMeshIndex];

                const gl = this._webgl;
                gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vbo);

                if (ibo) {
                    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
                }

                const glAttributes = program.attributes;
                const attributes = technique.attributes;
                for (const glAttribute of glAttributes) {
                    const attribute = attributes[glAttribute.name];
                    const location = glAttribute.location;
                    const accessorIndex = primitive.attributes[attribute.semantic];
                    if (accessorIndex !== undefined) {
                        const accessor = glTFAsset.getAccessor(accessorIndex);
                        const bufferOffset = glTFAsset.getBufferOffset(accessor);
                        const typeCount = GLTFAsset.getAccessorTypeCount(accessor.type);
                        gl.vertexAttribPointer(location, typeCount, accessor.componentType, accessor.normalized ? true : false, 0, bufferOffset);//TODO normalized应该来源于mesh，应该还没有
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
        private _drawCall(mesh: Mesh, drawCall: DrawCall) {
            const webgl = this._webgl;
            const primitive = mesh.glTFMesh.primitives[drawCall.subMeshIndex];
            const vertexAccessor = mesh.glTFAsset.getAccessor(primitive.attributes.POSITION);
            const bufferOffset = mesh.glTFAsset.getBufferOffset(vertexAccessor);

            if (primitive.indices !== undefined) {
                const indexAccessor = mesh.glTFAsset.getAccessor(primitive.indices);
                switch (primitive.mode) { // TODO
                    case gltf.MeshPrimitiveMode.Lines:
                        webgl.drawElements(webgl.LINES, indexAccessor.count, webgl.UNSIGNED_SHORT, bufferOffset);
                        break;
                    case gltf.MeshPrimitiveMode.Triangles:
                    default:
                        webgl.drawElements(webgl.TRIANGLES, indexAccessor.count, webgl.UNSIGNED_SHORT, bufferOffset);
                        break;
                }
            }
            else {
                switch (primitive.mode) {
                    case gltf.MeshPrimitiveMode.Lines:
                        webgl.drawArrays(webgl.LINES, bufferOffset, vertexAccessor.count);
                        break;
                    case gltf.MeshPrimitiveMode.LineLoop:
                        webgl.drawArrays(webgl.LINE_LOOP, bufferOffset, vertexAccessor.count);
                        break;
                    case gltf.MeshPrimitiveMode.LineStrip:
                        webgl.drawArrays(webgl.LINE_STRIP, bufferOffset, vertexAccessor.count);
                        break;
                    case gltf.MeshPrimitiveMode.Triangles:
                    default:
                        webgl.drawArrays(webgl.TRIANGLES, bufferOffset, vertexAccessor.count);
                        break;
                }
            }
        }
        private _renderCall(context: RenderContext, drawCall: DrawCall) {
            const renderer = drawCall.renderer;
            context.drawCall = drawCall;
            context.updateModel(drawCall.matrix || renderer.gameObject.transform.getWorldMatrix());
            if (drawCall.boneData) {
                context.updateBones(drawCall.boneData);
            }
            //
            const material = drawCall.shadow || drawCall.material;
            const technique = material._glTFTechnique;
            //Defines
            this._updateContextDefines(context, material);
            //Program
            const program = GlProgram.getProgram(material, technique, this._cacheDefines);
            //State
            this._updateState(technique.states);
            //Use Program
            let force = false;
            if (this._cacheProgram !== program) {
                this._cacheProgram = program;
                this._webgl.useProgram(program.program);
                force = true;
            }
            //Uniform
            this._updateContextUniforms(program, context, technique, force);
            this._updateUniforms(program, material, technique, force);
            //Attribute
            this._updateAttributes(program, drawCall.mesh, drawCall.subMeshIndex, technique, force);
            //Draw
            this._drawCall(drawCall.mesh, drawCall);
        }
        /**
         * @internal
         * @param camera 
         */
        public _renderCamera(camera: Camera) {
            camera._targetAndViewport(camera.renderTarget, false);
            //在这里先剔除，然后排序，最后绘制
            const drawCalls = this._drawCalls;
            drawCalls.sortAfterFrustumCulling(camera);
            //
            const opaqueCalls = drawCalls.opaqueCalls;
            const transparentCalls = drawCalls.transparentCalls;
            //Step1 draw opaque
            for (const drawCall of opaqueCalls) {
                this._renderCall(camera.context, drawCall);
            }
            //Step2 draw transparent
            for (const drawCall of transparentCalls) {
                this._renderCall(camera.context, drawCall);
            }
            // Egret2D渲染不加入DrawCallList的排序
            for (const gameObject of this._groups[1].gameObjects) {
                const egret2DRenderer = gameObject.getComponent(Egret2DRenderer) as Egret2DRenderer;
                if (camera.cullingMask & egret2DRenderer.gameObject.layer) {
                    egret2DRenderer.render(camera.context, camera);

                    //clear State
                    for (const key in this._cacheStateEnable) {
                        delete this._cacheStateEnable[key];
                    }
                    this._cacheProgram = undefined;
                    this._cacheState = undefined;
                }
            }
        }
        /**
         * @internal
         * @param light
         */
        public _renderLightShadow(light: BaseLight) {
            const camera = this._lightCamera;
            const drawCalls = this._drawCalls;
            const faceCount = light.type === LightType.Point ? 6 : 1;

            for (let i = 0; i < faceCount; ++i) {
                (light.renderTarget as GlRenderTargetCube).activeCubeFace = i; // TODO 创建接口。
                light.update(camera, i);
                camera._targetAndViewport(light.renderTarget, false);
                const context = camera.context;
                context.updateCamera(camera, light.matrix);
                context.updateLightDepth(light);

                drawCalls.shadowFrustumCulling(camera);
                //
                const shadowCalls = drawCalls.shadowCalls;
                const shadowMaterial = light.type === LightType.Point ? egret3d.DefaultMaterials.ShadowDistance : egret3d.DefaultMaterials.ShadowDepth;
                for (const drawCall of shadowCalls) {
                    //TODO, 现在不支持蒙皮动画阴影                    
                    drawCall.shadow = shadowMaterial;
                    this._renderCall(context, drawCall);
                    drawCall.shadow = undefined;
                }
            }

            GlRenderTarget.useNull(WebGLCapabilities.webgl);
        }

        public onUpdate() {
            Performance.startCounter("render");
            const cameras = this._camerasAndLights.cameras;
            const lights = this._camerasAndLights.lights;
            const filteredLights = this._filteredLights;;
            const camerasScene = paper.Application.sceneManager.camerasScene || paper.Application.sceneManager.activeScene;
            const lightsScene = paper.Application.sceneManager.lightsScene || paper.Application.sceneManager.activeScene;
            // Lights.
            if (filteredLights.length > 0) {
                filteredLights.length = 0;
            }

            if (lights.length > 0) {
                for (const light of lights) {
                    if (!light.castShadows || light.gameObject.scene !== lightsScene) {
                        continue;
                    }

                    filteredLights.push(light);
                    this._renderLightShadow(light);
                }
            }
            // Cameras.
            if (cameras.length > 0) {
                for (const camera of cameras) {
                    if (camera.gameObject.scene !== camerasScene) {
                        continue;
                    }

                    if (filteredLights.length > 0) {
                        camera.context.updateLights(filteredLights); // TODO 性能优化
                    }

                    if (camera.postQueues.length === 0) {
                        this._renderCamera(camera);
                    }
                    else {
                        for (const item of camera.postQueues) {
                            item.render(camera, this);
                        }
                    }
                }
            }
            else {
                const webgl = this._webgl;
                webgl.clearColor(0, 0, 0, 1);
                webgl.clearDepth(1.0);
                webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);
            }

            Performance.endCounter("render");
        }
    }
}