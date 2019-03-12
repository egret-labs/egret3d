namespace behaviors {
    export abstract class BaseRaycast extends paper.Behaviour {
        public readonly ray: egret3d.Ray = egret3d.Ray.create();
        public readonly normal: egret3d.Vector3 = egret3d.Vector3.create();
        public readonly raycastInfo: egret3d.RaycastInfo = egret3d.RaycastInfo.create();

        protected _lineMesh: egret3d.Mesh | null = null;
        protected _normalMesh: egret3d.Mesh | null = null;

        protected readonly _line: paper.GameObject = egret3d.creater.createGameObject("Line", { mesh: egret3d.DefaultMeshes.LINE_Z, material: egret3d.DefaultMaterials.LINEDASHED });
        protected readonly _normal: paper.GameObject = egret3d.creater.createGameObject("Normal", { mesh: egret3d.DefaultMeshes.LINE_Z, material: egret3d.DefaultMaterials.LINEDASHED });

        public onAwake() {
            const meshFilter = this._line.getComponent(egret3d.MeshFilter)!;
            const meshRenderer = this._line.getComponent(egret3d.MeshRenderer)!;

            this._lineMesh = meshFilter.mesh!;
            this._lineMesh.setIndices([2, 3], this._lineMesh.addSubMesh(2, 1, gltf.MeshPrimitiveMode.Points));
            this._lineMesh.setAttributes(gltf.AttributeSemantics.COLOR_0, [
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

        protected _updateRay() {
            const transform = this.gameObject.transform;
            const ray = this.ray;
            ray.origin.copy(transform.position);
            transform.getForward(ray.direction);
        }
    }

    export class RendererRaycast extends BaseRaycast {
        @paper.editor.property(paper.editor.EditType.CHECKBOX)
        public target: paper.GameObject | null = null;

        public onUpdate() {
            const raycastInfo = this.raycastInfo;
            const lineTransform = this._line.transform;
            lineTransform.setLocalScale(1.0);
            raycastInfo.clear();
            raycastInfo.normal = this.normal;

            if (this.target && this.target.renderer) {
                this._updateRay();

                if (this.target.renderer.raycast(this.ray, raycastInfo)) {

                    lineTransform.setLocalScale(1.0, 1.0, raycastInfo.distance);
                    this._normal.activeSelf = true;
                    this._normal.transform
                        .setPosition(raycastInfo.position)
                        .lookRotation(raycastInfo.normal!)
                        .setLocalScale(1.0, 1.0, raycastInfo.normal!.length);
                    return;
                }
            }

            this._normal.activeSelf = false;
        }
    }

    export class ColliderRaycast extends BaseRaycast {
        public target: paper.GameObject | null = null;

        public onUpdate() {
            const raycastInfo = this.raycastInfo;
            const lineTransform = this._line.transform;
            lineTransform.setLocalScale(1.0);
            raycastInfo.clear();
            raycastInfo.normal = this.normal;

            if (this.target) {
                this._updateRay();

                if (egret3d.raycast(this.ray, this.target, false, raycastInfo)) {
                    lineTransform.setLocalScale(1.0, 1.0, raycastInfo.distance);
                    this._normal.activeSelf = true;
                    this._normal.transform
                        .setPosition(raycastInfo.position)
                        .lookRotation(raycastInfo.normal!)
                        .setLocalScale(1.0, 1.0, raycastInfo.normal!.length);
                    return;
                }
            }

            this._normal.activeSelf = false;
        }
    }
}