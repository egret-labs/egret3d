namespace paper.editor {
    export class GeoContainer extends BaseGeo {
        private geos: BaseGeo[] = []
        private selectedGeo: BaseGeo
        public get onGeoControll() {
            if (this.selectedGeo) {
                return true
            }
            return false
        }
        constructor() {
            super();
            this.changeType("position")
        }

        onSet() {
            let controller = new paper.GameObject("", "", Application.sceneManager.editorScene);
            controller.activeSelf = false;
            controller.name = "GizmoController";
            controller.tag = "Editor";
            this.geo = controller
        }

        public checkIntersect(ray: egret3d.Ray) {
            for (let item of this.geos) {
                const temp = item._checkIntersect(ray)
                if (temp) { return temp }
            }
        }

        private clear() {
            if (this.geos) {
                for (let item of this.geos) {
                    item.geo.destroy()
                    item.geo = null;
                }
            }
            this.geos = []
        }
        // public clearAll() {
        //     this.clear();
        //     this.selectedGeo = null;
        // }
        changeType(type: string) {
            this.clear();
            switch (type) {
                case "position":
                    {
                        let x = new xAxis
                        let y = new yAxis
                        let z = new zAxis
                        let xy = new xyAxis
                        let xz = new xzAxis
                        let yz = new yzAxis
                        this.geos.push(x, y, z, xy, xz, yz)
                    }
                    break;
                case "rotation":
                    {
                        let ball = new ballRot
                        let x = new xRot
                        let y = new yRot
                        let z = new zRot
                        this.geos.push(x, y, z, ball)
                    }

                    break;
                case "scale":
                    {
                        let x = new xScl
                        let y = new yScl
                        let z = new zScl
                        this.geos.push(x, y, z)
                    }
                    break;
            }
            for (let geo of this.geos) {
                geo.editorModel = this.editorModel
                geo.geo.transform.setParent(this.geo.transform)
            }
        }
        wasPressed_local(ray: egret3d.Ray, selected: any) {
            const result = this.checkIntersect(ray)
            if (result) {
                result.wasPressed_local(ray, selected)
                this.selectedGeo = result

                for (let item of this.geos) {
                    item.changeColor('grey')
                }
                this.selectedGeo.changeColor('yellow')
                return;
            }
            this.selectedGeo = null
            return null;
        }
        isPressed_local(ray: egret3d.Ray, selected: any) {
            if (this.selectedGeo) {
                this.selectedGeo.isPressed_local(ray, selected)
                this.geo.transform.setLocalPosition(selected[0].transform.getPosition())
                this.geo.transform.setLocalRotation(selected[0].transform.getRotation())
            }
        }
        wasPressed_world(ray: egret3d.Ray, selected: any) {
            let ctrlRot = this.geo.transform.getRotation();
            const result = this.checkIntersect(ray)
            if (result) {
                console.log(result.geo.name)
                this._ctrlRot = ctrlRot;
                result.wasPressed_world(ray, selected)
                this.selectedGeo = result

                for (let item of this.geos) {
                    item.changeColor('grey')
                }
                this.selectedGeo.changeColor('yellow')
                return;
            }
            this.selectedGeo = null
            return null;

        }
        isPressed_world(ray: egret3d.Ray, selected: any) {
            if (this.selectedGeo) {
                this.selectedGeo.isPressed_world(ray, selected)
                let len = selected.length
                let ctrlPos = egret3d.Vector3.set(0, 0, 0, this.helpVec3_3);
                for (let i = 0; i < len; i++) {
                    // console.log("select: " + i + " " + this.selectedGameObjs[i].name);
                    let obj = selected[i];
                    egret3d.Vector3.add(obj.transform.getPosition(), ctrlPos, ctrlPos);
                }
                ctrlPos = egret3d.Vector3.scale(ctrlPos, 1 / len);
                if (this.selectedGeo._ctrlRot) {
                    this._ctrlRot.copy(this.selectedGeo._ctrlRot)
                    this.geo.transform.setRotation(this._ctrlRot);
                }
                this.geo.transform.setPosition(ctrlPos);

            }

        }
        wasReleased(selectedGameObjs: GameObject[]) {
            if (this.selectedGeo) {
                this.selectedGeo.wasReleased(selectedGameObjs);
                for (let item of this.geos) {
                    item.changeColor('origin')
                }
                this.selectedGeo = null
            }
        }
    }
}