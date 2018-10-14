namespace paper.editor {
    /**
     * @internal
     */
    export class SkeletonDrawer extends BaseComponent {
        private readonly _skeletonMesh: egret3d.Mesh = egret3d.Mesh.create(128, 0, [gltf.MeshAttributeType.POSITION], null, gltf.DrawMode.Dynamic);

        public initialize() {
            super.initialize();

            const mesh = this._skeletonMesh;
            const material = egret3d.Material.create(egret3d.DefaultShaders.LINEDASHED);
            mesh.glTFMesh.primitives[0].mode = gltf.MeshPrimitiveMode.Lines;
            material
                .setColor(egret3d.Color.YELLOW)
                .setDepth(false, false)
                .renderQueue = RenderQueue.Overlay;

            this.gameObject.getOrAddComponent(egret3d.MeshFilter).mesh = mesh;
            this.gameObject.getOrAddComponent(egret3d.MeshRenderer).material = material;
        }

        public update() {
            const modelComponent = this.gameObject.getComponent(ModelComponent)!;
            const selectedGameObject = modelComponent.selectedGameObject!;
            const skinnedMeshRenderer = selectedGameObject.getComponent(egret3d.SkinnedMeshRenderer)!;
            const mesh = this._skeletonMesh;

            if (!skinnedMeshRenderer) {
                return;
            }

            let offset = 0;
            const helpVertex3A = egret3d.Vector3.create().release();
            const helpVertex3B = egret3d.Vector3.create().release();
            const helpMatrixA = egret3d.Matrix4.create().release();
            const vertices = mesh.getVertices()!;
            const bones = skinnedMeshRenderer.bones;

            this.gameObject.transform.position = selectedGameObject.transform.position;
            helpMatrixA.inverse(this.gameObject.transform.worldMatrix);

            for (const bone of bones) {
                if (bone) {
                    if (bone.parent && bones.indexOf(bone.parent) >= 0) {
                        helpVertex3A.applyMatrix(helpMatrixA, bone.parent.position).toArray(vertices, offset);
                        helpVertex3A.applyMatrix(helpMatrixA, bone.position).toArray(vertices, offset + 3);
                    }
                    else {
                        bone.getRight(helpVertex3B).applyDirection(helpMatrixA).multiplyScalar(0.25); // Bone length.
                        helpVertex3A.applyMatrix(helpMatrixA, bone.position).toArray(vertices, offset);
                        helpVertex3A.applyMatrix(helpMatrixA, bone.position).add(helpVertex3B).toArray(vertices, offset + 3);
                    }
                }
                else {
                    (egret3d.Vector3.ZERO as egret3d.Vector3).toArray(vertices, offset);
                    (egret3d.Vector3.ZERO as egret3d.Vector3).toArray(vertices, offset + 3);
                }

                offset += 6;
            }

            mesh.uploadVertexBuffer();
        }
    }
}