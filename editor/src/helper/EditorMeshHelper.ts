namespace paper.editor {
    /**
     * @internal
     */
    export class EditorMeshHelper {
        //
        public static createGameObject(name: string, mesh: egret3d.Mesh = null, material: egret3d.Material = null, tag: string = paper.DefaultTags.EditorOnly, scene: paper.Scene = paper.Scene.editorScene) {
            const gameObject = paper.GameObject.create(name, tag, scene);
            gameObject.hideFlags = paper.HideFlags.HideAndDontSave;

            if (mesh) {
                gameObject.addComponent(egret3d.MeshFilter).mesh = mesh;
            }
            if (material) {
                gameObject.addComponent(egret3d.MeshRenderer).material = material;
            }
            return gameObject;
        }

        public static createBox(name: string, color: egret3d.Color, opacity: number, scene: Scene) {
            const box = this.createGameObject(name, egret3d.DefaultMeshes.CUBE_LINE, egret3d.DefaultMaterials.LINEDASHED_COLOR.clone(), paper.DefaultTags.EditorOnly, scene);
            box.getComponent(egret3d.MeshRenderer)!.material!.setColor(color).setBlend(gltf.BlendMode.Blend).opacity = opacity;

            return box;
        }

        public static createIcon(name: string, parent: paper.GameObject, icon: egret3d.Texture) {
            const material = new egret3d.Material(egret3d.DefaultShaders.TRANSPARENT);
            material.renderQueue = paper.RenderQueue.Overlay;
            material.setTexture(egret3d.ShaderUniformName.Map, icon);
            material.setColor(egret3d.ShaderUniformName.Diffuse, egret3d.Color.RED);
            // const gameObject = this.createGameObject(name, null, null, parent.tag, parent.scene);
            // const pick = this.createGameObject("pick", egret3d.DefaultMeshes.CUBE, egret3d.DefaultMaterials.MESH_BASIC.clone(), parent.tag, parent.scene);
            // pick.transform.setParent(gameObject.transform);
            // pick.activeSelf = false;
            // pick.addComponent(GizmoPickComponent).pickTarget = parent;
            const iconObj = this.createGameObject(name, egret3d.DefaultMeshes.QUAD, material, parent.tag, parent.scene);
            iconObj.transform.setParent(parent.transform);
            iconObj.addComponent(GizmoPickComponent).pickTarget = parent;
            // gameObject.transform.setParent(parent.transform);
            return iconObj;
        }

        public static createCameraWireframed(name: string,
            colorFrustum: egret3d.Color = egret3d.Color.create(1.0, 0.7, 0),
            colorCone: egret3d.Color = egret3d.Color.RED,
            colorUp: egret3d.Color = egret3d.Color.create(0, 0.7, 1),
            colorTarget: egret3d.Color = egret3d.Color.WHITE,
            colorCross: egret3d.Color = egret3d.Color.create(0.2, 0.2, 0.2)) {
            const vertices: number[] = [], colors: number[] = [];
            const verticeCount = 50;
            for (let i = 0; i < verticeCount; i++) {
                vertices.push(0.0, 0.0, 0.0);
                if (i < 24) {
                    colors.push(colorFrustum.r, colorFrustum.g, colorFrustum.b, colorFrustum.a);
                }
                else if (i < 32) {// cone
                    colors.push(colorCone.r, colorCone.g, colorCone.b, colorCone.a);
                }
                else if (i < 38) {// up
                    colors.push(colorUp.r, colorUp.g, colorUp.b, colorUp.a);
                }
                else if (i < 40) {// target
                    colors.push(colorTarget.r, colorTarget.g, colorTarget.b, colorTarget.a);
                }
                else {
                    colors.push(colorCross.r, colorCross.g, colorCross.b, colorCross.a);
                }
            }
            const mesh = new egret3d.Mesh(verticeCount, 0, [gltf.MeshAttributeType.POSITION, gltf.MeshAttributeType.COLOR_0]);
            mesh.setAttributes(gltf.MeshAttributeType.POSITION, vertices);
            mesh.setAttributes(gltf.MeshAttributeType.COLOR_0, colors);
            mesh.glTFMesh.primitives[0].mode = gltf.MeshPrimitiveMode.Lines;

            const gameObject = this.createGameObject(name, mesh, egret3d.DefaultMaterials.LINEDASHED_COLOR.clone());
            return gameObject;
        }
    }
}