namespace egret3d {
    /**
     * 
     */
    export const enum MeshFilterEventType {
        Mesh = "mesh",
    }
    /**
     * MeshFilter 组件
     */
    @paper.disallowMultiple
    export class MeshFilter extends paper.BaseComponent {
        @paper.serializedField
        private _mesh: Mesh | null = null;

        public uninitialize() {
            super.uninitialize();

            if (this._mesh) {
                // this._mesh.dispose();//TODO shaderdMesh暂时没法dispose
            }

            this._mesh = null;
        }

        /**
         * 组件挂载的 mesh 模型
         */
        @paper.editor.property(paper.editor.EditType.MESH)
        public get mesh() {
            return this._mesh;
        }
        public set mesh(mesh: Mesh | null) {
            if (this._mesh === mesh) {
                return;
            }

            if (this._mesh) {
                // this._mesh.dispose();//TODO shaderdMesh暂时没法dispose
            }

            this._mesh = mesh;
            paper.EventPool.dispatchEvent(MeshFilterEventType.Mesh, this);
        }
    }
}