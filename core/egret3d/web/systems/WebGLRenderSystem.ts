namespace egret3d.web {
    /**
     * @internal
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
                { componentClass: [DirectionalLight, SpotLight, PointLight] }
            ]
        ];
        private _egret2dOrderCount: number = 0;
        private readonly _drawCallCollecter: DrawCallCollecter = paper.GameObject.globalGameObject.getOrAddComponent(DrawCallCollecter);
        private readonly _cameraAndLightCollecter: CameraAndLightCollecter = paper.GameObject.globalGameObject.getOrAddComponent(CameraAndLightCollecter);
        private readonly _renderState: WebGLRenderState = paper.GameObject.globalGameObject.getOrAddComponent(WebGLRenderState);
        private readonly _lightCamera: Camera = paper.GameObject.globalGameObject.getOrAddComponent(Camera);
        //
        private _cacheLightCount: number = 0;
        //
        private _cacheMaterialVerision: number = -1;
        private _cacheMaterial: Material | null = null;
        //
        private _cacheSubMeshIndex: number = -1;
        private _cacheMesh: Mesh | null = null;

        private _renderLightShadow(light: BaseLight) {
            const camera = this._lightCamera;
            const renderState = this._renderState;
            const isPointLight = light.constructor === PointLight;
            const shadowMaterial = isPointLight ? egret3d.DefaultMaterials.SHADOW_DISTANCE : egret3d.DefaultMaterials.SHADOW_DEPTH;
            const drawCalls = this._drawCallCollecter;
            const shadowCalls = drawCalls.shadowCalls;
            const webgl = WebGLCapabilities.webgl!;

            light.updateShadow(camera);
            light.renderTarget.use();
            renderState.clear(true, true, egret3d.Color.WHITE);
            for (let i = 0, l = isPointLight ? 6 : 1; i < l; ++i) {
                const context = camera.context;
                if (isPointLight) {
                    light.updateFace(camera, i);
                }
                webgl.viewport(light.viewPortPixel.x, light.viewPortPixel.y, light.viewPortPixel.w, light.viewPortPixel.h);
                webgl.depthRange(0, 1);
                drawCalls.shadowFrustumCulling(camera);

                for (const drawCall of shadowCalls) {
                    this._draw(context, drawCall, shadowMaterial);
                }
            }

            webgl.bindFramebuffer(webgl.FRAMEBUFFER, null);
        }

        private _renderCamera(camera: Camera, renderEnabled: boolean) {
            if (renderEnabled) {
                //在这里先剔除，然后排序，最后绘制
                const drawCalls = this._drawCallCollecter;
                drawCalls.frustumCulling(camera);
                //
                const opaqueCalls = drawCalls.opaqueCalls;
                const transparentCalls = drawCalls.transparentCalls;
                // Step 1 draw opaques.
                for (const drawCall of opaqueCalls) {
                    this._draw(camera.context, drawCall, drawCall.material);
                }
                // Step 2 draw transparents.
                for (const drawCall of transparentCalls) {
                    this._draw(camera.context, drawCall, drawCall.material);
                }
            }
            // Egret2D渲染不加入DrawCallList的排序
            for (const gameObject of this._groups[1].gameObjects) {
                const egret2DRenderer = gameObject.getComponent(Egret2DRenderer) as Egret2DRenderer;
                if (camera.cullingMask & egret2DRenderer.gameObject.layer) {
                    if (egret2DRenderer._order < 0) {
                        egret2DRenderer._order = this._egret2dOrderCount++;
                    }

                    egret2DRenderer._draw();
                    this._renderState.clearState();
                }
            }
        }

        private _draw(context: RenderContext, drawCall: DrawCall, material: Material) {
            context.update(drawCall);
            //
            const webgl = WebGLCapabilities.webgl!;
            const technique = material._glTFTechnique;
            const renderState = this._renderState;
            // Get program.
            const program = renderState.getProgram(material, technique, context.shaderContextDefine + material.shaderDefine);
            // Use program.
            const force = renderState.useProgram(program);
            // Update states.
            renderState.updateState(technique.states || null);
            // Update static uniforms.
            this._updateContextUniforms(program, context, technique);
            // Update uniforms.
            this._updateUniforms(program, material, technique, force);
            // Update attributes.
            this._updateAttributes(program, drawCall.mesh, drawCall.subMeshIndex, technique, force);
            // Draw.
            const mesh = drawCall.mesh;
            const glTFMesh = mesh.glTFMesh;
            const primitive = glTFMesh.primitives[drawCall.subMeshIndex];
            const vertexAccessor = mesh.getAccessor(glTFMesh.primitives[0].attributes.POSITION || 0);
            const bufferOffset = mesh.getBufferOffset(vertexAccessor);
            const drawMode = primitive.mode === undefined ? gltf.MeshPrimitiveMode.Triangles : primitive.mode;

            if (primitive.indices !== undefined) {
                const indexAccessor = mesh.getAccessor(primitive.indices);
                webgl.drawElements(drawMode, indexAccessor.count, webgl.UNSIGNED_SHORT, bufferOffset);
            }
            else {
                webgl.drawArrays(drawMode, bufferOffset, vertexAccessor.count);
            }
        }

        private _updateContextUniforms(program: GlProgram, context: RenderContext, technique: gltf.Technique) {
            const webgl = WebGLCapabilities.webgl!;
            const uniforms = technique.uniforms;
            const glUniforms = program.contextUniforms;

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
                    case gltf.UniformSemanticType.MODELVIEW:
                        webgl.uniformMatrix4fv(location, false, context.matrix_mv.rawData);
                        break;
                    case gltf.UniformSemanticType.MODELVIEWPROJECTION:
                        webgl.uniformMatrix4fv(location, false, context.matrix_mvp.rawData);
                        break;
                    case gltf.UniformSemanticType.MODELVIEWINVERSE:
                        webgl.uniformMatrix3fv(location, false, context.matrix_mv_inverse.rawData);
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

                    case gltf.UniformSemanticType._CAMERA_POS:
                        webgl.uniform3fv(location, context.cameraPosition);
                        break;
                    case gltf.UniformSemanticType._CAMERA_FORWARD:
                        webgl.uniform3fv(location, context.cameraForward);
                        break;
                    case gltf.UniformSemanticType._CAMERA_UP:
                        webgl.uniform3fv(location, context.cameraUp);
                        break;

                    case gltf.UniformSemanticType.JOINTMATRIX:
                        webgl.uniformMatrix4fv(location, false, (context.drawCall.renderer as SkinnedMeshRenderer).boneMatrices!);
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
                    case gltf.UniformSemanticType._AMBIENTLIGHTCOLOR:
                        const currenAmbientColor = paper.Scene.activeScene.ambientColor;
                        webgl.uniform3f(location, currenAmbientColor.r, currenAmbientColor.g, currenAmbientColor.b);
                        // webgl.uniform3fv(location, context.ambientLightColor);
                        break;

                    case gltf.UniformSemanticType._DIRECTIONSHADOWMAT:
                        webgl.uniformMatrix4fv(location, false, context.directShadowMatrix);
                        break;
                    case gltf.UniformSemanticType._SPOTSHADOWMAT:
                        webgl.uniformMatrix4fv(location, false, context.spotShadowMatrix);
                        break;
                    case gltf.UniformSemanticType._POINTSHADOWMAT:
                        webgl.uniformMatrix4fv(location, false, context.pointShadowMatrix);
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
                            webgl.bindTexture(webgl.TEXTURE_2D, (context.lightmap as GLTexture)._texture);
                        }
                        else {
                            console.error("Error texture unit.");
                        }
                        break;
                    case gltf.UniformSemanticType._LIGHTMAPINTENSITY:
                        webgl.uniform1f(location, context.lightmapIntensity);
                        break;

                    case gltf.UniformSemanticType._REFERENCEPOSITION:
                        webgl.uniform3fv(location, context.lightPosition);
                        break;
                    case gltf.UniformSemanticType._NEARDICTANCE:
                        webgl.uniform1f(location, context.lightShadowCameraNear);
                        break;
                    case gltf.UniformSemanticType._FARDISTANCE:
                        webgl.uniform1f(location, context.lightShadowCameraFar);
                        break;
                    case gltf.UniformSemanticType._FOG_COLOR:
                        webgl.uniform3fv(location, context.fogColor);
                        break;
                    case gltf.UniformSemanticType._FOG_DENSITY:
                        webgl.uniform1f(location, context.fogDensity);
                        break;
                    case gltf.UniformSemanticType._FOG_NEAR:
                        webgl.uniform1f(location, context.fogNear);
                        break;
                    case gltf.UniformSemanticType._FOG_FAR:
                        webgl.uniform1f(location, context.fogFar);
                        break;

                    default:
                        console.warn("不识别的Uniform语义:" + uniform.semantic);
                        break;
                }
            }
        }

        private _updateUniforms(program: GlProgram, material: Material, technique: gltf.Technique, forceUpdate: boolean) {
            const needUpdate = this._cacheMaterial !== material || this._cacheMaterialVerision !== material._version || forceUpdate;
            if (!needUpdate) {
                return;
            }

            this._cacheMaterial = material;
            this._cacheMaterialVerision = material._version;

            const webgl = WebGLCapabilities.webgl!;
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
                    case gltf.UniformType.INT:
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
                            webgl.bindTexture(webgl.TEXTURE_2D, (value as GLTexture)._texture);
                        }
                        else {
                            console.error("Error texture unit");
                        }
                        break;
                }
            }
        }

        private _updateAttributes(program: GlProgram, mesh: Mesh, subMeshIndex: number, technique: gltf.Technique, forceUpdate: boolean) {
            const needUpdate = forceUpdate || this._cacheSubMeshIndex !== subMeshIndex || this._cacheMesh !== mesh;
            if (!needUpdate) {
                return;
            }

            this._cacheSubMeshIndex = subMeshIndex;
            this._cacheMesh = mesh;

            const webgl = WebGLCapabilities.webgl!;
            const primitive = mesh.glTFMesh.primitives[subMeshIndex];
            // vbo.
            const webglAttributes = program.attributes;
            const attributes = technique.attributes;
            webgl.bindBuffer(webgl.ARRAY_BUFFER, mesh._vbo);

            for (const glAttribute of webglAttributes) {
                const attribute = attributes[glAttribute.name];
                const location = glAttribute.location;
                const accessorIndex = primitive.attributes[attribute.semantic];
                if (accessorIndex !== undefined) {
                    const accessor = mesh.getAccessor(accessorIndex);
                    const bufferOffset = mesh.getBufferOffset(accessor);
                    const typeCount = mesh.getAccessorTypeCount(accessor.type);
                    webgl.vertexAttribPointer(location, typeCount, accessor.componentType, accessor.normalized ? true : false, 0, bufferOffset);//TODO normalized应该来源于mesh，应该还没有
                    webgl.enableVertexAttribArray(location);
                }
                else {
                    webgl.disableVertexAttribArray(location);
                }
            }
            // ibo.
            const ibo = mesh._ibos[subMeshIndex];
            if (ibo) {
                webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, ibo);
            }
        }

        private _viewport(viewport: Rectangle, target: BaseRenderTarget | null) {
            const webgl = WebGLCapabilities.webgl!;

            let w: number;
            let h: number;
            if (!target) {
                const stageViewport = stage.viewport;
                w = stageViewport.w;
                h = stageViewport.h;
                webgl.bindFramebuffer(webgl.FRAMEBUFFER, null);
            }
            else {
                w = target.width;
                h = target.height;
                target.use();
            }

            webgl.viewport(w * viewport.x, h * viewport.y, w * viewport.w, h * viewport.h);
            webgl.depthRange(0, 1);
        }

        public onUpdate() {
            const webgl = WebGLCapabilities.webgl;
            if (!webgl) {
                return;
            }

            Performance.startCounter("render");
            let lightCountDirty = false;
            const isPlayerMode = paper.Application.playerMode === paper.PlayerMode.Player;
            const renderState = this._renderState;
            const cameras = this._cameraAndLightCollecter.cameras;
            const lights = this._cameraAndLightCollecter.lights;
            const editorScene = paper.Application.sceneManager.editorScene;
            this._drawCallCollecter.drawCallCount = 0;
            // Render lights.
            if (lights.length > 0) {
                lightCountDirty = true;
                this._cacheLightCount = 0;

                for (const light of lights) {
                    this._cacheLightCount++;

                    if (!light.castShadows) {
                        continue;
                    }

                    this._renderLightShadow(light);
                }
            }
            else if (this._cacheLightCount > 0) {
                lightCountDirty = true;
                this._cacheLightCount = 0;
            }

            // Render cameras.
            if (cameras.length > 0) {
                this._egret2dOrderCount = 0;
                for (const camera of cameras) {
                    const scene = camera.gameObject.scene;
                    const renderEnabled = isPlayerMode ? scene !== editorScene : scene === editorScene;

                    if (renderEnabled && lightCountDirty) {
                        camera.context.updateLights(lights); // TODO 性能优化
                    }

                    if (camera.postQueues.length === 0) {
                        if (renderEnabled) {
                            this._viewport(camera.viewport, camera.renderTarget);
                            renderState.clear(camera.clearOption_Color, camera.clearOption_Depth, camera.backgroundColor);
                        }

                        this._renderCamera(camera, renderEnabled);

                        if (renderEnabled && camera.renderTarget) {
                            if (camera.renderTarget.generateMipmap()) {
                                renderState.clearState(); // Fixed there is no texture bound to the unit 0 error.
                            }
                        }
                    }
                    else {
                        for (const item of camera.postQueues) {
                            // TODO
                        }
                    }
                }
            }
            else {
                renderState.clear(true, true, Color.BLACK);
            }

            Performance.endCounter("render");
        }
    }
}