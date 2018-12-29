namespace examples {
    export class BehaviourLifeCycleTest extends BaseExample {

        async start() {
            // Create camera.
            egret3d.Camera.main;

            {
                const gameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE, "CubeA");
                gameObject.transform.setLocalPosition(2.0, 0.0, 0.0);
                gameObject.activeSelf = false;

                gameObject.addComponent(BehaviourTest);
                gameObject.addComponent(BehaviourTest);
            }

            {
                const gameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE, "CubeB");
                gameObject.transform.setLocalPosition(-2.0, 0.0, 0.0);

                gameObject.addComponent(BehaviourTest);
                gameObject.addComponent(BehaviourTest);
            }
        }
    }

    @paper.allowMultiple
    class BehaviourTest extends paper.Behaviour {
        public onAwake() {
            console.info("onAwake", this.gameObject.name);
        }

        public onEnable() {
            console.info("onEnable", this.gameObject.name);
        }

        public onStart() {
            console.info("onStart", this.gameObject.name);
        }

        public onFixedUpdate(ct: number, tt: number) {
            // console.info("onFixedUpdate", ct, tt);
        }

        public onUpdate(deltaTime: number): any {
            // console.info("onUpdate");
        }

        public onLateUpdate(deltaTime: number) {
            // console.info("onLateUpdate");
        }

        public onDisable() {
            console.info("onDisable", this.gameObject.name);
        }

        public onDestroy() {
            console.info("onDestroy", this.gameObject.name);
        }
    }
}