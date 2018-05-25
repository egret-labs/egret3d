namespace egret3d {
    /**
     * 
     */
    export class MeshRendererSystem extends paper.BaseSystem<MeshRenderer | MeshFilter> {
        /**
         * @inheritDoc
         */
        protected readonly _interests = [
            {
                componentClass: MeshRenderer,
                listeners: [
                    {
                        type: paper.EventPool.EventType.Enabled,
                        listener: (component: MeshRenderer) => {
                            const filter = this._getComponent(component.gameObject, 1);
                            if (filter) {
                                this._drawCallList.updateShadowCasters(component.gameObject, component.castShadows);
                            }
                        }
                    },
                    {
                        type: MeshRendererEventType.CastShadows,
                        listener: (component: MeshRenderer) => {
                            const filter = this._getComponent(component.gameObject, 1);
                            if (filter) {
                                this._drawCallList.updateShadowCasters(component.gameObject, component.castShadows);
                            }
                        }
                    },
                    {
                        type: MeshRendererEventType.LightmapIndex,
                        listener: (component: MeshRenderer) => {
                            const filter = this._getComponent(component.gameObject, 1);
                            if (filter) {
                                this._updateLightMap(component);
                            }
                        }
                    },
                    {
                        type: MeshRendererEventType.LightmapScaleOffset,
                        listener: (component: MeshRenderer) => {
                            const filter = this._getComponent(component.gameObject, 1);
                            if (filter) {
                                this._updateLightMap(component);
                            }
                        }
                    },
                    {
                        type: MeshRendererEventType.Materials,
                        listener: (component: MeshRenderer) => {
                            const filter = this._getComponent(component.gameObject, 1);
                            if (filter) {
                                this._drawCallList.updateDrawCalls(component.gameObject, component.castShadows);
                            }
                        }
                    },
                ]
            },
            {
                componentClass: MeshFilter,
                listeners: [
                    {
                        type: MeshFilterEventType.Mesh,
                        listener: (component: MeshFilter) => {
                            const renderer = this._getComponent(component.gameObject, 0) as MeshRenderer | null;
                            if (renderer) {
                                this._drawCallList.updateDrawCalls(component.gameObject, renderer.castShadows);
                            }
                        }
                    },
                ]
            },
        ];

        private readonly _createDrawCalls = ((gameObject: paper.GameObject) => {
            const renderer = this._getComponent(gameObject, 0) as MeshRenderer;
            const filter = this._getComponent(gameObject, 1) as MeshFilter;

            if (filter.isActiveAndEnabled && filter.mesh && renderer.isActiveAndEnabled && renderer.materials.length > 0) {
                let subMeshIndex = 0;
                const drawCalls: DrawCall[] = [];

                for (const primitive of filter.mesh.glTFMesh.primitives) {
                    drawCalls.push({
                        subMeshInfo: subMeshIndex,
                        mesh: filter.mesh,
                        material: renderer.materials[primitive.material || 0],
                        lightMapIndex: renderer.lightmapIndex,
                        lightMapScaleOffset: renderer.lightmapScaleOffset,
                        boneData: null,
                        gameObject: gameObject,
                        transform: gameObject.transform,
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
        protected _onCreateComponent(component: MeshRenderer | MeshFilter) {
            if (!super._onCreateComponent(component)) {
                return false;
            }

            const renderer = this._getComponent(component.gameObject, 0) as MeshRenderer;
            this._drawCallList.updateDrawCalls(renderer.gameObject, renderer.castShadows);

            return true;
        }
        /**
         * @inheritDoc
         */
        protected _onDestroyComponent(component: MeshRenderer | MeshFilter) {
            if (!super._onDestroyComponent(component)) {
                return false;
            }

            this._drawCallList.removeDrawCalls(component.gameObject);

            return true;
        }

        private _updateLightMap(component: MeshRenderer) {
            const drawCalls = this._drawCallList.getDrawCalls(component.gameObject);
            if (drawCalls) {
                for (const drawCall of drawCalls) {
                    drawCall.lightMapIndex = component.lightmapIndex;
                    drawCall.lightMapScaleOffset = component.lightmapScaleOffset;
                }
            }
        }
        /**
         * @inheritDoc
         */
        public update() {
        }
    }
}
