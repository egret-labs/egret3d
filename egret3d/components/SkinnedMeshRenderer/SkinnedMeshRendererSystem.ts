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
                            this._updateDrawCalls(component.gameObject);
                        }
                    },
                    {
                        type: SkinnedMeshRendererEventType.Materials,
                        listener: (component: SkinnedMeshRenderer) => {
                            this._updateDrawCalls(component.gameObject);
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

        private _updateDrawCalls(gameObject: paper.GameObject) {
            if (!this._hasGameObject(gameObject)) { // 保持 listener 的代码简洁。
                return;
            }

            const component = this._getComponent(gameObject, 0);
            this._drawCallList.updateDrawCalls(gameObject, false);
            //
            const drawCalls = this._drawCallList.getDrawCalls(gameObject);
            if (drawCalls) {
                for (const drawCall of drawCalls) {
                    drawCall.boneData = component.boneBuffer;
                }
            }
        }

        public onEnable() {
            // TODO
        }

        public onAddGameObject(gameObject: paper.GameObject) {
            this._updateDrawCalls(gameObject);
        }

        public onRemoveGameObject(gameObject: paper.GameObject) {
            this._drawCallList.removeDrawCalls(gameObject);
        }

        public onUpdate() {
            // TODO
        }

        public onDisable() {
            // TODO
        }
    }
}
