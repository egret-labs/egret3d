namespace paper.editor {

    const icons = {
        camera: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAIcSURBVFhH7ZbPjtMwEMYj7vAACCFg28Rx4oQmtGnLQo/7Du1pK3Hk2BtSHwYkXoA34C34I7Fozxxoy+6yaocZx9M6u4WkFaA95JN+qu0Z21/riVOnVq1a/0oiaoMXPdlCBxpxG0xaNXlB+vHqIl7Utfo5Jl3LxU2uxpkmmjNp1RTEGfg4kZhOp/eRe8xwOHzqmnjSPXxnpjhBlIEIM5BRb40f96Ch2jCZTO6atGryVQeESjVmqCA/zGNy15/2xuv4xcuBK1N4KBNw445FZugauG/ndKr9GlJRYWBBxcn7LHveHAyOHtC4iJKLbQW0C0IlBRNemH6jTzpSQqouOFQ89iSdibLHcrKKbObYBqhGaC9qc/yaAdnKdMKjoLUe08QpvH7zFsp08fOyMI8N0DHRPqUGRJhXsWr112ME5SwWM73Jp5NTzecvFtg/+XqK0UsQ1vNvG+Ax6nN7bYBN8GPW0HVRZL44h+VqdW2cafcOYYUW9jZAAZb3uHiWxPcfZQae7Wdgmw7wYuEk5r8a8MPNBGa+OIMVGpBRfyu9rI/bL/+OAU/Sy2azOS06m81xgzItoRkmm3l7G2gGr7gwGR8LU+JbLAcvEQ29bIi8L4Li0bEBunR4TK9v2r81QCIDwiQSblwNzifYAMkNW+Dil6A2x/9ogGQvtg8HQn0wS2mxIY5LlV98pRqNRnfG4/HtXcD/CrfM9Fq1at1kOc4vVSG2+aaGzOwAAAAASUVORK5CYII=",
        light: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAPcSURBVFhH3ZdLSNRRFMbn4fuZmtmYZpn0gCx6YbQokBZRq6hVL6xWUdCmICIoIYjaWBDRu3WShhUJLSKIIKISgqBWao9NlIsUwlKn33fnzDij/1HHsU0fHM693z333HPOffxnfNNBMBjcgRpCVjjiX6GwsHAJKhDpjYIAdqLCyEpHxKG8vLwgJyen2rrTR25uboPf7/+Ns31GxTBRAJmZmc2BQKC/rKys0qhpAz+Bt8inUCiUZ5xDsgAIeh5BDzCnzaj0kJ2d3YjDcFZW1imjHJIFkJGRcQf7waKiojqj0gdOH5DRz7y8vLlGeQZA6Vex+DBjLUalhtLS0iJrJoDsl+os4PiGUVqsHu48zVCEcYE+JdAfZF9qVAKS+XfgoM1nch+LnK2oqMg3OgYWvIhcsu44VFVV5RLAXYI9alQMBQUFsxm7prPk5dtBhwejdu03hr04Uonj4TftKy4ursVmP/bH0LvZmlgVQMwOBDlDh/D53bbmWklJSbGNeYMJW3D6kWaYBZ4Q/bLIiM+nM8BYG85G6Gr/ndD/owy5doWyE6joBmzf0Ayz8EsSXBsZmRqycHgCx/1MPieCyKtpdyNhgnTCluh2hHGuIFS519EgsGul/w27g3THPWRTAoemyg6OH2fPtLgWoz9OqI4CUNVu0Ve1QmxVidppgywaUUkXjwplVyWGsF9If+ZA5i3Knuw8F46KApCmEkfQKaEH+ewhWxG9xw+13zQnFJ0DBYl2DxHzDqO8/D5HRsGEVuTeWGFovcZx1D6VAKJVQl+gr8pt9/KLXNb4lIGjMzpgkwWhmyGN3V70zMHeguGJDqECtEP4k9M/Cy59cMe3ktUCtcnqKs7D+fn5bq+hEhYXrzZzjqN1DdcQcIPaKcOe2g6aKqfbr5qamhy4TnHKVA+QSh4V8ez/dbR7iml3Eugw+ibBzRE3KfRBYb+bmfhLwuLNY36IBFn4KGO6NfEVeI/tLhlEoS8ivq5gO8R4H4HoagYjox7AwXIMu5mgTDrIqtaGHOwTG31S/aoSduv0RBvnqhT/PRDYitX4fUFTt6NL35PIyBhoIkE8J8NtRiWAxR4x/tS642DV+4BcNCoefhJqYv5j2ql/F5i8GaV9PxlhXECbUM+QRY4AcLep4CC/pBcbNSMIUsIupFdZGuf5k4xTX0kAAwRy36j0QdkO6Fyg9xjl4BWAwOKnUSPcFFUoPegPBpl/RV7RTdi7ZAHoJxf2Xxh/TXd6vwOiIOt6HPWQzUajYkgWgMC8JsbfJT3xqaCuri7bmgmYKACgzDMizX+EuFswc39A/kfE/0RPAp/vL7M1A0/aWSCCAAAAAElFTkSuQmCC"
    };

    //只有编辑模式可以执行，编辑相机
    @paper.executeInEditMode
    export class Gizmo extends paper.Behaviour {
        private static enabled: boolean = false;
        private static webgl: WebGLRenderingContext;
        private static camera: egret3d.Camera;

        public onStart() {
            this.nrLine = 100;
            this._oldTransform = egret3d.Vector3.getLength(this.gameObject.transform.getLocalPosition());
        }
        public static Enabled() {
            this.webgl = egret3d.WebGLCapabilities.webgl;
            this.camera = Application.sceneManager.editorScene.find("EditorCamera").getComponent(egret3d.Camera);

            this.initPrg();
            this.lineVertexBuffer = this.webgl.createBuffer();
            this.setVertices();
            this.initIconTexture();

            this.camera.gameObject.addComponent(Gizmo)

        }
        public static setGameObj(obj: GameObject) {
            this.gameObj = obj
        }
        private static gameObj: GameObject
        public static DrawStroke() {
            if (!this.enabled) return;
            if (!this.gameObj) return;
            let obj = this.gameObj
            let gl = this.webgl
            let prg = this.glProgram_stroke;
            let mesh = obj.getComponent(egret3d.MeshFilter).mesh
            let position = mesh.getAttributes('POSITION')
            let normal = mesh.getAttributes('NORMAL')
            let indices = mesh.getIndices()
            let vertexCount = position.length / 3

            let vertexBuffer = gl.createBuffer();
            let normalBuffer = gl.createBuffer();
            let indiceBuffer = gl.createBuffer();

            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
            gl.bufferData(gl.ARRAY_BUFFER, position, gl.STATIC_DRAW)
            gl.vertexAttribPointer(gl.getAttribLocation(prg.prg, 'aPosition'), 3, gl.FLOAT, false, 0, 0)
            gl.enableVertexAttribArray(gl.getAttribLocation(prg.prg, 'aPosition'))

            gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer)
            gl.bufferData(gl.ARRAY_BUFFER, normal, gl.STATIC_DRAW)
            gl.vertexAttribPointer(gl.getAttribLocation(prg.prg, 'aNormal'), 3, gl.FLOAT, false, 0, 0)
            gl.enableVertexAttribArray(gl.getAttribLocation(prg.prg, 'aNormal'))

            this.setMVPMatrix();
            prg.setMatrix("mvpMat", this.mvpMatrix);
            prg.setColor("lineColor", [1, 1, 1, 1]);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indiceBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);


            gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0)
            console.log(position, normal)
        }
        public static DrawIcon(path: string, pos: egret3d.Vector3, size: number, color?: egret3d.Color) {
            if (!this.enabled) return;

            let gl = this.webgl;
            let prg = this.glProgram_icon;

            this.verticesLine = [pos.x, pos.y, pos.z];

            prg.use();
            let prgVertexPosition = gl.getAttribLocation(prg.prg, "aVertexPosition");

            gl.bindBuffer(gl.ARRAY_BUFFER, this.lineVertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.verticesLine), gl.STATIC_DRAW);
            gl.vertexAttribPointer(prgVertexPosition, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(prgVertexPosition);

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.textures[path]);

            if (color) {
                prg.setBool("hasColor", true);
                prg.setColor("iconColor", [color.r, color.g, color.b, color.a]);
            } else {
                prg.setBool("hasColor", false);
                prg.setColor("iconColor", [1, 0, 0, 1]);
            }

            prg.setTexture("PointTexture", 0);
            this.setMVPMatrix();
            prg.setMatrix("mvpMat", this.mvpMatrix);
            prg.setFloat("pointSize", size);

            gl.drawArrays(gl.POINTS, 0, 1);
        }

        private static verticesLine: number[];
        private static lineVertexBuffer;

        // public static DrawLine(posStart: egret3d.Vector3, posEnd: egret3d.Vector3, size?: number, color?: number[]) {
        //     if (!this.enabled) return;

        //     let gl = this.webgl;
        //     let prg = this.glProgram_line;
        //     gl.enable(gl.DEPTH_TEST);

        //     this.verticesLine = [
        //         posStart.x, posStart.y, posStart.z,
        //         posEnd.x, posEnd.y, posEnd.z
        //     ];
        //     gl.lineWidth(size || 1);
        //     prg.use();
        //     let prgVertexPosition = gl.getAttribLocation(prg.prg, "aVertexPosition");

        //     gl.bindBuffer(gl.ARRAY_BUFFER, this.lineVertexBuffer);
        //     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.verticesLine), gl.STATIC_DRAW);
        //     gl.vertexAttribPointer(prgVertexPosition, 3, gl.FLOAT, false, 0, 0);
        //     gl.enableVertexAttribArray(prgVertexPosition);
        //     this.setMVPMatrix();
        //     prg.setMatrix("mvpMat", this.mvpMatrix);
        //     prg.setColor("lineColor", color);

        //     gl.drawArrays(gl.LINES, 0, 2);
        // }

        private _oldTransform
        private nrLine
        public static DrawCoord() {
            let gl = Gizmo.webgl;
            let prg = Gizmo.glProgram_line;

            let nrLine = this.nrLine
            if (!this.enabled) return;
            gl.enable(gl.DEPTH_TEST);

            prg.use();
            let prgVertexPosition = gl.getAttribLocation(prg.prg, "aVertexPosition");
            gl.bindBuffer(gl.ARRAY_BUFFER, Gizmo.coordVertexBuffer);
            gl.vertexAttribPointer(prgVertexPosition, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(prgVertexPosition);
            Gizmo.setMVPMatrix();
            prg.setMatrix("mvpMat", Gizmo.mvpMatrix);
            prg.setColor("lineColor", [0.7, 0.7, 0.7, 1]);
            gl.drawArrays(gl.LINES, 0, (2 * nrLine + 1) * 4 + 2);
        }

        private static verticesCoord: number[];
        private static verticesCylinder: number[];
        private static verticesArrow: number[];
        private static coordVertexBuffer;
        private static cylinderVertexBuffer;
        private static arrowVertexBuffer;
        private static cameraVertexBuffer;
        private static cameraIndexBuffer;
        private static nrLine: number;

        private static setVertices() {
            let gl = this.webgl;
            let nrLine = this.nrLine = 100;
            this.verticesCoord = [];
            this.cameraVertexBuffer = gl.createBuffer();
            this.cameraIndexBuffer = gl.createBuffer();
            this.coordVertexBuffer = gl.createBuffer();
            this.cylinderVertexBuffer = gl.createBuffer();
            this.arrowVertexBuffer = gl.createBuffer();
            let bia = -0.05;
            for (let i = 0, len = 2 * nrLine + 1; i < len; i++) {
                this.verticesCoord[6 * i] = -nrLine + i;
                this.verticesCoord[6 * i + 1] = bia;
                this.verticesCoord[6 * i + 2] = -nrLine;
                this.verticesCoord[6 * i + 3] = -nrLine + i;
                this.verticesCoord[6 * i + 4] = bia;
                this.verticesCoord[6 * i + 5] = nrLine;

                this.verticesCoord[6 * len + 6 * i] = -nrLine;
                this.verticesCoord[6 * len + 6 * i + 1] = bia;
                this.verticesCoord[6 * len + 6 * i + 2] = -nrLine + i;
                this.verticesCoord[6 * len + 6 * i + 3] = nrLine;
                this.verticesCoord[6 * len + 6 * i + 4] = bia;
                this.verticesCoord[6 * len + 6 * i + 5] = -nrLine + i;
            }

            this.verticesCylinder = [
                0.5, 0, 0, 0.5, 0, 2,
                0.433, 0.25, 0, 0.433, 0.25, 2,
                0.25, 0.433, 0, 0.25, 0.433, 2,
                -0.5, 0, 0, -0.5, 0, 2,
                -0.433, 0.25, 0, -0.433, 0.25, 2,
                -0.25, 0.433, 0, -0.25, 0.433, 2,
                -0.5, 0, 0, -0.5, 0, 2,
                -0.433, -0.25, 0, -0.433, -0.25, 2,
                -0.25, -0.433, 0, -0.25, -0.433, 2,
                0.5, 0, 0, 0.5, 0, 2,
                0.433, -0.25, 0, 0.433, -0.25, 2,
                0.25, -0.433, 0, 0.25, -0.433, 2,
            ];

            for (let i = 0; i < this.verticesCylinder.length; i++) {
                this.verticesCylinder[i] *= 0.5;
            }

            this.verticesArrow = [
                0.7, 0.0, 0.0, 0.0, 0.0, 0.0,
                0.7, 0.0, 0.0, 0.7, 0.0, 0.1, 0.7, 0.1, 0.0,
                0.7, 0.0, 0.0, 0.7, 0.1, 0.0, 0.7, 0.0, -0.1,
                0.7, 0.0, 0.0, 0.7, 0.0, -0.1, 0.7, -0.1, 0.0,
                0.7, 0.0, 0.0, 0.7, -0.1, 0.0, 0.7, 0.0, 0.1,
                1.0, 0.0, 0.0, 0.7, 0.0, 0.1, 0.7, 0.1, 0.0,
                1.0, 0.0, 0.0, 0.7, 0.1, 0.0, 0.7, 0.0, -0.1,
                1.0, 0.0, 0.0, 0.7, 0.0, -0.1, 0.7, -0.1, 0.0,
                1.0, 0.0, 0.0, 0.7, -0.1, 0.0, 0.7, 0.0, 0.1
            ];

            this.verticesCoord = this.verticesCoord.concat([0, -this.nrLine, 0, 0, this.nrLine, 0]);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.coordVertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.verticesCoord), gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.cylinderVertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.verticesCylinder), gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.arrowVertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.verticesArrow), gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
        }

        private static mvpMatrix: egret3d.Matrix4 = new egret3d.Matrix4();
        private static mMatrix: egret3d.Matrix4 = new egret3d.Matrix4();
        private static vMatrix: egret3d.Matrix4 = new egret3d.Matrix4();
        private static pMatrix: egret3d.Matrix4 = new egret3d.Matrix4();

        private static setMVPMatrix(m?: egret3d.Matrix4) {
            var asp = this.camera.context.viewPortPixel.w / this.camera.context.viewPortPixel.h;
            this.vMatrix.inverse(this.camera.gameObject.transform.getWorldMatrix());
            this.camera.calcProjectMatrix(asp, this.pMatrix);
            this.mvpMatrix.multiply(this.pMatrix, this.vMatrix);
            m = m || new egret3d.Matrix4();
            this.mMatrix.copy(m);
            this.mvpMatrix.multiply(this.mMatrix);
        }

        private static glProgram_line: editor.GizmoShader;
        private static glProgram_icon: editor.GizmoShader;
        private static glProgram_stroke: editor.GizmoShader;

        private static initPrg() {
            this.glProgram_line = new GizmoShader(this.webgl, editor.line_vert, editor.line_frag);
            this.glProgram_icon = new GizmoShader(this.webgl, editor.icon_vert, editor.icon_frag);
            this.glProgram_stroke = new GizmoShader(this.webgl, editor.stroke_vert, editor.line_frag);
        }

        // const cameras = Application.sceneManager.globalGameObject.getOrAddComponent(egret3d.CamerasAndLights);

        public static DrawLights() {
            if (!this.enabled) return;

            const camerasAndLights = Application.sceneManager.globalGameObject.getOrAddComponent(egret3d.CamerasAndLights);
            for (const light of camerasAndLights.lights) {
                Gizmo.DrawIcon("light", light.gameObject.transform.getPosition(), 30, light.color);
                Gizmo.DrawCylinder(light.gameObject.transform, light.color);
            }
        }

        private static DrawCylinder(transform: egret3d.Transform, color: egret3d.Color) {
            if (!this.enabled) return;

            let gl = this.webgl;
            let prg = this.glProgram_line;
            gl.enable(gl.DEPTH_TEST);

            prg.use();
            let prgVertexPosition = gl.getAttribLocation(prg.prg, "aVertexPosition");
            gl.bindBuffer(gl.ARRAY_BUFFER, this.cylinderVertexBuffer);
            gl.vertexAttribPointer(prgVertexPosition, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(prgVertexPosition);

            let m = this.helpMat;
            this.getWorldMatrixWithoutScale(transform, 15, m);
            this.setMVPMatrix(m);
            prg.setMatrix("mvpMat", this.mvpMatrix);
            prg.setColor("lineColor", [color.r, color.g, color.b, color.a]);
            gl.drawArrays(gl.LINES, 0, 24);
        }

        public static DrawCameras() {
            if (!this.enabled) return;

            const camerasAndLights = Application.sceneManager.globalGameObject.getOrAddComponent(egret3d.CamerasAndLights);

            for (const camera of camerasAndLights.cameras) {
                // if (!camera.gameObject.getComponent(egret3d.MeshFilter) && camera.gameObject.name != "EditorCamera") {
                //     let obj = camera.gameObject
                //     let mesh = obj.addComponent(egret3d.MeshFilter)
                //     mesh.mesh = egret3d.DefaultMeshes.CUBE
                //     // let renderer = obj.addComponent(egret3d.MeshRenderer);
                //     // let mat = new egret3d.Material(egret3d.DefaultShaders.GIZMOS_COLOR);
                //     // mat.setVector4v("_Color", [1, 0, 0, 1]);
                //     // renderer.materials = [mat];
                //     // obj.transform.setScale(0.6, 0.4, 0.4)
                // }

                Gizmo.DrawIcon("camera", camera.gameObject.transform.getPosition(), 30);
                Gizmo.DrawCameraSquare(camera.gameObject, [1, 0, 0, 1])
                //Gizmo.DrawCameraSquare(this.cameraPool[i], [1.0, 0.0, 1.0, 1.0]);
            }
        }

        public static DrawCameraSquare(obj: GameObject, color: number[]) {
            if (!this.enabled) return;

            let gl = this.webgl;
            let prg = this.glProgram_line;
            gl.enable(gl.DEPTH_TEST);

            this.getCameraSquare(obj);

            prg.use();
            let prgVertexPosition = gl.getAttribLocation(prg.prg, "aVertexPosition");
            gl.bindBuffer(gl.ARRAY_BUFFER, this.cameraVertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.verticesCameraSquare), gl.STATIC_DRAW);
            gl.vertexAttribPointer(prgVertexPosition, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(prgVertexPosition);
            this.setMVPMatrix();
            prg.setMatrix("mvpMat", this.mvpMatrix);
            prg.setColor("lineColor", color);

            let indices: number[] = [1, 0, 1, 2, 2, 3, 3, 0, 4, 5, 5, 6, 6, 7, 7, 4, 0, 4, 1, 5, 2, 6, 3, 7];
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.cameraIndexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
            gl.drawElements(gl.LINES, indices.length, gl.UNSIGNED_SHORT, 0);
            //sconsole.log(this.verticesCameraSquare);
            //gl.drawArrays(gl.LINES, 0, 24);
        }

        private static helpVec31 = new egret3d.Vector3();
        private static helpVec32 = new egret3d.Vector3();
        private static helpVec33 = new egret3d.Vector3();
        private static helpVec34 = new egret3d.Vector3();
        private static helpVec35 = new egret3d.Vector3();
        private static helpVec36 = new egret3d.Vector3();
        private static verticesCameraSquare: number[];
        private static getCameraSquare(obj: GameObject) {
            this.verticesCameraSquare = [];
            let t = obj.transform;
            let camera = obj.getComponent(egret3d.Camera);

            let forward = this.helpVec31;
            let up = this.helpVec32;
            let right = this.helpVec33;
            let nearCenter = this.helpVec34;
            let farCenter = this.helpVec35;

            t.getForward(forward);
            t.getUp(up);
            t.getRight(right);

            let cameraPos = t.getPosition();

            egret3d.Vector3.add(egret3d.Vector3.scale(forward, camera.near), cameraPos, nearCenter);
            t.getForward(forward);
            egret3d.Vector3.add(egret3d.Vector3.scale(forward, camera.far), cameraPos, farCenter);


            let asp = this.camera.context.viewPortPixel.w / this.camera.context.viewPortPixel.h;
            let nearH = camera.opvalue > 0 ? camera.near * Math.tan(camera.fov * 0.5) : camera.size * 0.5;
            let nearW = nearH * asp;
            let farH = camera.opvalue > 0 ? camera.far * Math.tan(camera.fov * 0.5) : camera.size * 0.5;
            let farW = farH * asp;

            let point = this.helpVec36;
            //0
            t.getUp(up);
            t.getRight(right);
            egret3d.Vector3.add(nearCenter, egret3d.Vector3.scale(up, nearH), point);
            egret3d.Vector3.add(point, egret3d.Vector3.scale(right, nearW), point);
            this.verticesCameraSquare = this.verticesCameraSquare.concat([point.x, point.y, point.z]);
            //1
            t.getUp(up);
            t.getRight(right);
            egret3d.Vector3.add(nearCenter, egret3d.Vector3.scale(up, nearH), point);
            egret3d.Vector3.add(point, egret3d.Vector3.scale(right, -nearW), point);
            this.verticesCameraSquare = this.verticesCameraSquare.concat([point.x, point.y, point.z]);
            //2
            t.getUp(up);
            t.getRight(right);
            egret3d.Vector3.add(nearCenter, egret3d.Vector3.scale(up, -nearH), point);
            egret3d.Vector3.add(point, egret3d.Vector3.scale(right, -nearW), point);
            this.verticesCameraSquare = this.verticesCameraSquare.concat([point.x, point.y, point.z]);
            //3
            t.getUp(up);
            t.getRight(right);
            egret3d.Vector3.add(nearCenter, egret3d.Vector3.scale(up, -nearH), point);
            egret3d.Vector3.add(point, egret3d.Vector3.scale(right, nearW), point);
            this.verticesCameraSquare = this.verticesCameraSquare.concat([point.x, point.y, point.z]);
            //4
            t.getUp(up);
            t.getRight(right);
            egret3d.Vector3.add(farCenter, egret3d.Vector3.scale(up, farH), point);
            egret3d.Vector3.add(point, egret3d.Vector3.scale(right, farW), point);
            this.verticesCameraSquare = this.verticesCameraSquare.concat([point.x, point.y, point.z]);
            //5
            t.getUp(up);
            t.getRight(right);
            egret3d.Vector3.add(farCenter, egret3d.Vector3.scale(up, farH), point);
            egret3d.Vector3.add(point, egret3d.Vector3.scale(right, -farW), point);
            this.verticesCameraSquare = this.verticesCameraSquare.concat([point.x, point.y, point.z]);
            //6
            t.getUp(up);
            t.getRight(right);
            egret3d.Vector3.add(farCenter, egret3d.Vector3.scale(up, -farH), point);
            egret3d.Vector3.add(point, egret3d.Vector3.scale(right, -farW), point);
            this.verticesCameraSquare = this.verticesCameraSquare.concat([point.x, point.y, point.z]);
            //7
            t.getUp(up);
            t.getRight(right);
            egret3d.Vector3.add(farCenter, egret3d.Vector3.scale(up, -farH), point);
            egret3d.Vector3.add(point, egret3d.Vector3.scale(right, farW), point);
            this.verticesCameraSquare = this.verticesCameraSquare.concat([point.x, point.y, point.z]);
        }

        // public static DrawArrow(m: egret3d.Matrix4, color: number[], fixSize?: boolean) {
        //     if (!this.enabled) return;

        //     let gl = this.webgl;
        //     let prg = this.glProgram_line;
        //     gl.disable(gl.DEPTH_TEST);

        //     prg.use();
        //     let prgVertexPosition = gl.getAttribLocation(prg.prg, "aVertexPosition");
        //     gl.bindBuffer(gl.ARRAY_BUFFER, this.arrowVertexBuffer);
        //     gl.vertexAttribPointer(prgVertexPosition, 3, gl.FLOAT, false, 0, 0);
        //     gl.enableVertexAttribArray(prgVertexPosition);
        //     this.setMVPMatrix(m);
        //     prg.setMatrix("mvpMat", this.mvpMatrix);
        //     prg.setColor("lineColor", color);
        //     gl.drawArrays(gl.LINES, 0, 2);
        //     gl.drawArrays(gl.TRIANGLES, 2, 24);
        // }

        // private static xArrowMMatrix = new egret3d.Matrix4();
        // private static yArrowMMatrix = egret3d.Matrix4.create([
        //     0, 1, 0, 0,
        //     -1, 0, 0, 0,
        //     0, 0, 1, 0,
        //     0, 0, 0, 1
        // ]);
        // private static zArrowMMatrix = egret3d.Matrix4.create([
        //     0, 0, 1, 0,
        //     0, 1, 0, 0,
        //     -1, 0, 0, 0,
        //     0, 0, 0, 1
        // ]);

        private static helpMat: egret3d.Matrix4 = new egret3d.Matrix4();
        private static helpMat1: egret3d.Matrix4 = new egret3d.Matrix4();
        // public static DrawArrowXYZ(transform: egret3d.Transform) {
        //     console.log("now drawXYZ", transform)
        //     let worldMat = Gizmo.helpMat;
        //     Gizmo.getWorldMatrixWithoutScale(transform, 10, worldMat);
        //     worldMat.multiply(this.xArrowMMatrix);
        //     Gizmo.DrawArrow(worldMat, [1.0, 0.0, 0.0, 1.0], true);
        //     worldMat.multiply(this.yArrowMMatrix);
        //     Gizmo.DrawArrow(worldMat, [0.0, 1.0, 0.0, 1.0], true);
        //     worldMat.multiply(this.zArrowMMatrix);
        //     Gizmo.DrawArrow(worldMat, [0.0, 0.0, 1.0, 1.0], true);
        // }
        private static getWorldMatrixWithoutScale(transform: egret3d.Transform, fixScale: number, out: egret3d.Matrix4) {
            out.identity();
            let p = transform.getPosition();
            let r = transform.getRotation();
            let p_c = this.camera.gameObject.transform.getPosition();
            egret3d.Vector3.subtract(p, p_c, p_c);
            let sca = egret3d.Vector3.getLength(p_c) / fixScale;

            let matS = this.helpMat1;
            // egret3d.Quaternion.toMatrix(r, out);
            out.fromRotation(r);
            matS.fromScale(sca, sca, sca);

            out.multiply(matS);
            out.rawData[12] = p.x;
            out.rawData[13] = p.y;
            out.rawData[14] = p.z;
        }

        private static _imageLoadCount: number = 0;
        private static textures: { [key: string]: WebGLTexture } = {};
        private static initIconTexture() {
            for (let key in icons) {
                let image = new Image();
                this._imageLoadCount++;
                image.setAttribute('src', icons[key]);
                image.onload = this.loadIconTexture.bind(this, image, key);
            }
        }

        private static loadIconTexture(image: HTMLImageElement, key: string) {
            const webgl = egret3d.WebGLCapabilities.webgl;
            const texture = webgl.createTexture();
            webgl.bindTexture(webgl.TEXTURE_2D, texture);
            webgl.texImage2D(webgl.TEXTURE_2D, 0, webgl.RGBA, webgl.RGBA, webgl.UNSIGNED_BYTE, image);
            webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.LINEAR);
            webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.LINEAR);
            this._imageLoadCount--;
            this.textures[key] = texture;

            if (this._imageLoadCount === 0) {
                this.enabled = true;
            }
        }
    }
}