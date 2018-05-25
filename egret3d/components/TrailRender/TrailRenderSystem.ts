namespace egret3d {
    /**
     * TrailRender系统
     */
    export class TrailRenderSystem extends paper.BaseSystem<TrailRender> {
        /**
         * @inheritDoc
         */
        public readonly _interests = [
            {
                componentClass: TrailRender,
                listeners: [
                    {
                        type: paper.EventPool.EventType.Enabled,
                        listener: (component: TrailRender) => {
                            const renderer = this._getComponent(component.gameObject, 0);
                            if (renderer) {
                                this._drawCallList.updateDrawCalls(component.gameObject, false);
                            }
                        }
                    },
                    {
                        type: TrailRenderEventType.Meterial,
                        listener: (component: TrailRender) => {
                            const renderer = this._getComponent(component.gameObject, 0);
                            if (renderer) {
                                this._drawCallList.updateDrawCalls(component.gameObject, false);
                            }
                        }
                    },
                ]
            }
        ];

        private readonly _transform: Transform = new Transform(); // TODO 不要这样，这是组件

        private readonly _createDrawCalls = ((gameObject: paper.GameObject) => {
            const renderer = this._getComponent(gameObject, 0) as TrailRender;

            if (renderer.isActiveAndEnabled && renderer._mesh && renderer._material && renderer.$active) {
                let subMeshIndex = 0;
                const drawCalls: DrawCall[] = [];

                for (const primitive of renderer._mesh.glTFMesh.primitives) {
                    drawCalls.push({
                        subMeshInfo: subMeshIndex,
                        mesh: renderer._mesh,
                        material: renderer._material,
                        lightMapIndex: -1,
                        boneData: null,
                        gameObject: gameObject,
                        transform: this._transform,
                        frustumTest: false,
                        zdist: -1
                    });

                    subMeshIndex++;
                }

                return drawCalls;
            }

            return null;
        });
        private readonly _drawCallList: DrawCallList = new DrawCallList(this._createDrawCalls);
        /**
         * @inheritDoc
         */
        protected _onCreateComponent(component: TrailRender) {
            if (!super._onCreateComponent(component)) {
                return false;
            }

            this._drawCallList.updateShadowCasters(component.gameObject, false);

            return true;
        }
        /**
         * @inheritDoc
         */
        protected _onDestroyComponent(component: TrailRender) {
            if (!super._onDestroyComponent(component)) {
                return false;
            }

            this._drawCallList.removeDrawCalls(component.gameObject);

            return true;
        }
        /**
         * @inheritDoc
         */
        public update() { // TODO 应将组件功能尽量移到系统
            const deltaTime = paper.Time.deltaTime;
            for (const component of this._components) {
                component.update(deltaTime);
            }
        }
    }
}
