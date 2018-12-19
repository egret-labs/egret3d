namespace paper.editor {
    /**
     * @internal
     */
    export class SkeletonDrawer extends BaseSelectedGOComponent {

        public initialize() {
            super.initialize();

            const mesh = egret3d.Mesh.create(128, 0, [gltf.AttributeSemantics.POSITION]);
            const material = egret3d.Material.create(egret3d.DefaultShaders.LINEDASHED);
            mesh.glTFMesh.primitives[0].mode = gltf.MeshPrimitiveMode.Lines;
            mesh.drawMode = gltf.DrawMode.Dynamic;
            material
                .setColor(egret3d.Color.YELLOW)
                .setDepth(false, false)
                .renderQueue = RenderQueue.Overlay;

            this.gameObject.addComponent(egret3d.MeshFilter).mesh = mesh;
            this.gameObject.addComponent(egret3d.MeshRenderer).material = material;
        }

        public update() {
            const selectedGameObject = super.update();
            const skinnedMeshRenderer = selectedGameObject ? selectedGameObject.getComponent(egret3d.SkinnedMeshRenderer) : null;

            if (selectedGameObject && skinnedMeshRenderer) {
                const mesh = this.gameObject.getComponent(egret3d.MeshFilter)!.mesh!;

                let offset = 0;
                const helpVertex3A = egret3d.Vector3.create().release();
                const helpVertex3B = egret3d.Vector3.create().release();
                const vertices = mesh.getVertices()!;
                const bones = skinnedMeshRenderer.bones;

                this.gameObject.transform.position = selectedGameObject!.transform.position;
                const worldToLocalMatrix = this.gameObject.transform.worldToLocalMatrix;

                for (const bone of bones) {
                    if (bone) {
                        if (bone.parent && bones.indexOf(bone.parent) >= 0) {
                            helpVertex3A.applyMatrix(worldToLocalMatrix, bone.parent.position).toArray(vertices, offset);
                            helpVertex3A.applyMatrix(worldToLocalMatrix, bone.position).toArray(vertices, offset + 3);
                        }
                        else {
                            bone.getRight(helpVertex3B).applyDirection(worldToLocalMatrix).multiplyScalar(0.25); // Bone length.
                            helpVertex3A.applyMatrix(worldToLocalMatrix, bone.position).toArray(vertices, offset);
                            helpVertex3A.applyMatrix(worldToLocalMatrix, bone.position).add(helpVertex3B).toArray(vertices, offset + 3);
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
            else {
                this.gameObject.activeSelf = false;
            }

            return selectedGameObject;
        }
    }
}