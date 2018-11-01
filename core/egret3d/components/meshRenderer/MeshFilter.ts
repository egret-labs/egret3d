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

        @paper.serializedField
        private _mesh: Mesh | null = null;

        public uninitialize() {
            super.uninitialize();

            if (this._mesh) {
                // this._mesh.dispose(); //TODO shaderdMesh暂时没法dispose
            }

            this._mesh = null;
        }
        /**
         * 该组件的网格资源。
         */
        @paper.property(paper.EditType.MESH)
        public get mesh() {
            return this._mesh;
        }
        public set mesh(value: Mesh | null) {
            if (this._mesh === value) {
                return;
            }

            if (this._mesh) {
                // this._mesh.dispose();//TODO shaderdMesh暂时没法dispose
            }

            this._mesh = value;
            MeshFilter.onMeshChanged.dispatch(this);
        }
    }
}