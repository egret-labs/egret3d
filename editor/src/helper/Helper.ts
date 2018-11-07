namespace paper.editor {
    /**
     * @internal
     */
    export class Helper {

        public static raycastAll(targets: ReadonlyArray<paper.GameObject | egret3d.Transform>, mousePositionX: number, mousePositionY: number) {
            const camera = egret3d.Camera.editor;
            const ray = camera.createRayByScreen(mousePositionX, mousePositionY).release();
            const raycastInfos = egret3d.raycastAll(ray, targets, 0.0, paper.CullingMask.Everything, true);

            return raycastInfos;
        }

        public static raycast(raycastAble: egret3d.IRaycast, mousePositionX: number, mousePositionY: number) {
            const camera = egret3d.Camera.editor;
            const ray = camera.createRayByScreen(mousePositionX, mousePositionY);
            const raycastInfo = egret3d.RaycastInfo.create();

            return raycastAble.raycast(ray, raycastInfo) ? raycastInfo : null;
        }
    }
}