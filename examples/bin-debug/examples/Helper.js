"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var examples;
(function (examples) {
    function createGridRoom() {
        {
            var pointLight = paper.GameObject.create("Point Light").addComponent(egret3d.PointLight);
            pointLight.decay = 0.0;
            pointLight.distance = 0.0;
            pointLight.castShadows = true;
            pointLight.transform.setLocalPosition(0.0, 5.0, -10.0);
            //
            pointLight.gameObject.addComponent(behaviors.RotateAround).rotateSpeed *= -2.0;
        }
        var mesh = egret3d.MeshBuilder.createCube(40.0, 40.0, 40.0, 0.0, 20.0, 0.0, 40, 40, 40);
        mesh.name = "custom/gridroom.mesh.bin";
        var gameObject = egret3d.DefaultMeshes.createObject(mesh, "Background");
        // gameObject.hideFlags = paper.HideFlags.NotTouchable;
        gameObject.activeSelf = false;
        function loadResource() {
            return __awaiter(this, void 0, void 0, function () {
                var textureA, textureB, renderer;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, RES.getResAsync("textures/grid_a.png")];
                        case 1:
                            textureA = _a.sent();
                            return [4 /*yield*/, RES.getResAsync("textures/grid_b.png")];
                        case 2:
                            textureB = _a.sent();
                            textureA.gltfTexture.extensions.paper.anisotropy = 4;
                            textureB.gltfTexture.extensions.paper.anisotropy = 4;
                            renderer = gameObject.renderer;
                            renderer.receiveShadows = true;
                            renderer.materials = [
                                egret3d.DefaultMaterials.MESH_LAMBERT.clone()
                                    .setTexture(textureA)
                                    .setCullFace(true, 2305 /* CCW */, 1028 /* Front */)
                                    .setUVTransform(egret3d.Matrix3.create().fromUVTransform(0.0, 0.0, 20, 20, 0.0, 0.0, 0.0).release()),
                                egret3d.DefaultMaterials.MESH_LAMBERT.clone()
                                    .setTexture(textureB)
                                    .setCullFace(true, 2305 /* CCW */, 1028 /* Front */)
                                    .setBlend(2 /* Normal */, 3000 /* Blend */),
                            ];
                            gameObject.activeSelf = true;
                            return [2 /*return*/];
                    }
                });
            });
        }
        loadResource();
        return gameObject;
    }
    examples.createGridRoom = createGridRoom;
})(examples || (examples = {}));
