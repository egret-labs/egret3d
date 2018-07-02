namespace egret3d {
    /**
     * TrailRender系统
     */
    export class TrailRendererSystem extends paper.BaseSystem<TrailRenderer> {
        public readonly _interests = [
            {
                componentClass: TrailRenderer,
                listeners: [
                    {
                        type: TrailRenderEventType.Meterial,
                        listener: (component: TrailRenderer) => {
                            const gameObject = component.gameObject;
                            if (this._hasGameObject(gameObject)) {
                                this._drawCallList.updateDrawCalls(gameObject, false);
                            }
                        }
                    },
                ]
            }
        ];

        private readonly _transform: Transform = new Transform(); // TODO 不要这样，这是组件
        private readonly _createDrawCalls = ((gameObject: paper.GameObject) => {
            const renderer = this._getComponent(gameObject, 0) as TrailRenderer;

            if (renderer._mesh && renderer._material && renderer.$active) {
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

        public onEnable() {
            // TODO
        }

        public onAddGameObject(gameObject: paper.GameObject) {
            this._drawCallList.updateDrawCalls(gameObject, false);
            this._drawCallList.updateShadowCasters(gameObject, false);
        }

        public onRemoveGameObject(gameObject: paper.GameObject) {
            this._drawCallList.removeDrawCalls(gameObject);
        }

        public onUpdate() { // TODO 应将组件功能尽量移到系统
            const deltaTime = paper.Time.deltaTime;
            for (const component of this._components) {
                component.update(deltaTime);
            }
        }

        public onDisable() {
            // TODO
        }
    }
}
