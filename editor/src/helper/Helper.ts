namespace paper.debug {
    export class Helper {
        private static _raycast(ray: egret3d.Ray, gameObject: paper.GameObject, raycastInfos: egret3d.RaycastInfo[]) {
            if (
                !gameObject.activeInHierarchy ||
                (
                    (gameObject.hideFlags === paper.HideFlags.Hide || gameObject.hideFlags === paper.HideFlags.HideAndDontSave) &&
                    gameObject.tag === paper.DefaultTags.EditorOnly
                )
            ) {
                return;
            }
            if (!gameObject.activeInHierarchy && gameObject.tag !== paper.DefaultTags.EditorOnly && gameObject.hideFlags !== paper.HideFlags.HideAndDontSave) {
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

        public static getPickObjects(pickables: paper.GameObject[], mousePositionX: number, mousePositionY: number) {
            const camera = egret3d.Camera.editor;
            const ray = camera.createRayByScreen(mousePositionX, mousePositionY);
            const raycastInfos = [] as egret3d.RaycastInfo[];

            for (const gameObject of pickables) {
                this._raycast(ray, gameObject, raycastInfos);
            }
            //
            raycastInfos.sort((a, b) => {
                return b.distance - a.distance;
            });

            return raycastInfos;
        }
    }
}