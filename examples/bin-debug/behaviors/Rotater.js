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
    var Rotater = (function (_super) {
        __extends(Rotater, _super);
        function Rotater() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.speed = egret3d.Vector3.create(0.0, 0.01, 0.0);
            return _this;
        }
        Rotater.prototype.onUpdate = function (deltaTime) {
            this.gameObject.transform.rotate(this.speed);
        };
        __decorate([
            paper.editor.property("VECTOR3" /* VECTOR3 */)
        ], Rotater.prototype, "speed", void 0);
        return Rotater;
    }(paper.Behaviour));
    behaviors.Rotater = Rotater;
    __reflect(Rotater.prototype, "behaviors.Rotater");
})(behaviors || (behaviors = {}));
