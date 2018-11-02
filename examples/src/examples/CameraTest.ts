namespace examples {

    export class CameraTest {

        async start() {
            // Load resource config.
            await RES.loadConfig("default.res.json", "resource/");
            // Create camera.
            egret3d.Camera.main;

            paper.GameObject.create("WorldToStageTest")
                .addComponent(egret3d.Egret2DRenderer).gameObject
                .addComponent(WorldToStageTest);

            egret3d.Camera.main.gameObject.addComponent(StageToWorldTest);
        }
    }

    class WorldToStageTest extends paper.Behaviour {
        private readonly _cube: paper.GameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE, "Cube");
        private readonly _shape: egret.Shape = new egret.Shape();

        public onAwake() {
            this._shape.graphics.lineStyle(2, 0x000000, 1);
            this._shape.graphics.drawCircle(0.0, 0.0, 50.0);
            (this.gameObject.renderer as egret3d.Egret2DRenderer).stage.addChild(this._shape);
        }

        public onUpdate() {
            const stagePosition = egret3d.Camera.main.worldToStage(this._cube.transform.position).release();
            this._shape.x = stagePosition.x;
            this._shape.y = stagePosition.y;
        }
    }

    class StageToWorldTest extends paper.Behaviour {
        @paper.editor.property(paper.editor.EditType.VECTOR3)
        public readonly stagePosition: egret3d.Vector3 = egret3d.Vector3.create();

        public onAwake() {
            this.stagePosition.set(egret3d.stage.size.w * 0.5, egret3d.stage.size.h * 0.5, 0.0);

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