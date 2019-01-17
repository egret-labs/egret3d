namespace egret3d {
    /**
     * 
     */
    export enum LightCountDirty {
        None = 0,
        DirectionalLight = 0b00001,
        SpotLight = 0b00010,
        RectangleAreaLight = 0b00100,
        PointLight = 0b01000,
        HemisphereLight = 0b10000,
    }
    /**
     * 全局摄像机和灯光组件。
     */
    @paper.singleton
    export class CameraAndLightCollecter extends paper.BaseComponent {
        /**
         * 
         */
        public lightCountDirty: LightCountDirty = LightCountDirty.None;
        /**
         * 
         */
        public readonly postprocessingCamera: Camera = null!;
        /**
         * 
         */
        public readonly shadowCamera: Camera = null!;
        /**
         * 
         */
        public readonly cameras: Camera[] = [];
        /**
         * 
         */
        public readonly lights: BaseLight[] = [];
        /**
         * 
         */
        public readonly directionalLights: DirectionalLight[] = [];
        /**
         * 
         */
        public readonly spotLights: SpotLight[] = [];
        /**
         * 
         */
        public readonly rectangleAreaLights: RectangleAreaLight[] = [];
        /**
         * 
         */
        public readonly pointLights: PointLight[] = [];
        /**
         * 
         */
        public readonly hemisphereLights: HemisphereLight[] = [];
        /**
         * 
         */
        public currentLight: BaseLight | null = null;

        private _sortCameras(a: Camera, b: Camera) {
            // renderTarget 相机应优先渲染。
            const aOrder = (a.renderTarget || a._previewRenderTarget) ? a.order : (a.order * 1000 + 1);
            const bOrder = (b.renderTarget || b._previewRenderTarget) ? b.order : (b.order * 1000 + 1);

            return aOrder - bOrder;
        }
        /**
         * @internal
         */
        public initialize() {
            super.initialize();

            (cameraAndLightCollecter as CameraAndLightCollecter) = this;

            { //
                const gameObject = paper.GameObject.create("Postprocessing Camera", paper.DefaultTags.Global, paper.Scene.globalScene);
                //
                const camera = gameObject.getOrAddComponent(Camera);
                camera.enabled = false;
                camera.opvalue = 0.0;
                camera.size = 1.0;
                camera.near = 0.01;
                camera.far = 1.0;
                camera.projectionMatrix = Matrix4.IDENTITY;
                //
                (this.postprocessingCamera as Camera) = camera;
            }

            { //
                const gameObject = paper.GameObject.create("Shadow Camera", paper.DefaultTags.Global, paper.Scene.globalScene);
                //
                const camera = gameObject.getOrAddComponent(Camera);
                camera.enabled = false;
                //
                (this.shadowCamera as Camera) = camera;
            }
        }
        /**
         * 更新相机。
         */
        public updateCameras(gameObjects: ReadonlyArray<paper.GameObject>) {
            this.cameras.length = 0;

            for (const gameObject of gameObjects) {
                this.cameras.push(gameObject.getComponent(Camera)!);
            }
        }
        /**
         * 更新灯光。
         */
        public updateLights(gameObjects: ReadonlyArray<paper.GameObject>) {
            let directLightCount = 0, spotLightCount = 0, rectangleAreaLightCount = 0, pointLightCount = 0, hemisphereLightCount = 0;
            // const lights = [];
            const { lights, directionalLights, spotLights, rectangleAreaLights, pointLights, hemisphereLights } = this;
            lights.length = 0;

            for (const gameObject of gameObjects) {
                const light = gameObject.getComponent(BaseLight as any, true) as BaseLight;
                lights.push(light);

                switch (light.constructor) {
                    case DirectionalLight:
                        directLightCount++;
                        break;

                    case SpotLight:
                        spotLightCount++;
                        break;

                    case RectangleAreaLight:
                        rectangleAreaLightCount++;
                        break;

                    case PointLight:
                        pointLightCount++;
                        break;

                    case HemisphereLight:
                        hemisphereLightCount++;
                        break;
                }
            }

            const defines = renderState.defines;

            if (directLightCount !== directionalLights.length) {
                if (directionalLights.length > 0) {
                    defines.removeDefine(ShaderDefine.NUM_DIR_LIGHTS, directionalLights.length);
                }

                if (directLightCount > 0) {
                    const define = defines.addDefine(ShaderDefine.NUM_DIR_LIGHTS, directLightCount);
                    if (define) {
                        define.type = DefineLocation.None;
                    }
                }

                this.lightCountDirty |= LightCountDirty.DirectionalLight;
                directionalLights.length = directLightCount;

                let index = 0;
                for (const light of lights) {
                    if (light.constructor !== DirectionalLight) {
                        continue;
                    }

                    directionalLights[index++] = light as any;
                }
            }

            if (spotLightCount !== spotLights.length) {
                if (spotLights.length > 0) {
                    defines.removeDefine(ShaderDefine.NUM_SPOT_LIGHTS, spotLights.length);
                }

                if (spotLightCount > 0) {
                    const define = defines.addDefine(ShaderDefine.NUM_SPOT_LIGHTS, spotLightCount);
                    if (define) {
                        define.type = DefineLocation.None;
                    }
                }

                this.lightCountDirty |= LightCountDirty.SpotLight;
                spotLights.length = spotLightCount;

                let index = 0;
                for (const light of lights) {
                    if (light.constructor !== SpotLight) {
                        continue;
                    }

                    spotLights[index++] = light as any;
                }
            }

            if (rectangleAreaLightCount !== rectangleAreaLights.length) {
                if (rectangleAreaLights.length > 0) {
                    defines.removeDefine(ShaderDefine.NUM_RECT_AREA_LIGHTS, rectangleAreaLights.length);
                }

                if (rectangleAreaLightCount > 0) {
                    const define = defines.addDefine(ShaderDefine.NUM_RECT_AREA_LIGHTS, rectangleAreaLightCount);
                    if (define) {
                        define.type = DefineLocation.None;
                    }
                }

                this.lightCountDirty |= LightCountDirty.RectangleAreaLight;
                rectangleAreaLights.length = rectangleAreaLightCount;

                let index = 0;
                for (const light of lights) {
                    if (light.constructor !== RectangleAreaLight) {
                        continue;
                    }

                    rectangleAreaLights[index++] = light as any;
                }
            }

            if (pointLightCount !== pointLights.length) {
                if (pointLights.length > 0) {
                    defines.removeDefine(ShaderDefine.NUM_POINT_LIGHTS, pointLights.length);
                }

                if (pointLightCount > 0) {
                    const define = defines.addDefine(ShaderDefine.NUM_POINT_LIGHTS, pointLightCount);
                    if (define) {
                        define.type = DefineLocation.None;
                    }
                }

                this.lightCountDirty |= LightCountDirty.PointLight;
                pointLights.length = pointLightCount;

                let index = 0;
                for (const light of lights) {
                    if (light.constructor !== PointLight) {
                        continue;
                    }

                    pointLights[index++] = light as any;
                }
            }

            if (hemisphereLightCount !== hemisphereLights.length) {
                if (hemisphereLights.length > 0) {
                    defines.removeDefine(ShaderDefine.NUM_HEMI_LIGHTS, hemisphereLights.length);
                }

                if (hemisphereLightCount > 0) {
                    const define = defines.addDefine(ShaderDefine.NUM_HEMI_LIGHTS, hemisphereLightCount);
                    if (define) {
                        define.type = DefineLocation.None;
                    }
                }

                this.lightCountDirty |= LightCountDirty.HemisphereLight;
                hemisphereLights.length = hemisphereLightCount;

                let index = 0;
                for (const light of lights) {
                    if (light.constructor !== HemisphereLight) {
                        continue;
                    }

                    hemisphereLights[index++] = light as any;
                }
            }
        }
        /**
         * 排序相机。
         */
        public sortCameras() {
            this.cameras.sort(this._sortCameras);
        }
        /**
         * 相机计数。
         */
        @paper.editor.property(paper.editor.EditType.UINT, { readonly: true })
        public get cameraCount(): uint {
            return this.cameras.length;
        }
        /**
         * 灯光计数。
         */
        @paper.editor.property(paper.editor.EditType.UINT, { readonly: true })
        public get lightCount(): uint {
            return this.directionalLights.length
                + this.spotLights.length
                + this.rectangleAreaLights.length
                + this.pointLights.length
                + this.hemisphereLights.length;
        }
    }
    /**
     * 全局摄像机和灯光组件实例。
     */
    export const cameraAndLightCollecter: CameraAndLightCollecter = null!;
}