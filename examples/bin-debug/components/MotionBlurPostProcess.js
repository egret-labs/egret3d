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
var components;
(function (components) {
    var MotionBlurPostProcess = (function (_super) {
        __extends(MotionBlurPostProcess, _super);
        function MotionBlurPostProcess() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._velocityFactor = 1.0;
            _this._samples = 20;
            _this._resolution = egret3d.Vector2.create(1.0, 1.0);
            _this._depthRenderTarget = null;
            _this._preMatrix = null;
            _this._depathMaterial = egret3d.Material.create(RES.getRes("shaders/motionBlur/blurDepth.shader.json"));
            _this._material = egret3d.Material.create(RES.getRes("shaders/motionBlur/motionBlur.shader.json"));
            _this._renderState = paper.GameObject.globalGameObject.getComponent(egret3d.RenderState);
            return _this;
        }
        MotionBlurPostProcess.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
            this._resolution.set(egret3d.stage.viewport.w, egret3d.stage.viewport.h);
            this._depathMaterial.setDepth(true, true).setCullFace(true, 2305 /* CCW */, 1029 /* Back */);
            this._material.setDepth(true, true).setCullFace(false).setFloat("velocityFactor", this._velocityFactor);
        };
        MotionBlurPostProcess.prototype.uninitialize = function () {
            _super.prototype.uninitialize.call(this);
            if (this._depthRenderTarget) {
                this._depthRenderTarget.dispose();
            }
            if (this._depathMaterial) {
                this._depathMaterial.dispose();
            }
            if (this._material) {
                this._material.dispose();
            }
            this._resolution.release();
            if (this._preMatrix) {
                this._preMatrix.release();
            }
        };
        MotionBlurPostProcess.prototype.onRender = function (camera) {
            var context = camera.context;
            var depthMaterial = this._depathMaterial;
            var material = this._material;
            var renderState = this._renderState;
            var postProcessingRenderTarget = camera.postprocessingRenderTarget;
            if (!this._depthRenderTarget) {
                this._depthRenderTarget = egret3d.RenderTexture.create({ width: egret3d.stage.viewport.w, height: egret3d.stage.viewport.h, premultiplyAlpha: 1 }).setLiner(false).setRepeat(false).setMipmap(true);
            }
            depthMaterial.setFloat("mNear", camera.near).setFloat("mFar", camera.far);
            // const preMatrix = egret3d.Matrix4.create().multiply(camera.projectionMatrix, camera.transform.worldToLocalMatrix).release();
            // const preMatrix = camera.transform.worldToLocalMatrix.clone().multiply(camera.projectionMatrix).release();
            // const currentMatrix = preMatrix.clone().inverse();
            if (!this._preMatrix) {
                this._preMatrix = camera.worldToClipMatrix.clone();
            }
            //
            material.setTexture("tColor", postProcessingRenderTarget);
            material.setMatrix("viewProjectionInverseMatrix", camera.clipToWorldMatrix);
            material.setMatrix("previousViewProjectionMatrix", this._preMatrix);
            camera.renderTarget = this._depthRenderTarget;
            renderState.render(camera, depthMaterial);
            camera.renderTarget = null;
            material.setTexture("tDepth", this._depthRenderTarget);
            this.blit(postProcessingRenderTarget, this._material);
            this._preMatrix.copy(camera.worldToClipMatrix);
        };
        Object.defineProperty(MotionBlurPostProcess.prototype, "velocityFactor", {
            get: function () {
                return this._velocityFactor;
            },
            set: function (value) {
                if (this._velocityFactor !== value) {
                    this._velocityFactor = value;
                    this._material.setFloat("velocityFactor", value);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MotionBlurPostProcess.prototype, "samples", {
            get: function () {
                return this._samples;
            },
            set: function (value) {
                if (this._samples !== value) {
                    this._material.removeDefine("SAMPLE_NUM " + this._samples);
                    this._samples = value;
                    this._material.addDefine("SAMPLE_NUM " + this._samples);
                }
            },
            enumerable: true,
            configurable: true
        });
        __decorate([
            paper.editor.property("FLOAT" /* FLOAT */, { minimum: 0.1 })
        ], MotionBlurPostProcess.prototype, "velocityFactor", null);
        __decorate([
            paper.editor.property("FLOAT" /* FLOAT */, { minimum: 1 })
        ], MotionBlurPostProcess.prototype, "samples", null);
        return MotionBlurPostProcess;
    }(egret3d.CameraPostprocessing));
    components.MotionBlurPostProcess = MotionBlurPostProcess;
    __reflect(MotionBlurPostProcess.prototype, "components.MotionBlurPostProcess");
})(components || (components = {}));
