namespace egret3d {

    let helpVec3_1: Vector3 = new Vector3();

    /**
     * 缓存场景通用数据
     * 包括矩阵信息，灯光，光照贴图，viewport尺寸等等
     */
    export class RenderContext {
        /**
         * 
         */
        public version: number = 0;
        /**
         * 
         */
        public lightmapUV: number = 1;
        public lightCount: number = 0;
        public directLightCount: number = 0;
        public pointLightCount: number = 0;
        public spotLightCount: number = 0;
        /**
         * 
         */
        public drawtype: string = "";
        /**
         * 
         */
        public lightmap: Texture | null = null;
        public boneData: Float32Array | null = null;

        // 15: x, y, z, dirX, dirY, dirZ, colorR, colorG, colorB, intensity, shadow, shadowBias, shadowRadius, shadowMapSizeX, shadowMapSizeY
        public directLightArray: Float32Array = new Float32Array(0);
        // 19: x, y, z, dirX, dirY, dirZ, colorR, colorG, colorB, intensity, distance, decay, shadow, shadowBias, shadowRadius, shadowCameraNear, shadowCameraFar, shadowMapSizeX, shadowMapSizeY
        public pointLightArray: Float32Array = new Float32Array(0);
        // 19: x, y, z, dirX, dirY, dirZ, colorR, colorG, colorB, intensity, distance, decay, coneCos, penumbraCos, shadow, shadowBias, shadowRadius, shadowMapSizeX, shadowMapSizeY
        public spotLightArray: Float32Array = new Float32Array(0);
        public directShadowMatrix: Float32Array = new Float32Array(0);
        public spotShadowMatrix: Float32Array = new Float32Array(0);
        public readonly matrix_m: Matrix = new Matrix();
        public readonly matrix_mvp: Matrix = new Matrix();
        public readonly directShadowMaps: (WebGLTexture | null)[] = [];
        public readonly pointShadowMaps: (WebGLTexture | null)[] = [];
        public readonly spotShadowMaps: (WebGLTexture | null)[] = [];

        public readonly viewPortPixel: IRectangle = { x: 0, y: 0, w: 0, h: 0 };

        //
        public readonly cameraPosition: Vector3 = new Vector3();
        public readonly cameraForward: Vector3 = new Vector3();
        public readonly cameraUp: Vector3 = new Vector3();


        // transforms
        // eyePos: Vector4 = new Vector4();
        public readonly matrix_v: Matrix = new Matrix();
        public readonly matrix_p: Matrix = new Matrix();
        private readonly matrix_mv: Matrix = new Matrix();
        public readonly matrix_vp: Matrix = new Matrix();
        //matrixNormal: paper.matrix = new paper.matrix();

        /**
         * 
         */
        public drawCall: DrawCall;
        /**
         * 
         */
        public lightmapOffset: Float32Array | null = null;

        public updateLightmap(texture: Texture, uv: number, offset: Float32Array) {
            this.lightmap = texture;
            this.lightmapUV = uv;
            this.lightmapOffset = offset;

            this.version++;
        }

        public updateCamera(camera: Camera) {
            const viewPortPixel = this.viewPortPixel;
            camera.calcViewPortPixel(viewPortPixel); // update viewport
            const asp = viewPortPixel.w / viewPortPixel.h;
            camera.calcViewMatrix(this.matrix_v);
            camera.calcProjectMatrix(asp, this.matrix_p);
            Matrix.multiply(this.matrix_p, this.matrix_v, this.matrix_vp);

            //
            const position = camera.gameObject.transform.getPosition();
            const worldMatrix = camera.gameObject.transform.getWorldMatrix().rawData;

            this.cameraPosition.x = position.x;
            this.cameraPosition.y = position.y;
            this.cameraPosition.z = position.z;

            this.cameraUp.x = worldMatrix[4];
            this.cameraUp.y = worldMatrix[5];
            this.cameraUp.z = worldMatrix[6];

            this.cameraForward.x = -worldMatrix[8];
            this.cameraForward.y = -worldMatrix[9];
            this.cameraForward.z = -worldMatrix[10];

            this.version++;
        }

        public updateLights(lights: ReadonlyArray<Light>) {
            let allLightCount = 0,
                directLightCount = 0,
                pointLightCount = 0,
                spotLightCount = 0;

            for (const light of lights) { // TODO 如何 灯光组件关闭，此处有何影响。
                switch (light.type) {
                    case LightTypeEnum.Direction:
                        directLightCount++;
                        break;

                    case LightTypeEnum.Point:
                        pointLightCount++;
                        break;

                    case LightTypeEnum.Spot:
                        spotLightCount++;
                        break;
                }

                allLightCount++;
            }

            // TODO
            if (this.directLightArray.length !== directLightCount * 15) {
                this.directLightArray = new Float32Array(directLightCount * 15);
            }

            if (this.pointLightArray.length !== pointLightCount * 19) {
                this.pointLightArray = new Float32Array(pointLightCount * 19);
            }

            if (this.spotLightArray.length !== spotLightCount * 19) {
                this.spotLightArray = new Float32Array(spotLightCount * 19);
            }

            if (this.directShadowMatrix.length !== directLightCount * 16) {
                this.directShadowMatrix = new Float32Array(directLightCount * 16);
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

            let directLightIndex = 0,
                pointLightIndex = 0,
                spotLightIndex = 0,
                index = 0,
                size = 0;

            for (const light of lights) {
                let lightArray = this.directLightArray;

                if (light.type === LightTypeEnum.Direction) {
                    lightArray = this.directLightArray;
                    index = directLightIndex;
                    size = 15;
                }
                else if (light.type === LightTypeEnum.Point) {
                    lightArray = this.pointLightArray;
                    index = pointLightIndex;
                    size = 19;
                }
                else if (light.type === LightTypeEnum.Spot) {
                    lightArray = this.spotLightArray;
                    index = spotLightIndex;
                    size = 19;
                }

                let offset = 0;

                const pos = light.gameObject.transform.getPosition();
                lightArray[index * size + offset++] = pos.x;
                lightArray[index * size + offset++] = pos.y;
                lightArray[index * size + offset++] = pos.z;

                const dir = light.gameObject.transform.getForward(helpVec3_1);
                lightArray[index * size + offset++] = dir.x;
                lightArray[index * size + offset++] = dir.y;
                lightArray[index * size + offset++] = dir.z;

                lightArray[index * size + offset++] = light.color.r;
                lightArray[index * size + offset++] = light.color.g;
                lightArray[index * size + offset++] = light.color.b;

                lightArray[index * size + offset++] = light.intensity;

                if (light.type === LightTypeEnum.Point || light.type === LightTypeEnum.Spot) {
                    lightArray[index * size + offset++] = light.distance;
                    lightArray[index * size + offset++] = light.decay;
                    if (light.type === LightTypeEnum.Spot) {
                        lightArray[index * size + offset++] = Math.cos(light.angle);
                        lightArray[index * size + offset++] = Math.cos(light.angle * (1 - light.penumbra));
                    }
                }

                if (light.castShadows) {
                    lightArray[index * size + offset++] = 1;

                    if (light.type === LightTypeEnum.Direction) {
                        lightArray[index * size + offset++] = light.$directLightShadow.bias;
                        lightArray[index * size + offset++] = light.$directLightShadow.radius;
                        lightArray[index * size + offset++] = light.$directLightShadow.windowSize;
                        lightArray[index * size + offset++] = light.$directLightShadow.windowSize;
                        this.directShadowMatrix.set(light.$directLightShadow.matrix.rawData, directLightIndex * 16);
                        this.directShadowMaps[directLightIndex] = light.$directLightShadow.map;
                    }
                    else if (light.type === LightTypeEnum.Point) {
                        lightArray[index * size + offset++] = light.$pointLightShadow.bias;
                        lightArray[index * size + offset++] = light.$pointLightShadow.radius;
                        lightArray[index * size + offset++] = light.$pointLightShadow.camera.near;
                        lightArray[index * size + offset++] = light.$pointLightShadow.camera.far;
                        lightArray[index * size + offset++] = light.$pointLightShadow.windowSize;
                        lightArray[index * size + offset++] = light.$pointLightShadow.windowSize;
                        this.pointShadowMaps[pointLightIndex] = light.$pointLightShadow.map;
                    }
                    else if (light.type === LightTypeEnum.Spot) {
                        lightArray[index * size + offset++] = light.$spotLightShadow.bias;
                        lightArray[index * size + offset++] = light.$spotLightShadow.radius;
                        lightArray[index * size + offset++] = light.$spotLightShadow.windowSize;
                        lightArray[index * size + offset++] = light.$spotLightShadow.windowSize;
                        this.spotShadowMatrix.set(light.$spotLightShadow.matrix.rawData, spotLightIndex * 16);
                        this.spotShadowMaps[spotLightIndex] = light.$spotLightShadow.map;
                    }
                }
                else {
                    lightArray[index * size + offset++] = 0;
                    lightArray[index * size + offset++] = 0;
                    lightArray[index * size + offset++] = 0;
                    lightArray[index * size + offset++] = 0;
                    lightArray[index * size + offset++] = 0;

                    if (light.type === LightTypeEnum.Direction) {
                        this.directShadowMaps[directLightIndex] = null;
                    }
                    else if (light.type === LightTypeEnum.Point) {
                        this.pointShadowMaps[pointLightIndex] = null;
                    }
                    else if (light.type === LightTypeEnum.Spot) {
                        this.spotShadowMaps[spotLightIndex] = null;
                    }
                }

                if (light.type === LightTypeEnum.Direction) {
                    directLightIndex++;
                }
                else if (light.type === LightTypeEnum.Point) {
                    pointLightIndex++;
                }
                else if (light.type === LightTypeEnum.Spot) {
                    spotLightIndex++;
                }
            }

            this.version++;
        }

        updateOverlay() {
            Matrix.identify(this.matrix_mvp);

            this.version++;
        }

        updateModel(matrix: Matrix) {
            Matrix.copy(matrix, this.matrix_m); // clone matrix because getWorldMatrix returns a reference
            Matrix.multiply(this.matrix_v, this.matrix_m, this.matrix_mv);
            // paper._Matrix.inverse(this.matrixModelView, this.matrixNormal);
            // paper.matrixTranspose(this.matrixNormal, this.matrixNormal);
            Matrix.multiply(this.matrix_vp, this.matrix_m, this.matrix_mvp);

            this.version++;
        }

        // for trial effect
        updateModeTrail() {
            Matrix.copy(this.matrix_v, this.matrix_mv);
            Matrix.copy(this.matrix_vp, this.matrix_mvp);

            this.version++;
        }

        updateBones(data: Float32Array | null) {
            this.boneData = data;

            this.version++;
        }

        public lightPosition: ImmutableVector4 = new Float32Array([0, 0, 0, 1]);
        public lightShadowCameraNear: number = 0;
        public lightShadowCameraFar: number = 0;
        public updateLightDepth(light: Light) {
            let shadow: ILightShadow | null = null;
            switch (light.type) {
                case LightTypeEnum.Direction:
                    shadow = light.$directLightShadow;
                    break;

                case LightTypeEnum.Point:
                    shadow = light.$pointLightShadow;
                    break;

                case LightTypeEnum.Spot:
                    shadow = light.$spotLightShadow;
                    break;
            }
            // let pos = light.gameObject.transform.getPosition();
            this.lightPosition = light.gameObject.transform.$getGlobalPosition();
            // this.lightPosition.x = pos.x;
            // this.lightPosition.y = pos.y;
            // this.lightPosition.z = pos.z;
            // this.lightPosition.w = 1;

            if (shadow) {
                this.lightShadowCameraNear = shadow.camera.near;
                this.lightShadowCameraFar = shadow.camera.far;
            }
        }
    }
}
