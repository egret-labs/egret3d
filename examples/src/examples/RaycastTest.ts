namespace RaycastTest {
    export async function start() {
        await RES.loadConfig("resource/default.res.json", "resource/");

        // Create camera.
        egret3d.Camera.main;

        {
            const gameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CYLINDER, "Cube");
            gameObject.transform.setLocalPosition(0.0, 0.0, 0.0);

            const line = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.LINE_Z, "Line");
            line.transform.setLocalPosition(0.0, 5.0, -5.0);
            line.addComponent(behaviors.RotateComponent).target = gameObject;
            line.addComponent(RendererRaycast).target = gameObject;
        }

        {
            const gameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.PLANE, "Plane");
            gameObject.transform.setLocalPosition(15.0, 0.0, 0.0);

            const line = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.LINE_Z, "Line");
            line.transform.setLocalPosition(15.0, 5.0, -5.0);
            line.addComponent(behaviors.RotateComponent).target = gameObject;
            line.addComponent(RaycastPlane).target = gameObject;
        }

        // {
        //     await RES.getResAsync("Assets/pp1.prefab.json");
        //     const gameObject = paper.Prefab.create("Assets/pp1.prefab.json");
        //     gameObject.transform.setLocalPosition(2.0, 0.0, 0.0);

        //     const line = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.LINE_Z, "Line");
        //     line.transform.setLocalPosition(2.0, 5.0, -5.0);
        //     line.addComponent(behaviors.RotateComponent).target = gameObject.getComponentInChildren(egret3d.Animation)!.gameObject;
        //     line.addComponent(RendererRaycast).target = gameObject.getComponentInChildren(egret3d.SkinnedMeshRenderer)!.gameObject;
        // }
    }

    abstract class BaseRaycast extends paper.Behaviour {
        protected static readonly _ray: egret3d.Ray = egret3d.Ray.create();
        protected _lineMesh: egret3d.Mesh | null = null;

        public onStart() {
            const meshFilter = this.gameObject.getComponent(egret3d.MeshFilter)!;
            const meshRenderer = this.gameObject.getComponent(egret3d.MeshRenderer)!;

            this._lineMesh = meshFilter.mesh!;
            this._lineMesh.setIndices([2, 3], this._lineMesh.addSubMesh(2, 1, gltf.MeshPrimitiveMode.Points));
            this._lineMesh.setAttributes(gltf.MeshAttributeType.COLOR_0, [
                0.0, 0.0, 0.0, 0.0,
                0.0, 0.0, 0.0, 0.0,
            ], 2);

            meshRenderer.materials = [
                meshRenderer.material!,
                egret3d.Material.create(egret3d.DefaultShaders.POINTS)
                    .addDefine(egret3d.ShaderDefine.USE_COLOR)
                    .setFloat(egret3d.ShaderUniformName.Size, 10.0)
            ];
        }

        protected _updateAngGetRay() {
            const transform = this.gameObject.transform;
            const ray = BaseRaycast._ray;
            ray.origin.copy(transform.position);
            transform.getForward(ray.direction);

            return ray;
        }
    }

    class RendererRaycast extends BaseRaycast {
        @paper.editor.property(paper.editor.EditType.CHECKBOX)
        public raycastMesh: boolean = false;
        public target: paper.GameObject | null = null;

        public onUpdate() {
            const transform = this.gameObject.transform;
            transform.setLocalScale(1.0);

            if (this.target && this.target.renderer) {
                const ray = this._updateAngGetRay();
                const raycastInfo = egret3d.RaycastInfo.create();
                if (this.target.renderer.raycast(ray, raycastInfo, this.raycastMesh)) {
                    transform.setLocalScale(1.0, 1.0, raycastInfo.distance);
                }

                raycastInfo.release();
            }
        }
    }

    class RaycastSphere extends BaseRaycast {
        public target: paper.GameObject | null = null;

        public onUpdate() {
            // if (this.target && this.target.renderer) {
            //     const sphere = this.target.renderer.boundingSphere;
            //     const raycastInfo = this._ray.intersectSphere(sphere.center, sphere.radius);

            //     if (raycastInfo) {
            //         this.transform.setScale(1.0, 1.0, raycastInfo.distance);
            //         return;
            //     }
            // }

            // this.transform.setScale(100.0);
        }
    }

    class RaycastPlane extends BaseRaycast {
        public target: paper.GameObject | null = null;

        private readonly _plane: egret3d.Plane = egret3d.Plane.create();

        public onUpdate() {
            const transform = this.gameObject.transform;
            transform.setLocalScale(1.0);

            if (this.target) {
                const ray = this._updateAngGetRay();
                const raycastInfo = egret3d.RaycastInfo.create();
                const plane = this._plane.fromPoint(this.target.transform.position, this.target.transform.getForward().release());

                if (plane.raycast(ray, raycastInfo)) {
                    transform.setLocalScale(1.0, 1.0, raycastInfo.distance);
                }

                raycastInfo.release();
            }
        }
    }
}