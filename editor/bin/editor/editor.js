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
         *
         */
        var EditorSystem = (function (_super) {
            __extends(EditorSystem, _super);
            function EditorSystem() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            EditorSystem.prototype.onAwake = function () {
                if (paper.Application.playerMode === 2 /* Editor */) {
                    paper.Application.systemManager.getOrRegisterSystem(debug.SceneSystem);
                }
                else {
                    paper.Application.systemManager.getOrRegisterSystem(debug.GUISystem);
                }
            };
            return EditorSystem;
        }(paper.BaseSystem));
        debug.EditorSystem = EditorSystem;
        __reflect(EditorSystem.prototype, "paper.debug.EditorSystem");
        // 
        paper.Application.systemManager.preRegister(EditorSystem, paper.LateUpdateSystem);
    })(debug = paper.debug || (paper.debug = {}));
})(paper || (paper = {}));
var paper;
(function (paper) {
    var debug;
    (function (debug) {
        /**
         * @internal
         */
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
        var GUIComponent = (function (_super) {
            __extends(GUIComponent, _super);
            function GUIComponent() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.inspector = new dat.GUI({ closeOnTop: true, width: 330 });
                _this.hierarchy = new dat.GUI({ closeOnTop: true, width: 330 });
                return _this;
            }
            return GUIComponent;
        }(paper.SingletonComponent));
        debug.GUIComponent = GUIComponent;
        __reflect(GUIComponent.prototype, "paper.debug.GUIComponent");
    })(debug = paper.debug || (paper.debug = {}));
})(paper || (paper = {}));
var paper;
(function (paper) {
    var debug;
    (function (debug) {
        /**
         *
         */
        var ModelComponentEvent;
        (function (ModelComponentEvent) {
            ModelComponentEvent["SceneSelected"] = "SceneSelected";
            ModelComponentEvent["SceneUnselected"] = "SceneUnselected";
            ModelComponentEvent["GameObjectHovered"] = "GameObjectHovered";
            ModelComponentEvent["GameObjectSelected"] = "GameObjectSelected";
            ModelComponentEvent["GameObjectUnselected"] = "GameObjectUnselected";
        })(ModelComponentEvent = debug.ModelComponentEvent || (debug.ModelComponentEvent = {}));
        /**
         *
         */
        var ModelComponent = (function (_super) {
            __extends(ModelComponent, _super);
            function ModelComponent() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
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
                _this.hoveredGameObject = null;
                /**
                 * 最后一个选中的实体。
                 */
                _this.selectedGameObject = null;
                //
                _this.editorModel = null;
                return _this;
            }
            ModelComponent.prototype._onEditorSelectGameObjects = function (gameObjs) {
                for (var _i = 0, _a = this.selectedGameObjects; _i < _a.length; _i++) {
                    var gameObj = _a[_i];
                    if (gameObjs.indexOf(gameObj) < 0) {
                        this._unselect(gameObj);
                    }
                }
                for (var _b = 0, gameObjs_1 = gameObjs; _b < gameObjs_1.length; _b++) {
                    var gameObj = gameObjs_1[_b];
                    this._select(gameObj);
                }
            };
            ModelComponent.prototype._onChangeEditMode = function (mode) {
            };
            ModelComponent.prototype._onChangeEditType = function (type) {
            };
            ModelComponent.prototype._onChangeProperty = function (data) {
                if ((data.target instanceof egret3d.Transform) && data.propName && this.selectedGameObjects.length > 0) {
                    var propName = data.propName;
                    switch (propName) {
                        case "position":
                            this.selectedGameObject.transform.position = data.propValue;
                            break;
                        case "rotation":
                            this.selectedGameObject.transform.rotation = data.propValue;
                            break;
                        case "localPosition":
                            this.selectedGameObject.transform.localPosition = data.propValue;
                            break;
                        case "localRotation":
                            this.selectedGameObject.transform.localRotation = data.propValue;
                            break;
                        case "scale":
                            this.selectedGameObject.transform.scale = data.propValue;
                            break;
                        case "localScale":
                            this.selectedGameObject.transform.localScale = data.propValue;
                            break;
                        default:
                            break;
                    }
                }
                if (data.target instanceof paper.GameObject) {
                    var propName = data.propName;
                    console.log(propName);
                }
            };
            ModelComponent.prototype.initialize = function () {
                var _this = this;
                setTimeout(function () {
                    if (paper.Application.playerMode === 2 /* Editor */) {
                        _this.editorModel = paper.editor.Editor.activeEditorModel;
                        _this.editorModel.addEventListener(paper.editor.EditorModelEvent.SELECT_GAMEOBJECTS, function (e) { return _this._onEditorSelectGameObjects(e.data); }, _this);
                        _this.editorModel.addEventListener(paper.editor.EditorModelEvent.CHANGE_EDIT_MODE, function (e) { return _this._onChangeEditMode(e.data); }, _this);
                        _this.editorModel.addEventListener(paper.editor.EditorModelEvent.CHANGE_EDIT_TYPE, function (e) { return _this._onChangeEditType(e.data); }, _this);
                        _this.editorModel.addEventListener(paper.editor.EditorModelEvent.CHANGE_PROPERTY, function (e) { return _this._onChangeProperty(e.data); }, _this);
                    }
                }, 3000);
            };
            ModelComponent.prototype._select = function (value, isReplace) {
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
            ModelComponent.prototype._unselect = function (value) {
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
            ModelComponent.prototype.select = function (value, isReplace) {
                this._select(value, isReplace);
                if (this.editorModel !== null) {
                    this.editorModel.selectGameObject(this.selectedGameObjects);
                }
            };
            ModelComponent.prototype.unselect = function (value) {
                this._unselect(value);
                if (this.editorModel !== null) {
                    this.editorModel.selectGameObject(this.selectedGameObjects);
                }
            };
            ModelComponent.prototype.changeProperty = function (propName, propOldValue, propNewValue, target) {
                if (this.editorModel) {
                    this.editorModel.setTransformProperty(propName, propOldValue, propNewValue, target);
                }
            };
            ModelComponent.prototype.hover = function (value) {
                if (this.hoveredGameObject === value) {
                    return;
                }
                this.hoveredGameObject = value;
                paper.EventPool.dispatchEvent("GameObjectHovered" /* GameObjectHovered */, this, this.hoveredGameObject);
            };
            return ModelComponent;
        }(paper.SingletonComponent));
        debug.ModelComponent = ModelComponent;
        __reflect(ModelComponent.prototype, "paper.debug.ModelComponent");
    })(debug = paper.debug || (paper.debug = {}));
})(paper || (paper = {}));
var paper;
(function (paper) {
    var debug;
    (function (debug) {
        /**
         * @internal
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
                        var center = _this.lookAtPoint;
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
                target.copy(this.lookAtPoint);
                target.add(this.lookAtOffset);
                this.gameObject.transform.setPosition(target.x + distanceX, target.y + distanceY, target.z + distanceZ);
                this.gameObject.transform.lookAt(target);
                target.release();
            };
            OrbitControls = __decorate([
                paper.executeInEditMode
            ], OrbitControls);
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
        /**
         * @internal
         */
        var TransfromController = (function (_super) {
            __extends(TransfromController, _super);
            function TransfromController() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.isWorldSpace = true;
                _this.eye = egret3d.Vector3.create();
                _this.translate = debug.EditorMeshHelper.createGameObject("Translate");
                _this.rotate = debug.EditorMeshHelper.createGameObject("Rotate");
                _this.scale = debug.EditorMeshHelper.createGameObject("Scale");
                _this._controlling = false;
                _this._prsStarts = {};
                _this._offsetStart = egret3d.Vector3.create();
                _this._offsetEnd = egret3d.Vector3.create();
                _this._plane = egret3d.Plane.create();
                _this._quad = debug.EditorMeshHelper.createGameObject("Plane", egret3d.DefaultMeshes.QUAD, egret3d.DefaultMaterials.MESH_BASIC_DOUBLESIDE.clone().setBlend(1 /* Blend */).setOpacity(0.5));
                _this._highlights = {};
                _this._mode = null;
                _this._hovered = null;
                _this._dir = { "X": egret3d.Vector3.RIGHT, "Y": egret3d.Vector3.UP, "Z": egret3d.Vector3.FORWARD };
                return _this;
            }
            TransfromController.prototype.initialize = function () {
                _super.prototype.initialize.call(this);
                {
                    var translate = this.translate;
                    var axisX = debug.EditorMeshHelper.createGameObject("AxisX", egret3d.DefaultMeshes.LINE_X, egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var axisY = debug.EditorMeshHelper.createGameObject("AxisY", egret3d.DefaultMeshes.LINE_Y, egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var axisZ = debug.EditorMeshHelper.createGameObject("AxisZ", egret3d.DefaultMeshes.LINE_Z, egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var arrowX = debug.EditorMeshHelper.createGameObject("ArrowX", egret3d.DefaultMeshes.PYRAMID, egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var arrowY = debug.EditorMeshHelper.createGameObject("ArrowY", egret3d.DefaultMeshes.PYRAMID, egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var arrowZ = debug.EditorMeshHelper.createGameObject("ArrowZ", egret3d.DefaultMeshes.PYRAMID, egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var pickX = debug.EditorMeshHelper.createGameObject("X", egret3d.DefaultMeshes.CUBE, egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var pickY = debug.EditorMeshHelper.createGameObject("Y", egret3d.DefaultMeshes.CUBE, egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var pickZ = debug.EditorMeshHelper.createGameObject("Z", egret3d.DefaultMeshes.CUBE, egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var pickXY = debug.EditorMeshHelper.createGameObject("XY", egret3d.DefaultMeshes.QUAD, egret3d.Material.create(egret3d.DefaultShaders.MESH_BASIC_DOUBLESIDE), "" /* Untagged */);
                    var pickYZ = debug.EditorMeshHelper.createGameObject("YZ", egret3d.DefaultMeshes.QUAD, egret3d.Material.create(egret3d.DefaultShaders.MESH_BASIC_DOUBLESIDE), "" /* Untagged */);
                    var pickZX = debug.EditorMeshHelper.createGameObject("ZX", egret3d.DefaultMeshes.QUAD, egret3d.Material.create(egret3d.DefaultShaders.MESH_BASIC_DOUBLESIDE), "" /* Untagged */);
                    this._highlights[pickX.uuid] = [pickX, axisX, arrowX];
                    this._highlights[pickY.uuid] = [pickY, axisY, arrowY];
                    this._highlights[pickZ.uuid] = [pickZ, axisZ, arrowZ];
                    translate.transform.setParent(this.gameObject.transform);
                    axisX.transform.setParent(translate.transform).setLocalPosition(0.001, 0.0, 0.0);
                    axisY.transform.setParent(translate.transform).setLocalPosition(0.0, 0.001, 0.0);
                    axisZ.transform.setParent(translate.transform).setLocalPosition(0.0, 0.0, 0.001);
                    arrowX.transform.setParent(translate.transform).setLocalPosition(egret3d.Vector3.RIGHT).setLocalEuler(0.0, 0.0, -Math.PI * 0.5).setLocalScale(0.1, 0.2, 0.1);
                    arrowY.transform.setParent(translate.transform).setLocalPosition(egret3d.Vector3.UP).setLocalScale(0.1, 0.2, 0.1);
                    arrowZ.transform.setParent(translate.transform).setLocalPosition(egret3d.Vector3.FORWARD).setLocalEuler(Math.PI * 0.5, 0.0, 0.0).setLocalScale(0.1, 0.2, 0.1);
                    pickX.transform.setParent(translate.transform).setLocalPosition(0.7, 0.0, 0.0).setLocalScale(0.9, 0.15, 0.15).gameObject.activeSelf = false;
                    pickY.transform.setParent(translate.transform).setLocalPosition(0.0, 0.7, 0.0).setLocalScale(0.15, 0.9, 0.15).gameObject.activeSelf = false;
                    pickZ.transform.setParent(translate.transform).setLocalPosition(0.0, 0.0, 0.7).setLocalScale(0.15, 0.15, 0.9).gameObject.activeSelf = false;
                    pickXY.transform.setParent(translate.transform).setLocalPosition(0.15, 0.15, 0.0).setLocalScale(0.3);
                    pickYZ.transform.setParent(translate.transform).setLocalPosition(0.0, 0.15, 0.15).setLocalEuler(0.0, Math.PI * 0.5, 0.0).setLocalScale(0.3);
                    pickZX.transform.setParent(translate.transform).setLocalPosition(0.15, 0.0, 0.15).setLocalEuler(Math.PI * 0.5, 0.0, 0.0).setLocalScale(0.3);
                    axisX.renderer.material.glTFTechnique.states.functions.lineWidth = [5];
                    axisY.renderer.material.glTFTechnique.states.functions.lineWidth = [5];
                    axisZ.renderer.material.glTFTechnique.states.functions.lineWidth = [5];
                    axisX.renderer.material.setOpacity(0.8).setDepth(false, false).setBlend(1 /* Blend */).setRenderQueue(4000 /* Overlay */).setColor(egret3d.Color.RED);
                    axisY.renderer.material.setOpacity(0.8).setDepth(false, false).setBlend(1 /* Blend */).setRenderQueue(4000 /* Overlay */).setColor(egret3d.Color.GREEN);
                    axisZ.renderer.material.setOpacity(0.8).setDepth(false, false).setBlend(1 /* Blend */).setRenderQueue(4000 /* Overlay */).setColor(egret3d.Color.BLUE);
                    arrowX.renderer.material.setOpacity(0.8).setDepth(false, false).setBlend(1 /* Blend */).setRenderQueue(4000 /* Overlay */).setColor(egret3d.Color.RED);
                    arrowY.renderer.material.setOpacity(0.8).setDepth(false, false).setBlend(1 /* Blend */).setRenderQueue(4000 /* Overlay */).setColor(egret3d.Color.GREEN);
                    arrowZ.renderer.material.setOpacity(0.8).setDepth(false, false).setBlend(1 /* Blend */).setRenderQueue(4000 /* Overlay */).setColor(egret3d.Color.BLUE);
                    pickX.renderer.material.setOpacity(0.8).setDepth(false, false).setBlend(1 /* Blend */).setRenderQueue(4000 /* Overlay */).setColor(egret3d.Color.RED);
                    pickY.renderer.material.setOpacity(0.8).setDepth(false, false).setBlend(1 /* Blend */).setRenderQueue(4000 /* Overlay */).setColor(egret3d.Color.GREEN);
                    pickZ.renderer.material.setOpacity(0.8).setDepth(false, false).setBlend(1 /* Blend */).setRenderQueue(4000 /* Overlay */).setColor(egret3d.Color.BLUE);
                    pickXY.renderer.material.setOpacity(0.8).setDepth(false, false).setBlend(1 /* Blend */).setRenderQueue(4000 /* Overlay */).setColor(egret3d.Color.YELLOW);
                    pickYZ.renderer.material.setOpacity(0.8).setDepth(false, false).setBlend(1 /* Blend */).setRenderQueue(4000 /* Overlay */).setColor(egret3d.Color.INDIGO);
                    pickZX.renderer.material.setOpacity(0.8).setDepth(false, false).setBlend(1 /* Blend */).setRenderQueue(4000 /* Overlay */).setColor(egret3d.Color.PURPLE);
                }
                {
                    var rotate = this.rotate;
                    var axisX = debug.EditorMeshHelper.createGameObject("AxisX", egret3d.DefaultMeshes.createCircle(1.0, 0.5, 1), egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var axisY = debug.EditorMeshHelper.createGameObject("AxisY", egret3d.DefaultMeshes.createCircle(1.0, 0.5, 2), egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var axisZ = debug.EditorMeshHelper.createGameObject("AxisZ", egret3d.DefaultMeshes.createCircle(1.0, 0.5, 3), egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var axisE = debug.EditorMeshHelper.createGameObject("AxisE", egret3d.DefaultMeshes.createCircle(1.25, 1.0, 3), egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var axisXYZE = debug.EditorMeshHelper.createGameObject("AxisXYZE", egret3d.DefaultMeshes.createCircle(1, 1, 3), egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var pickX = debug.EditorMeshHelper.createGameObject("X", egret3d.DefaultMeshes.createTorus(1.0, 0.1, 4, 12, 0.5, 1), egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var pickY = debug.EditorMeshHelper.createGameObject("Y", egret3d.DefaultMeshes.createTorus(1.0, 0.1, 4, 12, 0.5, 2), egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var pickZ = debug.EditorMeshHelper.createGameObject("Z", egret3d.DefaultMeshes.createTorus(1.0, 0.1, 4, 12, 0.5, 3), egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var pickE = debug.EditorMeshHelper.createGameObject("E", egret3d.DefaultMeshes.createTorus(1.25, 0.1, 4, 24, 1.0, 3), egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var pickXYZE = debug.EditorMeshHelper.createGameObject("XYZE", egret3d.DefaultMeshes.createSphere(0.7, 10, 8), egret3d.DefaultMaterials.MESH_BASIC.clone());
                    this._highlights[pickX.uuid] = [axisX];
                    this._highlights[pickY.uuid] = [axisY];
                    this._highlights[pickZ.uuid] = [axisZ];
                    this._highlights[pickE.uuid] = [axisE];
                    this._highlights[pickXYZE.uuid] = [axisXYZE];
                    rotate.transform.setParent(this.gameObject.transform);
                    axisX.transform.setParent(rotate.transform);
                    axisY.transform.setParent(rotate.transform);
                    axisZ.transform.setParent(rotate.transform);
                    axisE.transform.setParent(rotate.transform);
                    axisXYZE.transform.setParent(rotate.transform);
                    pickX.transform.setParent(rotate.transform).gameObject.activeSelf = false;
                    pickY.transform.setParent(rotate.transform).gameObject.activeSelf = false;
                    pickZ.transform.setParent(rotate.transform).gameObject.activeSelf = false;
                    pickE.transform.setParent(rotate.transform).gameObject.activeSelf = false;
                    pickXYZE.transform.setParent(rotate.transform).gameObject.activeSelf = false;
                    axisX.renderer.material.setOpacity(0.8).setDepth(false, false).setBlend(1 /* Blend */).setRenderQueue(4000 /* Overlay */).setColor(egret3d.Color.RED);
                    axisY.renderer.material.setOpacity(0.8).setDepth(false, false).setBlend(1 /* Blend */).setRenderQueue(4000 /* Overlay */).setColor(egret3d.Color.GREEN);
                    axisZ.renderer.material.setOpacity(0.8).setDepth(false, false).setBlend(1 /* Blend */).setRenderQueue(4000 /* Overlay */).setColor(egret3d.Color.BLUE);
                    axisE.renderer.material.setOpacity(0.8).setDepth(false, false).setBlend(1 /* Blend */).setRenderQueue(4000 /* Overlay */).setColor(egret3d.Color.YELLOW);
                    axisXYZE.renderer.material.setOpacity(0.8).setDepth(false, false).setBlend(1 /* Blend */).setRenderQueue(4000 /* Overlay */ - 1).setColor(egret3d.Color.GRAY);
                    pickX.renderer.material.setOpacity(0.8).setDepth(false, false).setBlend(1 /* Blend */).setRenderQueue(4000 /* Overlay */).setColor(egret3d.Color.RED);
                    pickY.renderer.material.setOpacity(0.8).setDepth(false, false).setBlend(1 /* Blend */).setRenderQueue(4000 /* Overlay */).setColor(egret3d.Color.GREEN);
                    pickZ.renderer.material.setOpacity(0.8).setDepth(false, false).setBlend(1 /* Blend */).setRenderQueue(4000 /* Overlay */).setColor(egret3d.Color.BLUE);
                    pickE.renderer.material.setOpacity(0.8).setDepth(false, false).setBlend(1 /* Blend */).setRenderQueue(4000 /* Overlay */).setColor(egret3d.Color.YELLOW);
                    pickXYZE.renderer.material.setOpacity(0.8).setDepth(false, false).setBlend(1 /* Blend */).setRenderQueue(4000 /* Overlay */ - 1).setColor(egret3d.Color.GRAY);
                }
                {
                    var scale = this.scale;
                    var axisX = debug.EditorMeshHelper.createGameObject("AxisX", egret3d.DefaultMeshes.LINE_X, egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var axisY = debug.EditorMeshHelper.createGameObject("AxisY", egret3d.DefaultMeshes.LINE_Y, egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var axisZ = debug.EditorMeshHelper.createGameObject("AxisZ", egret3d.DefaultMeshes.LINE_Z, egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var arrowX = debug.EditorMeshHelper.createGameObject("ArrowX", egret3d.DefaultMeshes.CUBE, egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var arrowY = debug.EditorMeshHelper.createGameObject("ArrowY", egret3d.DefaultMeshes.CUBE, egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var arrowZ = debug.EditorMeshHelper.createGameObject("ArrowZ", egret3d.DefaultMeshes.CUBE, egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var pickX = debug.EditorMeshHelper.createGameObject("X", egret3d.DefaultMeshes.CUBE, egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var pickY = debug.EditorMeshHelper.createGameObject("Y", egret3d.DefaultMeshes.CUBE, egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var pickZ = debug.EditorMeshHelper.createGameObject("Z", egret3d.DefaultMeshes.CUBE, egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var pickXY = debug.EditorMeshHelper.createGameObject("XY", egret3d.DefaultMeshes.QUAD, egret3d.Material.create(egret3d.DefaultShaders.MESH_BASIC_DOUBLESIDE), "" /* Untagged */);
                    var pickYZ = debug.EditorMeshHelper.createGameObject("YZ", egret3d.DefaultMeshes.QUAD, egret3d.Material.create(egret3d.DefaultShaders.MESH_BASIC_DOUBLESIDE), "" /* Untagged */);
                    var pickZX = debug.EditorMeshHelper.createGameObject("ZX", egret3d.DefaultMeshes.QUAD, egret3d.Material.create(egret3d.DefaultShaders.MESH_BASIC_DOUBLESIDE), "" /* Untagged */);
                    this._highlights[pickX.uuid] = [pickX, axisX, arrowX];
                    this._highlights[pickY.uuid] = [pickX, axisY, arrowY];
                    this._highlights[pickZ.uuid] = [pickX, axisZ, arrowZ];
                    scale.transform.setParent(this.gameObject.transform);
                    axisX.transform.setParent(scale.transform).setLocalPosition(0.001, 0.0, 0.0);
                    axisY.transform.setParent(scale.transform).setLocalPosition(0.0, 0.001, 0.0);
                    axisZ.transform.setParent(scale.transform).setLocalPosition(0.0, 0.0, 0.001);
                    arrowX.transform.setParent(scale.transform).setLocalPosition(egret3d.Vector3.RIGHT).setLocalScale(0.15, 0.15, 0.15);
                    arrowY.transform.setParent(scale.transform).setLocalPosition(egret3d.Vector3.UP).setLocalScale(0.15, 0.15, 0.15);
                    arrowZ.transform.setParent(scale.transform).setLocalPosition(egret3d.Vector3.FORWARD).setLocalScale(0.15, 0.15, 0.15);
                    pickX.transform.setParent(scale.transform).setLocalPosition(0.7, 0.0, 0.0).setLocalScale(0.9, 0.15, 0.15).gameObject.activeSelf = false;
                    pickY.transform.setParent(scale.transform).setLocalPosition(0.0, 0.7, 0.0).setLocalScale(0.15, 0.9, 0.15).gameObject.activeSelf = false;
                    pickZ.transform.setParent(scale.transform).setLocalPosition(0.0, 0.0, 0.7).setLocalScale(0.15, 0.15, 0.9).gameObject.activeSelf = false;
                    pickXY.transform.setParent(scale.transform).setLocalPosition(0.15, 0.15, 0.0).setLocalScale(0.3);
                    pickYZ.transform.setParent(scale.transform).setLocalPosition(0.0, 0.15, 0.15).setLocalEuler(0.0, Math.PI * 0.5, 0.0).setLocalScale(0.3);
                    pickZX.transform.setParent(scale.transform).setLocalPosition(0.15, 0.0, 0.15).setLocalEuler(Math.PI * 0.5, 0.0, 0.0).setLocalScale(0.3);
                    axisX.renderer.material.setOpacity(0.8).setDepth(false, false).setBlend(1 /* Blend */).setRenderQueue(4000 /* Overlay */).setColor(egret3d.Color.RED);
                    axisY.renderer.material.setOpacity(0.8).setDepth(false, false).setBlend(1 /* Blend */).setRenderQueue(4000 /* Overlay */).setColor(egret3d.Color.GREEN);
                    axisZ.renderer.material.setOpacity(0.8).setDepth(false, false).setBlend(1 /* Blend */).setRenderQueue(4000 /* Overlay */).setColor(egret3d.Color.BLUE);
                    arrowX.renderer.material.setOpacity(0.8).setDepth(false, false).setBlend(1 /* Blend */).setRenderQueue(4000 /* Overlay */).setColor(egret3d.Color.RED);
                    arrowY.renderer.material.setOpacity(0.8).setDepth(false, false).setBlend(1 /* Blend */).setRenderQueue(4000 /* Overlay */).setColor(egret3d.Color.GREEN);
                    arrowZ.renderer.material.setOpacity(0.8).setDepth(false, false).setBlend(1 /* Blend */).setRenderQueue(4000 /* Overlay */).setColor(egret3d.Color.BLUE);
                    pickX.renderer.material.setOpacity(0.8).setDepth(false, false).setBlend(1 /* Blend */).setRenderQueue(4000 /* Overlay */).setColor(egret3d.Color.RED);
                    pickY.renderer.material.setOpacity(0.8).setDepth(false, false).setBlend(1 /* Blend */).setRenderQueue(4000 /* Overlay */).setColor(egret3d.Color.GREEN);
                    pickZ.renderer.material.setOpacity(0.8).setDepth(false, false).setBlend(1 /* Blend */).setRenderQueue(4000 /* Overlay */).setColor(egret3d.Color.BLUE);
                    pickXY.renderer.material.setOpacity(0.8).setDepth(false, false).setBlend(1 /* Blend */).setRenderQueue(4000 /* Overlay */).setColor(egret3d.Color.YELLOW);
                    pickYZ.renderer.material.setOpacity(0.8).setDepth(false, false).setBlend(1 /* Blend */).setRenderQueue(4000 /* Overlay */).setColor(egret3d.Color.INDIGO);
                    pickZX.renderer.material.setOpacity(0.8).setDepth(false, false).setBlend(1 /* Blend */).setRenderQueue(4000 /* Overlay */).setColor(egret3d.Color.PURPLE);
                }
                this.mode = this.translate;
                this._quad.parent = this.gameObject;
                this._quad.activeSelf = false;
            };
            TransfromController.prototype._updateTransform = function (mousePosition) {
                var isWorldSpace = this.isWorldSpace;
                var hoveredName = this._hovered.name;
                var raycastInfo = debug.Helper.raycastB(this._plane, mousePosition.x, mousePosition.y);
                var modelComponent = this.gameObject.getComponent(debug.ModelComponent);
                var currentSelected = modelComponent.selectedGameObject;
                var currentSelectedPRS = this._prsStarts[currentSelected.uuid];
                this._offsetEnd.subtract(currentSelectedPRS[3], raycastInfo.position);
                if (this._mode === this.scale) {
                    isWorldSpace = false;
                }
                else {
                    switch (hoveredName) {
                        case "E":
                        case "XYZ":
                        case "XYZE":
                            isWorldSpace = true;
                            break;
                    }
                }
                if (!isWorldSpace) {
                    this._offsetEnd.applyQuaternion(currentSelectedPRS[4].clone().inverse().release());
                }
                if (this._mode === this.translate) {
                    if (hoveredName.indexOf("X") < 0) {
                        this._offsetEnd.x = this._offsetStart.x;
                    }
                    if (hoveredName.indexOf("Y") < 0) {
                        this._offsetEnd.y = this._offsetStart.y;
                    }
                    if (hoveredName.indexOf("Z") < 0) {
                        this._offsetEnd.z = this._offsetStart.z;
                    }
                    var position = egret3d.Vector3.create();
                    for (var _i = 0, _a = modelComponent.selectedGameObjects; _i < _a.length; _i++) {
                        var gameObject = _a[_i];
                        if (modelComponent.selectedGameObjects.indexOf(gameObject.parent) >= 0) {
                            continue;
                        }
                        var selectedPRS = this._prsStarts[gameObject.uuid];
                        position.subtract(this._offsetStart, this._offsetEnd);
                        if (isWorldSpace) {
                            position.add(selectedPRS[3]);
                            // TODO translationSnap
                            gameObject.transform.position = position;
                        }
                        else {
                            position.applyQuaternion(selectedPRS[1]);
                            position.add(selectedPRS[0]);
                            // TODO translationSnap
                            gameObject.transform.localPosition = position;
                        }
                    }
                    position.release();
                }
                else if (this._mode === this.rotate) {
                    var camera = egret3d.Camera.editor;
                    var tempVector = egret3d.Vector3.create();
                    var rotationAxis = egret3d.Vector3.create();
                    var quaternion = !isWorldSpace ? currentSelected.transform.getRotation() : egret3d.Quaternion.IDENTITY.clone();
                    var tempQuaternion = egret3d.Quaternion.create();
                    var ROTATION_SPEED = 20 / currentSelected.transform.getPosition().getDistance(tempVector.applyMatrix(camera.transform.getWorldMatrix()));
                    var rotationAngle = 0;
                    if (hoveredName.indexOf("XYZE") >= 0) {
                        tempVector.copy(this._offsetEnd).subtract(this._offsetStart, tempVector).cross(this.eye).normalize();
                        rotationAxis.copy(tempVector);
                        rotationAngle = this._offsetEnd.subtract(this._offsetStart, this._offsetEnd).dot(tempVector.cross(this.eye)) * ROTATION_SPEED;
                    }
                    else if (hoveredName.indexOf("E") >= 0) {
                        tempVector.copy(this._offsetEnd).cross(this._offsetStart);
                        rotationAxis.copy(this.eye);
                        rotationAngle = this._offsetEnd.getAngle(this._offsetStart) * (tempVector.dot(this.eye) < 0 ? 1 : -1);
                    }
                    else {
                        var unit = this._dir[hoveredName];
                        var tempVector2 = egret3d.Vector3.create();
                        rotationAxis.copy(unit);
                        tempVector.copy(unit);
                        tempVector2.subtract(this._offsetStart, this._offsetEnd);
                        if (!isWorldSpace) {
                            tempVector.applyQuaternion(quaternion);
                            tempVector2.applyQuaternion(currentSelectedPRS[4]);
                        }
                        rotationAngle = tempVector2.dot(tempVector.cross(this.eye).normalize()) * ROTATION_SPEED;
                        tempVector2.release();
                    }
                    for (var _b = 0, _c = modelComponent.selectedGameObjects; _b < _c.length; _b++) {
                        var gameObject = _c[_b];
                        var selectedPRS = this._prsStarts[gameObject.uuid];
                        if (isWorldSpace) {
                            tempQuaternion.fromAxis(rotationAxis, rotationAngle).multiply(selectedPRS[4]).normalize();
                            gameObject.transform.rotation = tempQuaternion;
                        }
                        else {
                            tempQuaternion.fromAxis(rotationAxis, rotationAngle).premultiply(selectedPRS[1]).normalize();
                            gameObject.transform.localRotation = tempQuaternion;
                        }
                    }
                    tempVector.release();
                    rotationAxis.release();
                    tempQuaternion.release();
                    // TODO
                    currentSelected.transform.localEulerAngles;
                }
                else if (this._mode === this.scale) {
                    if (hoveredName.indexOf("XYZ") >= 0) {
                        var d = this._offsetEnd.length / this._offsetStart.length;
                        if (this._offsetEnd.dot(this._offsetStart) < 0.0)
                            d *= -1.0;
                        this._offsetEnd.set(d, d, d);
                    }
                    else {
                        this._offsetEnd.divide(this._offsetStart);
                        if (hoveredName.indexOf("X") < 0) {
                            this._offsetEnd.x = 1.0;
                        }
                        if (hoveredName.indexOf("Y") < 0) {
                            this._offsetEnd.y = 1.0;
                        }
                        if (hoveredName.indexOf("Z") < 0) {
                            this._offsetEnd.z = 1.0;
                        }
                    }
                    // TODO this._offsetEnd scale aabb size
                    var scale = egret3d.Vector3.create();
                    for (var _d = 0, _e = modelComponent.selectedGameObjects; _d < _e.length; _d++) {
                        var gameObject = _e[_d];
                        if (modelComponent.selectedGameObjects.indexOf(gameObject.parent) >= 0) {
                            continue;
                        }
                        var selectedPRS = this._prsStarts[gameObject.uuid];
                        gameObject.transform.localScale = scale.multiply(this._offsetEnd, selectedPRS[2]);
                    }
                    scale.release();
                }
            };
            TransfromController.prototype._updateSelf = function () {
                var isWorldSpace = this._mode === this.scale ? false : this.isWorldSpace; // scale always oriented to local rotation
                var camera = egret3d.Camera.editor;
                var modelComponent = this.gameObject.getComponent(debug.ModelComponent);
                var currentSelected = modelComponent.selectedGameObject;
                var eye = this.eye.copy(camera.transform.position);
                var eyeDistance = eye.getDistance(currentSelected.transform.position);
                if (camera.opvalue > 0.0) {
                    eye.subtract(currentSelected.transform.position);
                }
                eye.normalize();
                var quaternion = isWorldSpace ? egret3d.Quaternion.IDENTITY : currentSelected.transform.getRotation();
                this.transform.position = currentSelected.transform.position;
                this.transform.rotation = quaternion;
                this.transform.scale = egret3d.Vector3.ONE.clone().multiplyScalar(eyeDistance / 10.0).release();
                if (this._mode === this.rotate) {
                    var tempQuaternion = quaternion.clone();
                    var tempQuaternion2 = quaternion.clone();
                    var alignVector = egret3d.Vector3.create();
                    alignVector.copy(this.eye).applyQuaternion(tempQuaternion.inverse());
                    {
                        tempQuaternion.fromAxis(egret3d.Vector3.RIGHT, Math.atan2(-alignVector.y, alignVector.z));
                        tempQuaternion.multiply(tempQuaternion2, tempQuaternion);
                        var axisX = this.rotate.transform.find("AxisX");
                        var pickX = this.rotate.transform.find("X");
                        axisX.setRotation(tempQuaternion);
                        pickX.setRotation(tempQuaternion);
                    }
                    {
                        tempQuaternion.fromAxis(egret3d.Vector3.UP, Math.atan2(alignVector.x, alignVector.z));
                        tempQuaternion.multiply(tempQuaternion2, tempQuaternion);
                        var axisY = this.rotate.transform.find("AxisY");
                        var pickY = this.rotate.transform.find("Y");
                        axisY.setRotation(tempQuaternion);
                        pickY.setRotation(tempQuaternion);
                    }
                    {
                        tempQuaternion.fromAxis(egret3d.Vector3.FORWARD, Math.atan2(-alignVector.x, alignVector.y));
                        tempQuaternion.multiply(tempQuaternion2, tempQuaternion);
                        var axisZ = this.rotate.transform.find("AxisZ");
                        var pickZ = this.rotate.transform.find("Z");
                        axisZ.setRotation(tempQuaternion);
                        pickZ.setRotation(tempQuaternion);
                    }
                    {
                        tempQuaternion2.fromMatrix(egret3d.Matrix4.create().lookAt(this.eye, egret3d.Vector3.ZERO, egret3d.Vector3.UP).release());
                        var axisE = this.rotate.transform.find("AxisE");
                        var pickE = this.rotate.transform.find("E");
                        axisE.setRotation(tempQuaternion2);
                        pickE.setRotation(tempQuaternion2);
                    }
                    {
                        tempQuaternion2.fromMatrix(egret3d.Matrix4.create().lookAt(this.eye, egret3d.Vector3.ZERO, egret3d.Vector3.UP).release());
                        var axisXYZE = this.rotate.transform.find("AxisXYZE");
                        axisXYZE.setRotation(tempQuaternion2);
                    }
                    tempQuaternion.release();
                    tempQuaternion2.release();
                    alignVector.release();
                }
            };
            TransfromController.prototype._updatePlane = function () {
                var isWorldSpace = this._mode === this.scale ? false : this.isWorldSpace; // scale always oriented to local rotation
                var rotation = isWorldSpace ? egret3d.Quaternion.IDENTITY : this.transform.rotation;
                var unitX = egret3d.Vector3.RIGHT.clone().applyQuaternion(rotation);
                var unitY = egret3d.Vector3.UP.clone().applyQuaternion(rotation);
                var unitZ = egret3d.Vector3.FORWARD.clone().applyQuaternion(rotation);
                // Align the plane for current transform mode, axis and space.
                var alignVector = unitY.clone();
                var dirVector = egret3d.Vector3.create();
                if (this._hovered && this._mode !== this.rotate) {
                    switch (this._hovered.name) {
                        case "X":
                            alignVector.cross(this.eye, unitX);
                            dirVector.cross(unitX, alignVector);
                            break;
                        case "Y":
                            alignVector.cross(this.eye, unitY);
                            dirVector.cross(unitY, alignVector);
                            break;
                        case "Z":
                            alignVector.cross(this.eye, unitZ);
                            dirVector.cross(unitZ, alignVector);
                            break;
                        case "XY":
                            dirVector.copy(unitZ);
                            break;
                        case "YZ":
                            dirVector.copy(unitX);
                            break;
                        case "ZX":
                            alignVector.copy(unitZ);
                            dirVector.copy(unitY);
                            break;
                    }
                }
                if (dirVector.length === 0.0) {
                    // If in rotate mode, make the plane parallel to camera
                    this._quad.transform.rotation = egret3d.Camera.editor.transform.rotation;
                }
                else {
                    this._quad.transform.rotation = egret3d.Quaternion.create().fromMatrix(egret3d.Matrix4.create().lookAt(egret3d.Vector3.ZERO, dirVector, alignVector).release()).release();
                }
                if (!this._controlling) {
                    this._plane.fromPoint(this._quad.transform.position, this._quad.transform.getForward().release());
                }
                unitX.release();
                unitY.release();
                unitZ.release();
                alignVector.release();
                dirVector.release();
            };
            TransfromController.prototype.start = function (mousePosition) {
                var isWorldSpace = this.isWorldSpace;
                var hoveredName = this._hovered.name;
                var raycastInfo = debug.Helper.raycastB(this._plane, mousePosition.x, mousePosition.y);
                var modelComponent = this.gameObject.getComponent(debug.ModelComponent);
                for (var _i = 0, _a = modelComponent.selectedGameObjects; _i < _a.length; _i++) {
                    var gameObject = _a[_i];
                    var transform = gameObject.transform;
                    this._prsStarts[gameObject.uuid] = [
                        egret3d.Vector3.create().copy(transform.localPosition),
                        egret3d.Quaternion.create().copy(transform.localRotation),
                        egret3d.Vector3.create().copy(transform.localScale),
                        egret3d.Vector3.create().copy(transform.position),
                        egret3d.Quaternion.create().copy(transform.rotation),
                        egret3d.Vector3.create().copy(transform.scale),
                        egret3d.Vector3.create().copy(transform.localEulerAngles),
                    ];
                }
                var currentSelectedPRS = this._prsStarts[modelComponent.selectedGameObject.uuid];
                this._offsetStart.subtract(currentSelectedPRS[3], raycastInfo.position);
                this._controlling = true;
                if (this._mode === this.scale) {
                    isWorldSpace = false;
                }
                else {
                    switch (hoveredName) {
                        case "E":
                        case "XYZ":
                        case "XYZE":
                            isWorldSpace = true;
                            break;
                    }
                }
                if (!isWorldSpace) {
                    this._offsetStart.applyQuaternion(currentSelectedPRS[4].clone().inverse().release());
                }
            };
            TransfromController.prototype.end = function () {
                //
                var modelComponent = this.gameObject.getComponent(debug.ModelComponent);
                for (var _i = 0, _a = modelComponent.selectedGameObjects; _i < _a.length; _i++) {
                    var gameObject = _a[_i];
                    var transform = gameObject.transform;
                    var currentPro = this._prsStarts[gameObject.uuid];
                    if (this.mode === this.translate) {
                        modelComponent.changeProperty("localPosition", currentPro[0], transform.localPosition, transform);
                    }
                    else if (this.mode === this.scale) {
                        modelComponent.changeProperty("localScale", currentPro[2], transform.localScale, transform);
                    }
                    else if (this.mode === this.rotate) {
                        modelComponent.changeProperty("localEulerAngles", currentPro[6], transform.localEulerAngles, transform);
                    }
                }
                for (var k in this._prsStarts) {
                    for (var _b = 0, _c = this._prsStarts[k]; _b < _c.length; _b++) {
                        var v = _c[_b];
                        v.release();
                    }
                    delete this._prsStarts[k];
                }
                this._controlling = false;
            };
            TransfromController.prototype.update = function (mousePosition) {
                if (this._hovered && this._controlling) {
                    this._updateTransform(mousePosition);
                }
                this._updateSelf();
                this._updatePlane();
            };
            Object.defineProperty(TransfromController.prototype, "mode", {
                get: function () {
                    return this._mode || this.translate;
                },
                set: function (value) {
                    if (this._mode === value) {
                        return;
                    }
                    this.translate !== value && (this.translate.activeSelf = false);
                    this.rotate !== value && (this.rotate.activeSelf = false);
                    this.scale !== value && (this.scale.activeSelf = false);
                    this._mode = value;
                    this._mode.activeSelf = true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TransfromController.prototype, "hovered", {
                get: function () {
                    return this._hovered;
                },
                set: function (value) {
                    if (this._hovered === value) {
                        return;
                    }
                    this._hovered = value;
                    if (this._hovered) {
                        var highlights = this._highlights[this._hovered.uuid] || [this._hovered];
                        for (var _i = 0, _a = this._mode.transform.children; _i < _a.length; _i++) {
                            var child = _a[_i];
                            if (!child.gameObject.renderer) {
                                continue;
                            }
                            var material = child.gameObject.renderer.material;
                            if (highlights.indexOf(child.gameObject) >= 0) {
                                material.opacity = 1.0;
                            }
                            else {
                                material.opacity = 0.2;
                            }
                        }
                    }
                    else {
                        for (var _b = 0, _c = this._mode.transform.children; _b < _c.length; _b++) {
                            var child = _c[_b];
                            if (!child.gameObject.renderer) {
                                continue;
                            }
                            child.gameObject.renderer.material.opacity = 0.8;
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });
            return TransfromController;
        }(paper.BaseComponent));
        debug.TransfromController = TransfromController;
        __reflect(TransfromController.prototype, "paper.debug.TransfromController");
    })(debug = paper.debug || (paper.debug = {}));
})(paper || (paper = {}));
var paper;
(function (paper) {
    var debug;
    (function (debug) {
        var _step = 5;
        /**
         * @internal
         */
        var GridController = (function (_super) {
            __extends(GridController, _super);
            function GridController() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this._gridA = _this._createGrid("GridA");
                _this._gridB = _this._createGrid("GridB", 100.0 * _step, 100 * _step);
                return _this;
            }
            GridController.prototype._createGrid = function (name, size, divisions) {
                if (size === void 0) { size = 100.0; }
                if (divisions === void 0) { divisions = 100; }
                var step = size / divisions;
                var halfSize = size / 2;
                var vertices = [];
                for (var i = 0, k = -halfSize; i <= divisions; i++, k += step) {
                    vertices.push(-halfSize, 0, k);
                    vertices.push(halfSize, 0, k);
                    vertices.push(k, 0, -halfSize);
                    vertices.push(k, 0, halfSize);
                }
                var mesh = new egret3d.Mesh(vertices.length, 0, ["POSITION" /* POSITION */]);
                mesh.setAttributes("POSITION" /* POSITION */, vertices);
                mesh.glTFMesh.primitives[0].mode = 1 /* Lines */;
                var gameObject = debug.EditorMeshHelper.createGameObject(name, mesh, egret3d.DefaultMaterials.MESH_BASIC.clone());
                return gameObject;
            };
            GridController.prototype.initialize = function () {
                _super.prototype.initialize.call(this);
                this._gridA.parent = this.gameObject;
                this._gridB.parent = this.gameObject;
                var mA = this._gridA.renderer.material;
                var mB = this._gridB.renderer.material;
                mA.setBlend(1 /* Blend */);
                mB.setBlend(1 /* Blend */);
            };
            GridController.prototype.update = function () {
                var camera = egret3d.Camera.editor;
                var aaa = camera.gameObject.getComponent(debug.OrbitControls);
                var target = aaa.lookAtPoint.clone().add(aaa.lookAtOffset);
                var eyeDistance = (10000.0 - target.getDistance(camera.transform.position)) * 0.01; // TODO
                var d = (eyeDistance % 1.0);
                var s = d * (_step - 1) + 1.0;
                this._gridA.transform.setScale(s * _step, 0.0, s * _step);
                this._gridB.transform.setScale(s, 0.0, s);
                var mA = this._gridA.renderer.material;
                var mB = this._gridB.renderer.material;
                mA.setOpacity(1.0 * 0.2);
                mB.setOpacity(d * 0.2);
            };
            return GridController;
        }(paper.BaseComponent));
        debug.GridController = GridController;
        __reflect(GridController.prototype, "paper.debug.GridController");
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
                    [{ componentClass: egret3d.Transform }]
                ];
                _this._disposeCollecter = paper.GameObject.globalGameObject.getOrAddComponent(paper.DisposeCollecter);
                _this._modelComponent = paper.GameObject.globalGameObject.getOrAddComponent(debug.ModelComponent);
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
                    _this._selectSceneOrGameObject(null);
                    _this._selectSceneOrGameObject(value);
                };
                _this._gameObjectUnselectedHandler = function (_c, value) {
                    _this._selectSceneOrGameObject(null);
                };
                _this._createGameObject = function () {
                    if (_this._modelComponent.selectedScene) {
                        var gameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE, "NoName" /* NoName */, "" /* Untagged */, _this._modelComponent.selectedScene);
                        _this._modelComponent.select(gameObject, true);
                    }
                    else {
                        var gameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE, "NoName" /* NoName */, "" /* Untagged */, _this._modelComponent.selectedGameObject.scene);
                        gameObject.transform.parent = _this._modelComponent.selectedGameObject.transform;
                        _this._modelComponent.select(gameObject, true);
                    }
                };
                _this._destroySceneOrGameObject = function () {
                    var selectedSceneOrGameObject = _this._guiComponent.inspector.instance;
                    if (selectedSceneOrGameObject) {
                        _this._modelComponent.select(null); // TODO 
                        (selectedSceneOrGameObject).destroy();
                    }
                };
                _this._nodeClickHandler = function (gui) {
                    _this._modelComponent.select(gui.instance, true);
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
            GUISystem.prototype._debug = function (value) {
                if (value) {
                    paper.EventPool.addEventListener("SceneSelected" /* SceneSelected */, debug.ModelComponent, this._sceneSelectedHandler);
                    paper.EventPool.addEventListener("SceneUnselected" /* SceneUnselected */, debug.ModelComponent, this._sceneUnselectedHandler);
                    paper.EventPool.addEventListener("GameObjectSelected" /* GameObjectSelected */, debug.ModelComponent, this._gameObjectSelectedHandler);
                    paper.EventPool.addEventListener("GameObjectUnselected" /* GameObjectUnselected */, debug.ModelComponent, this._gameObjectUnselectedHandler);
                    this._bufferedGameObjects.push(paper.GameObject.globalGameObject);
                    for (var _i = 0, _a = this._groups[0].gameObjects; _i < _a.length; _i++) {
                        var gameObject = _a[_i];
                        this._bufferedGameObjects.push(gameObject);
                    }
                    this._modelComponent.select(paper.Scene.activeScene);
                }
                else {
                    paper.EventPool.removeEventListener("SceneSelected" /* SceneSelected */, debug.ModelComponent, this._sceneSelectedHandler);
                    paper.EventPool.removeEventListener("SceneUnselected" /* SceneUnselected */, debug.ModelComponent, this._sceneUnselectedHandler);
                    paper.EventPool.removeEventListener("GameObjectSelected" /* GameObjectSelected */, debug.ModelComponent, this._gameObjectSelectedHandler);
                    paper.EventPool.removeEventListener("GameObjectUnselected" /* GameObjectUnselected */, debug.ModelComponent, this._gameObjectUnselectedHandler);
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
                }
            };
            GUISystem.prototype.onAwake = function () {
                var _this = this;
                var sceneOptions = {
                    debug: false,
                    assets: function () {
                        var assets = paper.Asset["_assets"];
                        var assetNames = [];
                        for (var k in assets) {
                            if (k.indexOf("builtin") >= 0) {
                                continue;
                            }
                            assetNames.push(k);
                            if (assets[k] instanceof egret3d.Texture) {
                                assetNames.push(k.replace(".image.json", ".png"));
                                assetNames.push(k.replace(".image.json", ".jpg"));
                            }
                        }
                        console.info(JSON.stringify(assetNames));
                    }
                };
                this._guiComponent.hierarchy.add(sceneOptions, "debug").onChange(function (v) {
                    var guiSceneSystem = paper.Application.systemManager.getOrRegisterSystem(debug.SceneSystem);
                    if (v) {
                        paper.Application.playerMode = 1 /* DebugPlayer */;
                        guiSceneSystem.enabled = true;
                    }
                    else {
                        _this._modelComponent.select(null);
                        _this._modelComponent.hover(null);
                        paper.Application.playerMode = 0 /* Player */;
                        guiSceneSystem.enabled = false;
                    }
                    _this._debug(v);
                });
                this._guiComponent.hierarchy.add(sceneOptions, "assets");
                this._guiComponent.hierarchy.close();
            };
            GUISystem.prototype.onEnable = function () {
            };
            GUISystem.prototype.onDisable = function () {
            };
            GUISystem.prototype.onAddGameObject = function (gameObject, _group) {
                if (paper.Application.playerMode !== 1 /* DebugPlayer */) {
                    return;
                }
                this._bufferedGameObjects.push(gameObject);
            };
            GUISystem.prototype.onRemoveGameObject = function (gameObject, _group) {
                if (paper.Application.playerMode !== 1 /* DebugPlayer */) {
                    return;
                }
                var index = this._bufferedGameObjects.indexOf(gameObject);
                if (index >= 0) {
                    this._bufferedGameObjects[index] = null;
                }
            };
            GUISystem.prototype.onUpdate = function (dt) {
                if (paper.Application.playerMode !== 1 /* DebugPlayer */) {
                    return;
                }
                var i = 0;
                while (this._bufferedGameObjects.length > 0 && i++ < 5) {
                    this._addToHierarchy(this._bufferedGameObjects.shift());
                }
                // Open and select folder.
                if (!this._selectFolder) {
                    var sceneOrGameObject = this._modelComponent.selectedScene || this._modelComponent.selectedGameObject;
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
        var SceneSystem = (function (_super) {
            __extends(SceneSystem, _super);
            function SceneSystem() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this._interests = [
                    [
                        { componentClass: egret3d.Transform }
                    ]
                ];
                _this._camerasAndLights = paper.GameObject.globalGameObject.getOrAddComponent(egret3d.CamerasAndLights);
                _this._modelComponent = paper.GameObject.globalGameObject.getOrAddComponent(debug.ModelComponent);
                _this._orbitControls = null;
                _this._transformController = null;
                _this._gridController = null;
                _this._hoverBox = null;
                _this._grids = null;
                _this._cameraViewFrustum = null; //TODO封装一下
                _this._pointerStartPosition = egret3d.Vector3.create();
                _this._pointerPosition = egret3d.Vector3.create();
                // private readonly _pickableSelected: GameObject[] = [];   //可被选中的 camera
                _this._boxes = {};
                _this._contextmenuHandler = function (event) {
                    event.preventDefault();
                };
                _this._onMouseDown = function (event) {
                    _this._pointerStartPosition.copy(_this._pointerPosition);
                    if (event.button === 0) {
                        if (event.buttons & 2) {
                            return;
                        }
                        var transformController = _this._transformController;
                        if (transformController && transformController.isActiveAndEnabled && transformController.hovered) {
                            transformController.start(_this._pointerPosition);
                        }
                    }
                    else if (event.button === 1) {
                    }
                    event.preventDefault();
                };
                _this._onMouseUp = function (event) {
                    if (event.button === 0) {
                        var transformController = _this._transformController;
                        if (transformController.isActiveAndEnabled && transformController.hovered) {
                            transformController.end();
                        }
                        else {
                            var hoveredGameObject = _this._modelComponent.hoveredGameObject;
                            if (hoveredGameObject) {
                                var selectedGameObject = _this._modelComponent.selectedGameObject;
                                if (_this._modelComponent.selectedGameObjects.indexOf(hoveredGameObject) >= 0) {
                                    if (event.ctrlKey) {
                                        _this._modelComponent.unselect(hoveredGameObject);
                                    }
                                }
                                else {
                                    if (_this._pointerPosition.getDistance(_this._pointerStartPosition) < 5.0) {
                                        if (hoveredGameObject.renderer instanceof egret3d.SkinnedMeshRenderer && !hoveredGameObject.transform.find("__pickTarget")) {
                                            var animation = hoveredGameObject.getComponentInParent(egret3d.Animation);
                                            if (animation) {
                                                var pickGameObject = debug.EditorMeshHelper.createGameObject("__pickTarget", null, null, "Editor Only" /* EditorOnly */, hoveredGameObject.scene);
                                                pickGameObject.transform.parent = hoveredGameObject.transform;
                                                pickGameObject.addComponent(debug.GizmoPickComponent).pickTarget = animation.gameObject;
                                            }
                                        }
                                        var pickHelper = hoveredGameObject.name === "__pickTarget" ? hoveredGameObject.transform : hoveredGameObject.transform.find("__pickTarget");
                                        if (pickHelper) {
                                            _this._modelComponent.select(pickHelper.gameObject.getComponent(debug.GizmoPickComponent).pickTarget, !(event.ctrlKey));
                                        }
                                        else {
                                            _this._modelComponent.select(hoveredGameObject, !event.ctrlKey);
                                        }
                                    }
                                    else if (event.ctrlKey) {
                                        // TODO
                                    }
                                    else {
                                        // TODO
                                    }
                                }
                            }
                            else if (!event.ctrlKey && !event.shiftKey) {
                                _this._modelComponent.select(null);
                            }
                        }
                    }
                    else if (event.button === 1) {
                    }
                    event.preventDefault();
                };
                _this._onMouseMove = function (event) {
                    _this._pointerPosition.set(event.clientX, event.clientY, 0.0);
                    egret3d.InputManager.mouse.convertPosition(_this._pointerPosition, _this._pointerPosition);
                    if (event.buttons & 2) {
                    }
                    else if (event.buttons & 1) {
                    }
                    else {
                        var transformController = _this._transformController;
                        if (transformController && transformController.isActiveAndEnabled) {
                            if (event.shiftKey || event.ctrlKey) {
                                transformController.hovered = null;
                            }
                            else {
                                var raycastInfos = debug.Helper.raycast(transformController.mode.transform.children, _this._pointerPosition.x, _this._pointerPosition.y);
                                if (raycastInfos.length > 0) {
                                    transformController.hovered = raycastInfos[0].transform.gameObject;
                                }
                                else {
                                    transformController.hovered = null;
                                }
                            }
                        }
                        else {
                            transformController.hovered = null;
                        }
                        if (!transformController || !transformController.isActiveAndEnabled || !transformController.hovered) {
                            var raycastInfos = debug.Helper.raycast(paper.Scene.activeScene.getRootGameObjects(), _this._pointerPosition.x, _this._pointerPosition.y);
                            if (raycastInfos.length > 0) {
                                _this._modelComponent.hover(raycastInfos[0].transform.gameObject);
                            }
                            else {
                                _this._modelComponent.hover(null);
                            }
                        }
                        else {
                            _this._modelComponent.hover(null);
                        }
                    }
                    event.preventDefault();
                };
                _this._onKeyUp = function (event) {
                    var transformController = _this._transformController;
                    if (!event.altKey && !event.ctrlKey && !event.shiftKey) {
                        switch (event.key.toLowerCase()) {
                            case "escape":
                                _this._modelComponent.select(null);
                                break;
                            case "f":
                                _this._orbitControls.distance = 10.0;
                                _this._orbitControls.lookAtOffset.set(0.0, 0.0, 0.0);
                                if (_this._modelComponent.selectedGameObject) {
                                    _this._orbitControls.lookAtPoint.copy(_this._modelComponent.selectedGameObject.transform.position);
                                }
                                else {
                                    _this._orbitControls.lookAtPoint.copy(egret3d.Vector3.ZERO);
                                }
                                break;
                            case "w":
                                if (transformController) {
                                    transformController.mode = transformController.translate;
                                }
                                break;
                            case "e":
                                if (transformController) {
                                    transformController.mode = transformController.rotate;
                                }
                                break;
                            case "r":
                                if (transformController) {
                                    transformController.mode = transformController.scale;
                                }
                                break;
                            case "x":
                                if (transformController) {
                                    transformController.isWorldSpace = !transformController.isWorldSpace;
                                }
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
            SceneSystem.prototype._selectGameObject = function (value, selected) {
                var transformController = this._transformController;
                if (selected) {
                    if (transformController) {
                        transformController.gameObject.activeSelf = true;
                    }
                    {
                        var box = debug.EditorMeshHelper.createBox("Box", egret3d.Color.INDIGO, 0.8, value.scene);
                        box.activeSelf = false;
                        box.parent = value;
                        this._boxes[value.uuid] = box;
                    }
                }
                else {
                    if (transformController) {
                        transformController.gameObject.activeSelf = false;
                    }
                    var box = this._boxes[value.uuid];
                    if (!box) {
                        throw new Error(); // Never.
                    }
                    delete this._boxes[value.uuid];
                    box.destroy();
                }
            };
            SceneSystem.prototype._updateBoxes = function () {
                for (var _i = 0, _a = this._modelComponent.selectedGameObjects; _i < _a.length; _i++) {
                    var gameObject = _a[_i];
                    var box = this._boxes[gameObject.uuid];
                    if (!box) {
                        throw new Error(); // Never.
                    }
                    if (gameObject.renderer) {
                        box.activeSelf = true;
                        box.transform.localPosition = gameObject.renderer.aabb.center;
                        // box.transform.localScale = gameObject.renderer.aabb.size;
                        var size = gameObject.renderer.aabb.size;
                        ; // TODO
                        box.transform.setLocalScale(size.x || 0.001, size.y || 0.001, size.z || 0.001);
                    }
                    else {
                        box.activeSelf = false;
                    }
                }
                if (this._hoverBox.activeSelf) {
                    var parentRenderer = this._hoverBox.parent ? this._hoverBox.parent.renderer : null; //TODO
                    if (parentRenderer) {
                        this._hoverBox.transform.localPosition = parentRenderer.aabb.center;
                        // this._hoverBox.transform.localScale = parentRenderer.aabb.size;
                        var size = parentRenderer.aabb.size; // TODO
                        this._hoverBox.transform.setLocalScale(size.x || 0.001, size.y || 0.001, size.z || 0.001);
                    }
                    else {
                        this._hoverBox.activeSelf = false;
                    }
                }
            };
            SceneSystem.prototype._updateCameras = function () {
                for (var _i = 0, _a = this._camerasAndLights.cameras; _i < _a.length; _i++) {
                    var camera = _a[_i];
                    if (camera.gameObject.tag === "Editor Only" /* EditorOnly */) {
                        continue;
                    }
                    var __editor = camera.transform.find("__pickTarget");
                    if (__editor) {
                        var cameraPosition = egret3d.Camera.editor.transform.getPosition();
                        var eyeDistance = cameraPosition.getDistance(camera.transform.position);
                        __editor.transform.setLocalScale(egret3d.Vector3.ONE.clone().multiplyScalar(eyeDistance / 40).release());
                        __editor.transform.rotation = egret3d.Camera.editor.transform.rotation;
                    }
                    else {
                        __editor = debug.EditorMeshHelper.createIcon("__pickTarget", camera.gameObject, egret3d.DefaultTextures.CAMERA_ICON).transform;
                    }
                    // const pick = iconObject;
                    // const pick = __editor.transform.find("__pickTarget").gameObject;
                    // if (this._pickableSelected.indexOf(pick) < 0) {
                    //     this._pickableSelected.push(pick);
                    // }
                }
                var setPoint = function (cameraProject, positions, x, y, z, points) {
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
                var selectedCamera = this._modelComponent.selectedGameObject ? this._modelComponent.selectedGameObject.getComponent(egret3d.Camera) : null;
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
                    setPoint(cameraProject, positions, 0, 0, -1, [38, 41]);
                    setPoint(cameraProject, positions, 0, 0, 1, [39]);
                    // near,
                    setPoint(cameraProject, positions, -1, -1, -1, [0, 7, 16, 25]);
                    setPoint(cameraProject, positions, 1, -1, -1, [1, 2, 18, 27]);
                    setPoint(cameraProject, positions, -1, 1, -1, [5, 6, 20, 29]);
                    setPoint(cameraProject, positions, 1, 1, -1, [3, 4, 22, 31]);
                    // far,
                    setPoint(cameraProject, positions, -1, -1, 1, [8, 15, 17]);
                    setPoint(cameraProject, positions, 1, -1, 1, [9, 10, 19]);
                    setPoint(cameraProject, positions, -1, 1, 1, [13, 14, 21]);
                    setPoint(cameraProject, positions, 1, 1, 1, [11, 12, 23]);
                    // up,
                    setPoint(cameraProject, positions, 0.7, 1.1, -1, [32, 37]);
                    setPoint(cameraProject, positions, -0.7, 1.1, -1, [33, 34]);
                    setPoint(cameraProject, positions, 0, 2, -1, [35, 36]);
                    // cross,
                    setPoint(cameraProject, positions, -1, 0, 1, [42]);
                    setPoint(cameraProject, positions, 1, 0, 1, [43]);
                    setPoint(cameraProject, positions, 0, -1, 1, [44]);
                    setPoint(cameraProject, positions, 0, 1, 1, [45]);
                    setPoint(cameraProject, positions, -1, 0, -1, [46]);
                    setPoint(cameraProject, positions, 1, 0, -1, [47]);
                    setPoint(cameraProject, positions, 0, -1, -1, [48]);
                    setPoint(cameraProject, positions, 0, 1, -1, [49]);
                    mesh.uploadVertexBuffer("POSITION" /* POSITION */);
                    cameraProject.release();
                }
                else {
                    this._cameraViewFrustum.activeSelf = false;
                }
            };
            SceneSystem.prototype._updateLights = function () {
                for (var _i = 0, _a = this._camerasAndLights.lights; _i < _a.length; _i++) {
                    var light = _a[_i];
                    if (light.gameObject.tag === "Editor Only" /* EditorOnly */) {
                        continue;
                    }
                    var __editor = light.transform.find("__pickTarget");
                    if (__editor) {
                        var cameraPosition = egret3d.Camera.editor.transform.getPosition();
                        var eyeDistance = cameraPosition.getDistance(light.transform.position);
                        __editor.transform.setLocalScale(egret3d.Vector3.ONE.clone().multiplyScalar(eyeDistance / 40).release());
                        __editor.transform.rotation = egret3d.Camera.editor.transform.rotation;
                    }
                    else {
                        __editor = debug.EditorMeshHelper.createIcon("__pickTarget", light.gameObject, egret3d.DefaultTextures.LIGHT_ICON).transform;
                    }
                    // const pick = iconObject;
                    // const pick = __editor.transform.find("pick").gameObject;
                    // if (this._pickableSelected.indexOf(pick) < 0) {
                    //     this._pickableSelected.push(pick);
                    // }
                }
            };
            SceneSystem.prototype.onEnable = function () {
                paper.EventPool.addEventListener("GameObjectHovered" /* GameObjectHovered */, debug.ModelComponent, this._onGameObjectHovered);
                paper.EventPool.addEventListener("GameObjectSelected" /* GameObjectSelected */, debug.ModelComponent, this._onGameObjectSelected);
                paper.EventPool.addEventListener("GameObjectUnselected" /* GameObjectUnselected */, debug.ModelComponent, this._onGameObjectUnselected);
                {
                    var canvas = egret3d.WebGLCapabilities.canvas;
                    canvas.addEventListener("contextmenu", this._contextmenuHandler);
                    canvas.addEventListener("mousedown", this._onMouseDown);
                    canvas.addEventListener("mouseup", this._onMouseUp);
                    canvas.addEventListener("mouseout", this._onMouseUp);
                    canvas.addEventListener("mousemove", this._onMouseMove);
                    window.addEventListener("keyup", this._onKeyUp);
                    window.addEventListener("keydown", this._onKeyDown);
                }
                this._orbitControls = egret3d.Camera.editor.gameObject.getOrAddComponent(debug.OrbitControls);
                this._transformController = debug.EditorMeshHelper.createGameObject("Axises").addComponent(debug.TransfromController);
                this._transformController.gameObject.activeSelf = false;
                this._gridController = debug.EditorMeshHelper.createGameObject("Grid").addComponent(debug.GridController);
                this._hoverBox = debug.EditorMeshHelper.createBox("HoverBox", egret3d.Color.WHITE, 0.6, paper.Scene.activeScene);
                this._hoverBox.activeSelf = false;
                this._cameraViewFrustum = debug.EditorMeshHelper.createCameraWireframed("Camera");
                this._cameraViewFrustum.activeSelf = false;
                //
                var editorCamera = egret3d.Camera.editor;
                var mainCamera = egret3d.Camera.main;
                editorCamera.transform.position = mainCamera.transform.position;
                editorCamera.transform.rotation = mainCamera.transform.rotation;
            };
            SceneSystem.prototype.onDisable = function () {
                paper.EventPool.removeEventListener("GameObjectHovered" /* GameObjectHovered */, debug.ModelComponent, this._onGameObjectHovered);
                paper.EventPool.removeEventListener("GameObjectSelected" /* GameObjectSelected */, debug.ModelComponent, this._onGameObjectSelected);
                paper.EventPool.removeEventListener("GameObjectUnselected" /* GameObjectUnselected */, debug.ModelComponent, this._onGameObjectUnselected);
                {
                    var canvas = egret3d.WebGLCapabilities.canvas;
                    canvas.removeEventListener("contextmenu", this._contextmenuHandler);
                    canvas.removeEventListener("mousedown", this._onMouseDown);
                    canvas.removeEventListener("mouseup", this._onMouseUp);
                    canvas.removeEventListener("mouseout", this._onMouseUp);
                    canvas.removeEventListener("mousemove", this._onMouseMove);
                    window.removeEventListener("keyup", this._onKeyUp);
                    window.removeEventListener("keydown", this._onKeyDown);
                }
                egret3d.Camera.editor.gameObject.removeComponent(debug.OrbitControls);
                this._orbitControls = null;
                if (this._transformController) {
                    this._transformController.gameObject.destroy();
                    this._transformController = null;
                }
                if (this._gridController) {
                    this._gridController.gameObject.destroy();
                    this._gridController = null;
                }
                if (this._hoverBox) {
                    this._hoverBox.destroy();
                    this._hoverBox = null;
                }
                if (this._grids) {
                    this._grids.destroy();
                    this._grids = null;
                }
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
                if (this._cameraViewFrustum && !this._cameraViewFrustum.isDestroyed) {
                    this._cameraViewFrustum.destroy();
                    this._cameraViewFrustum = null;
                }
                // this._pickableSelected.length = 0;
            };
            SceneSystem.prototype.onUpdate = function () {
                for (var _i = 0, _a = this._modelComponent.selectedGameObjects; _i < _a.length; _i++) {
                    var gameObject = _a[_i];
                    if (gameObject.isDestroyed) {
                        this._modelComponent.select(null);
                    }
                }
                // this._pickableSelected.length = 0;
                if (this._cameraViewFrustum) {
                    if (this._cameraViewFrustum.isDestroyed) {
                        this._cameraViewFrustum = null;
                    }
                    else {
                        this._cameraViewFrustum.activeSelf = this._modelComponent.selectedGameObject ? true : false;
                    }
                }
                var transformController = this._transformController;
                if (transformController && transformController.isActiveAndEnabled) {
                    transformController.update(this._pointerPosition);
                }
                var gridController = this._gridController;
                if (gridController && gridController.isActiveAndEnabled) {
                    gridController.update();
                }
                this._updateBoxes();
                this._updateCameras();
                this._updateLights();
            };
            return SceneSystem;
        }(paper.BaseSystem));
        debug.SceneSystem = SceneSystem;
        __reflect(SceneSystem.prototype, "paper.debug.SceneSystem");
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
            EditorMeshHelper.createBox = function (name, color, opacity, scene) {
                var box = this.createGameObject(name, egret3d.DefaultMeshes.CUBE_LINE, egret3d.DefaultMaterials.LINEDASHED_COLOR.clone(), "Editor Only" /* EditorOnly */, scene);
                box.getComponent(egret3d.MeshRenderer).material.setColor(color).setBlend(1 /* Blend */).opacity = opacity;
                return box;
            };
            EditorMeshHelper.createIcon = function (name, parent, icon) {
                var material = new egret3d.Material(egret3d.DefaultShaders.TRANSPARENT);
                material.renderQueue = 4000 /* Overlay */;
                material.setTexture("map" /* Map */, icon);
                material.setColor("diffuse" /* Diffuse */, egret3d.Color.RED);
                // const gameObject = this.createGameObject(name, null, null, parent.tag, parent.scene);
                // const pick = this.createGameObject("pick", egret3d.DefaultMeshes.CUBE, egret3d.DefaultMaterials.MESH_BASIC.clone(), parent.tag, parent.scene);
                // pick.transform.setParent(gameObject.transform);
                // pick.activeSelf = false;
                // pick.addComponent(GizmoPickComponent).pickTarget = parent;
                var iconObj = this.createGameObject(name, egret3d.DefaultMeshes.QUAD, material, parent.tag, parent.scene);
                iconObj.transform.setParent(parent.transform);
                iconObj.addComponent(debug.GizmoPickComponent).pickTarget = parent;
                // gameObject.transform.setParent(parent.transform);
                return iconObj;
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
            Helper.raycast = function (targets, mousePositionX, mousePositionY) {
                var camera = egret3d.Camera.editor;
                var ray = camera.createRayByScreen(mousePositionX, mousePositionY);
                var raycastInfos = paper.GameObject.raycast(ray, targets, 0.0, 16777215 /* Everything */, true);
                ray.release();
                return raycastInfos;
            };
            Helper.raycastB = function (raycastAble, mousePositionX, mousePositionY) {
                var camera = egret3d.Camera.editor;
                var ray = camera.createRayByScreen(mousePositionX, mousePositionY);
                var raycastInfo = egret3d.RaycastInfo.create();
                return raycastAble.raycast(ray, raycastInfo) ? raycastInfo : null;
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
