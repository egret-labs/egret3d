"use strict";
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var behaviors;
(function (behaviors) {
    var _reflectorPlane = egret3d.Plane.create();
    var _normal = egret3d.Vector3.create();
    var _up = egret3d.Vector3.create();
    var _lookAtPosition = egret3d.Vector3.create(0.0, 0.0, -1);
    var _clipPlane = egret3d.Vector4.create();
    var _view = egret3d.Vector3.create();
    var _target = egret3d.Vector3.create();
    var _q = egret3d.Vector4.create();
    var _viewPort = egret3d.Rectangle.create();
    var _textureMatrix = egret3d.Matrix4.create();
    var Reflector = (function (_super) {
        __extends(Reflector, _super);
        function Reflector() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.recursion = 1;
            _this.textureWidth = 1500;
            _this.textureHeight = 969;
            // @paper.editor.property(paper.editor.EditType.FLOAT)
            _this.clipBias = 0.003;
            _this.color = egret3d.Color.create(0.0, 0.0, 0.0, 1.0);
            _this._renderState = paper.GameObject.globalGameObject.getComponent(egret3d.RenderState);
            _this._renderTarget = egret3d.RenderTexture.create({ width: _this.textureWidth, height: _this.textureHeight }).setMipmap(true);
            return _this;
        }
        Reflector.prototype.onStart = function () {
            if (!Reflector._reflectorCamera) {
                var gameObject = paper.GameObject.create("ReflectorCamera");
                gameObject.dontDestroy = true;
                var reflectorCamera = gameObject.addComponent(egret3d.Camera);
                reflectorCamera.enabled = false;
                // reflectorCamera.hideFlags = paper.HideFlags.HideAndDontSave;
                reflectorCamera.backgroundColor.set(0.0, 0.0, 0.0, 1.0);
                Reflector._reflectorCamera = reflectorCamera;
            }
            var reflectorMaterial = this.gameObject.renderer.material;
            reflectorMaterial
                .setRenderQueue(-1000)
                .setColor("color", this.color)
                .setMatrix("textureMatrix", _textureMatrix);
        };
        Reflector.prototype.onBeforeRender = function () {
            var currentCamera = egret3d.Camera.current;
            var reflectorCamera = Reflector._reflectorCamera;
            if (currentCamera === reflectorCamera) {
                return false;
            }
            var transform = this.gameObject.transform;
            var currentCameraTransform = currentCamera.gameObject.transform;
            var reflectorPosition = transform.position;
            var normal = transform.getForward(_normal).negate();
            var cameraPosition = currentCameraTransform.position;
            var view = _view.subtract(reflectorPosition, cameraPosition);
            if (view.dot(normal) > 0.0) {
                return true; //
            }
            // const reflectorMatrix = this._calculateReflectionMatrix(clipPlane, _reflectorMatrix);
            // this._testCube.transform.position.applyMatrix(reflectorMatrix, cameraPosition).update();
            var reflectorPlane = _reflectorPlane.fromPoint(reflectorPosition, normal);
            var clipPlane = _clipPlane.set(reflectorPlane.normal.x, reflectorPlane.normal.y, reflectorPlane.normal.z, reflectorPlane.constant);
            var lookAtPosition = currentCameraTransform.getForward(_lookAtPosition).negate().add(cameraPosition);
            var up = currentCameraTransform.getUp(_up).reflect(normal);
            var target = _target.subtract(reflectorPosition, lookAtPosition).reflect(normal).add(reflectorPosition);
            view.reflect(normal).negate().add(reflectorPosition);
            reflectorCamera.transform.position = view;
            reflectorCamera.transform.lookAt(target, up);
            // reflectorCamera.opvalue = currentCamera.opvalue;
            // reflectorCamera.fov = currentCamera.fov;
            // reflectorCamera.near = currentCamera.near; // 
            // reflectorCamera.far = currentCamera.far;
            // reflectorCamera.size = currentCamera.size; // 
            // virtualCamera.userData.recursion = 0; TODO
            var projectionMatrix = reflectorCamera.projectionMatrix;
            // Update the texture matrix
            // const matrix = egret3d.Matrix4.create().copy(transform.localToWorldMatrix).fromTranslate(egret3d.Vector3.ZERO, true).release();
            _textureMatrix
                .set(0.5, 0.0, 0.0, 0.5, 0.0, 0.5, 0.0, 0.5, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0, 1.0)
                .multiply(projectionMatrix)
                .multiply(reflectorCamera.gameObject.transform.worldToLocalMatrix)
                .multiply(transform.localToWorldMatrix);
            _q.x = (egret3d.sign(clipPlane.x) + projectionMatrix.rawData[8]) / projectionMatrix.rawData[0];
            _q.y = (egret3d.sign(clipPlane.y) + projectionMatrix.rawData[9]) / projectionMatrix.rawData[5];
            _q.z = -1.0;
            _q.w = (1.0 + projectionMatrix.rawData[10]) / projectionMatrix.rawData[14];
            // Calculate the scaled plane vector
            clipPlane.multiplyScalar(2.0 / clipPlane.dot(_q));
            // Replacing the third row of the projection matrix
            // projectionMatrix.rawData[2] = clipPlane.x;
            // projectionMatrix.rawData[6] = clipPlane.y;
            // projectionMatrix.rawData[10] = clipPlane.z + 1.0 - this.clipBias;
            // projectionMatrix.rawData[14] = clipPlane.w;
            // Render
            var renderState = this._renderState;
            var backupViewPort = _viewPort.copy(renderState.viewport);
            var backupRenderTarget = renderState.renderTarget;
            var saveCamera = egret3d.Camera.current;
            reflectorCamera.renderTarget = this._renderTarget;
            renderState.render(reflectorCamera);
            egret3d.Camera.current = saveCamera;
            var reflectorMaterial = this.gameObject.renderer.material;
            reflectorMaterial.setTexture("tDiffuse", this._renderTarget).setColor(this.color);
            // renderState.updateViewport(backupViewPort, backupRenderTarget);
            return true;
        };
        Reflector._reflectorCamera = null;
        Reflector._cameraRecursion = {};
        __decorate([
            paper.editor.property("UINT" /* UINT */)
        ], Reflector.prototype, "recursion", void 0);
        __decorate([
            paper.editor.property("COLOR" /* COLOR */)
        ], Reflector.prototype, "color", void 0);
        return Reflector;
    }(paper.Behaviour));
    behaviors.Reflector = Reflector;
    __reflect(Reflector.prototype, "behaviors.Reflector");
})(behaviors || (behaviors = {}));
