namespace paper.editor {
    export abstract class BaseGeo {

        public editorModel: EditorModel;

        public geo: GameObject;

        private baseColor: egret3d.Material;

        public greyColor: egret3d.Material

        public yellowColor: egret3d.Material

        protected helpVec3_1 = new egret3d.Vector3();
        protected helpVec3_2 = new egret3d.Vector3();
        protected helpVec3_3 = new egret3d.Vector3();
        protected helpQuat_1 = new egret3d.Quaternion();
        protected helpQuat_2 = new egret3d.Quaternion();
        protected forward = new egret3d.Vector3(0, 0, 1);
        protected up = new egret3d.Vector3(0, 1, 0);
        protected right = new egret3d.Vector3(1, 0, 0);
        protected _dragOffset: egret3d.Vector3 = new egret3d.Vector3();
        protected _delta: egret3d.Vector3 = new egret3d.Vector3();
        protected _newPosition: egret3d.Vector3 = new egret3d.Vector3();
        protected _ctrlPos: egret3d.Vector3 = new egret3d.Vector3();
        public _ctrlRot: egret3d.Quaternion = new egret3d.Quaternion();
        protected _dragPlanePoint: egret3d.Vector3 = new egret3d.Vector3();
        protected _dragPlaneNormal: egret3d.Vector3 = new egret3d.Vector3();
        protected _initRotation = new egret3d.Quaternion();
        protected _oldLocalScale = new egret3d.Vector3();

        constructor() {
            this.onSet();
            if (this.geo) {
                if (this.geo.getComponent(egret3d.MeshRenderer))
                    this.baseColor = this.geo.getComponent(egret3d.MeshRenderer).materials[0]
            }
        }

        public onSet() {

        }
        public abstract isPressed_local(ray: egret3d.Ray, selectedGameObjs: GameObject[])
        public abstract wasPressed_local(ray: egret3d.Ray, selectedGameObjs: GameObject[])
        public abstract isPressed_world(ray: egret3d.Ray, selectedGameObjs: GameObject[])
        public abstract wasPressed_world(ray: egret3d.Ray, selectedGameObjs: GameObject[])
        public abstract wasReleased(selectedGameObj: GameObject[])
        public _checkIntersect(ray: egret3d.Ray) {
            const mesh = this.geo.getComponent(egret3d.MeshFilter).mesh
            const temp = mesh.raycast(ray); // RAYCAST
            if (temp) { return this }
        }
        public changeColor(color: string) {
            if (color == "origin") {
                this.geo.getComponent(egret3d.MeshRenderer).materials = [this.baseColor]
            }
            else if (color == "yellow") {
                if (this.yellowColor) {
                    this.geo.getComponent(egret3d.MeshRenderer).materials = [this.greyColor]
                }

                let mat = this.geo.getComponent(egret3d.MeshRenderer).materials[0].clone()

                let color1 = new Float32Array([0.8, 0.8, 0.3])
                let alpha = new Float32Array([0.3])
                mat.setFloatv(egret3d.ShaderUniformName.Opacity, alpha)
                mat.setVector3v(egret3d.ShaderUniformName.Diffuse, color1);

                this.geo.getComponent(egret3d.MeshRenderer).materials = [mat]
            }
            else if (color == "grey") {
                if (this.greyColor) {
                    this.geo.getComponent(egret3d.MeshRenderer).materials = [this.greyColor]
                }
                let mat = this.geo.getComponent(egret3d.MeshRenderer).materials[0].clone()

                let color1 = new Float32Array([0.3, 0.3, 0.3])
                let alpha = new Float32Array([0.2])
                mat.setFloatv(egret3d.ShaderUniformName.Opacity, alpha)
                mat.setVector3v(egret3d.ShaderUniformName.Diffuse, color1);

                this.geo.getComponent(egret3d.MeshRenderer).materials = [mat]

            }
        }

        protected _createAxis(color: egret3d.Vector4, type: number): GameObject {
            let gizmoAxis = new paper.GameObject("", "", Application.sceneManager.editorScene);

            let mesh = gizmoAxis.addComponent(egret3d.MeshFilter);
            switch (type) {
                case 0:
                    mesh.mesh = egret3d.DefaultMeshes.CUBE;
                    break;
                case 1:
                    mesh.mesh = this._createCircleLine();
                    break;
                case 2:
                    mesh.mesh = egret3d.DefaultMeshes.CUBE;
                    break;
                case 3:
                    mesh.mesh = egret3d.DefaultMeshes.PLANE;
                    break;
            }
            let renderer = gizmoAxis.addComponent(egret3d.MeshRenderer);

            let mat = new egret3d.Material(egret3d.DefaultShaders.LINEDASHED);
            let color1 = new Float32Array([color.x, color.y, color.z])
            let alpha = new Float32Array([color.w])
            let technique = mat.glTFTechnique

            const funs = technique.states.functions;
            const enables = technique.states.enable;

            mat.setFloatv(egret3d.ShaderUniformName.Opacity, alpha)
            mat.setVector3v(egret3d.ShaderUniformName.Diffuse, color1);
            mat.setCullFace(false)
            mat.setBlend(gltf.BlendMode.Blend)
            mat.renderQueue = RenderQueue.Overlay
            // funs.depthMask = [true];
            funs.depthFunc = [gltf.DepthFunc.ALWAYS];
            renderer.materials = [mat];
            return gizmoAxis;
        }

        protected _createCircleLine() {
            var vertexCount = 1;
            var triangleFan = [];
            var indices = [];
            for (var angle = 0; angle <= 360; angle += 1) {
                var x = Math.cos(angle / 180.0 * 3.14) / 1.03;
                var y = Math.sin(angle / 180.0 * 3.14) / 1.03;
                var z = 0.0;
                triangleFan.push(x, y, z);

                var x = Math.cos(angle / 180.0 * 3.14);
                var y = Math.sin(angle / 180.0 * 3.14);
                var z = 0.0;
                triangleFan.push(x, y, z);
                vertexCount++;
            }
            console.log(vertexCount)
            for (var angle = 0; angle <= vertexCount * 2 - 3; angle += 1) {
                indices.push(angle, angle + 1, angle + 2);
            }
            var mesh = new egret3d.Mesh(vertexCount * 2, (vertexCount * 2 - 3) * 3);
            mesh.setIndices(indices);
            mesh.setAttributes(gltf.MeshAttributeType.POSITION, triangleFan)
            return mesh
        }

        protected createFan(maxAngle: number, _mesh?: egret3d.MeshFilter) {
            if (_mesh) {
                mesh = _mesh
            }
            var mesh;
            var vertexCount = 1;
            var triangleFan = [0, 0, 0];
            var indices = [];
            if (maxAngle >= 0) {
                for (var angle = 0; angle <= maxAngle; angle += 1) {
                    var x = Math.cos(angle / 180.0 * 3.14);
                    var y = Math.sin(angle / 180.0 * 3.14);
                    var z = 0.0;
                    triangleFan.push(x, y, z);
                    vertexCount++;
                }
            } else {
                for (var angle = 0; angle >= maxAngle; angle -= 1) {
                    var x = Math.cos(angle / 180.0 * 3.14);
                    var y = Math.sin(angle / 180.0 * 3.14);
                    var z = 0.0;
                    triangleFan.push(x, y, z);
                    vertexCount++;
                }

            }

            console.log(vertexCount)
            for (var angle = 0; angle <= (vertexCount - 1) * 3; angle += 1) {
                indices.push(0, angle, angle + 1);
            }

            mesh = new egret3d.Mesh(vertexCount, (vertexCount - 1) * 3);
            mesh.setIndices(indices);
            mesh.setAttributes(gltf.MeshAttributeType.POSITION, triangleFan)
            return mesh
        }
    }



}