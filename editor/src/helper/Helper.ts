namespace paper.debug {
    export class Helper {
        private static _raycast(ray: egret3d.Ray, gameObject: paper.GameObject, raycastInfos: egret3d.RaycastInfo[]) {
            if (
                (
                    gameObject.hideFlags === paper.HideFlags.HideAndDontSave && gameObject.tag === paper.DefaultTags.EditorOnly
                ) ? gameObject.activeInHierarchy : !gameObject.activeInHierarchy
            ) {
                return;
            }

            const raycastInfo = egret3d.RaycastInfo.create();
            if (gameObject.renderer && gameObject.renderer.raycast(ray, raycastInfo, true)) {
                raycastInfo.transform = gameObject.transform;
                raycastInfos.push(raycastInfo);
            }
            else {
                raycastInfo.release();

                for (const child of gameObject.transform.children) {
                    this._raycast(ray, child.gameObject, raycastInfos);
                }
            }
        }

        public static raycast(gameObjects: paper.GameObject[], mousePositionX: number, mousePositionY: number) {
            const camera = egret3d.Camera.editor;
            const ray = camera.createRayByScreen(mousePositionX, mousePositionY);
            const raycastInfos = [] as egret3d.RaycastInfo[];

            for (const gameObject of gameObjects) {
                this._raycast(ray, gameObject, raycastInfos);
            }

            ray.release();
            //
            raycastInfos.sort((a, b) => {
                return a.distance - b.distance;
            });

            return raycastInfos;
        }
    }
}