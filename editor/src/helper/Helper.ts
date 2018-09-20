namespace paper.debug {
    export class Helper {
        private static _rayCastGameObject(ray: egret3d.Ray, gameObject: paper.GameObject, raycastInfos: egret3d.RaycastInfo[]) {
            if(gameObject.name === "__editor"){
                return;
            }
            if (!gameObject.activeInHierarchy && gameObject.tag !== paper.DefaultTags.EditorOnly && gameObject.hideFlags !== paper.HideFlags.HideAndDontSave) {
                return;
            }


            let raycastInfo: egret3d.RaycastInfo | null = null;
            const meshFilter = gameObject.getComponent(egret3d.MeshFilter);

            if (meshFilter && meshFilter.mesh) {
                raycastInfo = meshFilter.mesh.raycast(ray, gameObject.transform.getWorldMatrix());
                if (raycastInfo) {
                    raycastInfo.transform = gameObject.transform;
                    raycastInfos.push(raycastInfo);
                }
            }
            else {
                const skinnedMeshRenderer = gameObject.getComponent(egret3d.SkinnedMeshRenderer);
                if (skinnedMeshRenderer && skinnedMeshRenderer.mesh) {
                    raycastInfo = skinnedMeshRenderer.mesh.raycast(ray, gameObject.transform.getWorldMatrix(), skinnedMeshRenderer.boneMatrices);
                    if (raycastInfo) {
                        raycastInfo.transform = gameObject.transform;
                        raycastInfos.push(raycastInfo);
                    }
                }
            }

            if (!raycastInfo) {
                for (const child of gameObject.transform.children) {
                    this._rayCastGameObject(ray, child.gameObject, raycastInfos);
                }
            }
        }

        public static getPickObjects(pickables: paper.GameObject[], mousePositionX: number, mousePositionY: number) {
            const camera = egret3d.Camera.editor;
            const ray = camera.createRayByScreen(mousePositionX, mousePositionY);
            const raycastInfos = [] as egret3d.RaycastInfo[];

            for (const gameObject of pickables) {
                this._rayCastGameObject(ray, gameObject, raycastInfos);
            }
            //
            raycastInfos.sort((a, b) => {
                return b.distance - a.distance;
            });

            return raycastInfos;
        }
    }
}