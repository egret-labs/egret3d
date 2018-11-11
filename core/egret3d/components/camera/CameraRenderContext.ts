namespace egret3d {
    const enum LightSize {
        Directional = 11,
        Point = 15,
        Spot = 18,
    }
    const _helpVector3 = Vector3.create();
    /**
     * 摄像机渲染上下文。
     */
    export class CameraRenderContext {
        /**
         * 进入渲染周期后缓存的相机世界坐标。
         */
        public readonly cameraPosition: Float32Array = new Float32Array(3);
        /**
         * 进入渲染周期后缓存的相机世界前方向。
         */
        public readonly cameraForward: Float32Array = new Float32Array(3);
        /**
         * 进入渲染周期后缓存的相机世界上方向。
         */
        public readonly cameraUp: Float32Array = new Float32Array(3);
        /**
         * 
         */
        public readonly camera: Camera = null!;
        /**
         * 
         */
        public drawCall: DrawCall = null!;
        /**
         * 
         */
        public lightmapUV: uint = 1;
        public lightmapIntensity: number = 1.0;
        public readonly lightmapScaleOffset: Float32Array = new Float32Array(4);
        public lightmap: Texture | null = null;
        /**
         * 
         */
        public lightCount: uint = 0;
        public directLightCount: uint = 0;
        public pointLightCount: uint = 0;
        public spotLightCount: uint = 0;

        // public readonly lightPosition: Float32Array = new Float32Array([0.0, 0.0, 0.0]);
        // 12: dirX, dirY, dirZ, colorR, colorG, colorB, shadow, shadowBias, shadowRadius, shadowMapSizeX, shadowMapSizeY
        public directLightArray: Float32Array = new Float32Array(0);
        // 16: x, y, z, colorR, colorG, colorB, distance, decay, shadow, shadowBias, shadowRadius, shadowMapSizeX, shadowMapSizeY, shadowCameraNear, shadowCameraFar,
        public pointLightArray: Float32Array = new Float32Array(0);
        // 18: x, y, z, dirX, dirY, dirZ, colorR, colorG, colorB, distance, decay, coneCos, penumbraCos, shadow, shadowBias, shadowRadius, shadowMapSizeX, shadowMapSizeY
        public spotLightArray: Float32Array = new Float32Array(0);

        public lightShadowCameraNear: number = 0.0;
        public lightShadowCameraFar: number = 0.0;

        public readonly directShadowMaps: (WebGLTexture | null)[] = [];
        public readonly pointShadowMaps: (WebGLTexture | null)[] = [];
        public readonly spotShadowMaps: (WebGLTexture | null)[] = [];

        public directShadowMatrix: Float32Array = new Float32Array(0);
        public spotShadowMatrix: Float32Array = new Float32Array(0);
        public pointShadowMatrix: Float32Array = new Float32Array(0);

        public readonly matrix_mv: Matrix4 = Matrix4.create();
        public readonly matrix_mvp: Matrix4 = Matrix4.create();
        public readonly matrix_mv_inverse: Matrix3 = Matrix3.create();

        public fogDensity: number = 0.0;
        public fogNear: number = 0.0;
        public fogFar: number = 0.0;
        public readonly fogColor: Float32Array = new Float32Array(3);

        private readonly _postProcessingCamera: Camera = null!;
        private readonly _postProcessDrawCall: DrawCall = DrawCall.create();

        /**
         * 此帧的非透明绘制信息列表。
         * - 已进行视锥剔除的。
         */
        public readonly opaqueCalls: DrawCall[] = [];
        /**
         * 此帧的透明绘制信息列表。
         * - 已进行视锥剔除的。
         */
        public readonly transparentCalls: DrawCall[] = [];
        /**
         * 此帧的阴影绘制信息列表。
         * - 已进行视锥剔除的。
         */
        public readonly shadowCalls: DrawCall[] = [];

        private readonly _drawCallCollecter: DrawCallCollecter = paper.GameObject.globalGameObject.getComponent(DrawCallCollecter)!;
        /**
         * 禁止实例化。
         */
        public constructor(camera: Camera) {
            this.camera = camera;

            {
                const gameObjectName = "PostProcessing Camera";
                const transform = paper.GameObject.globalGameObject.transform.find(gameObjectName);
                let gameObject: paper.GameObject | null = null;

                if (transform) {
                    gameObject = transform.gameObject;
                    this._postProcessingCamera = gameObject.getComponent(egret3d.Camera)!;
                }
                else {
                    gameObject = paper.GameObject.create(gameObjectName, paper.DefaultTags.Untagged, paper.Scene.globalScene);
                    // gameObject.hideFlags = paper.HideFlags.HideAndDontSave;
                    gameObject.parent = paper.GameObject.globalGameObject; // TODO remove

                    const postProcessingCamera = gameObject.addComponent(egret3d.Camera);
                    postProcessingCamera.enabled = false;
                    postProcessingCamera.opvalue = 0.0;
                    postProcessingCamera.size = 1.0;
                    postProcessingCamera.near = 0.01;
                    postProcessingCamera.far = 1.0;
                    this._postProcessingCamera = postProcessingCamera;
                }
            }

            //
            this._postProcessDrawCall.matrix = Matrix4.IDENTITY;
            this._postProcessDrawCall.subMeshIndex = 0;
            this._postProcessDrawCall.mesh = DefaultMeshes.FULLSCREEN_QUAD;
            this._postProcessDrawCall.mesh._createBuffer(); //
        }

        /**
         * 所有非透明的, 按照从近到远排序
         */
        private _sortOpaque(a: DrawCall, b: DrawCall) {
            const aMat = a.material;
            const bMat = b.material;
            if (aMat.renderQueue !== bMat.renderQueue) {
                return aMat.renderQueue - bMat.renderQueue;
            }
            else if (aMat._glTFTechnique.program !== bMat._glTFTechnique.program) {
                return aMat._glTFTechnique.program! - bMat._glTFTechnique.program!;
            }
            else if (aMat._id !== bMat._id) {
                return aMat._id - bMat._id;
            }
            else {
                return a.zdist - b.zdist;
            }
        }
        /**
         * 所有透明的，按照从远到近排序
         */
        private _sortFromFarToNear(a: DrawCall, b: DrawCall) {
            if (a.material.renderQueue === b.material.renderQueue) {
                return b.zdist - a.zdist;
            }
            else {
                return a.material.renderQueue - b.material.renderQueue;
            }
        }

        /**
         * TODO
         */
        public shadowFrustumCulling(camera: Camera) {
            this.shadowCalls.length = 0;

            for (const drawCall of this._drawCallCollecter.drawCalls) {
                const renderer = drawCall.renderer;
                if (
                    renderer.castShadows &&
                    (camera.cullingMask & renderer.gameObject.layer) !== 0 &&
                    (!renderer.frustumCulled || camera.testFrustumCulling(renderer))
                ) {
                    this.shadowCalls.push(drawCall);
                }
            }

            this.shadowCalls.sort(this._sortFromFarToNear);
        }
        /**
         * TODO
         */
        public frustumCulling() {
            const camera = this.camera;
            const cameraPosition = camera.gameObject.transform.position;
            this.opaqueCalls.length = 0;
            this.transparentCalls.length = 0;

            for (const drawCall of this._drawCallCollecter.drawCalls) {
                const renderer = drawCall.renderer;
                if (
                    (camera.cullingMask & renderer.gameObject.layer) !== 0 &&
                    (!renderer.frustumCulled || camera.testFrustumCulling(renderer))
                ) {
                    // if (drawCall.material.renderQueue >= paper.RenderQueue.Transparent && drawCall.material.renderQueue <= paper.RenderQueue.Overlay) {
                    if (drawCall.material.renderQueue >= paper.RenderQueue.Transparent) {
                        this.transparentCalls.push(drawCall);
                    }
                    else {
                        this.opaqueCalls.push(drawCall);
                    }

                    drawCall.zdist = renderer.gameObject.transform.position.getDistance(cameraPosition);
                }
            }

            this.opaqueCalls.sort(this._sortOpaque);
            this.transparentCalls.sort(this._sortFromFarToNear);
        }

        public blit(src: Texture, material: Material | null = null, dest: BaseRenderTarget | null = null) {
            if (!material) {
                material = DefaultMaterials.COPY;
                material.setTexture(src);
            }

            const postProcessingCamera = this._postProcessingCamera;
            const postProcessDrawCall = this._postProcessDrawCall;
            const renderState = paper.GameObject.globalGameObject.getComponent(WebGLRenderState)!;
            postProcessDrawCall.material = material;

            renderState.updateViewport(postProcessingCamera.viewport, dest);
            renderState.clearBuffer(gltf.BufferBit.DEPTH_BUFFER_BIT | gltf.BufferBit.COLOR_BUFFER_BIT, egret3d.Color.WHITE);
            renderState.draw(postProcessingCamera, postProcessDrawCall);
        }

        public updateCameraTransform() {
            const rawData = this.camera.gameObject.transform.localToWorldMatrix.rawData;

            if (this.cameraPosition[0] !== rawData[12] ||
                this.cameraPosition[1] !== rawData[13] ||
                this.cameraPosition[2] !== rawData[14]
            ) {
                this.cameraPosition[0] = rawData[12];
                this.cameraPosition[1] = rawData[13];
                this.cameraPosition[2] = rawData[14];
            }

            if (this.cameraUp[0] !== rawData[4] ||
                this.cameraUp[1] !== rawData[5] ||
                this.cameraUp[2] !== rawData[6]
            ) {
                this.cameraUp[0] = rawData[4];
                this.cameraUp[1] = rawData[5];
                this.cameraUp[2] = rawData[6];
            }

            if (this.cameraForward[0] !== rawData[8] ||
                this.cameraForward[1] !== rawData[9] ||
                this.cameraForward[2] !== rawData[10]
            ) {
                this.cameraForward[0] = -rawData[8];
                this.cameraForward[1] = -rawData[9];
                this.cameraForward[2] = -rawData[10];
            }
        }

        public updateLights(lights: ReadonlyArray<BaseLight>) {
            let allLightCount = 0, directLightCount = 0, pointLightCount = 0, spotLightCount = 0;

            for (const light of lights) { // TODO 如何 灯光组件关闭，此处有何影响。
                if (light instanceof DirectionalLight) {
                    directLightCount++;
                }
                else if (light instanceof PointLight) {
                    pointLightCount++;
                }
                else if (light instanceof SpotLight) {
                    spotLightCount++;
                }

                allLightCount++;
            }

            // TODO
            if (this.directLightArray.length !== directLightCount * LightSize.Directional) {
                this.directLightArray = new Float32Array(directLightCount * LightSize.Directional);
            }

            if (this.pointLightArray.length !== pointLightCount * LightSize.Point) {
                this.pointLightArray = new Float32Array(pointLightCount * LightSize.Point);
            }

            if (this.spotLightArray.length !== spotLightCount * LightSize.Spot) {
                this.spotLightArray = new Float32Array(spotLightCount * LightSize.Spot);
            }

            if (this.directShadowMatrix.length !== directLightCount * 16) {
                this.directShadowMatrix = new Float32Array(directLightCount * 16);
            }

            if (this.pointShadowMatrix.length !== pointLightCount * 16) {
                this.pointShadowMatrix = new Float32Array(pointLightCount * 16);
            }

            if (this.spotShadowMatrix.length !== spotLightCount * 16) {
                this.spotShadowMatrix = new Float32Array(spotLightCount * 16);
            }

            this.directShadowMaps.length = directLightCount;
            this.pointShadowMaps.length = pointLightCount;
            this.spotShadowMaps.length = spotLightCount;

            this.lightCount = allLightCount;
            this.directLightCount = directLightCount;
            this.pointLightCount = pointLightCount;
            this.spotLightCount = spotLightCount;

            let directLightIndex = 0, pointLightIndex = 0, spotLightIndex = 0, index = 0;
            let lightArray = this.directLightArray;
            const cameraWorldToLocalMatrix = this.camera.transform.worldToLocalMatrix;

            for (const light of lights) {
                switch (light.constructor) {
                    case DirectionalLight: {
                        light.gameObject.transform.getForward(_helpVector3);
                        _helpVector3.applyDirection(cameraWorldToLocalMatrix);

                        lightArray = this.directLightArray;
                        index = directLightIndex * LightSize.Directional;
                        // lightArray[index++] = dirHelper.x; // Right-hand.
                        // lightArray[index++] = dirHelper.y;
                        // lightArray[index++] = dirHelper.z;

                        lightArray[index++] = -_helpVector3.x; // Left-hand.
                        lightArray[index++] = -_helpVector3.y;
                        lightArray[index++] = -_helpVector3.z;

                        lightArray[index++] = light.color.r * light.intensity;
                        lightArray[index++] = light.color.g * light.intensity;
                        lightArray[index++] = light.color.b * light.intensity;
                        break;
                    }

                    case PointLight: {
                        const position = light.gameObject.transform.position.clone().release();
                        position.applyMatrix(cameraWorldToLocalMatrix);
                        lightArray = this.pointLightArray;
                        index = pointLightIndex * LightSize.Point;

                        lightArray[index++] = position.x;
                        lightArray[index++] = position.y;
                        lightArray[index++] = position.z;

                        lightArray[index++] = light.color.r * light.intensity;
                        lightArray[index++] = light.color.g * light.intensity;
                        lightArray[index++] = light.color.b * light.intensity;

                        const distance = (light as PointLight).distance;
                        lightArray[index++] = distance;
                        lightArray[index++] = distance === 0 ? 0 : (light as PointLight).decay;
                        break;
                    }

                    case SpotLight: {
                        const position = light.gameObject.transform.position.clone().release();
                        position.applyMatrix(cameraWorldToLocalMatrix);
                        light.gameObject.transform.getForward(_helpVector3);
                        _helpVector3.applyDirection(cameraWorldToLocalMatrix);

                        lightArray = this.spotLightArray;
                        index = spotLightIndex * LightSize.Spot;

                        lightArray[index++] = position.x;
                        lightArray[index++] = position.y;
                        lightArray[index++] = position.z;

                        // lightArray[index++] = dirHelper.x; // Right-hand.
                        // lightArray[index++] = dirHelper.y;
                        // lightArray[index++] = dirHelper.z;

                        lightArray[index++] = -_helpVector3.x; // Left-hand.
                        lightArray[index++] = -_helpVector3.y;
                        lightArray[index++] = -_helpVector3.z;

                        lightArray[index++] = light.color.r * light.intensity;
                        lightArray[index++] = light.color.g * light.intensity;
                        lightArray[index++] = light.color.b * light.intensity;

                        const distance = (light as SpotLight).distance;
                        lightArray[index++] = distance;
                        lightArray[index++] = distance === 0 ? 0 : (light as SpotLight).decay;
                        lightArray[index++] = Math.cos((light as SpotLight).angle);
                        lightArray[index++] = Math.cos((light as SpotLight).angle * (1 - (light as SpotLight).penumbra));
                        break;
                    }
                }

                if (light.castShadows) {
                    // lightArray[index++] = 1;
                    // lightArray[index++] = -light.shadowBias; // Left-hand.
                    // lightArray[index++] = light.shadowRadius;
                    // lightArray[index++] = light.shadowSize;
                    // lightArray[index++] = light.shadowSize;

                    // switch (light.constructor) {
                    //     case DirectionalLight:
                    //         this.directShadowMatrix.set(light.shadowMatrix.rawData, directLightIndex * 16);
                    //         this.directShadowMaps[directLightIndex++] = light.renderTarget.texture;
                    //         break;

                    //     case PointLight:
                    //         lightArray[index++] = light.shadowCameraNear;
                    //         lightArray[index++] = light.shadowCameraFar;
                    //         this.pointShadowMatrix.set(light.shadowMatrix.rawData, pointLightIndex * 16);
                    //         this.pointShadowMaps[pointLightIndex++] = light.renderTarget.texture;
                    //         break;

                    //     case SpotLight:
                    //         this.spotShadowMatrix.set(light.shadowMatrix.rawData, spotLightIndex * 16);
                    //         this.spotShadowMaps[spotLightIndex++] = light.renderTarget.texture;
                    //         break;
                    // }
                }
                else {
                    lightArray[index++] = 0;
                    lightArray[index++] = 0;
                    lightArray[index++] = 0;
                    lightArray[index++] = 0;

                    switch (light.constructor) {
                        case DirectionalLight:
                            this.directShadowMaps[directLightIndex++] = null;
                            break;

                        case PointLight:
                            lightArray[index++] = 0;
                            lightArray[index++] = 0;
                            this.pointShadowMaps[pointLightIndex++] = null;
                            break;

                        case SpotLight:
                            this.spotShadowMaps[spotLightIndex++] = null;
                            break;
                    }
                }
            }
        }

        // public updateLightDepth(light: BaseLight) {
        //     const position = light.gameObject.transform.position;
        //     //
        //     this.lightPosition[0] = position.x;
        //     this.lightPosition[1] = position.y;
        //     this.lightPosition[2] = position.z;
        //     //
        //     this.lightShadowCameraNear = light.shadowCameraNear;
        //     this.lightShadowCameraFar = light.shadowCameraFar;
        // }

        public updateDrawCall(drawCall: DrawCall) {
            const renderer = drawCall.renderer;
            // const scene = renderer.gameObject.scene;
            const scene = paper.Scene.activeScene;
            const worldToLocalMatrix = this.camera.transform.worldToLocalMatrix;
            const worldToClipMatrix = this.camera.worldToClipMatrix;
            const matrix = drawCall.matrix;

            this.drawCall = drawCall;
            this.matrix_mv.multiply(worldToLocalMatrix, matrix);
            this.matrix_mvp.multiply(worldToClipMatrix, matrix);
            this.matrix_mv_inverse.getNormalMatrix(this.matrix_mv);
            //
            let shaderContextDefine = "";

            if (
                renderer &&
                renderer.lightmapIndex >= 0 &&
                scene.lightmaps.length > renderer.lightmapIndex
            ) {
                this.lightmapUV = drawCall.mesh.glTFMesh.primitives[drawCall.subMeshIndex].attributes.TEXCOORD_1 ? 1 : 0;
                this.lightmapIntensity = scene.lightmapIntensity;
                renderer.lightmapScaleOffset.toArray(this.lightmapScaleOffset);
                this.lightmap = scene.lightmaps[renderer.lightmapIndex];
                shaderContextDefine += "#define USE_LIGHTMAP \n";
            }

            if (this.lightCount > 0) {
                if (this.directLightCount > 0) {
                    shaderContextDefine += "#define NUM_DIR_LIGHTS " + this.directLightCount + "\n";
                }

                if (this.pointLightCount > 0) {
                    shaderContextDefine += "#define NUM_POINT_LIGHTS " + this.pointLightCount + "\n";
                }

                if (this.spotLightCount > 0) {
                    shaderContextDefine += "#define NUM_SPOT_LIGHTS " + this.spotLightCount + "\n";
                }

                if (renderer && renderer.receiveShadows) {
                    shaderContextDefine += "#define USE_SHADOWMAP \n";
                    shaderContextDefine += "#define SHADOWMAP_TYPE_PCF \n";
                }
            }

            const fog = scene.fog;

            if (fog.mode !== FogMode.NONE) {
                this.fogColor[0] = fog.color.r;
                this.fogColor[1] = fog.color.g;
                this.fogColor[2] = fog.color.b;
                shaderContextDefine += "#define USE_FOG \n";//TODO 根据参数生成define

                if (fog.mode === FogMode.FOG_EXP2) {
                    this.fogDensity = fog.density;
                    shaderContextDefine += "#define FOG_EXP2 \n";//TODO 根据参数生成define
                }
                else {
                    this.fogNear = fog.near;
                    this.fogFar = fog.far;
                }
            }

            if (renderer && renderer.constructor === SkinnedMeshRenderer && !(renderer as SkinnedMeshRenderer).forceCPUSkin) {
                shaderContextDefine += "#define USE_SKINNING \n" + `#define MAX_BONES ${Math.min(SkinnedMeshRendererSystem.maxBoneCount, (renderer as SkinnedMeshRenderer).bones.length)} \n`;
            }

            return shaderContextDefine;
        }
    }
}
