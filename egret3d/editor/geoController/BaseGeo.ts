namespace paper.editor {
    export class BaseGeo {

        public editorModel: EditorModel;

        public geo: GameObject;

        private baseColor: egret3d.Material;

        private forward = new egret3d.Vector3(0, 0, 1);
        private up = new egret3d.Vector3(0, 1, 0);
        private right = new egret3d.Vector3(1, 0, 0);

        constructor() {
            this.onSet();
            if (this.geo) {
                if (this.geo.getComponent(egret3d.MeshRenderer))
                    this.baseColor = this.geo.getComponent(egret3d.MeshRenderer).materials[0]
            }
        }

        public onSet() {

        }
        public isPressed() {

        }
        public changeColor(color: string) {
            if (color == "origin") {
                this.geo.getComponent(egret3d.MeshRenderer).materials = [this.baseColor]
            } else if (color == "yellow") {
                let mat = new egret3d.Material(egret3d.DefaultShaders.GIZMOS_COLOR);
                mat.setVector4v("_Color", [0.9, 0.9, 0.7, 0.8]);
                this.geo.getComponent(egret3d.MeshRenderer).materials = [mat]
            }
        }

        public _createAxis(color: egret3d.Vector4, type: number): GameObject {
            let gizmoAxis = new paper.GameObject("", "", Application.sceneManager.editorScene);

            let mesh = gizmoAxis.addComponent(egret3d.MeshFilter);
            switch (type) {
                case 0:
                    mesh.mesh = egret3d.DefaultMeshes.CUBE;
                    break;
                case 1:
                    mesh.mesh = egret3d.DefaultMeshes.CIRCLE_LINE;
                    break;
                case 2:
                    mesh.mesh = egret3d.DefaultMeshes.CUBE;
                    break;
            }
            let renderer = gizmoAxis.addComponent(egret3d.MeshRenderer);
            let mat = new egret3d.Material(egret3d.DefaultShaders.GIZMOS_COLOR);
            mat.setVector4v("_Color", [color.x, color.y, color.z, color.w]);
            renderer.materials = [mat];
            return gizmoAxis;
        }

    }


    export class GeoContainer extends BaseGeo {
        private geos: BaseGeo[] = []

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
        changeType(type: string) {
            this.geos = []
            switch (type) {
                case "position":
                    {
                        let x = new xAxis
                        let y = new yAxis
                        let z = new zAxis
                        this.geos.push(x, y, z)
                    }
                    break;
                case "rotation":
                    {
                        let x = new xRot
                        let y = new yRot
                        let z = new zRot
                        this.geos.push(x, y, z)
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
                geo.geo.transform.setParent(this.geo.transform)
            }
            console.log(this.geos)
        }
    }
}