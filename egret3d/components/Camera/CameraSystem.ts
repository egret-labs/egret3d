namespace egret3d {
    /**
     * Camera系统
     */
    export class CameraSystem extends paper.BaseSystem {
        protected readonly _interests = [
            [
                { componentClass: Camera }
            ],
            [
                { componentClass: [DirectLight, SpotLight, PointLight] }
            ],
            [
                { componentClass: Egret2DRenderer }
            ],
        ];
        protected readonly _cameras: Cameras = this._globalGameObject.getOrAddComponent(Cameras);
        protected readonly _drawCalls: DrawCalls = this._globalGameObject.getOrAddComponent(DrawCalls);

        private _applyDrawCall(context: RenderContext, drawCall: DrawCall): void {
            const renderer = drawCall.renderer;
            const lightmapIndex = renderer.lightmapIndex;

            context.drawCall = drawCall;

            context.updateModel(drawCall.matrix || renderer.gameObject.transform.getWorldMatrix());

            let drawType: string = "base"; // TODO

            if (drawCall.boneData) {
                context.updateBones(drawCall.boneData);
                drawType = "skin";
            }

            if (lightmapIndex >= 0) {
                const activeScene = paper.Application.sceneManager.activeScene;
                if (activeScene.lightmaps.length > lightmapIndex) {
                    context.updateLightmap(
                        activeScene.lightmaps[lightmapIndex],
                        drawCall.mesh.glTFMesh.primitives[drawCall.subMeshIndex].attributes.TEXCOORD_1 ? 1 : 0,
                        renderer.lightmapScaleOffset,
                        activeScene.lightmapIntensity
                    );
                    drawType = "lightmap";
                }
            }

            WebGLKit.draw(context, drawType);
        }

        /**
         * @internal
         */
        public $renderCamera(camera: Camera) {
            //在这里先剔除，然后排序，最后绘制           
            this._drawCalls.sortAfterFrustumCulling(camera);
            // this._drawCalls.sort();

            for (const drawCall of this._drawCalls.drawCalls) {
                if (drawCall.disable) {
                    continue;
                }
                const gameObject = drawCall.renderer.gameObject;

                if (camera.cullingMask & gameObject.layer) {
                    this._applyDrawCall(camera.context, drawCall);
                }
            }

            // Egret2D渲染不加入DrawCallList的排序
            const egret2DRenderers = this._groups[2].components as ReadonlyArray<Egret2DRenderer>;
            for (const egret2DRenderer of egret2DRenderers) {
                if (camera.cullingMask & egret2DRenderer.gameObject.layer) {
                    egret2DRenderer.render(camera.context, camera);
                }
            }
        }

        public onAddGameObject(gameObject: paper.GameObject, group: paper.Group) {
            if (group === this._groups[0]) {
                this._cameras.update(this._groups[0].components as ReadonlyArray<Camera>);
            }
        }

        public onRemoveGameObject(gameObject: paper.GameObject, group: paper.Group) {
            if (group === this._groups[0]) {
                this._cameras.update(this._groups[0].components as ReadonlyArray<Camera>);
            }
        }

        public onUpdate(deltaTime: number) {
            Performance.startCounter("render");

            const cameras = this._cameras.cameras;
            if (cameras.length > 0) {
                const lights = this._groups[1].components as ReadonlyArray<BaseLight>;

                this._cameras.sort(); // TODO

                const activeScene = paper.Application.sceneManager.activeScene;

                for (const component of cameras) {
                    component.update(deltaTime);

                    if (component.gameObject.scene !== activeScene) {
                        continue;
                    }

                    if (lights.length > 0) {
                        component.context.updateLights(lights); // TODO 性能优化
                    }

                    if (component.postQueues.length === 0) {
                        component.context.drawtype = "";
                        component._targetAndViewport(component.renderTarget, false);
                        this.$renderCamera(component);
                    }
                    else {
                        for (const item of component.postQueues) {
                            item.render(component, this);
                        }
                    }
                }
            }
            else {
                WebGLKit.webgl.clearColor(0, 0, 0, 1);
                WebGLKit.webgl.clearDepth(1.0);
                WebGLKit.webgl.clear(WebGLKit.webgl.COLOR_BUFFER_BIT | WebGLKit.webgl.DEPTH_BUFFER_BIT);
            }

            Performance.endCounter("render");
            Performance.updateFPS();
        }
    }
}
