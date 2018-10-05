namespace InputTest {
    export async function start() {
        // Load resource config.
        await RES.loadConfig("default.res.json", "resource/");
        // Create camera.
        egret3d.Camera.main;

        paper.GameObject.globalGameObject.addComponent(Updater);
    }

    class Updater extends paper.Behaviour {
        private readonly _cubeLeft: paper.GameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE);
        private readonly _cubeMiddle: paper.GameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE);
        private readonly _cubeRight: paper.GameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE);
        private readonly _cubeBack: paper.GameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE);
        private readonly _cubeForward: paper.GameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE);
        private readonly _cubeEraser: paper.GameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE);
        private readonly _holdCubes: { [key: string]: paper.GameObject } = {};

        public onAwake() {
            this._cubeLeft.transform.setLocalPosition(-2.0, 0.0, 0.0);
            this._cubeMiddle.transform.setLocalPosition(0.0, 0.0, 0.0);
            this._cubeRight.transform.setLocalPosition(2.0, 0.0, 0.0);

            this._cubeBack.transform.setLocalPosition(-2.0, -2.0, 0.0);
            this._cubeForward.transform.setLocalPosition(0.0, -2.0, 0.0);
            this._cubeEraser.transform.setLocalPosition(2.0, -2.0, 0.0);
        }

        public onUpdate() {
            const camera = egret3d.Camera.main;
            const inputCollecter = this.gameObject.getComponent(egret3d.InputCollecter)!;
            const defaultPointer = inputCollecter.getPointer();
            //
            if (inputCollecter.isPointerDown()) {
                this._cubeLeft.transform.setLocalScale(2.0, 2.0, 2.0);
            }
            else if (inputCollecter.isPointerHold()) {
                this._cubeLeft.transform.rotate(0.0, 0.05, 0.0);
            }
            else if (inputCollecter.isPointerUp()) {
                this._cubeLeft.transform.setLocalScale(1.0, 1.0, 1.0);
                this._cubeLeft.transform.setLocalEuler(0.0, 0.0, 0.0);
            }
            //
            if (inputCollecter.isPointerDown(1, egret3d.PointerButtonsType.MiddleMouse)) {
                this._cubeMiddle.transform.setLocalScale(2.0, 2.0, 2.0);
            }
            else if (inputCollecter.isPointerHold(1, egret3d.PointerButtonsType.MiddleMouse)) {
                this._cubeMiddle.transform.rotate(0.0, 0.05, 0.0);
            }
            else if (inputCollecter.isPointerUp(1, egret3d.PointerButtonsType.MiddleMouse)) {
                this._cubeMiddle.transform.setLocalScale(1.0, 1.0, 1.0);
                this._cubeMiddle.transform.setLocalEuler(0.0, 0.0, 0.0);
            }
            //
            if (inputCollecter.isPointerDown(1, egret3d.PointerButtonsType.RightMouse)) {
                this._cubeRight.transform.setLocalScale(2.0, 2.0, 2.0);
                this._cubeLeft.transform.setLocalEuler(0.0, 0.0, 0.0);
            }
            else if (inputCollecter.isPointerHold(1, egret3d.PointerButtonsType.RightMouse)) {
                this._cubeRight.transform.rotate(0.0, 0.05, 0.0);
            }
            else if (inputCollecter.isPointerUp(1, egret3d.PointerButtonsType.RightMouse)) {
                this._cubeRight.transform.setLocalScale(1.0, 1.0, 1.0);
                this._cubeRight.transform.setLocalEuler(0.0, 0.0, 0.0);
            }
            //
            if (inputCollecter.isPointerDown(1, egret3d.PointerButtonsType.Back)) {
                this._cubeBack.transform.setLocalScale(2.0, 2.0, 2.0);
            }
            else if (inputCollecter.isPointerHold(1, egret3d.PointerButtonsType.Back)) {
                this._cubeBack.transform.rotate(0.0, 0.05, 0.0);
            }
            else if (inputCollecter.isPointerUp(1, egret3d.PointerButtonsType.Back)) {
                this._cubeBack.transform.setLocalScale(1.0, 1.0, 1.0);
                this._cubeBack.transform.setLocalEuler(0.0, 0.0, 0.0);
            }
            //
            if (inputCollecter.isPointerDown(1, egret3d.PointerButtonsType.Forward)) {
                this._cubeForward.transform.setLocalScale(2.0, 2.0, 2.0);
            }
            else if (inputCollecter.isPointerHold(1, egret3d.PointerButtonsType.Forward)) {
                this._cubeForward.transform.rotate(0.0, 0.05, 0.0);
            }
            else if (inputCollecter.isPointerUp(1, egret3d.PointerButtonsType.Forward)) {
                this._cubeForward.transform.setLocalScale(1.0, 1.0, 1.0);
                this._cubeForward.transform.setLocalEuler(0.0, 0.0, 0.0);
            }
            //
            if (inputCollecter.isPointerDown(1, egret3d.PointerButtonsType.PenEraser)) {
                this._cubeEraser.transform.setLocalScale(2.0, 2.0, 2.0);
            }
            else if (inputCollecter.isPointerHold(1, egret3d.PointerButtonsType.PenEraser)) {
                this._cubeEraser.transform.rotate(0.0, 0.05, 0.0);
            }
            else if (inputCollecter.isPointerUp(1, egret3d.PointerButtonsType.PenEraser)) {
                this._cubeEraser.transform.setLocalScale(1.0, 1.0, 1.0);
                this._cubeEraser.transform.setLocalEuler(0.0, 0.0, 0.0);
            }

            if (inputCollecter.holdPointers.length > 0) {
                for (const pointer of inputCollecter.holdPointers) {
                    if (!(pointer.event!.pointerId in this._holdCubes)) {
                        this._holdCubes[pointer.event!.pointerId] = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE);
                    }

                    const holdCube = this._holdCubes[pointer.event!.pointerId];
                    holdCube.activeSelf = true;

                    const ray = camera.createRayByScreen(pointer.position.x, pointer.position.y).release();
                    const plane = egret3d.Plane.create().fromPoint(egret3d.Vector3.ZERO, egret3d.Vector3.UP).release();
                    const raycastInfo = egret3d.RaycastInfo.create().release();

                    if (plane.raycast(ray, raycastInfo)) {
                        holdCube.transform.localPosition = raycastInfo.position;
                    }
                }
            }
            else {
                for (const k in this._holdCubes) {
                    const holdCube = this._holdCubes[k];
                    holdCube.activeSelf = false;
                }
            }
        }
    }
}