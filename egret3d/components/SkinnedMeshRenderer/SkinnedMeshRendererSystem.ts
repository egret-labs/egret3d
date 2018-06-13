namespace egret3d {
    /**
     * TODO 需要完善
     */
    export class SkinnedMeshRendererSystem extends paper.BaseSystem<SkinnedMeshRenderer> {

        protected readonly _interests = [
            {
                componentClass: SkinnedMeshRenderer,
                listeners: [
                    {
                        type: SkinnedMeshRendererEventType.Mesh,
                        listener: (component: SkinnedMeshRenderer) => {
                            const renderer = this._getComponent(component.gameObject, 0);
                            if (renderer) {
                                this._updateDrawCalls(component);
                            }
                        }
                    },
                    {
                        type: SkinnedMeshRendererEventType.Materials,
                        listener: (component: SkinnedMeshRenderer) => {
                            const renderer = this._getComponent(component.gameObject, 0);
                            if (renderer) {
                                this._updateDrawCalls(component);
                            }
                        }
                    },
                ]
            }
        ];

        private readonly _createDrawCalls = ((gameObject: paper.GameObject) => {
            const renderer = this._getComponent(gameObject, 0) as SkinnedMeshRenderer;

            if (renderer.mesh && renderer.materials.length > 0) {
                let subMeshIndex = 0;
                const drawCalls: DrawCall[] = [];

                for (const primitive of renderer.mesh.glTFMesh.primitives) {
                    drawCalls.push({
                        subMeshInfo: subMeshIndex,
                        mesh: renderer.mesh,
                        material: renderer.materials[primitive.material || 0],
                        lightMapIndex: -1,
                        boneData: renderer.boneBuffer,
                        gameObject: gameObject,
                        transform: gameObject.transform, // TODO
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

        private _updateDrawCalls(component: SkinnedMeshRenderer) {
            const gameObject = component.gameObject;
            this._drawCallList.updateDrawCalls(gameObject, false);
            //
            const drawCalls = this._drawCallList.getDrawCalls(gameObject);
            if (drawCalls) {
                for (const drawCall of drawCalls) {
                    drawCall.boneData = component.boneBuffer;
                }
            }
        }

        protected _onAddComponent(component: SkinnedMeshRenderer) {
            if (!super._onAddComponent(component)) {
                return false;
            }

            this._updateDrawCalls(component);

            return true;
        }

        protected _onRemoveComponent(component: SkinnedMeshRenderer) {
            if (!super._onRemoveComponent(component)) {
                return false;
            }

            this._drawCallList.removeDrawCalls(component.gameObject);

            return true;
        }

        public uninitialize() {
            for (const component of this._components) {
                this._drawCallList.removeDrawCalls(component.gameObject);
            }

            super.uninitialize();
        }

        public update() {
        }
    }
}
