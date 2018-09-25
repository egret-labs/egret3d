namespace paper.debug {
    export class Helper {

        public static raycast(targets: ReadonlyArray<paper.GameObject | egret3d.Transform>, mousePositionX: number, mousePositionY: number) {
            const camera = egret3d.Camera.editor;
            const ray = camera.createRayByScreen(mousePositionX, mousePositionY);
            const raycastInfos = GameObject.raycast(ray, targets, 0.0, paper.CullingMask.Everything, true);
            ray.release();

            return raycastInfos;
        }

        public static raycastB(raycastAble: egret3d.IRaycast, mousePositionX: number, mousePositionY: number) {
            const camera = egret3d.Camera.editor;
            const ray = camera.createRayByScreen(mousePositionX, mousePositionY);
            const raycastInfo = egret3d.RaycastInfo.create();

            return raycastAble.raycast(ray, raycastInfo) ? raycastInfo : null;
        }
    }
}