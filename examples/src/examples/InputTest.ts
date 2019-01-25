namespace examples {

    export class InputTest implements Example {

        async start() {
            // Load resource config.
            await RES.loadConfig("default.res.json", "resource/");

            paper.GameObject.globalGameObject.addComponent(Updater);
        }
    }

    class Updater extends paper.Behaviour {
        private readonly _cubeLeft: paper.GameObject = egret3d.creater.createGameObject("Left Mouse Or Touch");
        private readonly _cubeMiddle: paper.GameObject = egret3d.creater.createGameObject("Middle Moush");
        private readonly _cubeRight: paper.GameObject = egret3d.creater.createGameObject("Right Mouse");
        private readonly _cubeBack: paper.GameObject = egret3d.creater.createGameObject("Back");
        private readonly _cubeForward: paper.GameObject = egret3d.creater.createGameObject("Forward");
        private readonly _cubeEraser: paper.GameObject = egret3d.creater.createGameObject("Eraser");
        private readonly _holdCubes: { [key: string]: paper.GameObject } = {};

        public onAwake() {
            //
            createGridRoom();

            for (const transform of [
                this._cubeLeft.transform.setLocalPosition(-2.0, 0.5, 1.0),
                this._cubeMiddle.transform.setLocalPosition(0.0, 0.5, 1.0),
                this._cubeRight.transform.setLocalPosition(2.0, 0.5, 1.0),
                this._cubeBack.transform.setLocalPosition(-2.0, 0.5, -1.0),
                this._cubeForward.transform.setLocalPosition(0.0, 0.5, -1.0),
                this._cubeEraser.transform.setLocalPosition(2.0, 0.5, -1.0),
            ]) {
                const meshFilter = transform.gameObject.getComponent(egret3d.MeshFilter)!;
                const renderer = transform.gameObject.renderer!;
                meshFilter.mesh = egret3d.DefaultMeshes.CUBE;
                renderer.castShadows = true;
                renderer.receiveShadows = true;
                renderer.material = egret3d.DefaultMaterials.MESH_PHONG;
            }
        }

        public onUpdate() {
            const camera = egret3d.Camera.main;
            const inputCollecter = this.gameObject.getComponent(egret3d.InputCollecter)!;
            const defaultPointer = inputCollecter.defaultPointer;
            // Mouse wheel.
            const mouseWheel = inputCollecter.mouseWheel * 0.5;
            if (mouseWheel !== 0.0) {
                this._cubeLeft.transform.rotate(mouseWheel, 0.0, 0.0);
                this._cubeMiddle.transform.rotate(mouseWheel, 0.0, 0.0);
                this._cubeRight.transform.rotate(mouseWheel, 0.0, 0.0);
                this._cubeBack.transform.rotate(mouseWheel, 0.0, 0.0);
                this._cubeForward.transform.rotate(mouseWheel, 0.0, 0.0);
                this._cubeEraser.transform.rotate(mouseWheel, 0.0, 0.0);
            }
            // Mouse key or default touch.
            if (defaultPointer.isDown()) {
                this._cubeLeft.transform.translate(0.0, 1.0, 0.0);
            }
            else if (defaultPointer.isHold()) {
                this._cubeLeft.transform.rotate(0.0, 0.05, 0.0);
            }
            else if (defaultPointer.isUp()) {
                this._cubeLeft.transform.translate(0.0, -1.0, 0.0).setLocalEuler(0.0, 0.0, 0.0);
            }
            //
            if (defaultPointer.isDown(egret3d.PointerButtonsType.MiddleMouse)) {
                this._cubeMiddle.transform.translate(0.0, 1.0, 0.0);
            }
            else if (defaultPointer.isHold(egret3d.PointerButtonsType.MiddleMouse)) {
                this._cubeMiddle.transform.rotate(0.0, 0.05, 0.0);
            }
            else if (defaultPointer.isUp(egret3d.PointerButtonsType.MiddleMouse)) {
                this._cubeMiddle.transform.translate(0.0, -1.0, 0.0).setLocalEuler(0.0, 0.0, 0.0);
            }
            //
            if (defaultPointer.isDown(egret3d.PointerButtonsType.RightMouse)) {
                this._cubeRight.transform.translate(0.0, 1.0, 0.0);
            }
            else if (defaultPointer.isHold(egret3d.PointerButtonsType.RightMouse)) {
                this._cubeRight.transform.rotate(0.0, 0.05, 0.0);
            }
            else if (defaultPointer.isUp(egret3d.PointerButtonsType.RightMouse)) {
                this._cubeRight.transform.translate(0.0, -1.0, 0.0).setLocalEuler(0.0, 0.0, 0.0);
            }
            //
            if (defaultPointer.isDown(egret3d.PointerButtonsType.Back)) {
                this._cubeBack.transform.translate(0.0, 1.0, 0.0);
            }
            else if (defaultPointer.isHold(egret3d.PointerButtonsType.Back)) {
                this._cubeBack.transform.rotate(0.0, 0.05, 0.0);
            }
            else if (defaultPointer.isUp(egret3d.PointerButtonsType.Back)) {
                this._cubeBack.transform.translate(0.0, -1.0, 0.0).setLocalEuler(0.0, 0.0, 0.0);
            }
            //
            if (defaultPointer.isDown(egret3d.PointerButtonsType.Forward)) {
                this._cubeForward.transform.translate(0.0, 1.0, 0.0);
            }
            else if (defaultPointer.isHold(egret3d.PointerButtonsType.Forward)) {
                this._cubeForward.transform.rotate(0.0, 0.05, 0.0);
            }
            else if (defaultPointer.isUp(egret3d.PointerButtonsType.Forward)) {
                this._cubeForward.transform.translate(0.0, -1.0, 0.0).setLocalEuler(0.0, 0.0, 0.0);
            }
            //
            if (defaultPointer.isDown(egret3d.PointerButtonsType.PenEraser)) {
                this._cubeEraser.transform.translate(0.0, 1.0, 0.0);
            }
            else if (defaultPointer.isHold(egret3d.PointerButtonsType.PenEraser)) {
                this._cubeEraser.transform.rotate(0.0, 0.05, 0.0);
            }
            else if (defaultPointer.isUp(egret3d.PointerButtonsType.PenEraser)) {
                this._cubeEraser.transform.translate(0.0, -1.0, 0.0).setLocalEuler(0.0, 0.0, 0.0);
            }
            // Muti-touch.
            for (const pointer of inputCollecter.getDownPointers()) {
                const pointerId = pointer.event!.pointerId;

                if (!(pointerId in this._holdCubes)) {
                    const cube = egret3d.creater.createGameObject(`Touch ${pointerId}`, {
                        mesh: egret3d.DefaultMeshes.CUBE,
                        material: egret3d.DefaultMaterials.MESH_PHONG,
                        castShadows: true,
                        receiveShadows: true,
                    });
                    this._holdCubes[pointerId] = cube;
                }
            }

            for (const pointer of inputCollecter.getHoldPointers()) {
                const cube = this._holdCubes[pointer.event!.pointerId];

                if (cube) {
                    const ray = camera.createRayByScreen(pointer.position.x, pointer.position.y).release();
                    const plane = egret3d.Plane.create(egret3d.Vector3.UP, -2.5).release();
                    const raycastInfo = egret3d.RaycastInfo.create().release();

                    if (plane.raycast(ray, raycastInfo)) {
                        cube.transform.localPosition = raycastInfo.position;
                    }
                }
            }

            for (const pointer of inputCollecter.getUpPointers()) {
                const pointerId = pointer.event!.pointerId;
                const cube = this._holdCubes[pointerId];

                if (cube) {
                    cube.destroy();
                    delete this._holdCubes[pointerId];
                }
            }
            // Key board.
            for (const key of inputCollecter.getDownKeys()) {
                console.log("KeyDown", key.event!.code, key.event!.key, key.event!.keyCode);
            }

            for (const key of inputCollecter.getUpKeys()) {
                console.log("KeyUp", key.event!.code, key.event!.key, key.event!.keyCode);
            }
        }
    }
}
