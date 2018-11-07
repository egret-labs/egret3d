namespace paper.editor {
    /**
     * 
     */
    export class WorldAxisesDrawer extends BaseComponent {
        public readonly cube: paper.GameObject = EditorMeshHelper.createGameObject("Cube", egret3d.DefaultMeshes.CUBE, egret3d.DefaultMaterials.MESH_BASIC);
        public readonly left: paper.GameObject = EditorMeshHelper.createGameObject("Left", egret3d.DefaultMeshes.CONE, egret3d.DefaultMaterials.MESH_BASIC);
        public readonly right: paper.GameObject = EditorMeshHelper.createGameObject("Right", egret3d.DefaultMeshes.CONE, egret3d.DefaultMaterials.MESH_BASIC.clone());
        public readonly bottom: paper.GameObject = EditorMeshHelper.createGameObject("Bottom", egret3d.DefaultMeshes.CONE, egret3d.DefaultMaterials.MESH_BASIC);
        public readonly top: paper.GameObject = EditorMeshHelper.createGameObject("Top", egret3d.DefaultMeshes.CONE, egret3d.DefaultMaterials.MESH_BASIC.clone());
        public readonly back: paper.GameObject = EditorMeshHelper.createGameObject("Back", egret3d.DefaultMeshes.CONE, egret3d.DefaultMaterials.MESH_BASIC);
        public readonly forward: paper.GameObject = EditorMeshHelper.createGameObject("Forward", egret3d.DefaultMeshes.CONE, egret3d.DefaultMaterials.MESH_BASIC.clone());

        public initialize() {
            super.initialize();

            this.cube.transform.setParent(this.gameObject.transform);
            this.left.transform.setLocalPosition(-1.5, 0.0, 0.0).setLocalEuler(0.0, 0.0, -Math.PI * 0.5).setLocalScale(1.0, 2.0, 1.0).setParent(this.cube.transform);
            this.right.transform.setLocalPosition(1.5, 0.0, 0.0).setLocalEuler(0.0, 0.0, Math.PI * 0.5).setLocalScale(1.0, 2.0, 1.0).setParent(this.cube.transform);
            this.bottom.transform.setLocalPosition(0.0, -1.5, 0.0).setLocalEuler(0.0, 0.0, 0.0).setLocalScale(1.0, 2.0, 1.0).setParent(this.cube.transform);
            this.top.transform.setLocalPosition(0.0, 1.5, 0.0).setLocalEuler(Math.PI, 0.0, 0.0).setLocalScale(1.0, 2.0, 1.0).setParent(this.cube.transform);
            this.back.transform.setLocalPosition(0.0, 0.0, -1.5).setLocalEuler(Math.PI * 0.5, 0.0, 0.0).setLocalScale(1.0, 2.0, 1.0).setParent(this.cube.transform);
            this.forward.transform.setLocalPosition(0.0, 0.0, 1.5).setLocalEuler(-Math.PI * 0.5, 0.0, 0.0).setLocalScale(1.0, 2.0, 1.0).setParent(this.cube.transform);

            this.right.renderer!.material!.setColor(egret3d.Color.RED);
            this.top.renderer!.material!.setColor(egret3d.Color.GREEN);
            this.forward.renderer!.material!.setColor(egret3d.Color.BLUE);

            this.gameObject.transform.setLocalScale(0.01);
        }

        public update() {
            const stage = egret3d.stage;
            const camera = egret3d.Camera.editor;
            const scenePosition = egret3d.Vector3.create(stage.screenSize.w - 50.0, 50.0, 0.0);
            stage.screenToStage(scenePosition, scenePosition);
            camera.calcWorldPosFromScreenPos(scenePosition, scenePosition);

            this.gameObject.transform.position = scenePosition;
            this.gameObject.transform.lookAt(camera.transform);
        }
    }
}