namespace behaviors {
    export abstract class BaseRaycast extends paper.Behaviour {
        protected static readonly _ray: egret3d.Ray = egret3d.Ray.create();
        protected _lineMesh: egret3d.Mesh | null = null;
        protected _normalMesh: egret3d.Mesh | null = null;

        protected readonly _line: paper.GameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.LINE_Z, "Line");
        protected readonly _normal: paper.GameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.LINE_Z, "Normal");

        public onAwake() {
            const meshFilter = this._line.getComponent(egret3d.MeshFilter)!;
            const meshRenderer = this._line.getComponent(egret3d.MeshRenderer)!;

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

            this._line.transform.parent = this.gameObject.transform;
            this._normal.transform.parent = this.gameObject.transform;
            this._normal.activeSelf = false;
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
            const lineTransform = this._line.transform;
            lineTransform.setLocalScale(1.0);
            this._normal.activeSelf = true;

            if (this.target && this.target.renderer) {
                const ray = this._updateAngGetRay();
                const raycastInfo = egret3d.RaycastInfo.create().release();
                raycastInfo.normal = egret3d.Vector3.create().release();

                if (this.target.renderer.raycast(ray, raycastInfo, this.raycastMesh)) {
                    lineTransform.setLocalScale(1.0, 1.0, raycastInfo.distance);
                    this._normal.transform.position = raycastInfo.position;
                    this._normal.transform.lookRotation(raycastInfo.normal);
                }
            }
        }
    }

    export class ColliderRaycast extends BaseRaycast {
        public target: paper.GameObject | null = null;

        public onUpdate() {
            const lineTransform = this._line.transform;
            lineTransform.setLocalScale(1.0);
            this._normal.activeSelf = true;

            if (this.target) {
                const ray = this._updateAngGetRay();
                const raycastInfo = egret3d.RaycastInfo.create().release();
                raycastInfo.normal = egret3d.Vector3.create().release();

                if (egret3d.raycast(ray, this.target, false, raycastInfo)) {
                    lineTransform.setLocalScale(1.0, 1.0, raycastInfo.distance);
                    this._normal.transform.position = raycastInfo.position;
                    this._normal.transform.lookRotation(raycastInfo.normal);
                }
            }
        }
    }
}