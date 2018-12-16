namespace egret3d {
    const enum LightSize {
        Directional = 11,
        Point = 15,
        Spot = 18,
    }
    const _helpVector3 = Vector3.create();
    /**
     * 相机渲染上下文。
     */
    export class CameraRenderContext {
        /**
         * 
         */
        public readonly defines: Defines = new Defines();
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
        public lightCastShadows: boolean = false;

        public readonly directShadowMaps: (WebGLTexture | null)[] = [];
        public readonly pointShadowMaps: (WebGLTexture | null)[] = [];
        public readonly spotShadowMaps: (WebGLTexture | null)[] = [];

        public directShadowMatrix: Float32Array = new Float32Array(0);
        public spotShadowMatrix: Float32Array = new Float32Array(0);
        public pointShadowMatrix: Float32Array = new Float32Array(0);

        private readonly _postProcessingCamera: Camera = null!;
        private readonly _postProcessDrawCall: DrawCall = DrawCall.create();

        private readonly _drawCallCollecter: DrawCallCollecter = paper.GameObject.globalGameObject.getComponent(DrawCallCollecter)!;
        /**
         * 此帧的非透明绘制信息列表。
         * - 已进行视锥剔除的。
         * @internal
         */
        public readonly opaqueCalls: DrawCall[] = [];
        /**
         * 此帧的透明绘制信息列表。
         * - 已进行视锥剔除的。
         * @internal
         */
        public readonly transparentCalls: DrawCall[] = [];
        /**
         * 此帧的阴影绘制信息列表。
         * - 已进行视锥剔除的。
         * @internal
         */
        public readonly shadowCalls: DrawCall[] = [];
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
                    this._postProcessingCamera = gameObject.getComponent(Camera)!;
                }
                else {
                    gameObject = paper.GameObject.create(gameObjectName, paper.DefaultTags.Untagged, paper.Scene.globalScene);
                    // gameObject.hideFlags = paper.HideFlags.HideAndDontSave;
                    gameObject.parent = paper.GameObject.globalGameObject; // TODO remove

                    const postProcessingCamera = gameObject.addComponent(Camera);
                    postProcessingCamera.enabled = false;
                    postProcessingCamera.opvalue = 0.0;
                    postProcessingCamera.size = 1.0;
                    postProcessingCamera.near = 0.01;
                    postProcessingCamera.far = 1.0;
                    postProcessingCamera.projectionMatrix = Matrix4.IDENTITY;
                    this._postProcessingCamera = postProcessingCamera;
                }
            }
            //
            this._postProcessDrawCall.matrix = Matrix4.IDENTITY;
            this._postProcessDrawCall.subMeshIndex = 0;
            this._postProcessDrawCall.mesh = DefaultMeshes.FULLSCREEN_QUAD;
        }

        /**
         * 所有非透明的, 按照从近到远排序
         */
        private _sortOpaque(a: DrawCall, b: DrawCall) {
            const materialA = a.material!;
            const materialB = b.material!;

            if (materialA.renderQueue !== materialB.renderQueue) {
                return materialA.renderQueue - materialB.renderQueue;
            }
            else if (materialA._technique.program !== materialB._technique.program) {
                return materialA._technique.program! - materialB._technique.program!;
            }
            else if (materialA._id !== materialB._id) {
                return materialA._id - materialB._id;
            }
            else {
                return a.zdist - b.zdist;
            }
        }
        /**
         * 所有透明的，按照从远到近排序
         */
        private _sortFromFarToNear(a: DrawCall, b: DrawCall) {
            const materialA = a.material!;
            const materialB = b.material!;

            if (materialA.renderQueue === materialB.renderQueue) {
                return b.zdist - a.zdist;
            }
            else {
                return materialA.renderQueue - materialB.renderQueue;
            }
        }
        /**
         * @internal
         */
        public _shadowFrustumCulling() {
            const camera = this.camera;
            const cameraFrustum = camera.frustum;
            const shadowDrawCalls = this.shadowCalls;
            shadowDrawCalls.length = 0;

            for (const drawCall of this._drawCallCollecter.drawCalls) {
                const renderer = drawCall!.renderer!;
                if (
                    renderer.castShadows &&
                    (camera.cullingMask & renderer.gameObject.layer) !== 0 &&
                    (!renderer.frustumCulled || math.frustumIntersectsSphere(cameraFrustum, renderer.boundingSphere))
                ) {
                    shadowDrawCalls.push(drawCall!);
                }
            }

            shadowDrawCalls.sort(this._sortFromFarToNear);
        }
        /**
         * @internal
         */
        public _frustumCulling() {
            const camera = this.camera;
            const cameraPosition = camera.gameObject.transform.position;
            const cameraFrustum = camera.frustum;
            const opaqueCalls = this.opaqueCalls;
            const transparentCalls = this.transparentCalls;

            opaqueCalls.length = 0;
            transparentCalls.length = 0;

            for (const drawCall of this._drawCallCollecter.drawCalls) {
                const renderer = drawCall!.renderer!;
                if (
                    (camera.cullingMask & renderer.gameObject.layer) !== 0 &&
                    (!renderer.frustumCulled || math.frustumIntersectsSphere(cameraFrustum, renderer.boundingSphere))
                ) {
                    // if (drawCall.material.renderQueue >= paper.RenderQueue.Transparent && drawCall.material.renderQueue <= paper.RenderQueue.Overlay) {
                    if (drawCall!.material!.renderQueue >= paper.RenderQueue.Transparent) {
                        transparentCalls.push(drawCall!);
                    }
                    else {
                        opaqueCalls.push(drawCall!);
                    }

                    drawCall!.zdist = renderer.gameObject.transform.position.getDistance(cameraPosition);
                }
            }

            opaqueCalls.sort(this._sortOpaque);
            transparentCalls.sort(this._sortFromFarToNear);
        }

        public blit(src: BaseTexture, material: Material | null = null, dest: RenderTexture | null = null) {
            if (!material) {
                material = DefaultMaterials.COPY;
                material.setTexture(src);
            }

            const postProcessingCamera = this._postProcessingCamera;
            const postProcessDrawCall = this._postProcessDrawCall;
            postProcessDrawCall.material = material;

            renderState.updateViewport(postProcessingCamera.viewport, dest);
            renderState.clearBuffer(gltf.BufferMask.Depth | gltf.BufferMask.Color, Color.WHITE);
            postProcessingCamera.projectionMatrix.identity(); // TODO
            const saveCamera = Camera.current;
            Camera.current = postProcessingCamera;
            renderState.draw(postProcessDrawCall);
            Camera.current = saveCamera;
        }

        public updateLights(lights: ReadonlyArray<BaseLight>) {
            let allLightCount = 0, directLightCount = 0, pointLightCount = 0, spotLightCount = 0;
            this.lightCastShadows = false;
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
            const worldToCameraMatrix = this.camera.worldToCameraMatrix;

            for (const light of lights) {
                switch (light.constructor) {
                    case DirectionalLight: {
                        light.gameObject.transform.getForward(_helpVector3);
                        _helpVector3.applyDirection(worldToCameraMatrix);

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
                        position.applyMatrix(worldToCameraMatrix);
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
                        position.applyMatrix(worldToCameraMatrix);
                        light.gameObject.transform.getForward(_helpVector3);
                        _helpVector3.applyDirection(worldToCameraMatrix);

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

                    this.lightCastShadows = true;
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
    }
}
