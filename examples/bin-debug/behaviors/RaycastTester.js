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
    var BaseRaycast = (function (_super) {
        __extends(BaseRaycast, _super);
        function BaseRaycast() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.ray = egret3d.Ray.create();
            _this.normal = egret3d.Vector3.create();
            _this.raycastInfo = egret3d.RaycastInfo.create();
            _this._lineMesh = null;
            _this._normalMesh = null;
            _this._line = egret3d.creater.createGameObject("Line", { mesh: egret3d.DefaultMeshes.LINE_Z, material: egret3d.DefaultMaterials.LINEDASHED });
            _this._normal = egret3d.creater.createGameObject("Normal", { mesh: egret3d.DefaultMeshes.LINE_Z, material: egret3d.DefaultMaterials.LINEDASHED });
            return _this;
        }
        BaseRaycast.prototype.onAwake = function () {
            var meshFilter = this._line.getComponent(egret3d.MeshFilter);
            var meshRenderer = this._line.getComponent(egret3d.MeshRenderer);
            this._lineMesh = meshFilter.mesh;
            this._lineMesh.setIndices([2, 3], this._lineMesh.addSubMesh(2, 1, 0 /* Points */));
            this._lineMesh.setAttributes("COLOR_0" /* COLOR_0 */, [
                0.0, 0.0, 0.0, 0.0,
                0.0, 0.0, 0.0, 0.0,
            ], 2);
            meshRenderer.materials = [
                meshRenderer.material,
                egret3d.Material.create(egret3d.DefaultShaders.POINTS)
                    .addDefine("USE_COLOR" /* USE_COLOR */)
                    .setFloat("size" /* Size */, 10.0)
            ];
            this._line.transform.parent = this.gameObject.transform;
            this._normal.transform.parent = this.gameObject.transform;
            this._normal.activeSelf = false;
        };
        BaseRaycast.prototype._updateRay = function () {
            var transform = this.gameObject.transform;
            var ray = this.ray;
            ray.origin.copy(transform.position);
            transform.getForward(ray.direction);
        };
        return BaseRaycast;
    }(paper.Behaviour));
    behaviors.BaseRaycast = BaseRaycast;
    __reflect(BaseRaycast.prototype, "behaviors.BaseRaycast");
    var RendererRaycast = (function (_super) {
        __extends(RendererRaycast, _super);
        function RendererRaycast() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.raycastMesh = false;
            _this.target = null;
            return _this;
        }
        RendererRaycast.prototype.onUpdate = function () {
            var raycastInfo = this.raycastInfo;
            var lineTransform = this._line.transform;
            lineTransform.setLocalScale(1.0);
            raycastInfo.clear();
            raycastInfo.normal = this.normal;
            if (this.target && this.target.renderer) {
                this._updateRay();
                if (this.target.renderer.raycast(this.ray, raycastInfo, this.raycastMesh)) {
                    lineTransform.setLocalScale(1.0, 1.0, raycastInfo.distance);
                    this._normal.activeSelf = true;
                    this._normal.transform
                        .setPosition(raycastInfo.position)
                        .lookRotation(raycastInfo.normal)
                        .setLocalScale(1.0, 1.0, raycastInfo.normal.length);
                    return;
                }
            }
            this._normal.activeSelf = false;
        };
        __decorate([
            paper.editor.property("CHECKBOX" /* CHECKBOX */)
        ], RendererRaycast.prototype, "raycastMesh", void 0);
        return RendererRaycast;
    }(BaseRaycast));
    behaviors.RendererRaycast = RendererRaycast;
    __reflect(RendererRaycast.prototype, "behaviors.RendererRaycast");
    var ColliderRaycast = (function (_super) {
        __extends(ColliderRaycast, _super);
        function ColliderRaycast() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.target = null;
            return _this;
        }
        ColliderRaycast.prototype.onUpdate = function () {
            var raycastInfo = this.raycastInfo;
            var lineTransform = this._line.transform;
            lineTransform.setLocalScale(1.0);
            raycastInfo.clear();
            raycastInfo.normal = this.normal;
            if (this.target) {
                this._updateRay();
                if (egret3d.raycast(this.ray, this.target, false, raycastInfo)) {
                    lineTransform.setLocalScale(1.0, 1.0, raycastInfo.distance);
                    this._normal.activeSelf = true;
                    this._normal.transform
                        .setPosition(raycastInfo.position)
                        .lookRotation(raycastInfo.normal)
                        .setLocalScale(1.0, 1.0, raycastInfo.normal.length);
                    return;
                }
            }
            this._normal.activeSelf = false;
        };
        return ColliderRaycast;
    }(BaseRaycast));
    behaviors.ColliderRaycast = ColliderRaycast;
    __reflect(ColliderRaycast.prototype, "behaviors.ColliderRaycast");
})(behaviors || (behaviors = {}));
