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
    var RotateAround = (function (_super) {
        __extends(RotateAround, _super);
        function RotateAround() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.rotateSpeed = 0.5;
            _this.lookAtPoint = egret3d.Vector3.create();
            _this.target = null;
            _this._radius = 0.0;
            _this._radian = 0.0;
            return _this;
        }
        RotateAround.prototype.onUpdate = function (deltaTime) {
            var transform = this.gameObject.transform;
            var position = transform.position;
            var target = this.lookAtPoint;
            if (this.target) {
                target.copy(this.target.transform.position);
            }
            if (this.rotateSpeed !== 0.0) {
                var radius = Math.sqrt(Math.pow(position.x - target.x, 2) + Math.pow(position.z - target.z, 2));
                var radian = Math.atan2(position.z - target.z, position.x - target.x);
                if (Math.abs(this._radius - radius) > 0.05) {
                    this._radius = radius;
                }
                if (Math.abs(this._radian - radian) > 0.05) {
                    this._radian = radian;
                }
                this._radian += deltaTime * this.rotateSpeed * 0.5;
                transform.setPosition(target.x + Math.cos(this._radian) * this._radius, position.y, target.z + Math.sin(this._radian) * this._radius);
            }
            transform.lookAt(target);
        };
        __decorate([
            paper.editor.property("FLOAT" /* FLOAT */, { minimum: -10.0, maximum: 10.0 })
        ], RotateAround.prototype, "rotateSpeed", void 0);
        __decorate([
            paper.editor.property("VECTOR3" /* VECTOR3 */)
        ], RotateAround.prototype, "lookAtPoint", void 0);
        return RotateAround;
    }(paper.Behaviour));
    behaviors.RotateAround = RotateAround;
    __reflect(RotateAround.prototype, "behaviors.RotateAround");
})(behaviors || (behaviors = {}));
