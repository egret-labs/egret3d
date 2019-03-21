namespace paper.editor {
    /**
     * @internal
     */
    export class EditorMeshHelper {
        public static createGameObject(name: string, mesh: egret3d.Mesh | null = null, material: egret3d.Material[] | egret3d.Material | null = null) {
            const gameObject = GameObject.create(name, DefaultTags.EditorOnly, Scene.editorScene);
            gameObject.layer = Layer.Editor;

            if (mesh) {
                gameObject.addComponent(egret3d.MeshFilter).mesh = mesh;

                const meshRenderer = gameObject.addComponent(egret3d.MeshRenderer);

                if (material) {
                    if (Array.isArray(material)) {
                        meshRenderer.materials = material;
                    }
                    else {
                        meshRenderer.material = material;
                    }
                }
            }

            return gameObject;
        }

        public static createIcon(name: string, icon: egret3d.Texture) {
            const material = egret3d.Material.create(egret3d.DefaultShaders.MESH_BASIC); // TODO sprite raycast
            material.setTexture(icon).setColor(egret3d.Color.RED).setBlend(egret3d.BlendMode.Normal, egret3d.RenderQueue.Overlay - 1, 1.0);
            const gameObject = this.createGameObject(name, egret3d.DefaultMeshes.QUAD, material);

            return gameObject;
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

            const mesh = egret3d.Mesh.create(verticeCount, 0, [gltf.AttributeSemantics.POSITION, gltf.AttributeSemantics.COLOR_0]);
            mesh.setAttributes(gltf.AttributeSemantics.POSITION, vertices);
            mesh.setAttributes(gltf.AttributeSemantics.COLOR_0, colors);
            mesh.glTFMesh.primitives[0].mode = gltf.MeshPrimitiveMode.Lines;

            const material = (egret3d.DefaultMaterials as any).LINEDASHED_COLOR.clone();
            material.setBlend(gltf.BlendMode.Blend, RenderQueue.Transparent, 0.8);

            const gameObject = this.createGameObject(name, mesh, material);
            return gameObject;
        }
    }
}