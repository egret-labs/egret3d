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

        public static angle(line1: egret3d.Vector3, line2: egret3d.Vector3, direction: egret3d.Vector3) {
            line1.normalize();
            line2.normalize();
            const temp = line1.dot(line2);
            // 1和-1时为0和180°	
            if (Math.abs(Math.abs(temp) - 1) < egret3d.EPSILON) {
                return temp > 0 ? 0 : Math.PI;
            }
            const angle = Math.acos(temp);
            // 两个向量的叉乘结果与屏幕方向是否一致来判断角度是否超过180°	
            const axis = line1.cross(line2);
            return axis.dot(direction) > 0 ? angle : 2 * Math.PI - angle;
        }

    }
}