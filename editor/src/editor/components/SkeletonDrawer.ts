namespace paper.editor {
    /**
     * @internal
     */
    export class SkeletonDrawer extends BaseSelectedGOComponent {
        private readonly _drawer: GameObject = EditorMeshHelper.createGameObject("Skeleton Drawer");

        public initialize() {
            super.initialize();

            const drawer = this._drawer;
            const mesh = egret3d.Mesh.create(1024, 0, [gltf.AttributeSemantics.POSITION]);
            const material = egret3d.Material.create(egret3d.DefaultShaders.LINEDASHED);
            mesh.glTFMesh.primitives[0].mode = gltf.MeshPrimitiveMode.Lines;
            mesh.drawMode = gltf.DrawMode.Dynamic;
            material
                .setColor(egret3d.Color.YELLOW)
                .setDepth(false, false)
                .renderQueue = RenderQueue.Overlay;

            drawer.parent = this.gameObject;
            drawer.addComponent(egret3d.MeshFilter).mesh = mesh;
            drawer.addComponent(egret3d.MeshRenderer).material = material;
        }

        public update() {
            const selectedGameObject = super.update();
            const skinnedMeshRenderer = selectedGameObject ? selectedGameObject.getComponent(egret3d.SkinnedMeshRenderer) : null;
            const drawer = this._drawer;

            if (selectedGameObject && skinnedMeshRenderer) {
                let offset = 0;
                const mesh = drawer.getComponent(egret3d.MeshFilter)!.mesh!;
                const helpVertex3A = egret3d.Vector3.create().release();
                const helpVertex3B = egret3d.Vector3.create().release();
                const vertices = mesh.getVertices()!;
                const bones = skinnedMeshRenderer.bones;

                drawer.activeSelf = true;
                drawer.transform.localPosition = selectedGameObject.transform.position;
                //
                const worldToLocalMatrix = drawer.transform.worldToLocalMatrix;

                for (let i = 0, l = vertices.length; i < l; ++i) {
                    vertices[i] = 0.0;
                }

                for (const bone of bones) {
                    if (bone) {
                        if (bone.parent && bones.indexOf(bone.parent) >= 0) {
                            helpVertex3A.applyMatrix(worldToLocalMatrix, bone.parent.position).toArray(vertices, offset);
                            helpVertex3A.applyMatrix(worldToLocalMatrix, bone.position).toArray(vertices, offset + 3);
                        }
                        else {
                            bone.getForward(helpVertex3B).applyDirection(worldToLocalMatrix).multiplyScalar(0.1); // Bone length.
                            helpVertex3A.applyMatrix(worldToLocalMatrix, bone.position).toArray(vertices, offset);
                            helpVertex3A.applyMatrix(worldToLocalMatrix, bone.position).add(helpVertex3B).toArray(vertices, offset + 3);
                        }
                    }

                    offset += 6;
                }

                mesh.uploadVertexBuffer(gltf.AttributeSemantics.POSITION);
            }
            else {
                drawer.activeSelf = false;
            }

            return selectedGameObject;
        }
    }
}