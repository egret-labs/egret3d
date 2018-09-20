namespace paper.editor {
    let helpVec3_1 = new egret3d.Vector3();
    let helpVec3_2 = new egret3d.Vector3();
    let helpVec3_3 = new egret3d.Vector3();
    let helpQuat_1 = new egret3d.Quaternion();
    let helpQuat_2 = new egret3d.Quaternion();

    @paper.executeInEditMode
    export class Controller extends paper.Behaviour {

        private _modeCanChange: boolean = true;
        private _isEditing: boolean = false;
        public selectedGameObjs: GameObject[] = [];

        private _cameraObject: paper.GameObject
        private bindMouse: egret3d.MouseDevice;
        private bindKeyboard: egret3d.KeyboardDevice;
        public get onGeoControll() {
            return this.mainGeo.onGeoControll
        }
        private mainGeo: GeoContainer;
        private get controller() {
            return this.mainGeo.geo;
        }

        private _editorModel: EditorModel;
        public set editorModel(editorModel: EditorModel) {
            this._editorModel = editorModel
            this.mainGeo.editorModel = editorModel
            this.selectGameObjects([])
            this.addEventListener();
            this.changeEditType('position')
        }
        public get editorModel() {
            return this._editorModel;
        }

        private geoCtrlMode: string = 'world';
        private geoCtrlType: string;
        private coord: GameObject
        constructor() {
            super();
            this.mainGeo = new GeoContainer();
            this.coord = new GameObject()
            this.bindMouse = egret3d.InputManager.mouse;
            this.bindKeyboard = egret3d.InputManager.keyboard;
            this._cameraObject = Application.sceneManager.editorScene.find("EditorCamera");
            this._oldTransform = egret3d.Vector3.getDistance(this.controller.transform.getLocalPosition(), this.gameObject.transform.getLocalPosition());

        }

        public onUpdate() {
            if (!this.editorModel) {
                return;
            }
            this.drawCoord();
            this.geoChangeByCamera();
            this.inputUpdate();
            if (this._isEditing) {
                (this.geoCtrlMode == "world" || this.selectedGameObjs.length > 1) ? this.updateInWorldMode() : this.updateInLocalMode();
            }
            if (this.bindMouse.wasReleased(0)) {
                this.mainGeo.wasReleased(this.selectedGameObjs);
            }
        }

        private updateInLocalMode() {
            let len = this.selectedGameObjs.length;
            if (len <= 0) return;


            let camera = this._cameraObject.getComponent(egret3d.Camera);
            if (this.bindMouse.wasPressed(0) && !this.bindKeyboard.isPressed('ALT')) {
                let ray = camera.createRayByScreen(this.bindMouse.position.x, this.bindMouse.position.y);
                this.mainGeo.wasPressed_local(ray, this.selectedGameObjs)
            }
            else if (this.bindMouse.isPressed(0) && !this.bindKeyboard.isPressed('ALT')) {
                let ray = camera.createRayByScreen(this.bindMouse.position.x, this.bindMouse.position.y);
                this.mainGeo.isPressed_local(ray, this.selectedGameObjs)
            }
            else {
                this.mouseRayCastUpdate();
            }

        }
        private updateInWorldMode() {
            let len = this.selectedGameObjs.length;
            if (len <= 0) return;
            let camera = this._cameraObject.getComponent(egret3d.Camera);
            if (this.bindMouse.wasPressed(0) && !this.bindKeyboard.isPressed('ALT')) {
                let ray = camera.createRayByScreen(this.bindMouse.position.x, this.bindMouse.position.y);
                this.mainGeo.wasPressed_world(ray, this.selectedGameObjs)
            }
            else if (this.bindMouse.isPressed(0) && !this.bindKeyboard.isPressed('ALT')) {
                let ray = camera.createRayByScreen(this.bindMouse.position.x, this.bindMouse.position.y);
                this.mainGeo.isPressed_world(ray, this.selectedGameObjs)
            }
            else {
                this.mouseRayCastUpdate();
            }

        }

        private _oldResult: BaseGeo
        private mouseRayCastUpdate() {
            //变色逻辑
            let camera = this._cameraObject.getComponent(egret3d.Camera);
            let ray = camera.createRayByScreen(this.bindMouse.position.x, this.bindMouse.position.y);
            const result = this.mainGeo.checkIntersect(ray)
            if (this._oldResult != result) {
                if (this._oldResult) {
                    if (this._oldResult.geo) {
                        this._oldResult.changeColor("origin")
                    }
                }
                this._oldResult = result
                if (result) {
                    result.changeColor("yellow")
                }
            }
        }

        private _oldTransform: any//TODO
        private geoChangeByCamera() {
            //控制杆大小随镜头远近变化
            var dis1;
            var delta;
            dis1 = egret3d.Vector3.getDistance(this.controller.transform.getLocalPosition(), this.gameObject.transform.getLocalPosition());
            delta = (dis1 - this._oldTransform) / 20;
            this._oldTransform = egret3d.Vector3.getDistance(this.controller.transform.getLocalPosition(), this.gameObject.transform.getLocalPosition());
            var scale = this.controller.transform.getLocalScale();
            this.controller.transform.setScale(new egret3d.Vector3(scale.x + delta, scale.y + delta, scale.z + delta));

        }

        private inputUpdate() {
            let mouse = this.bindMouse;
            let keyboard = this.bindKeyboard;
            if (keyboard.wasPressed("Q")) {
                if (this.geoCtrlMode == "local") {
                    this.changeEditMode("world")
                    this.editorModel.changeEditMode("world");
                } else {
                    this.changeEditMode("local")
                    this.editorModel.changeEditMode("local");
                }
            }
            if (keyboard.wasPressed("W")) {
                this.changeEditType("position")
                this.editorModel.changeEditType("position");
            }
            if (keyboard.wasPressed("E")) {
                this.changeEditType("rotation")
                this.editorModel.changeEditType("rotation");
            }
            if (keyboard.wasPressed("R")) {
                this.changeEditType("scale")
                this.editorModel.changeEditType("scale");
            }


        }

        private changeEditMode(mode: string) {
            if (!this._modeCanChange) {
                console.log("current mode: " + this.geoCtrlMode);
                return;
            }
            this.geoCtrlMode = mode;
            let len = this.selectedGameObjs.length;
            if (len < 1) return;
            if (this.geoCtrlType != "scale") {
                switch (mode) {
                    case "local":
                        this.controller.transform.setRotation(this.selectedGameObjs[0].transform.getRotation());
                        break;
                    case "world":
                        this.controller.transform.setRotation(0, 0, 0, 1);
                        break;
                    default:
                        break;
                }
            }
            console.log("current mode: " + this.geoCtrlMode);
        }

        private changeEditType(type: string) {
            if (this.geoCtrlType == type) return;
            this.geoCtrlType = type;

            this.editorModel.changeEditType(type)
            if (type == 'scale') {
                this.mainGeo.geo.transform.setRotation(this.selectedGameObjs[0].transform.getRotation())
            }
            if (this.geoCtrlMode == 'world') {
                this.controller.transform.setRotation(0, 0, 0, 1);
            }
            this.mainGeo.changeType(type)
        }
        private addEventListener() {
            this.editorModel.addEventListener(EditorModelEvent.SELECT_GAMEOBJECTS, e => this.selectGameObjects(e.data), this);
            this.editorModel.addEventListener(EditorModelEvent.CHANGE_EDIT_MODE, e => this.changeEditMode(e.data), this);
            this.editorModel.addEventListener(EditorModelEvent.CHANGE_EDIT_TYPE, e => this.changeEditType(e.data), this);
            // this.editorModel.addEventListener(EditorModelEvent.CHANGE_PROPERTY, e => this.changeProperty(e.data), this);

        }
        private selectGameObjects(gameObjs: GameObject[]) {
            if (!gameObjs) { gameObjs = [] }
            this.selectedGameObjs = gameObjs;
            let len = this.selectedGameObjs.length;
            this._modeCanChange = true;
            if (len > 0) {
                this._isEditing = true;
                this.controller.activeSelf = true
                if (len == 1) {
                    // console.log("select: " + this.selectedGameObjs[0].name);
                    this.controller.transform.setPosition(this.selectedGameObjs[0].transform.getPosition());
                    if (this.geoCtrlMode == "local") {
                        this.controller.transform.setRotation(this.selectedGameObjs[0].transform.getRotation());
                    } else if (this.geoCtrlMode == "world") {
                        this.controller.transform.setRotation(0, 0, 0, 1);
                    }
                } else {
                    let ctrlPos = egret3d.Vector3.set(0, 0, 0, helpVec3_3);
                    for (let i = 0; i < len; i++) {
                        // console.log("select: " + i + " " + this.selectedGameObjs[i].name);
                        let obj = this.selectedGameObjs[i];
                        egret3d.Vector3.add(obj.transform.getPosition(), ctrlPos, ctrlPos);
                    }
                    ctrlPos = egret3d.Vector3.scale(ctrlPos, 1 / len);
                    this.controller.transform.setPosition(ctrlPos);
                    this.controller.transform.setRotation(0, 0, 0, 1);
                    this.geoCtrlMode = "world";
                    this._modeCanChange = false;
                }
            } else {
                this._isEditing = false;
                this.controller.activeSelf = false;
            }

        }
        private drawCoord() {
            let nrLine = 100;
            let bia = -0.05;
            let verticesCoord = [];
            let indices = [];
            var dis1;
            var delta;
            dis1 = egret3d.Vector3.getDistance(this.controller.transform.getLocalPosition(), this.gameObject.transform.getLocalPosition());
            delta = (dis1 - this._oldTransform) / 20;
            for (let i = 0, len = 2 * nrLine + 1; i < len; i++) {
                verticesCoord[6 * i] = -nrLine + i;
                verticesCoord[6 * i + 1] = bia;
                verticesCoord[6 * i + 2] = -nrLine;
                verticesCoord[6 * i + 3] = -nrLine + i;
                verticesCoord[6 * i + 4] = bia;
                verticesCoord[6 * i + 5] = nrLine;

                verticesCoord[6 * len + 6 * i] = -nrLine;
                verticesCoord[6 * len + 6 * i + 1] = bia;
                verticesCoord[6 * len + 6 * i + 2] = -nrLine + i;
                verticesCoord[6 * len + 6 * i + 3] = nrLine;
                verticesCoord[6 * len + 6 * i + 4] = bia;
                verticesCoord[6 * len + 6 * i + 5] = -nrLine + i;
            }
            for (let i = 0; i < 8 * nrLine + 1; i++) {
                indices.push(i)
            }
            var mesh = new egret3d.Mesh(nrLine * 8, 8 * nrLine)
            var mat = new egret3d.Material(egret3d.DefaultShaders.LINEDASHED);
            let color1 = new Float32Array([0.3, 0.3, 0.5])
            const funs = mat.glTFTechnique.states.functions;
            const enables = mat.glTFTechnique.states.enable;
            const index = enables.indexOf(gltf.EnableState.DEPTH_TEST);
            if (index < 0) {
                enables.push(gltf.EnableState.DEPTH_TEST);
            }
            funs.depthMask = [true];
            funs.depthFunc = [gltf.DepthFunc.LEQUAL];
            mat.setVector3v(egret3d.ShaderUniformName.Diffuse, color1);
            mesh.setAttributes(gltf.MeshAttributeType.POSITION, verticesCoord)
            mesh.setIndices(indices);
            mesh.glTFMesh.primitives[0].mode = gltf.MeshPrimitiveMode.Lines
            this.coord.getOrAddComponent(egret3d.MeshFilter).mesh = mesh
            this.coord.getOrAddComponent(egret3d.MeshRenderer).materials = [mat]
        }
    }
}