namespace egret3d {
    /**
     * BoxCollider系统
     */
    export class BoxColliderSystem extends paper.BaseSystem<BoxCollider> {
        /**
         * @inheritDoc
         */
        protected readonly _interests = [
            { componentClass: BoxCollider }
        ];

        /**
         * @inheritDoc
         */
        public update() {
            for (let i = 0, l = this._components.length; i < l; i += this._interestComponentCount) {
                const component = this._components[i] as BoxCollider;

                if (component._dirtyMask !== 0) {
                    if (component._dirtyMask & BoxColliderDirtyMask.Bounds) {
                        component._dirtyMask &= ~BoxColliderDirtyMask.Bounds;
                        const bounds = component.bounds;

                        if (bounds) {
                            bounds.setByCenterSize(bounds.center, bounds.size);
                        }
                    }
                }

                // TODO 是否应该每帧刷新定向包围盒？理论上只有 transform 改变或 自身 数据改变时才需要刷新。
                // 但是获取 transform 改变也需要花费很多成本
                const matrix = component.gameObject.transform.getWorldMatrix();
                component.bounds.update(matrix);
            }
        }
    }
}
