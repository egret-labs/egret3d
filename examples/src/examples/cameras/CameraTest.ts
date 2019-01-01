namespace examples {

    export class CameraTest {

        async start() {
            // Load resource config.
            await RES.loadConfig("default.res.json", "resource/");
            // Create camera.
            egret3d.Camera.main;

            { // Create light.
                const gameObject = paper.GameObject.create("Light");
                gameObject.transform.setLocalPosition(1.0, 10.0, -1.0);
                gameObject.transform.lookAt(egret3d.Vector3.ZERO);

                const light = gameObject.addComponent(egret3d.DirectionalLight);
                light.intensity = 0.5;
            }

            paper.GameObject.create("WorldToStageTest")
                .addComponent(egret3d.Egret2DRenderer).gameObject
                .addComponent(WorldToStageTest);

            paper.GameObject.create("StageToWorldTest")
                .addComponent(StageToWorldTest);
        }
    }

    class WorldToStageTest extends paper.Behaviour {
        private readonly _worldToStage: paper.GameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.SPHERE, "WorldToStage");
        private readonly _stageToWorld: paper.GameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.TORUS, "StageToWorld");
        private readonly _shapeA: egret.Shape = new egret.Shape();
        private readonly _shapeB: egret.Shape = new egret.Shape();

        public onAwake() {
            this._worldToStage.renderer!.material = egret3d.DefaultMaterials.MESH_LAMBERT;
            this._stageToWorld.renderer!.material = egret3d.DefaultMaterials.MESH_LAMBERT;

            this._shapeA.graphics.lineStyle(2, 0x000000, 1);
            this._shapeA.graphics.drawCircle(0.0, 0.0, 50.0);
            (this.gameObject.renderer as egret3d.Egret2DRenderer).stage.addChild(this._shapeA);
            (this.gameObject.renderer as egret3d.Egret2DRenderer).stage.addChild(this._shapeB);
        }

        public onUpdate() {
            // WorldToStage.
            const position = egret3d.Camera.main.worldToStage(this._worldToStage.transform.position).release();
            this._shapeA.x = position.x;
            this._shapeA.y = position.y;

            // StageToWorld.
            position.z = 10.0;
            egret3d.Camera.main.stageToWorld(position, position);
            this._stageToWorld.transform.position = position;

            this._shapeB.graphics.clear();
            this._shapeB.graphics.lineStyle(2, 0x000000, 1);
            this._shapeB.graphics.drawRect(10.0, 10.0, egret3d.stage.viewport.w - 20.0, egret3d.stage.viewport.h - 20.0);
        }
    }

    class StageToWorldTest extends paper.Behaviour {
        // @paper.editor.property(paper.editor.EditType.VECTOR3) TODO
        public readonly stagePosition: egret3d.Vector3 = egret3d.Vector3.create();

        public onAwake() {
            for (let i = 0, l = 100; i < l; ++i) {
                const line = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.LINE_Y, `Line_${i}`);
                line.transform.parent = this.gameObject.transform;
            }
        }

        public onUpdate() {
            const backupZ = this.stagePosition.z;
            const camera = egret3d.Camera.main;

            for (let i = 0, l = 100; i < l; ++i) {
                const line = this.gameObject.transform.find(`Line_${i}`);
                if (!line) {
                    continue;
                }

                this.stagePosition.z = camera.near + camera.far * i / l + backupZ;

                // camera.stageToWorld(this.stagePosition, line.transform.position).update();
                const position = line.transform.position;
                camera.stageToWorld(this.stagePosition, position);
                position.update();

                line.transform.rotation = camera.transform.rotation;
            }

            this.stagePosition.z = backupZ;
        }
    }
}