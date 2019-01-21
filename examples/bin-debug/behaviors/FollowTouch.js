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
    var FollowTouch = (function (_super) {
        __extends(FollowTouch, _super);
        function FollowTouch() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.followSpeed = 0.05;
            _this.lookAtPoint = egret3d.Vector3.create();
            _this.target = null;
            return _this;
        }
        FollowTouch.prototype.onUpdate = function () {
            var target = this.lookAtPoint;
            if (this.target) {
                target.copy(this.target.transform.position);
            }
            var inputCollecter = this.gameObject.getComponent(egret3d.InputCollecter);
            var defaultPointer = inputCollecter.defaultPointer;
            var transform = this.transform;
            transform.translate((defaultPointer.position.x - transform.localPosition.x) * this.followSpeed, (-defaultPointer.position.y - transform.localPosition.y) * this.followSpeed, 0.0);
            transform.lookAt(target);
        };
        __decorate([
            paper.editor.property("FLOAT" /* FLOAT */, { minimum: 0.0, maximum: 1.0 })
        ], FollowTouch.prototype, "followSpeed", void 0);
        __decorate([
            paper.editor.property("VECTOR3" /* VECTOR3 */)
        ], FollowTouch.prototype, "lookAtPoint", void 0);
        return FollowTouch;
    }(paper.Behaviour));
    behaviors.FollowTouch = FollowTouch;
    __reflect(FollowTouch.prototype, "behaviors.FollowTouch");
})(behaviors || (behaviors = {}));
