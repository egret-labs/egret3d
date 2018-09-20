namespace paper.debug {
    export class EditorMeshHelper {
        //
        public static _createGameObject(name: string, mesh: egret3d.Mesh = null, material: egret3d.Material = null, tag: string = paper.DefaultTags.EditorOnly, scene: paper.Scene = paper.Scene.editorScene) {
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

        public static createGrid(name: string, size: number = 50, divisions: number = 50,
            color1: egret3d.Color = egret3d.Color.create(0.26, 0.26, 0.26), color2: egret3d.Color = egret3d.Color.create(0.53, 0.53, 0.53)) {
            //
            const center = divisions / 2;
            const step = size / divisions;
            const halfSize = size / 2;
            const vertices: number[] = [], colors: number[] = [];

            for (let i = 0, k = - halfSize; i <= divisions; i++ , k += step) {
                vertices.push(- halfSize, 0, k);
                vertices.push(halfSize, 0, k);
                vertices.push(k, 0, - halfSize);
                vertices.push(k, 0, halfSize);

                const color = i === center ? color1 : color2;

                colors.push(color.r, color.g, color.b, color.a);
                colors.push(color.r, color.g, color.b, color.a);
                colors.push(color.r, color.g, color.b, color.a);
                colors.push(color.r, color.g, color.b, color.a);
            }

            for (var i = 0; i < colors.length; i += 80) {
                for (var j = 0; j < 16; j++) {
                    colors[i + j] = 0.26;
                }
            }

            const mesh = new egret3d.Mesh(vertices.length, 0, [gltf.MeshAttributeType.POSITION, gltf.MeshAttributeType.COLOR_0]);
            mesh.setAttributes(gltf.MeshAttributeType.POSITION, vertices);
            mesh.setAttributes(gltf.MeshAttributeType.COLOR_0, colors);

            mesh.glTFMesh.primitives[0].mode = gltf.MeshPrimitiveMode.Lines;
            const gameObject = this._createGameObject(name, mesh, egret3d.DefaultMaterials.LINEDASHED_COLOR.clone());
            return gameObject;
        }

        public static createTouchPlane(name: string, width: number = 500000, height: number = 500000) {
            const gameObject = this._createGameObject(name, egret3d.DefaultMeshes.createPlane(width, height), egret3d.DefaultMaterials.LINEDASHED_COLOR.clone());
            return gameObject;
        }

        public static createAxises(name: string) {
            const gameObject = this._createGameObject(name);
            {
                const translate = this._createGameObject("translate");
                translate.transform.setParent(gameObject.transform);
                const axisX = this._createGameObject("axisX", egret3d.DefaultMeshes.LINE_X, egret3d.DefaultMaterials.MESH_BASIC.clone());
                const axisY = this._createGameObject("axisY", egret3d.DefaultMeshes.LINE_X, egret3d.DefaultMaterials.MESH_BASIC.clone());
                const axisZ = this._createGameObject("axisZ", egret3d.DefaultMeshes.LINE_X, egret3d.DefaultMaterials.MESH_BASIC.clone());

                const arrowX = this._createGameObject("arrowX", egret3d.DefaultMeshes.PYRAMID, egret3d.DefaultMaterials.MESH_BASIC.clone());
                const arrowY = this._createGameObject("arrowY", egret3d.DefaultMeshes.PYRAMID, egret3d.DefaultMaterials.MESH_BASIC.clone());
                const arrowZ = this._createGameObject("arrowZ", egret3d.DefaultMeshes.PYRAMID, egret3d.DefaultMaterials.MESH_BASIC.clone());

                const pickX = this._createGameObject("pickX", egret3d.DefaultMeshes.CUBE, egret3d.DefaultMaterials.MESH_BASIC.clone());
                const pickY = this._createGameObject("pickY", egret3d.DefaultMeshes.CUBE, egret3d.DefaultMaterials.MESH_BASIC.clone());
                const pickZ = this._createGameObject("pickZ", egret3d.DefaultMeshes.CUBE, egret3d.DefaultMaterials.MESH_BASIC.clone());

                axisX.transform.setParent(translate.transform);
                axisY.transform.setParent(translate.transform).setLocalEuler(0.0, 0.0, Math.PI * 0.5);
                axisZ.transform.setParent(translate.transform).setLocalEuler(0.0, -Math.PI * 0.5, 0.0);

                arrowX.transform.setParent(axisX.transform).setLocalEuler(0.0, 0.0, -Math.PI * 0.5).setLocalPosition(egret3d.Vector3.RIGHT).setLocalScale(0.05, 0.1, 0.05);
                arrowY.transform.setParent(axisY.transform).setLocalEuler(0.0, 0.0, -Math.PI * 0.5).setLocalPosition(egret3d.Vector3.RIGHT).setLocalScale(0.05, 0.1, 0.05);
                arrowZ.transform.setParent(axisZ.transform).setLocalEuler(0.0, 0.0, -Math.PI * 0.5).setLocalPosition(egret3d.Vector3.RIGHT).setLocalScale(0.05, 0.1, 0.05);

                pickX.transform.setParent(translate.transform).setLocalPosition(egret3d.Vector3.RIGHT.clone().multiplyScalar(0.5)).setLocalScale(1, 0.1, 0.1);
                pickY.transform.setParent(translate.transform).setLocalPosition(egret3d.Vector3.UP.clone().multiplyScalar(0.5)).setLocalScale(0.1, 1, 0.1);
                pickZ.transform.setParent(translate.transform).setLocalPosition(egret3d.Vector3.FORWARD.clone().multiplyScalar(0.5)).setLocalScale(0.1, 0.1, 1);
                pickX.activeSelf = pickY.activeSelf = pickZ.activeSelf = false;

                (axisX.renderer as egret3d.MeshRenderer).material.setColor("diffuse", egret3d.Color.RED).setDepth(false, false).setRenderQueue(paper.RenderQueue.Overlay);
                (axisY.renderer as egret3d.MeshRenderer).material.setColor("diffuse", egret3d.Color.GREEN).setDepth(false, false).setRenderQueue(paper.RenderQueue.Overlay);
                (axisZ.renderer as egret3d.MeshRenderer).material.setColor("diffuse", egret3d.Color.BLUE).setDepth(false, false).setRenderQueue(paper.RenderQueue.Overlay);

                (arrowX.renderer as egret3d.MeshRenderer).material.addDefine(egret3d.ShaderDefine.USE_COLOR).setColor("diffuse", egret3d.Color.RED).setDepth(false, false).setRenderQueue(paper.RenderQueue.Overlay);
                (arrowY.renderer as egret3d.MeshRenderer).material.addDefine(egret3d.ShaderDefine.USE_COLOR).setColor("diffuse", egret3d.Color.GREEN).setDepth(false, false).setRenderQueue(paper.RenderQueue.Overlay);
                (arrowZ.renderer as egret3d.MeshRenderer).material.addDefine(egret3d.ShaderDefine.USE_COLOR).setColor("diffuse", egret3d.Color.BLUE).setDepth(false, false).setRenderQueue(paper.RenderQueue.Overlay);

                (pickX.renderer as egret3d.MeshRenderer).material.setColor("diffuse", egret3d.Color.RED).setDepth(false, false).setRenderQueue(paper.RenderQueue.Overlay);
                (pickY.renderer as egret3d.MeshRenderer).material.setColor("diffuse", egret3d.Color.GREEN).setDepth(false, false).setRenderQueue(paper.RenderQueue.Overlay);
                (pickZ.renderer as egret3d.MeshRenderer).material.setColor("diffuse", egret3d.Color.BLUE).setDepth(false, false).setRenderQueue(paper.RenderQueue.Overlay);
            }
            //
            {
                const rotate = this._createGameObject("rotate");
                rotate.transform.setParent(gameObject.transform);

                const axisX = this._createGameObject("axisX", egret3d.DefaultMeshes.CIRCLE_LINE, egret3d.DefaultMaterials.MESH_BASIC.clone());
                const axisY = this._createGameObject("axisY", egret3d.DefaultMeshes.CIRCLE_LINE, egret3d.DefaultMaterials.MESH_BASIC.clone());
                const axisZ = this._createGameObject("axisZ", egret3d.DefaultMeshes.CIRCLE_LINE, egret3d.DefaultMaterials.MESH_BASIC.clone());

                const pickX = this._createGameObject("pickX", egret3d.DefaultMeshes.TORUS, egret3d.DefaultMaterials.MESH_BASIC.clone());
                const pickY = this._createGameObject("pickY", egret3d.DefaultMeshes.TORUS, egret3d.DefaultMaterials.MESH_BASIC.clone());
                const pickZ = this._createGameObject("pickZ", egret3d.DefaultMeshes.TORUS, egret3d.DefaultMaterials.MESH_BASIC.clone());

                axisX.transform.setParent(rotate.transform);
                axisY.transform.setParent(rotate.transform).setLocalEuler(0.0, 0.0, Math.PI * 0.5);
                axisZ.transform.setParent(rotate.transform).setLocalEuler(0.0, -Math.PI * 0.5, 0.0);

                pickX.transform.setParent(rotate.transform).setLocalEuler(0, -Math.PI * 0.5, -Math.PI * 0.5);
                pickY.transform.setParent(rotate.transform).setLocalEuler(Math.PI * 0.5, 0.0, 0.0);
                pickZ.transform.setParent(rotate.transform).setLocalEuler(0.0, 0.0, -Math.PI * 0.5);
                pickX.activeSelf = pickY.activeSelf = pickZ.activeSelf = false;

                (axisX.renderer as egret3d.MeshRenderer).material.setColor("diffuse", egret3d.Color.RED).setDepth(false, false).setRenderQueue(paper.RenderQueue.Overlay);
                (axisY.renderer as egret3d.MeshRenderer).material.setColor("diffuse", egret3d.Color.GREEN).setDepth(false, false).setRenderQueue(paper.RenderQueue.Overlay);
                (axisZ.renderer as egret3d.MeshRenderer).material.setColor("diffuse", egret3d.Color.BLUE).setDepth(false, false).setRenderQueue(paper.RenderQueue.Overlay);

                (pickX.renderer as egret3d.MeshRenderer).material.setColor("diffuse", egret3d.Color.RED).setDepth(false, false).setRenderQueue(paper.RenderQueue.Overlay);
                (pickY.renderer as egret3d.MeshRenderer).material.setColor("diffuse", egret3d.Color.GREEN).setDepth(false, false).setRenderQueue(paper.RenderQueue.Overlay);
                (pickZ.renderer as egret3d.MeshRenderer).material.setColor("diffuse", egret3d.Color.BLUE).setDepth(false, false).setRenderQueue(paper.RenderQueue.Overlay);
            }
            //
            {
                const scale = this._createGameObject("scale");
                scale.transform.setParent(gameObject.transform);
                const axisX = this._createGameObject("axisX", egret3d.DefaultMeshes.LINE_X, egret3d.DefaultMaterials.MESH_BASIC.clone());
                const axisY = this._createGameObject("axisY", egret3d.DefaultMeshes.LINE_X, egret3d.DefaultMaterials.MESH_BASIC.clone());
                const axisZ = this._createGameObject("axisZ", egret3d.DefaultMeshes.LINE_X, egret3d.DefaultMaterials.MESH_BASIC.clone());

                const arrowX = this._createGameObject("arrowX", egret3d.DefaultMeshes.CUBE, egret3d.DefaultMaterials.MESH_BASIC.clone());
                const arrowY = this._createGameObject("arrowY", egret3d.DefaultMeshes.CUBE, egret3d.DefaultMaterials.MESH_BASIC.clone());
                const arrowZ = this._createGameObject("arrowZ", egret3d.DefaultMeshes.CUBE, egret3d.DefaultMaterials.MESH_BASIC.clone());

                const pickX = this._createGameObject("pickX", egret3d.DefaultMeshes.CUBE, egret3d.DefaultMaterials.MESH_BASIC.clone());
                const pickY = this._createGameObject("pickY", egret3d.DefaultMeshes.CUBE, egret3d.DefaultMaterials.MESH_BASIC.clone());
                const pickZ = this._createGameObject("pickZ", egret3d.DefaultMeshes.CUBE, egret3d.DefaultMaterials.MESH_BASIC.clone());

                axisX.transform.setParent(scale.transform);
                axisY.transform.setParent(scale.transform).setLocalEuler(0.0, 0.0, Math.PI * 0.5);
                axisZ.transform.setParent(scale.transform).setLocalEuler(0.0, -Math.PI * 0.5, 0.0);

                arrowX.transform.setParent(axisX.transform).setLocalEuler(0.0, 0.0, -Math.PI * 0.5).setLocalPosition(egret3d.Vector3.RIGHT).setLocalScale(0.2, 0.2, 0.2);
                arrowY.transform.setParent(axisY.transform).setLocalEuler(0.0, 0.0, -Math.PI * 0.5).setLocalPosition(egret3d.Vector3.RIGHT).setLocalScale(0.2, 0.2, 0.2);
                arrowZ.transform.setParent(axisZ.transform).setLocalEuler(0.0, 0.0, -Math.PI * 0.5).setLocalPosition(egret3d.Vector3.RIGHT).setLocalScale(0.2, 0.2, 0.2);

                pickX.transform.setParent(scale.transform).setLocalPosition(egret3d.Vector3.RIGHT.clone().multiplyScalar(0.5)).setLocalScale(1, 0.1, 0.1);
                pickY.transform.setParent(scale.transform).setLocalPosition(egret3d.Vector3.UP.clone().multiplyScalar(0.5)).setLocalScale(0.1, 1, 0.1);
                pickZ.transform.setParent(scale.transform).setLocalPosition(egret3d.Vector3.FORWARD.clone().multiplyScalar(0.5)).setLocalScale(0.1, 0.1, 1);
                pickX.activeSelf = pickY.activeSelf = pickZ.activeSelf = false;

                (axisX.renderer as egret3d.MeshRenderer).material.setColor("diffuse", egret3d.Color.RED).setDepth(false, false).setRenderQueue(paper.RenderQueue.Overlay);
                (axisY.renderer as egret3d.MeshRenderer).material.setColor("diffuse", egret3d.Color.GREEN).setDepth(false, false).setRenderQueue(paper.RenderQueue.Overlay);
                (axisZ.renderer as egret3d.MeshRenderer).material.setColor("diffuse", egret3d.Color.BLUE).setDepth(false, false).setRenderQueue(paper.RenderQueue.Overlay);

                (arrowX.renderer as egret3d.MeshRenderer).material.setColor("diffuse", egret3d.Color.RED).setDepth(false, false).setRenderQueue(paper.RenderQueue.Overlay);
                (arrowY.renderer as egret3d.MeshRenderer).material.setColor("diffuse", egret3d.Color.GREEN).setDepth(false, false).setRenderQueue(paper.RenderQueue.Overlay);
                (arrowZ.renderer as egret3d.MeshRenderer).material.setColor("diffuse", egret3d.Color.BLUE).setDepth(false, false).setRenderQueue(paper.RenderQueue.Overlay);

                (pickX.renderer as egret3d.MeshRenderer).material.setColor("diffuse", egret3d.Color.RED).setDepth(false, false).setRenderQueue(paper.RenderQueue.Overlay);
                (pickY.renderer as egret3d.MeshRenderer).material.setColor("diffuse", egret3d.Color.GREEN).setDepth(false, false).setRenderQueue(paper.RenderQueue.Overlay);
                (pickZ.renderer as egret3d.MeshRenderer).material.setColor("diffuse", egret3d.Color.BLUE).setDepth(false, false).setRenderQueue(paper.RenderQueue.Overlay);
            }
            //
            return gameObject;
        }

        public static createBox(name: string, color: egret3d.Color) {
            const gameObject = this._createGameObject(name, egret3d.DefaultMeshes.CUBE_LINE, egret3d.DefaultMaterials.LINEDASHED_COLOR.clone());
            gameObject.getComponent(egret3d.MeshRenderer).material.setColor("diffuse", egret3d.Color.create(0.0, 1.0, 1.0).release());
            return gameObject;
        }

        public static createCameraWireframed(name: string, tag: string, scene: paper.Scene,
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

            const gameObject = this._createGameObject(name, mesh, egret3d.DefaultMaterials.LINEDASHED_COLOR.clone(), tag, scene);

            const pick = this._createGameObject("pick", egret3d.DefaultMeshes.CUBE, null, tag, scene);
            pick.transform.parent = gameObject.transform;
            pick.activeSelf = false;

            return gameObject;
        }
    }
}