namespace paper.editor {
    /**
     * @internal
     */
    export class Helper {

        public static raycastAll(targets: ReadonlyArray<paper.GameObject | egret3d.Transform>, mousePositionX: number, mousePositionY: number, backfaceCulling: boolean) {
            const camera = egret3d.Camera.editor;
            const ray = camera.createRayByScreen(mousePositionX, mousePositionY).release();
            const raycastInfos = egret3d.raycastAll(ray, targets, 0.0, paper.Layer.Everything, true, backfaceCulling);

            return raycastInfos;
        }
    }
}