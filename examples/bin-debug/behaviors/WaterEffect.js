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
    var WaterEffect = (function (_super) {
        __extends(WaterEffect, _super);
        function WaterEffect() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.shininess = 1.0;
            _this.speed = 0.1;
            _this._lightDir = egret3d.Vector3.create();
            _this._lightColor = egret3d.Color.create();
            _this._color = egret3d.Color.create(0.09402033, 0.2427614, 0.2720588, 1.0);
            _this._material = null;
            _this._time = 0.0;
            return _this;
        }
        WaterEffect.prototype.onStart = function () {
            this._material = this.gameObject.renderer.material;
            this._material.setFloat("_Shininess", this.shininess);
            this._material.setVector4v("_Color", [this.color.r, this.color.g, this.color.b, this.color.a]);
            this._material.setVector3("lightDir", this._lightDir);
            this._material.setColor("lightColor", this._lightColor);
            this._material.setBlend(gltf.BlendMode.Blend, paper.RenderQueue.Transparent);
        };
        WaterEffect.prototype.onUpdate = function (deltaTime) {
            this._time += deltaTime * this.speed;
            this._material.setFloat("_time", this._time);
        };
        Object.defineProperty(WaterEffect.prototype, "lightDir", {
            get: function () {
                return this._lightDir;
            },
            set: function (value) {
                this._lightDir.copy(value);
                this._material.setVector3("lightDir", this._lightDir);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WaterEffect.prototype, "lightColor", {
            get: function () {
                return this._lightColor;
            },
            set: function (value) {
                this._lightColor.copy(value);
                this._material.setColor("lightColor", this._lightColor);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WaterEffect.prototype, "color", {
            get: function () {
                return this._color;
            },
            set: function (value) {
                this._color.copy(value);
                this._material.setVector4v("_Color", [this.color.r, this.color.g, this.color.b, this.color.a]);
            },
            enumerable: true,
            configurable: true
        });
        __decorate([
            paper.editor.property("FLOAT" /* FLOAT */)
        ], WaterEffect.prototype, "shininess", void 0);
        __decorate([
            paper.editor.property("FLOAT" /* FLOAT */)
        ], WaterEffect.prototype, "speed", void 0);
        __decorate([
            paper.editor.property("VECTOR3" /* VECTOR3 */)
        ], WaterEffect.prototype, "lightDir", null);
        __decorate([
            paper.editor.property("COLOR" /* COLOR */)
        ], WaterEffect.prototype, "lightColor", null);
        __decorate([
            paper.editor.property("COLOR" /* COLOR */)
        ], WaterEffect.prototype, "color", null);
        return WaterEffect;
    }(paper.Behaviour));
    behaviors.WaterEffect = WaterEffect;
    __reflect(WaterEffect.prototype, "behaviors.WaterEffect");
})(behaviors || (behaviors = {}));
