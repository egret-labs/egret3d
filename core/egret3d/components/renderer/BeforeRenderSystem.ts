namespace egret3d {
    /**
     * 渲染前系统系统。
     * - 为渲染系统纠错，关闭该系统可提高性能。
     */
    export class BeforeRenderSystem extends paper.BaseSystem {
        private readonly _drawCallCollecter: DrawCallCollecter = paper.GameObject.globalGameObject.getOrAddComponent(DrawCallCollecter);

        public onUpdate() {
            const drawCallCollecter = this._drawCallCollecter;

            for (const drawCall of drawCallCollecter.drawCalls) {
                if (drawCall!.mesh.isDisposed) {
                    drawCall!.mesh = DefaultMeshes.CUBE;
                    drawCall!.subMeshIndex = 0;
                }

                if (drawCall!.material.isDisposed) {
                    drawCall!.material = DefaultMaterials.MISSING;
                }
                else if (drawCall!.material.shader.isDisposed) {
                    drawCall!.material.shader = DefaultShaders.MESH_BASIC;
                }

                drawCall!.drawCount = 0;
            }
            //
            if (!renderState.standardDerivativesEnabled) {
                for (const drawCall of drawCallCollecter.addDrawCalls) {
                    if (drawCall) {
                        drawCall.material
                            .removeDefine(ShaderDefine.USE_NORMALMAP)
                            .removeDefine(ShaderDefine.USE_BUMPMAP)
                            .removeDefine(ShaderDefine.FLAT_SHADED)
                            .removeDefine(ShaderDefine.ENVMAP_TYPE_CUBE_UV);
                    }
                }
            }
        }
    }
}
