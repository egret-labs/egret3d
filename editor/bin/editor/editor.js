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
var paper;
(function (paper) {
    var debug;
    (function (debug) {
        /**
         * TODO 临时的
         */
        var Bootstrap = (function (_super) {
            __extends(Bootstrap, _super);
            function Bootstrap() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Bootstrap.prototype.initialize = function () {
                // GameObject.globalGameObject.getOrAddComponent(debug.GUIComponent);
            };
            return Bootstrap;
        }(paper.Behaviour));
        debug.Bootstrap = Bootstrap;
        __reflect(Bootstrap.prototype, "paper.debug.Bootstrap");
        // setTimeout(() => {
        //     paper.GameObject.globalGameObject.getOrAddComponent(debug.Bootstrap);
        // }, 1000);
    })(debug = paper.debug || (paper.debug = {}));
})(paper || (paper = {}));
var paper;
(function (paper) {
    var debug;
    (function (debug) {
        var GizmoPickComponent = (function (_super) {
            __extends(GizmoPickComponent, _super);
            function GizmoPickComponent() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.pickTarget = null;
                return _this;
            }
            GizmoPickComponent.prototype.onDestroy = function () {
                this.pickTarget = null;
            };
            return GizmoPickComponent;
        }(paper.Behaviour));
        debug.GizmoPickComponent = GizmoPickComponent;
        __reflect(GizmoPickComponent.prototype, "paper.debug.GizmoPickComponent");
    })(debug = paper.debug || (paper.debug = {}));
})(paper || (paper = {}));
var paper;
(function (paper) {
    var debug;
    (function (debug) {
        /**
         *
         */
        var GUIComponentEvent;
        (function (GUIComponentEvent) {
            GUIComponentEvent["SceneSelected"] = "SceneSelected";
            GUIComponentEvent["SceneUnselected"] = "SceneUnselected";
            GUIComponentEvent["GameObjectHovered"] = "GameObjectHovered";
            GUIComponentEvent["GameObjectSelected"] = "GameObjectSelected";
            GUIComponentEvent["GameObjectUnselected"] = "GameObjectUnselected";
        })(GUIComponentEvent = debug.GUIComponentEvent || (debug.GUIComponentEvent = {}));
        /**
         *
         */
        var GUIComponent = (function (_super) {
            __extends(GUIComponent, _super);
            function GUIComponent() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                // public readonly inspector: dat.GUI = new dat.GUI({ closeOnTop: true, width: 330 });
                // public readonly hierarchy: dat.GUI = new dat.GUI({ closeOnTop: true, width: 330 });
                /**
                 * 所有选中的实体。
                 */
                _this.selectedGameObjects = [];
                /**
                 * 选中的场景。
                 */
                _this.selectedScene = null;
                /**
                 *
                 */
                _this.hoverGameObject = null;
                /**
                 * 最后一个选中的实体。
                 */
                _this.selectedGameObject = null;
                return _this;
            }
            GUIComponent.prototype.initialize = function () {
                _super.prototype.initialize.call(this);
                var guiSceneSystem = paper.Application.systemManager.getOrRegisterSystem(debug.GUISceneSystem);
                // const sceneOptions = {
                //     debug: false,
                //     assets: () => {
                //         const assets = paper.Asset["_assets"] as any;
                //         const assetNames = [];
                //         for (const k in assets) {
                //             if (k.indexOf("builtin") >= 0) {
                //                 continue;
                //             }
                //             assetNames.push(k);
                //             if (assets[k] instanceof egret3d.Texture) {
                //                 assetNames.push(k.replace(".image.json", ".png"));
                //                 assetNames.push(k.replace(".image.json", ".jpg"));
                //             }
                //         }
                //         console.info(JSON.stringify(assetNames));
                //     }
                // };
                // this.hierarchy.add(sceneOptions, "debug").onChange((v: boolean) => {
                //     const guiSceneSystem = Application.systemManager.getOrRegisterSystem(debug.GUISceneSystem);
                //     const guiSystem = Application.systemManager.getOrRegisterSystem(debug.GUISystem);
                //     if (v) {
                //         Application.playerMode = PlayerMode.DebugPlayer;
                //         guiSceneSystem.enabled = true;
                //         guiSystem.enabled = true;
                //     }
                //     else {
                //         this.select(null);
                //         Application.playerMode = PlayerMode.Player;
                //         guiSceneSystem.enabled = false;
                //         guiSystem.enabled = false;
                //         this.selectedGameObjects.length = 0;
                //         this.selectedScene = null;
                //         this.hoverGameObject = null;
                //         this.selectedGameObject = null;
                //     }
                // });
                // this.hierarchy.add(sceneOptions, "assets");
                // this.hierarchy.close();
            };
            GUIComponent.prototype.select = function (value, isReplace) {
                if (value) {
                    if (value instanceof paper.Scene) {
                        if (this.selectedScene === value) {
                            return;
                        }
                    }
                    else if (this.selectedGameObject === value ||
                        this.selectedGameObjects.indexOf(value) >= 0) {
                        return;
                    }
                }
                if (!value || value instanceof paper.Scene || this.selectedScene) {
                    isReplace = true;
                }
                if (isReplace) {
                    if (this.selectedScene) {
                        var selectedScene = this.selectedScene;
                        this.selectedScene = null;
                        paper.EventPool.dispatchEvent("SceneUnselected" /* SceneUnselected */, this, selectedScene);
                    }
                    else if (this.selectedGameObjects.length > 0) {
                        var gameObjects = this.selectedGameObjects.concat();
                        this.selectedGameObjects.length = 0;
                        this.selectedGameObject = null;
                        for (var _i = 0, gameObjects_1 = gameObjects; _i < gameObjects_1.length; _i++) {
                            var gameObject = gameObjects_1[_i];
                            paper.EventPool.dispatchEvent("GameObjectUnselected" /* GameObjectUnselected */, this, gameObject);
                        }
                    }
                }
                if (value) {
                    if (value instanceof paper.Scene) {
                        this.selectedScene = value;
                        paper.EventPool.dispatchEvent("SceneSelected" /* SceneSelected */, this, value);
                    }
                    else {
                        this.selectedGameObjects.push(value);
                        this.selectedGameObject = value;
                        paper.EventPool.dispatchEvent("GameObjectSelected" /* GameObjectSelected */, this, value);
                    }
                }
                (global || window)["psgo"] = value; // For quick debug.
            };
            GUIComponent.prototype.unselect = function (value) {
                if (value instanceof paper.Scene) {
                    if (this.selectedScene === value) {
                        this.selectedScene = null;
                        paper.EventPool.dispatchEvent("SceneUnselected" /* SceneUnselected */, this, value);
                    }
                }
                else {
                    var index = this.selectedGameObjects.indexOf(value);
                    if (index >= 0) {
                        if (this.selectedGameObject === value) {
                            this.selectedGameObject = null;
                        }
                        this.selectedGameObjects.splice(index, 1);
                        paper.EventPool.dispatchEvent("GameObjectUnselected" /* GameObjectUnselected */, this, value);
                    }
                }
            };
            GUIComponent.prototype.hover = function (value) {
                if (this.hoverGameObject === value) {
                    return;
                }
                this.hoverGameObject = value;
                paper.EventPool.dispatchEvent("GameObjectHovered" /* GameObjectHovered */, this, this.hoverGameObject);
            };
            return GUIComponent;
        }(paper.SingletonComponent));
        debug.GUIComponent = GUIComponent;
        __reflect(GUIComponent.prototype, "paper.debug.GUIComponent");
        // 
        // if (dat) {
        setTimeout(function () {
            paper.GameObject.globalGameObject.getOrAddComponent(debug.GUIComponent);
        }, 1000);
        // }
    })(debug = paper.debug || (paper.debug = {}));
})(paper || (paper = {}));
var paper;
(function (paper) {
    var debug;
    (function (debug) {
        var TransformMode;
        (function (TransformMode) {
            TransformMode[TransformMode["TRANSLATE"] = 0] = "TRANSLATE";
            TransformMode[TransformMode["ROTATE"] = 1] = "ROTATE";
            TransformMode[TransformMode["SCALE"] = 2] = "SCALE";
        })(TransformMode || (TransformMode = {}));
        var TransformAxis;
        (function (TransformAxis) {
            TransformAxis[TransformAxis["None"] = 0] = "None";
            TransformAxis[TransformAxis["X"] = 1] = "X";
            TransformAxis[TransformAxis["Y"] = 2] = "Y";
            TransformAxis[TransformAxis["Z"] = 3] = "Z";
            TransformAxis[TransformAxis["E"] = 4] = "E";
        })(TransformAxis || (TransformAxis = {}));
        var GUISceneSystem = (function (_super) {
            __extends(GUISceneSystem, _super);
            function GUISceneSystem() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this._interests = [
                    [
                        { componentClass: egret3d.Transform }
                    ]
                ];
                _this._camerasAndLights = paper.GameObject.globalGameObject.getOrAddComponent(egret3d.CamerasAndLights);
                _this._guiComponent = paper.GameObject.globalGameObject.getOrAddComponent(debug.GUIComponent);
                _this._orbitControls = null;
                _this._buttons = 0;
                _this._mouseStart = egret3d.Vector3.create();
                _this._startPoint = egret3d.Vector3.create();
                _this._endPoint = egret3d.Vector3.create();
                _this._axises = null;
                _this._hoverBox = null;
                _this._grids = null;
                _this._touchPlane = null;
                _this._cameraViewFrustum = null;
                _this._transformMode = 0 /* TRANSLATE */;
                _this._transformAxis = 0 /* None */;
                _this._pickableSelected = []; //可被选中的 camera
                _this._boxes = {};
                _this._pickableTool = {}; //可拾取的_axises
                _this._gizomsMap = {}; //
                //
                //
                _this._positionStart = egret3d.Vector3.create();
                //
                _this._startWorldPosition = egret3d.Vector3.create();
                _this._startWorldQuaternion = egret3d.Quaternion.create();
                _this._startWorldScale = egret3d.Vector3.create(1.0, 1.0, 1.0);
                //
                _this._selectedWorldPostion = egret3d.Vector3.create();
                _this._selectedWorldQuaternion = egret3d.Quaternion.create();
                _this._cameraPosition = egret3d.Vector3.create();
                _this._eye = egret3d.Vector3.create();
                _this._onMouseDown = function (event) {
                    var mousePosition = egret3d.Vector3.create(event.clientX, event.clientY, 0.0);
                    egret3d.InputManager.mouse.convertPosition(mousePosition, mousePosition);
                    if (event.button === 0) {
                        if (event.buttons & 2) {
                            return;
                        }
                        if (_this._transformAxis !== 0 /* None */) {
                            var raycastInfos = debug.Helper.raycast([_this._touchPlane], mousePosition.x, mousePosition.y);
                            var selectedGameObject = _this._guiComponent.selectedGameObject;
                            selectedGameObject.transform.getWorldMatrix().decompose(_this._startWorldPosition, _this._startWorldQuaternion, _this._startWorldScale);
                            var raycastInfosPos = raycastInfos[0].position;
                            _this._startPoint.copy(raycastInfosPos).subtract(_this._startWorldPosition, _this._startPoint);
                            _this._positionStart.copy(selectedGameObject.transform.getPosition()); // TODO
                        }
                    }
                    else if (event.button === 2) {
                    }
                    _this._buttons = event.buttons;
                    _this._mouseStart.set(event.clientX, event.clientY, 0.0);
                    mousePosition.release();
                    event.preventDefault();
                    // const rootGameObjects = paper.Application.sceneManager.activeScene.getRootGameObjects();
                    // let picks = rootGameObjects.concat(this._pickableSelected);
                    // if (this._axises.activeSelf) {
                    //     picks = picks.concat(this._pickableTool[this._transformMode]);
                    // }
                    // let raycastInfos = Helper.raycast(picks, mousePosition.x, mousePosition.y);
                    // let intersectObject = raycastInfos[0];
                    // let selected = intersectObject ? intersectObject.transform.gameObject : null;
                    // if (selected && selected.getComponent(GizmoPickComponent)) {
                    //     const pickTarget = selected.getComponent(GizmoPickComponent).pickTarget;
                    //     if (pickTarget) {
                    //         selected = pickTarget;
                    //     }
                    // }
                };
                _this._onMouseMove = function (event) {
                    var mousePosition = egret3d.Vector3.create(event.clientX, event.clientY);
                    egret3d.InputManager.mouse.convertPosition(mousePosition, mousePosition);
                    if (event.buttons & 2) {
                    }
                    else if (event.buttons & 1) {
                        if (_this._transformAxis !== 0 /* None */) {
                            var raycastInfos = debug.Helper.raycast([_this._touchPlane], mousePosition.x, mousePosition.y);
                            if (raycastInfos.length == 0) {
                                return;
                            }
                            var selected = _this._guiComponent.selectedGameObject;
                            _this._orbitControls.enableMove = false;
                            var intersectObject = raycastInfos[0];
                            var intersectObjectPos = intersectObject.position;
                            _this._endPoint.copy(intersectObjectPos).subtract(_this._startWorldPosition, _this._endPoint);
                            if (_this._transformMode === 0 /* TRANSLATE */) {
                                switch (_this._transformAxis) {
                                    case 1 /* X */:
                                        _this._endPoint.y = _this._startPoint.y;
                                        _this._endPoint.z = _this._startPoint.z;
                                        break;
                                    case 2 /* Y */:
                                        _this._endPoint.x = _this._startPoint.x;
                                        _this._endPoint.z = _this._startPoint.z;
                                        break;
                                    case 3 /* Z */:
                                        _this._endPoint.x = _this._startPoint.x;
                                        _this._endPoint.y = _this._startPoint.y;
                                        break;
                                }
                                _this._endPoint.subtract(_this._startPoint, _this._endPoint).add(_this._positionStart);
                                selected.transform.setPosition(_this._endPoint);
                            }
                            else if (_this._transformMode === 1 /* ROTATE */) {
                                var camera = egret3d.Camera.editor;
                                var tempVector = egret3d.Vector3.create();
                                var rotationAxis = egret3d.Vector3.create();
                                var tempQuaternion = egret3d.Quaternion.create();
                                var unit = egret3d.Vector3.create();
                                var ROTATION_SPEED = 20 / _this._selectedWorldPostion.getDistance(tempVector.applyMatrix(camera.gameObject.transform.getWorldMatrix()));
                                var rotationAngle = 0;
                                if (_this._transformAxis === 4 /* E */) {
                                    tempVector.copy(_this._endPoint).cross(_this._startPoint);
                                    rotationAxis.copy(_this._eye);
                                    rotationAngle = _this._endPoint.getAngle(_this._startPoint) * (tempVector.dot(_this._eye) < 0 ? 1 : -1);
                                }
                                else {
                                    switch (_this._transformAxis) {
                                        case 1 /* X */:
                                            unit.set(1, 0, 0);
                                            break;
                                        case 2 /* Y */:
                                            unit.set(0, 1, 0);
                                            break;
                                        case 3 /* Z */:
                                            unit.set(0, 0, 1);
                                            break;
                                    }
                                    rotationAxis.copy(unit);
                                    _this._endPoint.subtract(_this._startPoint, _this._endPoint);
                                    rotationAngle = _this._endPoint.dot(unit.cross(_this._eye).normalize()) * ROTATION_SPEED;
                                }
                                tempQuaternion.fromAxis(rotationAxis, rotationAngle).multiply(_this._startWorldQuaternion);
                                selected.transform.setRotation(tempQuaternion);
                                tempVector.release();
                                rotationAxis.release();
                                tempQuaternion.release();
                                unit.release();
                            }
                            else if (_this._transformMode === 2 /* SCALE */) {
                                var scaleMultiply = _this._endPoint.clone().divide(_this._startPoint);
                                switch (_this._transformAxis) {
                                    case 1 /* X */:
                                        scaleMultiply.y = 1;
                                        scaleMultiply.z = 1;
                                        break;
                                    case 2 /* Y */:
                                        scaleMultiply.x = 1;
                                        scaleMultiply.z = 1;
                                        break;
                                    case 3 /* Z */:
                                        scaleMultiply.x = 1;
                                        scaleMultiply.y = 1;
                                        break;
                                }
                                _this._endPoint.copy(_this._startWorldScale).multiply(scaleMultiply);
                                selected.transform.setScale(_this._endPoint);
                            }
                        }
                    }
                    else {
                        if (_this._guiComponent.selectedGameObject) {
                            var raycastInfos = debug.Helper.raycast(_this._pickableTool[_this._transformMode], mousePosition.x, mousePosition.y);
                            if (raycastInfos.length > 0) {
                                var transform = raycastInfos[0].transform;
                                switch (transform.gameObject.name) {
                                    case "pickX":
                                        _this._transformAxis = 1 /* X */;
                                        break;
                                    case "pickY":
                                        _this._transformAxis = 2 /* Y */;
                                        break;
                                    case "pickZ":
                                        _this._transformAxis = 3 /* Z */;
                                        break;
                                    case "pickE":
                                        _this._transformAxis = 4 /* E */;
                                        break;
                                    default:
                                        _this._transformAxis = 0 /* None */;
                                        break;
                                }
                            }
                            else {
                                _this._transformAxis = 0 /* None */;
                            }
                        }
                        else {
                            _this._transformAxis = 0 /* None */;
                        }
                        if (_this._transformAxis === 0 /* None */) {
                            var raycastInfos = debug.Helper.raycast(paper.Scene.activeScene.getRootGameObjects(), mousePosition.x, mousePosition.y);
                            if (raycastInfos.length > 0) {
                                _this._guiComponent.hover(raycastInfos[0].transform.gameObject);
                            }
                            else {
                                _this._guiComponent.hover(null);
                            }
                        }
                        else {
                            _this._guiComponent.hover(null);
                        }
                    }
                    mousePosition.release();
                    event.preventDefault();
                };
                _this._onMouseUp = function (event) {
                    var button = (_this._buttons & (~event.buttons));
                    if (button === 1) {
                        if (_this._transformAxis !== 0 /* None */) {
                            // TODO
                        }
                        else {
                            var hoverGameObject = _this._guiComponent.hoverGameObject;
                            if (hoverGameObject && Math.abs(_this._mouseStart.x - event.clientX) < 5 && Math.abs(_this._mouseStart.y - event.clientY) < 5) {
                                if (hoverGameObject.renderer instanceof egret3d.SkinnedMeshRenderer && !hoverGameObject.transform.find("pickHelper")) {
                                    var animation = hoverGameObject.getComponentInParent(egret3d.Animation);
                                    if (animation) {
                                        var pickGameObject = debug.EditorMeshHelper.createGameObject("pickHelper", null, null, "Editor Only" /* EditorOnly */, hoverGameObject.scene);
                                        pickGameObject.transform.parent = hoverGameObject.transform;
                                        pickGameObject.addComponent(debug.GizmoPickComponent).pickTarget = animation.gameObject;
                                    }
                                }
                                var pickHelper = hoverGameObject.transform.find("pickHelper");
                                if (pickHelper) {
                                    _this._guiComponent.select(pickHelper.gameObject.getComponent(debug.GizmoPickComponent).pickTarget, !(event.ctrlKey));
                                }
                                else {
                                    _this._guiComponent.select(hoverGameObject, !(event.ctrlKey));
                                }
                            }
                        }
                    }
                    else if (button === 2) {
                        _this._orbitControls.enableMove = true;
                    }
                    _this._buttons = event.buttons;
                    event.preventDefault();
                };
                _this._onKeyUp = function (event) {
                    switch (event.key) {
                        case "Escape":
                            _this._guiComponent.select(null);
                            break;
                        case "f":
                            if (_this._guiComponent.selectedGameObject) {
                                _this._orbitControls.lookAtPoint.copy(_this._guiComponent.selectedGameObject.transform.position);
                                _this._orbitControls.distance = 10;
                                _this._orbitControls.lookAtOffset.set(0, 0, 0);
                            }
                            break;
                        case "w": {
                            _this._transformModeHandler(0 /* TRANSLATE */);
                            break;
                        }
                        case "e": {
                            _this._transformModeHandler(1 /* ROTATE */);
                            break;
                        }
                        case "r": {
                            _this._transformModeHandler(2 /* SCALE */);
                            break;
                        }
                    }
                };
                _this._onKeyDown = function (event) {
                };
                _this._onGameObjectSelected = function (_c, value) {
                    _this._selectGameObject(value, true);
                };
                _this._onGameObjectHovered = function (_c, value) {
                    if (value) {
                        _this._hoverBox.activeSelf = true;
                        if (_this._hoverBox.scene !== value.scene) {
                            _this._hoverBox.dontDestroy = true;
                            _this._hoverBox.dontDestroy = false;
                        }
                        _this._hoverBox.parent = value;
                    }
                    else {
                        _this._hoverBox.activeSelf = false;
                        _this._hoverBox.parent = null;
                    }
                };
                _this._onGameObjectUnselected = function (_c, value) {
                    _this._selectGameObject(value, false);
                };
                return _this;
            }
            GUISceneSystem.prototype._selectGameObject = function (value, selected) {
                if (selected) {
                    this._axises.activeSelf = true;
                    {
                        var box = debug.EditorMeshHelper.createBox("Box", egret3d.Color.create(0.0, 1.0, 1.0).release(), value.scene);
                        box.activeSelf = false;
                        box.parent = value;
                        this._boxes[value.uuid] = box;
                    }
                }
                else {
                    this._transformAxis = 0 /* None */;
                    this._axises.activeSelf = false; // TODO
                    var box = this._boxes[value.uuid];
                    if (!box) {
                        throw new Error(); // Never.
                    }
                    delete this._boxes[value.uuid];
                    box.destroy();
                }
            };
            GUISceneSystem.prototype._transformModeHandler = function (value) {
                this._transformMode = value;
                this._axises.transform.find("translate").gameObject.activeSelf = value === 0 /* TRANSLATE */;
                this._axises.transform.find("rotate").gameObject.activeSelf = value === 1 /* ROTATE */;
                this._axises.transform.find("scale").gameObject.activeSelf = value === 2 /* SCALE */;
            };
            GUISceneSystem.prototype._setPoint = function (cameraProject, positions, x, y, z, points) {
                var vector = egret3d.Vector3.create();
                var matrix = egret3d.Matrix4.create();
                vector.set(x, y, z).applyMatrix(matrix.inverse(cameraProject)).applyMatrix(egret3d.Matrix4.IDENTITY);
                if (points !== undefined) {
                    for (var i = 0, l = points.length; i < l; i++) {
                        var index = points[i] * 3;
                        positions[index + 0] = vector.x;
                        positions[index + 1] = vector.y;
                        positions[index + 2] = vector.z;
                    }
                }
                vector.release();
                matrix.release();
            };
            GUISceneSystem.prototype._updateAxises = function () {
                if (this._axises.activeSelf) {
                    this._axises.transform.position = this._selectedWorldPostion;
                    var eyeDistance = this._selectedWorldPostion.getDistance(this._cameraPosition);
                    var translateObj = this._axises.transform.find("translate");
                    var rotateObj = this._axises.transform.find("rotate");
                    var scaleObj = this._axises.transform.find("scale");
                    //
                    this._axises.transform.setScale(egret3d.Vector3.ONE.clone().multiplyScalar(eyeDistance / 10).release());
                    if (this._transformMode === 0 /* TRANSLATE */ || this._transformMode === 2 /* SCALE */) {
                        // translateObj.rotation = this._selectedWorldQuaternion;
                        // scaleObj.rotation = this._selectedWorldQuaternion;
                    }
                    else if (this._transformMode === 1 /* ROTATE */) {
                        var quaternion = egret3d.Quaternion.IDENTITY; //TODO local
                        var tempQuaternion = quaternion.clone();
                        var tempQuaternion2 = egret3d.Quaternion.create();
                        var alignVector = this._eye.clone();
                        alignVector.applyQuaternion(tempQuaternion.inverse());
                        {
                            var axisE = rotateObj.find("axisE");
                            var pickE = rotateObj.find("pickE");
                            tempQuaternion2.fromMatrix(egret3d.Matrix4.create().lookAt(this._eye, egret3d.Vector3.ZERO, egret3d.Vector3.UP).release());
                            axisE.setRotation(tempQuaternion2);
                            pickE.setRotation(tempQuaternion2);
                        }
                        {
                            var axisX = rotateObj.find("axisX");
                            tempQuaternion2.copy(tempQuaternion).fromAxis(egret3d.Vector3.RIGHT, Math.atan2(-alignVector.y, alignVector.z));
                            tempQuaternion2.multiply(quaternion);
                            axisX.setRotation(tempQuaternion2);
                        }
                        {
                            var axisY = rotateObj.find("axisY");
                            tempQuaternion2.copy(tempQuaternion).fromAxis(egret3d.Vector3.UP, Math.atan2(alignVector.x, alignVector.z));
                            tempQuaternion2.multiply(quaternion);
                            axisY.setRotation(tempQuaternion2);
                        }
                        {
                            var axisZ = rotateObj.find("axisZ");
                            tempQuaternion2.copy(tempQuaternion).fromAxis(egret3d.Vector3.FORWARD, Math.atan2(alignVector.y, alignVector.x));
                            tempQuaternion2.multiply(quaternion);
                            axisZ.setRotation(tempQuaternion2);
                        }
                        tempQuaternion.release();
                        tempQuaternion2.release();
                        alignVector.release();
                    }
                }
                //TODO
                if (this._guiComponent.selectedGameObject) {
                    this._guiComponent.selectedGameObject.transform.getLocalEulerAngles();
                }
            };
            GUISceneSystem.prototype._updateBoxes = function () {
                for (var _i = 0, _a = this._guiComponent.selectedGameObjects; _i < _a.length; _i++) {
                    var gameObject = _a[_i];
                    var box = this._boxes[gameObject.uuid];
                    if (!box) {
                        throw new Error(); // Never.
                    }
                    if (gameObject.renderer) {
                        box.activeSelf = true;
                        box.transform.localPosition = gameObject.renderer.aabb.center;
                        box.transform.localScale = gameObject.renderer.aabb.size;
                    }
                    else {
                        box.activeSelf = false;
                    }
                }
                if (this._hoverBox.activeSelf) {
                    var parentRenderer = this._hoverBox.parent.renderer;
                    if (parentRenderer) {
                        this._hoverBox.transform.localPosition = parentRenderer.aabb.center;
                        this._hoverBox.transform.localScale = parentRenderer.aabb.size;
                    }
                    else {
                        this._hoverBox.activeSelf = false;
                    }
                }
            };
            GUISceneSystem.prototype._updateCameras = function () {
                for (var _i = 0, _a = this._camerasAndLights.cameras; _i < _a.length; _i++) {
                    var camera = _a[_i];
                    if (camera.gameObject.tag === "Editor Only" /* EditorOnly */) {
                        continue;
                    }
                    var __editor = camera.transform.find("__editor");
                    if (__editor) {
                        var eyeDistance = this._selectedWorldPostion.getDistance(this._cameraPosition);
                        var tempQuaternion2 = egret3d.Quaternion.create();
                        tempQuaternion2.fromMatrix(egret3d.Matrix4.create().lookAt(this._eye, egret3d.Vector3.ZERO, egret3d.Vector3.UP).release());
                        __editor.transform.setLocalScale(egret3d.Vector3.ONE.clone().multiplyScalar(eyeDistance / 40).release());
                        __editor.transform.setRotation(tempQuaternion2);
                    }
                    else {
                        __editor = debug.EditorMeshHelper.createCameraIcon("__editor", camera.gameObject).transform;
                        __editor.parent = camera.gameObject.transform;
                    }
                    // const pick = iconObject;
                    var pick = __editor.transform.find("pick").gameObject;
                    if (this._pickableSelected.indexOf(pick) < 0) {
                        this._pickableSelected.push(pick);
                    }
                }
                var selectedCamera = this._guiComponent.selectedGameObject ? this._guiComponent.selectedGameObject.getComponent(egret3d.Camera) : null;
                if (selectedCamera) {
                    this._cameraViewFrustum.transform.position = selectedCamera.gameObject.transform.position;
                    this._cameraViewFrustum.transform.rotation = selectedCamera.gameObject.transform.rotation;
                    this._cameraViewFrustum.activeSelf = true;
                    var mesh = this._cameraViewFrustum.getComponent(egret3d.MeshFilter).mesh;
                    var cameraProject = egret3d.Matrix4.create();
                    var viewPortPixel = { x: 0, y: 0, w: 0, h: 0 };
                    selectedCamera.calcViewPortPixel(viewPortPixel); // update viewport
                    selectedCamera.calcProjectMatrix(viewPortPixel.w / viewPortPixel.h, cameraProject);
                    var positions = mesh.getVertices();
                    // center / target
                    this._setPoint(cameraProject, positions, 0, 0, -1, [38, 41]);
                    this._setPoint(cameraProject, positions, 0, 0, 1, [39]);
                    // near,
                    this._setPoint(cameraProject, positions, -1, -1, -1, [0, 7, 16, 25]);
                    this._setPoint(cameraProject, positions, 1, -1, -1, [1, 2, 18, 27]);
                    this._setPoint(cameraProject, positions, -1, 1, -1, [5, 6, 20, 29]);
                    this._setPoint(cameraProject, positions, 1, 1, -1, [3, 4, 22, 31]);
                    // far,
                    this._setPoint(cameraProject, positions, -1, -1, 1, [8, 15, 17]);
                    this._setPoint(cameraProject, positions, 1, -1, 1, [9, 10, 19]);
                    this._setPoint(cameraProject, positions, -1, 1, 1, [13, 14, 21]);
                    this._setPoint(cameraProject, positions, 1, 1, 1, [11, 12, 23]);
                    // up,
                    this._setPoint(cameraProject, positions, 0.7, 1.1, -1, [32, 37]);
                    this._setPoint(cameraProject, positions, -0.7, 1.1, -1, [33, 34]);
                    this._setPoint(cameraProject, positions, 0, 2, -1, [35, 36]);
                    // cross,
                    this._setPoint(cameraProject, positions, -1, 0, 1, [42]);
                    this._setPoint(cameraProject, positions, 1, 0, 1, [43]);
                    this._setPoint(cameraProject, positions, 0, -1, 1, [44]);
                    this._setPoint(cameraProject, positions, 0, 1, 1, [45]);
                    this._setPoint(cameraProject, positions, -1, 0, -1, [46]);
                    this._setPoint(cameraProject, positions, 1, 0, -1, [47]);
                    this._setPoint(cameraProject, positions, 0, -1, -1, [48]);
                    this._setPoint(cameraProject, positions, 0, 1, -1, [49]);
                    mesh.uploadVertexBuffer("POSITION" /* POSITION */);
                    cameraProject.release();
                }
                else {
                    this._cameraViewFrustum.activeSelf = false;
                }
            };
            GUISceneSystem.prototype._updateLights = function () {
                for (var _i = 0, _a = this._camerasAndLights.lights; _i < _a.length; _i++) {
                    var light = _a[_i];
                    if (light.gameObject.tag === "Editor Only" /* EditorOnly */) {
                        continue;
                    }
                    var __editor = light.transform.find("__editor");
                    if (__editor) {
                        var eyeDistance = this._selectedWorldPostion.getDistance(this._cameraPosition);
                        var tempQuaternion2 = egret3d.Quaternion.create();
                        tempQuaternion2.fromMatrix(egret3d.Matrix4.create().lookAt(this._eye, egret3d.Vector3.ZERO, egret3d.Vector3.UP).release());
                        __editor.transform.setLocalScale(egret3d.Vector3.ONE.clone().multiplyScalar(eyeDistance / 40).release());
                        __editor.transform.setRotation(tempQuaternion2);
                    }
                    else {
                        __editor = debug.EditorMeshHelper.createLightIcon("__editor", light.gameObject).transform;
                        __editor.parent = light.gameObject.transform;
                    }
                    // const pick = iconObject;
                    var pick = __editor.transform.find("pick").gameObject;
                    if (this._pickableSelected.indexOf(pick) < 0) {
                        this._pickableSelected.push(pick);
                    }
                }
            };
            GUISceneSystem.prototype._updateTouchPlane = function () {
                if (!this._guiComponent.selectedGameObject) {
                    return;
                }
                if (!this._touchPlane || this._touchPlane.isDestroyed) {
                    return;
                }
                var editorCamera = egret3d.Camera.editor;
                var worldPosition = this._guiComponent.selectedGameObject.transform.getPosition();
                var position = worldPosition.clone();
                var quaternion = egret3d.Quaternion.create();
                var unitX = egret3d.Vector3.create(1, 0, 0);
                var unitY = egret3d.Vector3.create(0, 1, 0);
                var unitZ = egret3d.Vector3.create(0, 0, 1);
                unitX.set(1, 0, 0).applyQuaternion(egret3d.Quaternion.IDENTITY);
                unitY.set(0, 1, 0).applyQuaternion(egret3d.Quaternion.IDENTITY);
                unitZ.set(0, 0, 1).applyQuaternion(egret3d.Quaternion.IDENTITY);
                // Align the plane for current transform mode, axis and space.
                var alignVector = unitY.clone();
                var dirVector = egret3d.Vector3.create();
                var eye = editorCamera.transform.getPosition().clone();
                if (editorCamera.opvalue > 0) {
                    eye.subtract(worldPosition, eye);
                }
                eye.normalize();
                switch (this._transformMode) {
                    case 0 /* TRANSLATE */:
                    case 2 /* SCALE */:
                        switch (this._transformAxis) {
                            case 1 /* X */:
                                alignVector.copy(eye).cross(unitX);
                                dirVector.copy(unitX).cross(alignVector);
                                break;
                            case 2 /* Y */:
                                alignVector.copy(eye).cross(unitY);
                                dirVector.copy(unitY).cross(alignVector);
                                break;
                            case 3 /* Z */:
                                alignVector.copy(eye).cross(unitZ);
                                dirVector.copy(unitZ).cross(alignVector);
                                break;
                        }
                        break;
                    case 1 /* ROTATE */:
                    default:
                        // special case for rotate
                        dirVector.set(0, 0, 0);
                }
                if (dirVector.length === 0) {
                    // If in rotate mode, make the plane parallel to camera
                    var cameraQuaternion = editorCamera.transform.getRotation();
                    quaternion.copy(cameraQuaternion);
                }
                else {
                    var tempMatrix = egret3d.Matrix4.create();
                    var tempVector = egret3d.Vector3.create();
                    tempMatrix.lookAt(tempVector.set(0, 0, 0), dirVector, alignVector);
                    quaternion.fromMatrix(tempMatrix);
                    tempVector.release();
                    tempMatrix.release();
                }
                this._touchPlane.transform.setPosition(position);
                this._touchPlane.transform.setRotation(quaternion);
                position.release();
                unitX.release();
                unitY.release();
                unitZ.release();
                alignVector.release();
                dirVector.release();
                quaternion.release();
                eye.release();
            };
            GUISceneSystem.prototype.onAwake = function () {
                egret3d.WebGLCapabilities.canvas.addEventListener('contextmenu', function contextmenu(event) { event.preventDefault(); });
                this._axises = debug.EditorMeshHelper.createAxises("Axis");
                this._axises.activeSelf = false;
                this._hoverBox = debug.EditorMeshHelper.createBox("HoverBox", egret3d.Color.WHITE, paper.Scene.activeScene);
                this._hoverBox.activeSelf = false;
            };
            GUISceneSystem.prototype.onEnable = function () {
                //
                paper.Application.playerMode = 1 /* DebugPlayer */;
                this._orbitControls = egret3d.Camera.editor.gameObject.getOrAddComponent(debug.OrbitControls);
                //
                if (!this._grids) {
                    this._grids = debug.EditorMeshHelper.createGrid("Grid");
                }
                if (!this._touchPlane) {
                    this._touchPlane = debug.EditorMeshHelper.createTouchPlane("TouchPlane");
                    this._touchPlane.activeSelf = false;
                }
                if (!this._cameraViewFrustum) {
                    this._cameraViewFrustum = debug.EditorMeshHelper.createCameraWireframed("Camera");
                    this._cameraViewFrustum.activeSelf = false;
                }
                this._transformAxis = 0 /* None */;
                //
                this._gizomsMap[1 /* X */] = [];
                //
                this._pickableTool[0 /* TRANSLATE */] = [];
                this._pickableTool[0 /* TRANSLATE */].push(this._axises.transform.find("translate").find("pickX").gameObject);
                this._pickableTool[0 /* TRANSLATE */].push(this._axises.transform.find("translate").find("pickY").gameObject);
                this._pickableTool[0 /* TRANSLATE */].push(this._axises.transform.find("translate").find("pickZ").gameObject);
                //
                this._pickableTool[1 /* ROTATE */] = [];
                this._pickableTool[1 /* ROTATE */].push(this._axises.transform.find("rotate").find("pickX").gameObject);
                this._pickableTool[1 /* ROTATE */].push(this._axises.transform.find("rotate").find("pickY").gameObject);
                this._pickableTool[1 /* ROTATE */].push(this._axises.transform.find("rotate").find("pickZ").gameObject);
                this._pickableTool[1 /* ROTATE */].push(this._axises.transform.find("rotate").find("pickE").gameObject);
                //
                this._pickableTool[2 /* SCALE */] = [];
                this._pickableTool[2 /* SCALE */].push(this._axises.transform.find("scale").find("pickX").gameObject);
                this._pickableTool[2 /* SCALE */].push(this._axises.transform.find("scale").find("pickY").gameObject);
                this._pickableTool[2 /* SCALE */].push(this._axises.transform.find("scale").find("pickZ").gameObject);
                this._pickableSelected.length = 0;
                paper.EventPool.addEventListener("GameObjectHovered" /* GameObjectHovered */, debug.GUIComponent, this._onGameObjectHovered);
                paper.EventPool.addEventListener("GameObjectSelected" /* GameObjectSelected */, debug.GUIComponent, this._onGameObjectSelected);
                paper.EventPool.addEventListener("GameObjectUnselected" /* GameObjectUnselected */, debug.GUIComponent, this._onGameObjectUnselected);
                {
                    var canvas = egret3d.WebGLCapabilities.canvas;
                    canvas.addEventListener("mousedown", this._onMouseDown);
                    canvas.addEventListener("mousemove", this._onMouseMove);
                    canvas.addEventListener("mouseup", this._onMouseUp);
                    window.addEventListener("keyup", this._onKeyUp);
                    window.addEventListener("keydown", this._onKeyDown);
                }
                //
                this._transformModeHandler(this._transformMode);
            };
            GUISceneSystem.prototype.onDisable = function () {
                egret3d.Camera.editor.gameObject.removeComponent(debug.OrbitControls);
                this._orbitControls = null;
                //
                for (var _i = 0, _a = this._camerasAndLights.cameras; _i < _a.length; _i++) {
                    var camera = _a[_i];
                    if (camera.gameObject.tag === "Editor Only" /* EditorOnly */) {
                        continue;
                    }
                    var __editor = camera.transform.find("__editor");
                    if (__editor) {
                        __editor.gameObject.destroy();
                    }
                }
                paper.EventPool.removeEventListener("GameObjectHovered" /* GameObjectHovered */, debug.GUIComponent, this._onGameObjectHovered);
                paper.EventPool.removeEventListener("GameObjectSelected" /* GameObjectSelected */, debug.GUIComponent, this._onGameObjectSelected);
                paper.EventPool.removeEventListener("GameObjectUnselected" /* GameObjectUnselected */, debug.GUIComponent, this._onGameObjectUnselected);
                {
                    var canvas = egret3d.WebGLCapabilities.canvas;
                    canvas.removeEventListener("mousedown", this._onMouseDown);
                    canvas.removeEventListener("mouseup", this._onMouseUp);
                    canvas.removeEventListener("mousemove", this._onMouseMove);
                    window.removeEventListener("keyup", this._onKeyUp);
                    window.removeEventListener("keydown", this._onKeyDown);
                }
                if (this._touchPlane && !this._touchPlane.isDestroyed) {
                    this._touchPlane.destroy();
                    this._touchPlane = null;
                }
                if (this._grids && !this._grids.isDestroyed) {
                    this._grids.destroy();
                    this._grids = null;
                }
                if (this._cameraViewFrustum && !this._cameraViewFrustum.isDestroyed) {
                    this._cameraViewFrustum.destroy();
                    this._cameraViewFrustum = null;
                }
                this._pickableSelected.length = 0;
                paper.Application.playerMode = 0 /* Player */;
            };
            GUISceneSystem.prototype.onUpdate = function (dt) {
                for (var _i = 0, _a = this._guiComponent.selectedGameObjects; _i < _a.length; _i++) {
                    var gameObject = _a[_i];
                    if (gameObject.isDestroyed) {
                        this._guiComponent.select(null);
                    }
                }
                var selectedGameObject = this._guiComponent.selectedGameObject;
                if (selectedGameObject) {
                    this._selectedWorldPostion.copy(selectedGameObject.transform.getPosition());
                    this._selectedWorldQuaternion.copy(selectedGameObject.transform.getRotation());
                }
                this._pickableSelected.length = 0;
                //
                if (this._touchPlane && this._touchPlane.isDestroyed) {
                    this._touchPlane = null;
                }
                if (this._grids && this._grids.isDestroyed) {
                    this._grids = null;
                }
                if (this._cameraViewFrustum) {
                    if (this._cameraViewFrustum.isDestroyed) {
                        this._cameraViewFrustum = null;
                    }
                    else {
                        this._cameraViewFrustum.activeSelf = selectedGameObject ? true : false;
                    }
                }
                var camera = egret3d.Camera.editor;
                this._cameraPosition.copy(camera.transform.getPosition());
                if (camera.opvalue == 0) {
                    this._eye.copy(this._cameraPosition).normalize();
                }
                else {
                    this._eye.copy(this._cameraPosition).subtract(this._selectedWorldPostion).normalize();
                }
                this._updateAxises();
                this._updateBoxes();
                this._updateCameras();
                this._updateLights();
                this._updateTouchPlane();
            };
            return GUISceneSystem;
        }(paper.BaseSystem));
        debug.GUISceneSystem = GUISceneSystem;
        __reflect(GUISceneSystem.prototype, "paper.debug.GUISceneSystem");
    })(debug = paper.debug || (paper.debug = {}));
})(paper || (paper = {}));
var paper;
(function (paper) {
    var debug;
    (function (debug) {
        var GUISystem = (function (_super) {
            __extends(GUISystem, _super);
            function GUISystem() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this._interests = [
                    [
                        { componentClass: egret3d.Transform }
                    ]
                ];
                _this._disposeCollecter = paper.GameObject.globalGameObject.getOrAddComponent(paper.DisposeCollecter);
                _this._guiComponent = paper.GameObject.globalGameObject.getOrAddComponent(debug.GUIComponent);
                _this._bufferedGameObjects = [];
                _this._hierarchyFolders = {};
                _this._inspectorFolders = {};
                _this._selectFolder = null;
                _this._sceneSelectedHandler = function (_c, value) {
                    _this._selectSceneOrGameObject(value);
                };
                _this._sceneUnselectedHandler = function (_c, value) {
                    _this._selectSceneOrGameObject(null);
                };
                _this._gameObjectSelectedHandler = function (_c, value) {
                    _this._selectSceneOrGameObject(value);
                };
                _this._gameObjectUnselectedHandler = function (_c, value) {
                    _this._selectSceneOrGameObject(null);
                };
                _this._createGameObject = function () {
                    if (_this._guiComponent.selectedScene) {
                        var gameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE, "NoName" /* NoName */, "" /* Untagged */, _this._guiComponent.selectedScene);
                        _this._guiComponent.select(gameObject, true);
                    }
                    else {
                        var gameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE, "NoName" /* NoName */, "" /* Untagged */, _this._guiComponent.selectedGameObject.scene);
                        gameObject.transform.parent = _this._guiComponent.selectedGameObject.transform;
                        _this._guiComponent.select(gameObject, true);
                    }
                };
                _this._destroySceneOrGameObject = function () {
                    var selectedSceneOrGameObject = _this._guiComponent.inspector.instance;
                    if (selectedSceneOrGameObject) {
                        _this._guiComponent.select(null); // TODO 
                        (selectedSceneOrGameObject).destroy();
                    }
                };
                _this._nodeClickHandler = function (gui) {
                    _this._guiComponent.select(gui.instance, true);
                };
                return _this;
            }
            GUISystem.prototype._openFolder = function (folder) {
                folder.open();
                if (folder.parent && folder.parent !== this._guiComponent.hierarchy) {
                    this._openFolder(folder.parent);
                }
            };
            GUISystem.prototype._selectSceneOrGameObject = function (sceneOrGameObject) {
                // Unselect prev folder.
                if (this._selectFolder) {
                    this._selectFolder.selected = false;
                    this._selectFolder = null;
                }
                this._guiComponent.inspector.instance = sceneOrGameObject;
                if (sceneOrGameObject) {
                    if (sceneOrGameObject instanceof paper.Scene) {
                        // Update scene.
                        this._guiComponent.inspector.add(this, "_createGameObject", "createObject");
                        this._guiComponent.inspector.add(this, "_destroySceneOrGameObject", "destroy");
                        this._addToInspector(this._guiComponent.inspector);
                    }
                    else {
                        // Update game object.
                        this._guiComponent.inspector.add(this, "_createGameObject", "createChildObject");
                        this._guiComponent.inspector.add(this, "_destroySceneOrGameObject", "destroy");
                        this._addToInspector(this._guiComponent.inspector);
                        // Update components.
                        for (var _i = 0, _a = sceneOrGameObject.components; _i < _a.length; _i++) {
                            var component = _a[_i];
                            var folder = this._guiComponent.inspector.addFolder(component.uuid, egret.getQualifiedClassName(component));
                            folder.instance = component;
                            this._inspectorFolders[component.uuid] = folder;
                            this._addToInspector(folder);
                        }
                    }
                }
                else {
                    for (var k in this._inspectorFolders) {
                        delete this._inspectorFolders[k];
                    }
                    if (this._guiComponent.inspector.__controllers) {
                        for (var _b = 0, _d = this._guiComponent.inspector.__controllers.concat(); _b < _d.length; _b++) {
                            var controller = _d[_b];
                            this._guiComponent.inspector.remove(controller);
                        }
                    }
                    if (this._guiComponent.inspector.__folders) {
                        for (var k in this._guiComponent.inspector.__folders) {
                            this._guiComponent.inspector.removeFolder(this._guiComponent.inspector.__folders[k]);
                        }
                    }
                }
            };
            GUISystem.prototype._addToHierarchy = function (gameObject) {
                if (gameObject.uuid in this._hierarchyFolders ||
                    gameObject.tag === "Editor Only" /* EditorOnly */ ||
                    gameObject.hideFlags === 2 /* Hide */ ||
                    gameObject.hideFlags === 3 /* HideAndDontSave */) {
                    return;
                }
                var parentFolder = this._hierarchyFolders[gameObject.transform.parent ? gameObject.transform.parent.gameObject.uuid : gameObject.scene.uuid];
                if (!parentFolder) {
                    if (gameObject.transform.parent) {
                        throw new Error(); // Never.
                    }
                    parentFolder = this._guiComponent.hierarchy.addFolder(gameObject.scene.uuid, gameObject.scene.name + " <Scene>");
                    parentFolder.instance = gameObject.scene;
                    parentFolder.onClick = this._nodeClickHandler;
                    this._hierarchyFolders[gameObject.scene.uuid] = parentFolder;
                }
                var folder = parentFolder.addFolder(gameObject.uuid, gameObject.name);
                folder.instance = gameObject;
                folder.onClick = this._nodeClickHandler;
                this._hierarchyFolders[gameObject.uuid] = folder;
            };
            GUISystem.prototype._addToInspector = function (gui) {
                var infos = paper.editor.getEditInfo(gui.instance);
                var guiControllerA;
                var guiControllerB;
                var guiControllerC;
                var _loop_1 = function (info) {
                    switch (info.editType) {
                        case 0 /* UINT */:
                            guiControllerA = this_1._guiComponent.inspector.add(gui.instance, info.name).min(0).step(1).listen();
                            if (info.option) {
                                if (info.option.minimum !== undefined) {
                                    guiControllerA.min(info.option.minimum);
                                }
                                if (info.option.maximum !== undefined) {
                                    guiControllerA.max(info.option.maximum);
                                }
                                if (info.option.step !== undefined) {
                                    guiControllerA.step(info.option.step);
                                }
                            }
                            break;
                        case 1 /* INT */:
                            guiControllerA = this_1._guiComponent.inspector.add(gui.instance, info.name).step(1).listen();
                            if (info.option) {
                                if (info.option.minimum !== undefined) {
                                    guiControllerA.min(info.option.minimum);
                                }
                                if (info.option.maximum !== undefined) {
                                    guiControllerA.max(info.option.maximum);
                                }
                                if (info.option.step !== undefined) {
                                    guiControllerA.step(info.option.step);
                                }
                            }
                            break;
                        case 2 /* FLOAT */:
                            guiControllerA = this_1._guiComponent.inspector.add(gui.instance, info.name).step(0.1).listen();
                            if (info.option) {
                                if (info.option.minimum !== undefined) {
                                    guiControllerA.min(info.option.minimum);
                                }
                                if (info.option.maximum !== undefined) {
                                    guiControllerA.max(info.option.maximum);
                                }
                                if (info.option.step !== undefined) {
                                    guiControllerA.step(info.option.step);
                                }
                            }
                            break;
                        case 4 /* CHECKBOX */:
                        case 3 /* TEXT */:
                            this_1._guiComponent.inspector.add(gui.instance, info.name).listen();
                            break;
                        case 10 /* LIST */:
                            this_1._guiComponent.inspector.add(gui.instance, info.name, info.option.listItems).listen();
                            break;
                        case 5 /* VECTOR2 */: {
                            var descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(gui.instance), info.name);
                            if (descriptor) {
                                if (descriptor.get && descriptor.set) {
                                    var onChange = function () {
                                        gui.instance[info.name] = gui.instance[info.name];
                                    };
                                    guiControllerA = this_1._guiComponent.inspector.add(gui.instance[info.name], "x", info.name + ": x").step(0.1).listen();
                                    guiControllerB = this_1._guiComponent.inspector.add(gui.instance[info.name], "y", info.name + ": y").step(0.1).listen();
                                    guiControllerA.onChange(onChange);
                                    guiControllerB.onChange(onChange);
                                }
                                else {
                                    guiControllerA = this_1._guiComponent.inspector.add(gui.instance[info.name], "x", info.name + ": x").step(0.1).listen();
                                    guiControllerB = this_1._guiComponent.inspector.add(gui.instance[info.name], "y", info.name + ": y").step(0.1).listen();
                                }
                            }
                            break;
                        }
                        case 6 /* VECTOR3 */: {
                            var descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(gui.instance), info.name);
                            if (descriptor) {
                                if (descriptor.get && descriptor.set) {
                                    var onChange = function () {
                                        gui.instance[info.name] = gui.instance[info.name];
                                    };
                                    guiControllerA = this_1._guiComponent.inspector.add(gui.instance[info.name], "x", info.name + ": x").step(0.1).listen();
                                    guiControllerB = this_1._guiComponent.inspector.add(gui.instance[info.name], "y", info.name + ": y").step(0.1).listen();
                                    guiControllerC = this_1._guiComponent.inspector.add(gui.instance[info.name], "z", info.name + ": z").step(0.1).listen();
                                    guiControllerA.onChange(onChange);
                                    guiControllerB.onChange(onChange);
                                    guiControllerC.onChange(onChange);
                                }
                                else {
                                    guiControllerA = this_1._guiComponent.inspector.add(gui.instance[info.name], "x", info.name + ": x").step(0.1).listen();
                                    guiControllerB = this_1._guiComponent.inspector.add(gui.instance[info.name], "y", info.name + ": y").step(0.1).listen();
                                    guiControllerC = this_1._guiComponent.inspector.add(gui.instance[info.name], "z", info.name + ": z").step(0.1).listen();
                                }
                                if (info.option) {
                                    if (info.option.minimum !== undefined) {
                                        guiControllerA.min(info.option.minimum);
                                        guiControllerB.min(info.option.minimum);
                                        guiControllerC.min(info.option.minimum);
                                    }
                                    if (info.option.maximum !== undefined) {
                                        guiControllerA.max(info.option.maximum);
                                        guiControllerB.max(info.option.maximum);
                                        guiControllerC.max(info.option.maximum);
                                    }
                                    if (info.option.step !== undefined) {
                                        guiControllerA.step(info.option.step);
                                        guiControllerB.step(info.option.step);
                                        guiControllerC.step(info.option.step);
                                    }
                                }
                            }
                            break;
                        }
                        case 7 /* VECTOR4 */:
                        case 8 /* QUATERNION */:
                            break;
                        case 9 /* COLOR */: {
                            // TODO
                            // const descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(gui.instance), info.name);
                            // if (descriptor) {
                            //     if (descriptor.get && descriptor.set) {
                            //         const onChange = () => {
                            //             gui.instance[info.name] = gui.instance[info.name];
                            //         };
                            //         // this._gameObject.add(gui.instance[info.name], "r", `${info.name}: x`).onChange(onChange);
                            //         // this._gameObject.add(gui.instance[info.name], "g", `${info.name}: y`).onChange(onChange);
                            //         // this._gameObject.add(gui.instance[info.name], "b", `${info.name}: z`).onChange(onChange);
                            //     }
                            //     else {
                            //         // this._gameObject.add(gui.instance[info.name], "x", `${info.name}: x`);
                            //         // this._gameObject.add(gui.instance[info.name], "y", `${info.name}: y`);
                            //         // this._gameObject.add(gui.instance[info.name], "z", `${info.name}: z`);
                            //     }
                            // }
                            break;
                        }
                        case 11 /* RECT */:
                            break;
                        case 14 /* GAMEOBJECT */:
                            break;
                    }
                };
                var this_1 = this;
                for (var _i = 0, infos_1 = infos; _i < infos_1.length; _i++) {
                    var info = infos_1[_i];
                    _loop_1(info);
                }
            };
            GUISystem.prototype.onAwake = function () {
            };
            GUISystem.prototype.onEnable = function () {
                paper.EventPool.addEventListener("SceneSelected" /* SceneSelected */, debug.GUIComponent, this._sceneSelectedHandler);
                paper.EventPool.addEventListener("SceneUnselected" /* SceneUnselected */, debug.GUIComponent, this._sceneUnselectedHandler);
                paper.EventPool.addEventListener("GameObjectSelected" /* GameObjectSelected */, debug.GUIComponent, this._gameObjectSelectedHandler);
                paper.EventPool.addEventListener("GameObjectUnselected" /* GameObjectUnselected */, debug.GUIComponent, this._gameObjectUnselectedHandler);
                this._guiComponent.select(paper.Scene.activeScene);
                this._bufferedGameObjects.push(paper.GameObject.globalGameObject);
                for (var _i = 0, _a = this._groups[0].gameObjects; _i < _a.length; _i++) {
                    var gameObject = _a[_i];
                    this._bufferedGameObjects.push(gameObject);
                }
            };
            GUISystem.prototype.onAddGameObject = function (gameObject, _group) {
                this._bufferedGameObjects.push(gameObject);
            };
            GUISystem.prototype.onUpdate = function (dt) {
                var i = 0;
                while (this._bufferedGameObjects.length > 0 && i++ < 5) {
                    this._addToHierarchy(this._bufferedGameObjects.shift());
                }
                // Open and select folder.
                if (!this._selectFolder) {
                    var sceneOrGameObject = this._guiComponent.selectedScene || this._guiComponent.selectedGameObject;
                    if (sceneOrGameObject && sceneOrGameObject.uuid in this._hierarchyFolders) {
                        this._selectFolder = this._hierarchyFolders[sceneOrGameObject.uuid];
                        this._selectFolder.selected = true;
                        this._openFolder(this._selectFolder.parent);
                    }
                }
                this._guiComponent.inspector.updateDisplay();
                if (this._guiComponent.inspector.__folders) {
                    for (var k in this._guiComponent.inspector.__folders) {
                        this._guiComponent.inspector.__folders[k].updateDisplay();
                    }
                }
                {
                    for (var _i = 0, _a = this._disposeCollecter.scenes; _i < _a.length; _i++) {
                        var scene = _a[_i];
                        var folder = this._hierarchyFolders[scene.uuid];
                        delete this._hierarchyFolders[scene.uuid];
                        if (folder && folder.parent) {
                            try {
                                folder.parent.removeFolder(folder);
                            }
                            catch (e) {
                            }
                        }
                    }
                    for (var _b = 0, _d = this._disposeCollecter.gameObjects; _b < _d.length; _b++) {
                        var gameObject = _d[_b];
                        var folder = this._hierarchyFolders[gameObject.uuid];
                        delete this._hierarchyFolders[gameObject.uuid];
                        if (folder && folder.parent) {
                            try {
                                folder.parent.removeFolder(folder);
                            }
                            catch (e) {
                            }
                        }
                    }
                    for (var _e = 0, _f = this._disposeCollecter.components; _e < _f.length; _e++) {
                        var component = _f[_e];
                        var folder = this._inspectorFolders[component.uuid];
                        delete this._inspectorFolders[component.uuid];
                        if (folder && folder.parent) {
                            try {
                                folder.parent.removeFolder(folder);
                            }
                            catch (e) {
                            }
                        }
                    }
                }
            };
            GUISystem.prototype.onRemoveGameObject = function (gameObject, _group) {
                var index = this._bufferedGameObjects.indexOf(gameObject);
                if (index >= 0) {
                    this._bufferedGameObjects[index] = null;
                }
            };
            GUISystem.prototype.onDisable = function () {
                paper.EventPool.removeEventListener("SceneSelected" /* SceneSelected */, debug.GUIComponent, this._sceneSelectedHandler);
                paper.EventPool.removeEventListener("SceneUnselected" /* SceneUnselected */, debug.GUIComponent, this._sceneUnselectedHandler);
                paper.EventPool.removeEventListener("GameObjectSelected" /* GameObjectSelected */, debug.GUIComponent, this._gameObjectSelectedHandler);
                paper.EventPool.removeEventListener("GameObjectUnselected" /* GameObjectUnselected */, debug.GUIComponent, this._gameObjectUnselectedHandler);
                for (var k in this._hierarchyFolders) {
                    var folder = this._hierarchyFolders[k];
                    delete this._hierarchyFolders[k];
                    if (folder && folder.parent) {
                        try {
                            folder.parent.removeFolder(folder);
                        }
                        catch (e) {
                        }
                    }
                }
                for (var k in this._inspectorFolders) {
                    delete this._inspectorFolders[k];
                }
                this._bufferedGameObjects.length = 0;
                this._selectFolder = null;
            };
            return GUISystem;
        }(paper.BaseSystem));
        debug.GUISystem = GUISystem;
        __reflect(GUISystem.prototype, "paper.debug.GUISystem");
    })(debug = paper.debug || (paper.debug = {}));
})(paper || (paper = {}));
var paper;
(function (paper) {
    var debug;
    (function (debug) {
        var hVec2_1 = new egret3d.Vector2();
        var hVec2_2 = new egret3d.Vector2();
        /**
         *
         */
        var OrbitControls = (function (_super) {
            __extends(OrbitControls, _super);
            function OrbitControls() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.lookAtPoint = egret3d.Vector3.create(0.0, 0.0, 0.0);
                _this.lookAtOffset = egret3d.Vector3.create();
                _this.distance = 30;
                _this.minPanAngle = -Infinity;
                _this.maxPanAngle = Infinity;
                _this.minTileAngle = -90;
                _this.maxTileAngle = 90;
                _this.moveSpped = 0.001;
                _this.scaleSpeed = 0.2;
                _this._enableMove = true;
                _this._mouseDown = false;
                _this._fingerTwo = false;
                _this._panAngle = 0;
                _this._panRad = 0;
                _this._tiltAngle = 0;
                _this._tiltRad = 0;
                _this._mouseDownHandler = function (event) {
                    if (event.button === 2) {
                        _this._mouseDown = true;
                        _this._lastMouseX = event.x;
                        _this._lastMouseY = event.y;
                        event.preventDefault();
                    }
                };
                _this._mouseUpHandler = function (event) {
                    if (event.button === 2) {
                        _this._mouseDown = false;
                        event.preventDefault();
                    }
                };
                _this._mouseMoveHandler = function (event) {
                    if (!_this._mouseDown || !_this._enableMove) {
                        return;
                    }
                    var move = egret3d.Vector3.create(event.x - _this._lastMouseX, event.y - _this._lastMouseY, 0);
                    if (event.ctrlKey) {
                        move.x = -move.x;
                        var center = _this.lookAtTarget ? _this.lookAtTarget.getPosition() : _this.lookAtPoint;
                        var dis = _this.gameObject.transform.getPosition().getDistance(center);
                        var normalMat = egret3d.Matrix3.create();
                        move.multiplyScalar(dis * _this.moveSpped).applyMatrix3(normalMat.getNormalMatrix(_this.gameObject.transform.getLocalMatrix()));
                        normalMat.release();
                        _this.lookAtOffset.add(move);
                    }
                    else {
                        _this.panAngle += move.x;
                        _this.tiltAngle += move.y;
                    }
                    _this._lastMouseX = event.x;
                    _this._lastMouseY = event.y;
                    move.release();
                    event.preventDefault();
                };
                _this._mouseWheelHandler = function (event) {
                    _this.distance = Math.max(_this.distance - (event.wheelDelta > 0 ? 2 : -2), 1);
                    event.preventDefault();
                };
                return _this;
                // private updateTouch(delta: number) {
                //     var touch = this.bindTouch;
                //     if (touch.touchCount > 0) {
                //         if (touch.touchCount == 1) {
                //             var _touch = touch.getTouch(0);
                //             if (_touch.phase == egret3d.TouchPhase.BEGAN || this._fingerTwo) {
                //                 this._lastTouchX = _touch.position.x;
                //                 this._lastTouchY = _touch.position.y;
                //             } else {
                //                 var moveX = _touch.position.x - this._lastTouchX;
                //                 var moveY = _touch.position.y - this._lastTouchY;
                //                 this.panAngle += moveX * 0.5;
                //                 this.tiltAngle += moveY * 0.5;
                //                 this._lastTouchX = _touch.position.x;
                //                 this._lastTouchY = _touch.position.y;
                //             }
                //             this._fingerTwo = false;
                //         } else if (touch.touchCount == 2) {
                //             var _touch1 = touch.getTouch(0);
                //             var _touch2 = touch.getTouch(1);
                //             if (_touch1.phase == egret3d.TouchPhase.BEGAN || _touch2.phase == egret3d.TouchPhase.BEGAN || this._fingerTwo == false) {
                //                 hVec2_1.copy(_touch1.position);
                //                 hVec2_2.copy(_touch2.position);
                //                 this._lastDistance = egret3d.Vector2.getDistance(hVec2_1, hVec2_2);
                //             } else {
                //                 hVec2_1.copy(_touch1.position);
                //                 hVec2_2.copy(_touch2.position);
                //                 var distance = egret3d.Vector2.getDistance(hVec2_1, hVec2_2);
                //                 var deltaDistance = distance - this._lastDistance;
                //                 this.distance = Math.max(this.distance - deltaDistance * this.scaleSpeed, 1);
                //                 this._lastDistance = distance;
                //             }
                //             this._fingerTwo = true;
                //         } else {
                //             this._fingerTwo = false;
                //         }
                //     }
                // }
            }
            Object.defineProperty(OrbitControls.prototype, "panAngle", {
                get: function () {
                    return this._panAngle;
                },
                set: function (value) {
                    this._panAngle = Math.max(this.minPanAngle, Math.min(this.maxPanAngle, value));
                    this._panRad = this._panAngle * Math.PI / 180;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(OrbitControls.prototype, "tiltAngle", {
                get: function () {
                    return this._tiltAngle;
                },
                set: function (value) {
                    this._tiltAngle = Math.max(this.minTileAngle, Math.min(this.maxTileAngle, value));
                    this._tiltRad = this._tiltAngle * Math.PI / 180;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(OrbitControls.prototype, "enableMove", {
                get: function () {
                    return this._enableMove;
                },
                set: function (value) {
                    if (this._enableMove === value) {
                        return;
                    }
                    this._enableMove = value;
                },
                enumerable: true,
                configurable: true
            });
            OrbitControls.prototype.onStart = function () {
                this.bindTouch = egret3d.InputManager.touch;
                this.bindMouse = egret3d.InputManager.mouse;
                //
                this.bindMouse.disableContextMenu();
            };
            ;
            OrbitControls.prototype.onEnable = function () {
                var canvas = egret3d.WebGLCapabilities.canvas;
                if (canvas) {
                    canvas.addEventListener("mousedown", this._mouseDownHandler);
                    canvas.addEventListener("mouseup", this._mouseUpHandler);
                    canvas.addEventListener("mouseout", this._mouseUpHandler);
                    canvas.addEventListener("dblclick", this._mouseUpHandler);
                    canvas.addEventListener("mousemove", this._mouseMoveHandler);
                    canvas.addEventListener("wheel", this._mouseWheelHandler);
                }
            };
            OrbitControls.prototype.onDisable = function () {
                var canvas = egret3d.WebGLCapabilities.canvas;
                if (canvas) {
                    canvas.removeEventListener("mousedown", this._mouseDownHandler);
                    canvas.removeEventListener("mouseup", this._mouseUpHandler);
                    canvas.removeEventListener("mouseout", this._mouseUpHandler);
                    canvas.removeEventListener("dblclick", this._mouseUpHandler);
                    canvas.removeEventListener("mousemove", this._mouseMoveHandler);
                    canvas.removeEventListener("wheel", this._mouseWheelHandler);
                }
            };
            OrbitControls.prototype.onUpdate = function (delta) {
                if (!this._enableMove) {
                    return;
                }
                this.move();
            };
            ;
            OrbitControls.prototype.move = function () {
                var distanceX = this.distance * Math.sin(this._panRad) * Math.cos(this._tiltRad);
                var distanceY = this.distance * (this._tiltRad === 0 ? 0 : Math.sin(this._tiltRad));
                var distanceZ = this.distance * Math.cos(this._panRad) * Math.cos(this._tiltRad);
                var target = egret3d.Vector3.create();
                if (this.lookAtTarget) {
                    target.copy(this.lookAtTarget.getPosition());
                }
                else {
                    target.copy(this.lookAtPoint);
                }
                target.add(this.lookAtOffset);
                this.gameObject.transform.setPosition(target.x + distanceX, target.y + distanceY, target.z + distanceZ);
                this.gameObject.transform.lookAt(target);
                target.release();
            };
            return OrbitControls;
        }(paper.Behaviour));
        debug.OrbitControls = OrbitControls;
        __reflect(OrbitControls.prototype, "paper.debug.OrbitControls");
    })(debug = paper.debug || (paper.debug = {}));
})(paper || (paper = {}));
var paper;
(function (paper) {
    var debug;
    (function (debug) {
        var EditorMeshHelper = (function () {
            function EditorMeshHelper() {
            }
            //
            EditorMeshHelper.createGameObject = function (name, mesh, material, tag, scene) {
                if (mesh === void 0) { mesh = null; }
                if (material === void 0) { material = null; }
                if (tag === void 0) { tag = "Editor Only" /* EditorOnly */; }
                if (scene === void 0) { scene = paper.Scene.editorScene; }
                var gameObject = paper.GameObject.create(name, tag, scene);
                gameObject.hideFlags = 3 /* HideAndDontSave */;
                if (mesh) {
                    gameObject.addComponent(egret3d.MeshFilter).mesh = mesh;
                }
                if (material) {
                    gameObject.addComponent(egret3d.MeshRenderer).material = material;
                }
                return gameObject;
            };
            EditorMeshHelper.createGrid = function (name, size, divisions, color1, color2) {
                if (size === void 0) { size = 50; }
                if (divisions === void 0) { divisions = 50; }
                if (color1 === void 0) { color1 = egret3d.Color.create(0.26, 0.26, 0.26); }
                if (color2 === void 0) { color2 = egret3d.Color.create(0.53, 0.53, 0.53); }
                //
                var center = divisions / 2;
                var step = size / divisions;
                var halfSize = size / 2;
                var vertices = [], colors = [];
                for (var i_1 = 0, k = -halfSize; i_1 <= divisions; i_1++, k += step) {
                    vertices.push(-halfSize, 0, k);
                    vertices.push(halfSize, 0, k);
                    vertices.push(k, 0, -halfSize);
                    vertices.push(k, 0, halfSize);
                    var color = i_1 === center ? color1 : color2;
                    colors.push(color.r, color.g, color.b, color.a);
                    colors.push(color.r, color.g, color.b, color.a);
                    colors.push(color.r, color.g, color.b, color.a);
                    colors.push(color.r, color.g, color.b, color.a);
                }
                for (var i = 0; i < colors.length; i += 80) {
                    for (var j = 0; j < 16; j++) {
                        colors[i + j] = 0.26;
                    }
                }
                var mesh = new egret3d.Mesh(vertices.length, 0, ["POSITION" /* POSITION */, "COLOR_0" /* COLOR_0 */]);
                mesh.setAttributes("POSITION" /* POSITION */, vertices);
                mesh.setAttributes("COLOR_0" /* COLOR_0 */, colors);
                mesh.glTFMesh.primitives[0].mode = 1 /* Lines */;
                var gameObject = this.createGameObject(name, mesh, egret3d.DefaultMaterials.LINEDASHED_COLOR.clone());
                return gameObject;
            };
            EditorMeshHelper.createTouchPlane = function (name, width, height) {
                if (width === void 0) { width = 500000; }
                if (height === void 0) { height = 500000; }
                var gameObject = this.createGameObject(name, egret3d.DefaultMeshes.createPlane(width, height), egret3d.DefaultMaterials.LINEDASHED_COLOR.clone());
                return gameObject;
            };
            EditorMeshHelper.createAxises = function (name) {
                var gameObject = this.createGameObject(name);
                {
                    var translate = this.createGameObject("translate");
                    translate.transform.setParent(gameObject.transform);
                    var axisX = this.createGameObject("axisX", egret3d.DefaultMeshes.LINE_X, egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var axisY = this.createGameObject("axisY", egret3d.DefaultMeshes.LINE_X, egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var axisZ = this.createGameObject("axisZ", egret3d.DefaultMeshes.LINE_X, egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var arrowX = this.createGameObject("arrowX", egret3d.DefaultMeshes.PYRAMID, egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var arrowY = this.createGameObject("arrowY", egret3d.DefaultMeshes.PYRAMID, egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var arrowZ = this.createGameObject("arrowZ", egret3d.DefaultMeshes.PYRAMID, egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var pickX = this.createGameObject("pickX", egret3d.DefaultMeshes.CUBE, egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var pickY = this.createGameObject("pickY", egret3d.DefaultMeshes.CUBE, egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var pickZ = this.createGameObject("pickZ", egret3d.DefaultMeshes.CUBE, egret3d.DefaultMaterials.MESH_BASIC.clone());
                    axisX.transform.setParent(translate.transform);
                    axisY.transform.setParent(translate.transform).setLocalEuler(0.0, 0.0, Math.PI * 0.5);
                    axisZ.transform.setParent(translate.transform).setLocalEuler(0.0, -Math.PI * 0.5, 0.0);
                    arrowX.transform.setParent(axisX.transform).setLocalEuler(0.0, 0.0, -Math.PI * 0.5).setLocalPosition(egret3d.Vector3.RIGHT).setLocalScale(0.05, 0.1, 0.05);
                    arrowY.transform.setParent(axisY.transform).setLocalEuler(0.0, 0.0, -Math.PI * 0.5).setLocalPosition(egret3d.Vector3.RIGHT).setLocalScale(0.05, 0.1, 0.05);
                    arrowZ.transform.setParent(axisZ.transform).setLocalEuler(0.0, 0.0, -Math.PI * 0.5).setLocalPosition(egret3d.Vector3.RIGHT).setLocalScale(0.05, 0.1, 0.05);
                    pickX.transform.setParent(translate.transform).setLocalPosition(egret3d.Vector3.RIGHT.clone().multiplyScalar(0.5)).setLocalScale(1.2, 0.1, 0.1);
                    pickY.transform.setParent(translate.transform).setLocalPosition(egret3d.Vector3.UP.clone().multiplyScalar(0.5)).setLocalScale(0.1, 1.2, 0.1);
                    pickZ.transform.setParent(translate.transform).setLocalPosition(egret3d.Vector3.FORWARD.clone().multiplyScalar(0.5)).setLocalScale(0.1, 0.1, 1.2);
                    pickX.activeSelf = pickY.activeSelf = pickZ.activeSelf = false;
                    axisX.renderer.material.setColor("diffuse", egret3d.Color.RED).setDepth(false, false).setRenderQueue(4000 /* Overlay */);
                    axisY.renderer.material.setColor("diffuse", egret3d.Color.GREEN).setDepth(false, false).setRenderQueue(4000 /* Overlay */);
                    axisZ.renderer.material.setColor("diffuse", egret3d.Color.BLUE).setDepth(false, false).setRenderQueue(4000 /* Overlay */);
                    arrowX.renderer.material.addDefine("USE_COLOR" /* USE_COLOR */).setColor("diffuse", egret3d.Color.RED).setDepth(false, false).setRenderQueue(4000 /* Overlay */);
                    arrowY.renderer.material.addDefine("USE_COLOR" /* USE_COLOR */).setColor("diffuse", egret3d.Color.GREEN).setDepth(false, false).setRenderQueue(4000 /* Overlay */);
                    arrowZ.renderer.material.addDefine("USE_COLOR" /* USE_COLOR */).setColor("diffuse", egret3d.Color.BLUE).setDepth(false, false).setRenderQueue(4000 /* Overlay */);
                    pickX.renderer.material.setColor("diffuse", egret3d.Color.RED).setDepth(false, false).setRenderQueue(4000 /* Overlay */);
                    pickY.renderer.material.setColor("diffuse", egret3d.Color.GREEN).setDepth(false, false).setRenderQueue(4000 /* Overlay */);
                    pickZ.renderer.material.setColor("diffuse", egret3d.Color.BLUE).setDepth(false, false).setRenderQueue(4000 /* Overlay */);
                }
                //
                {
                    var rotate = this.createGameObject("rotate");
                    rotate.transform.setParent(gameObject.transform);
                    var axisX = this.createGameObject("axisX", egret3d.DefaultMeshes.createCircle(1, 0.5, 1), egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var axisY = this.createGameObject("axisY", egret3d.DefaultMeshes.createCircle(1, 0.5, 2), egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var axisZ = this.createGameObject("axisZ", egret3d.DefaultMeshes.createCircle(1, 0.5, 3), egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var axisE = this.createGameObject("axisE", egret3d.DefaultMeshes.createCircle(1.25, 1, 3), egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var pickX = this.createGameObject("pickX", egret3d.DefaultMeshes.TORUS, egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var pickY = this.createGameObject("pickY", egret3d.DefaultMeshes.TORUS, egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var pickZ = this.createGameObject("pickZ", egret3d.DefaultMeshes.TORUS, egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var pickE = this.createGameObject("pickE", egret3d.DefaultMeshes.createTorus(1.25, 0.1, 2, 24), egret3d.DefaultMaterials.MESH_BASIC.clone());
                    axisX.transform.setParent(rotate.transform);
                    axisY.transform.setParent(rotate.transform);
                    axisZ.transform.setParent(rotate.transform);
                    axisE.transform.setParent(rotate.transform);
                    pickX.transform.setParent(rotate.transform).setLocalEuler(0, -Math.PI * 0.5, -Math.PI * 0.5);
                    pickY.transform.setParent(rotate.transform).setLocalEuler(Math.PI * 0.5, 0.0, 0.0);
                    pickZ.transform.setParent(rotate.transform).setLocalEuler(0.0, 0.0, -Math.PI * 0.5);
                    pickE.transform.setParent(rotate.transform).setLocalEuler(0.0, 0.0, 0.0);
                    pickX.activeSelf = pickY.activeSelf = pickZ.activeSelf = pickE.activeSelf = false;
                    axisX.renderer.material.setColor("diffuse", egret3d.Color.RED).setDepth(false, false).setRenderQueue(4000 /* Overlay */);
                    axisY.renderer.material.setColor("diffuse", egret3d.Color.GREEN).setDepth(false, false).setRenderQueue(4000 /* Overlay */);
                    axisZ.renderer.material.setColor("diffuse", egret3d.Color.BLUE).setDepth(false, false).setRenderQueue(4000 /* Overlay */);
                    axisE.renderer.material.setColor("diffuse", egret3d.Color.YELLOW).setDepth(false, false).setRenderQueue(4000 /* Overlay */);
                    pickX.renderer.material.setColor("diffuse", egret3d.Color.RED).setDepth(false, false).setRenderQueue(4000 /* Overlay */);
                    pickY.renderer.material.setColor("diffuse", egret3d.Color.GREEN).setDepth(false, false).setRenderQueue(4000 /* Overlay */);
                    pickZ.renderer.material.setColor("diffuse", egret3d.Color.BLUE).setDepth(false, false).setRenderQueue(4000 /* Overlay */);
                    pickE.renderer.material.setColor("diffuse", egret3d.Color.YELLOW).setDepth(false, false).setRenderQueue(4000 /* Overlay */);
                }
                //
                {
                    var scale = this.createGameObject("scale");
                    scale.transform.setParent(gameObject.transform);
                    var axisX = this.createGameObject("axisX", egret3d.DefaultMeshes.LINE_X, egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var axisY = this.createGameObject("axisY", egret3d.DefaultMeshes.LINE_X, egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var axisZ = this.createGameObject("axisZ", egret3d.DefaultMeshes.LINE_X, egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var arrowX = this.createGameObject("arrowX", egret3d.DefaultMeshes.CUBE, egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var arrowY = this.createGameObject("arrowY", egret3d.DefaultMeshes.CUBE, egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var arrowZ = this.createGameObject("arrowZ", egret3d.DefaultMeshes.CUBE, egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var pickX = this.createGameObject("pickX", egret3d.DefaultMeshes.CUBE, egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var pickY = this.createGameObject("pickY", egret3d.DefaultMeshes.CUBE, egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var pickZ = this.createGameObject("pickZ", egret3d.DefaultMeshes.CUBE, egret3d.DefaultMaterials.MESH_BASIC.clone());
                    axisX.transform.setParent(scale.transform);
                    axisY.transform.setParent(scale.transform).setLocalEuler(0.0, 0.0, Math.PI * 0.5);
                    axisZ.transform.setParent(scale.transform).setLocalEuler(0.0, -Math.PI * 0.5, 0.0);
                    arrowX.transform.setParent(axisX.transform).setLocalEuler(0.0, 0.0, -Math.PI * 0.5).setLocalPosition(egret3d.Vector3.RIGHT).setLocalScale(0.2, 0.2, 0.2);
                    arrowY.transform.setParent(axisY.transform).setLocalEuler(0.0, 0.0, -Math.PI * 0.5).setLocalPosition(egret3d.Vector3.RIGHT).setLocalScale(0.2, 0.2, 0.2);
                    arrowZ.transform.setParent(axisZ.transform).setLocalEuler(0.0, 0.0, -Math.PI * 0.5).setLocalPosition(egret3d.Vector3.RIGHT).setLocalScale(0.2, 0.2, 0.2);
                    pickX.transform.setParent(scale.transform).setLocalPosition(egret3d.Vector3.RIGHT.clone().multiplyScalar(0.5)).setLocalScale(1.2, 0.2, 0.2);
                    pickY.transform.setParent(scale.transform).setLocalPosition(egret3d.Vector3.UP.clone().multiplyScalar(0.5)).setLocalScale(0.2, 1.2, 0.2);
                    pickZ.transform.setParent(scale.transform).setLocalPosition(egret3d.Vector3.FORWARD.clone().multiplyScalar(0.5)).setLocalScale(0.2, 0.2, 1.2);
                    pickX.activeSelf = pickY.activeSelf = pickZ.activeSelf = false;
                    axisX.renderer.material.setColor("diffuse", egret3d.Color.RED).setDepth(false, false).setRenderQueue(4000 /* Overlay */);
                    axisY.renderer.material.setColor("diffuse", egret3d.Color.GREEN).setDepth(false, false).setRenderQueue(4000 /* Overlay */);
                    axisZ.renderer.material.setColor("diffuse", egret3d.Color.BLUE).setDepth(false, false).setRenderQueue(4000 /* Overlay */);
                    arrowX.renderer.material.setColor("diffuse", egret3d.Color.RED).setDepth(false, false).setRenderQueue(4000 /* Overlay */);
                    arrowY.renderer.material.setColor("diffuse", egret3d.Color.GREEN).setDepth(false, false).setRenderQueue(4000 /* Overlay */);
                    arrowZ.renderer.material.setColor("diffuse", egret3d.Color.BLUE).setDepth(false, false).setRenderQueue(4000 /* Overlay */);
                    pickX.renderer.material.setColor("diffuse", egret3d.Color.RED).setDepth(false, false).setRenderQueue(4000 /* Overlay */);
                    pickY.renderer.material.setColor("diffuse", egret3d.Color.GREEN).setDepth(false, false).setRenderQueue(4000 /* Overlay */);
                    pickZ.renderer.material.setColor("diffuse", egret3d.Color.BLUE).setDepth(false, false).setRenderQueue(4000 /* Overlay */);
                }
                //
                return gameObject;
            };
            EditorMeshHelper.createBox = function (name, color, scene) {
                var box = this.createGameObject(name, egret3d.DefaultMeshes.CUBE_LINE, egret3d.DefaultMaterials.LINEDASHED_COLOR.clone(), "Editor Only" /* EditorOnly */, scene);
                box.getComponent(egret3d.MeshRenderer).material.setColor("diffuse" /* Diffuse */, color);
                return box;
            };
            EditorMeshHelper.createCameraIcon = function (name, parent) {
                var material = new egret3d.Material(egret3d.DefaultShaders.TRANSPARENT);
                material.renderQueue = 4000 /* Overlay */;
                material.setTexture("map" /* Map */, egret3d.DefaultTextures.CAMERA_ICON);
                var gameObject = this.createGameObject(name, null, null, parent.tag, parent.scene);
                var pick = this.createGameObject("pick", egret3d.DefaultMeshes.CUBE, egret3d.DefaultMaterials.MESH_BASIC.clone(), parent.tag, parent.scene);
                pick.transform.setParent(gameObject.transform);
                var icon = this.createGameObject("icon", egret3d.DefaultMeshes.QUAD, material, parent.tag, parent.scene);
                icon.transform.setParent(gameObject.transform);
                pick.activeSelf = false;
                pick.addComponent(debug.GizmoPickComponent).pickTarget = parent;
                gameObject.transform.setParent(parent.transform);
                return gameObject;
            };
            EditorMeshHelper.createLightIcon = function (name, parent) {
                var material = new egret3d.Material(egret3d.DefaultShaders.TRANSPARENT);
                material.renderQueue = 4000 /* Overlay */;
                material.setTexture("map" /* Map */, egret3d.DefaultTextures.LIGHT_ICON);
                material.setColor("diffuse" /* Diffuse */, egret3d.Color.RED);
                var gameObject = this.createGameObject(name, null, null, parent.tag, parent.scene);
                var pick = this.createGameObject("pick", egret3d.DefaultMeshes.CUBE, egret3d.DefaultMaterials.MESH_BASIC.clone(), parent.tag, parent.scene);
                pick.transform.setParent(gameObject.transform);
                var icon = this.createGameObject("icon", egret3d.DefaultMeshes.QUAD, material, parent.tag, parent.scene);
                icon.transform.setParent(gameObject.transform);
                pick.activeSelf = false;
                pick.addComponent(debug.GizmoPickComponent).pickTarget = parent;
                gameObject.transform.setParent(parent.transform);
                return gameObject;
            };
            EditorMeshHelper.createCameraWireframed = function (name, colorFrustum, colorCone, colorUp, colorTarget, colorCross) {
                if (colorFrustum === void 0) { colorFrustum = egret3d.Color.create(1.0, 0.7, 0); }
                if (colorCone === void 0) { colorCone = egret3d.Color.RED; }
                if (colorUp === void 0) { colorUp = egret3d.Color.create(0, 0.7, 1); }
                if (colorTarget === void 0) { colorTarget = egret3d.Color.WHITE; }
                if (colorCross === void 0) { colorCross = egret3d.Color.create(0.2, 0.2, 0.2); }
                var vertices = [], colors = [];
                var verticeCount = 50;
                for (var i = 0; i < verticeCount; i++) {
                    vertices.push(0.0, 0.0, 0.0);
                    if (i < 24) {
                        colors.push(colorFrustum.r, colorFrustum.g, colorFrustum.b, colorFrustum.a);
                    }
                    else if (i < 32) {
                        colors.push(colorCone.r, colorCone.g, colorCone.b, colorCone.a);
                    }
                    else if (i < 38) {
                        colors.push(colorUp.r, colorUp.g, colorUp.b, colorUp.a);
                    }
                    else if (i < 40) {
                        colors.push(colorTarget.r, colorTarget.g, colorTarget.b, colorTarget.a);
                    }
                    else {
                        colors.push(colorCross.r, colorCross.g, colorCross.b, colorCross.a);
                    }
                }
                var mesh = new egret3d.Mesh(verticeCount, 0, ["POSITION" /* POSITION */, "COLOR_0" /* COLOR_0 */]);
                mesh.setAttributes("POSITION" /* POSITION */, vertices);
                mesh.setAttributes("COLOR_0" /* COLOR_0 */, colors);
                mesh.glTFMesh.primitives[0].mode = 1 /* Lines */;
                var gameObject = this.createGameObject(name, mesh, egret3d.DefaultMaterials.LINEDASHED_COLOR.clone());
                return gameObject;
            };
            return EditorMeshHelper;
        }());
        debug.EditorMeshHelper = EditorMeshHelper;
        __reflect(EditorMeshHelper.prototype, "paper.debug.EditorMeshHelper");
    })(debug = paper.debug || (paper.debug = {}));
})(paper || (paper = {}));
var paper;
(function (paper) {
    var debug;
    (function (debug) {
        var Helper = (function () {
            function Helper() {
            }
            Helper._raycast = function (ray, gameObject, raycastInfos) {
                if ((gameObject.hideFlags === 3 /* HideAndDontSave */ && gameObject.tag === "Editor Only" /* EditorOnly */) ? gameObject.activeInHierarchy : !gameObject.activeInHierarchy) {
                    return;
                }
                var raycastInfo = egret3d.RaycastInfo.create();
                if (gameObject.renderer && gameObject.renderer.raycast(ray, raycastInfo, true)) {
                    raycastInfo.transform = gameObject.transform;
                    raycastInfos.push(raycastInfo);
                }
                else {
                    raycastInfo.release();
                    for (var _i = 0, _a = gameObject.transform.children; _i < _a.length; _i++) {
                        var child = _a[_i];
                        this._raycast(ray, child.gameObject, raycastInfos);
                    }
                }
            };
            Helper.raycast = function (gameObjects, mousePositionX, mousePositionY) {
                var camera = egret3d.Camera.editor;
                var ray = camera.createRayByScreen(mousePositionX, mousePositionY);
                var raycastInfos = [];
                for (var _i = 0, gameObjects_2 = gameObjects; _i < gameObjects_2.length; _i++) {
                    var gameObject = gameObjects_2[_i];
                    this._raycast(ray, gameObject, raycastInfos);
                }
                ray.release();
                //
                raycastInfos.sort(function (a, b) {
                    return a.distance - b.distance;
                });
                return raycastInfos;
            };
            return Helper;
        }());
        debug.Helper = Helper;
        __reflect(Helper.prototype, "paper.debug.Helper");
    })(debug = paper.debug || (paper.debug = {}));
})(paper || (paper = {}));
var helper;
(function (helper) {
    var resLoaded = false;
    function getResType(uri) {
        var file = uri.substr(uri.lastIndexOf("/") + 1);
        var i = file.indexOf(".", 0);
        var extname = "";
        while (i >= 0) {
            extname = file.substr(i);
            if (extname == ".vs.glsl") {
                return 'GLVertexShader';
            }
            else if (extname == ".assetbundle.json") {
                return 'Bundle';
            }
            else if (extname == ".fs.glsl") {
                return 'GLFragmentShader';
            }
            else if (extname == ".png" || extname == ".jpg") {
                return 'Texture';
            }
            else if (extname == ".pvr.bin" || extname == ".pvr") {
                return 'PVR';
            }
            else if (extname == ".prefab.json") {
                return 'Prefab';
            }
            else if (extname == ".scene.json") {
                return 'Scene';
            }
            else if (extname == ".atlas.json") {
                return 'Atlas';
            }
            else if (extname == ".font.json") {
                return 'Font';
            }
            else if (extname == ".json" || extname == ".txt" || extname == ".effect.json") {
                return 'TextAsset';
            }
            else if (extname == ".packs.bin") {
                return 'PackBin';
            }
            else if (extname == ".packs.txt") {
                return 'PackTxt';
            }
            else if (extname == ".path.json") {
                return 'pathAsset';
            }
            else if (extname == ".mp3" || extname == ".ogg") {
                return 'Sound';
            }
            else if (extname == ".shader.json") {
                return 'Shader';
            }
            else if (extname == ".image.json") {
                return 'TextureDesc';
            }
            else if (extname == ".mat.json") {
                return 'Material';
            }
            else if (extname == ".mesh.bin") {
                return 'Mesh';
            }
            else if (extname == ".ani.bin") {
                return 'Animation';
            }
            i = file.indexOf(".", i + 1);
        }
        return "Unknown";
    }
    function getResAsync(uri, root) {
        if (root === void 0) { root = "resource/"; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!resLoaded) return [3 /*break*/, 2];
                        return [4 /*yield*/, RES.loadConfig("resource/default.res.json", root)];
                    case 1:
                        _a.sent();
                        resLoaded = true;
                        _a.label = 2;
                    case 2: return [2 /*return*/, new Promise(function (r) {
                            RES.getResByUrl(root + uri, function (data) {
                                paper.Asset.register(data);
                                r();
                            }, RES, getResType(uri));
                        })];
                }
            });
        });
    }
    helper.getResAsync = getResAsync;
})(helper || (helper = {}));
