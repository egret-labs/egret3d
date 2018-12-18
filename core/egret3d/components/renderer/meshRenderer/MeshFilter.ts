namespace egret3d {
    /**
     * 网格筛选组件。
     * - 为网格渲染组件提供网格资源。
     */
    export class MeshFilter extends paper.BaseComponent {
        /**
         * 当网格筛选组件的网格资源改变时派发事件。
         */
        public static readonly onMeshChanged: signals.Signal = new signals.Signal();

        private _mesh: Mesh | null = null;

        public uninitialize() {
            super.uninitialize();

            if (this._mesh) {
                this._mesh.release();
            }

            this._mesh = null;
        }
        /**
         * 该组件的网格资源。
         */
        @paper.editor.property(paper.editor.EditType.MESH)
        @paper.serializedField("_mesh")
        public get mesh(): Mesh | null {
            return this._mesh;
        }
        public set mesh(value: Mesh | null) {
            if (this._mesh === value) {
                return;
            }

            if (this._mesh) {
                this._mesh.release();
            }

            if (value) {
                value.retain();
            }

            this._mesh = value;

            MeshFilter.onMeshChanged.dispatch(this);
        }
    }
}