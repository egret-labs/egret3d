namespace behaviors {
    export abstract class BaseRaycast extends paper.Behaviour {
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

    export class RendererRaycast extends BaseRaycast {
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

    export class RaycastAABB extends BaseRaycast {
        public target: paper.GameObject | null = null;

        private readonly _aabb: egret3d.AABB = egret3d.AABB.create();

        public onUpdate() {
            const transform = this.gameObject.transform;
            transform.setLocalScale(1.0);

            if (this.target) {
                const ray = this._updateAngGetRay();
                const raycastInfo = egret3d.RaycastInfo.create();
                const aabb = this._aabb.applyMatrix(this.target.transform.worldMatrix, this.target.renderer!.aabb);

                if (aabb.raycast(ray, raycastInfo)) {
                    transform.setLocalScale(1.0, 1.0, raycastInfo.distance);
                }

                raycastInfo.release();
            }
        }
    }

    export class RaycastPlane extends BaseRaycast {
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