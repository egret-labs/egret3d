namespace egret3d {
    /**
     * 
     */
    export class MeshRendererSystem extends paper.BaseSystem<MeshRenderer | MeshFilter> {
        protected readonly _interests = [
            {
                componentClass: MeshRenderer,
                listeners: [
                    {
                        type: paper.RendererEventType.CastShadows,
                        listener: (component: MeshRenderer) => {
                            if (this._hasGameObject(component.gameObject)) {
                                this._drawCallList.updateDrawCalls(component.gameObject, component.castShadows);
                                this._drawCallList.updateShadowCasters(component.gameObject, component.castShadows);
                            }
                        }
                    },
                    {
                        type: paper.RendererEventType.LightmapIndex,
                        listener: (component: MeshRenderer) => {
                            if (this._hasGameObject(component.gameObject)) {
                                this._updateLightMap(component);
                            }
                        }
                    },
                    {
                        type: paper.RendererEventType.LightmapScaleOffset,
                        listener: (component: MeshRenderer) => {
                            if (this._hasGameObject(component.gameObject)) {
                                this._updateLightMap(component);
                            }
                        }
                    },
                    {
                        type: paper.RendererEventType.Materials,
                        listener: (component: MeshRenderer) => {
                            if (this._hasGameObject(component.gameObject)) {
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

            if (filter.mesh && renderer.materials.length > 0) {
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
                        renderer: renderer,
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

        private _updateLightMap(component: MeshRenderer) {
            const drawCalls = this._drawCallList.getDrawCalls(component.gameObject);
            if (drawCalls) {
                for (const drawCall of drawCalls) {
                    drawCall.lightMapIndex = component.lightmapIndex;
                    drawCall.lightMapScaleOffset = component.lightmapScaleOffset;
                }
            }
        }

        public onEnable() {
            // TODO 重新生成 drawcall
        }

        public onAddGameObject(gameObject: paper.GameObject) {
            const renderer = this._getComponent(gameObject, 0) as MeshRenderer;
            this._drawCallList.updateDrawCalls(gameObject, renderer.castShadows);
        }

        public onRemoveGameObject(gameObject: paper.GameObject) {
            this._drawCallList.removeDrawCalls(gameObject);
        }

        public onDisable() {
            for (const component of this._components) {
                this._drawCallList.removeDrawCalls(component.gameObject);
            }
        }
    }
}
