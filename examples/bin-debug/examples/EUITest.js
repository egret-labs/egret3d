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
var examples;
(function (examples) {
    var EUITest = (function () {
        function EUITest() {
        }
        EUITest.prototype.start = function () {
            return __awaiter(this, void 0, void 0, function () {
                var cube, meshFilter, meshRenderer, texture, material, gameObject;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, RES.loadConfig("default.res.json", "resource/")];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, RES.getResAsync("logo.png")];
                        case 2:
                            _a.sent();
                            // Create camera.
                            egret3d.Camera.main;
                            {
                                cube = paper.GameObject.create("Cube");
                                cube.transform.setLocalEulerAngles(45, 45, 0);
                                cube.addComponent(RotateScript);
                                meshFilter = cube.addComponent(egret3d.MeshFilter);
                                meshFilter.mesh = egret3d.DefaultMeshes.CUBE;
                                meshRenderer = cube.addComponent(egret3d.MeshRenderer);
                                texture = RES.getRes("logo.png");
                                material = egret3d.Material.create().setTexture(texture);
                                meshRenderer.material = material;
                            }
                            {
                                gameObject = paper.GameObject.create("GameUI");
                                gameObject.addComponent(egret3d.Egret2DRenderer);
                                gameObject.addComponent(GameUIScript);
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        return EUITest;
    }());
    examples.EUITest = EUITest;
    __reflect(EUITest.prototype, "examples.EUITest");
    var RotateScript = (function (_super) {
        __extends(RotateScript, _super);
        function RotateScript() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._timer = 0;
            return _this;
        }
        RotateScript.prototype.onUpdate = function (deltaTime) {
            this._timer += deltaTime;
            var sin = Math.sin(this._timer * 0.5);
            var cos = -Math.cos(this._timer * 0.5);
            this.gameObject.transform.setLocalEulerAngles(sin * 45, cos * 45, 0);
        };
        return RotateScript;
    }(paper.Behaviour));
    __reflect(RotateScript.prototype, "RotateScript");
    var GameUIScript = (function (_super) {
        __extends(GameUIScript, _super);
        function GameUIScript() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        GameUIScript.prototype.onStart = function () {
            var renderer = this.gameObject.getComponent(egret3d.Egret2DRenderer);
            var adapter = new egret3d.MatchWidthOrHeightAdapter();
            adapter.setResolution(egret3d.stage.size.w, egret3d.stage.size.h);
            renderer.screenAdapter = adapter;
            var assetAdapter = new AssetAdapter();
            egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
            egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
            var theme = new eui.Theme("resource/2d/default.thm.json", renderer.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, onThemeLoadComplete, this);
            function onThemeLoadComplete() {
                var uiLayer = new eui.UILayer();
                uiLayer.touchEnabled = false;
                renderer.root.addChild(uiLayer);
                var button = new eui.Button();
                button.label = "Click!";
                button.horizontalCenter = 0;
                button.verticalCenter = 0;
                uiLayer.addChild(button);
                button.addEventListener(egret.TouchEvent.TOUCH_TAP, onButtonClick, null);
                function onButtonClick(e) {
                    showPannel("Button Click!");
                }
                function showPannel(title) {
                    return __awaiter(this, void 0, void 0, function () {
                        var panel;
                        return __generator(this, function (_a) {
                            panel = new eui.Panel();
                            panel.title = title;
                            panel.horizontalCenter = 0;
                            panel.verticalCenter = 0;
                            uiLayer.addChild(panel);
                            return [2 /*return*/];
                        });
                    });
                }
            }
        };
        return GameUIScript;
    }(paper.Behaviour));
    __reflect(GameUIScript.prototype, "GameUIScript");
    var ThemeAdapter = (function () {
        function ThemeAdapter() {
        }
        ThemeAdapter.prototype.getTheme = function (url, onSuccess, onError, thisObject) {
            var _this = this;
            function onResGet(e) {
                onSuccess.call(thisObject, e);
            }
            function onResError(e) {
                if (e.resItem.url === url) {
                    RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, onResError, null);
                    onError.call(thisObject);
                }
            }
            if (typeof generateEUI !== 'undefined') {
                egret.callLater(function () {
                    onSuccess.call(thisObject, generateEUI);
                }, this);
            }
            else if (typeof generateEUI2 !== 'undefined') {
                RES.getResByUrl("resource/gameEui.json", function (data, url) {
                    window["JSONParseClass"]["setData"](data);
                    onResGet(data);
                    egret.callLater(function () {
                        onSuccess.call(thisObject, generateEUI2);
                    }, _this);
                }, this, RES.ResourceItem.TYPE_JSON);
            }
            else {
                RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, onResError, null);
                RES.getResByUrl(url, onResGet, this, RES.ResourceItem.TYPE_TEXT);
            }
        };
        return ThemeAdapter;
    }());
    __reflect(ThemeAdapter.prototype, "ThemeAdapter", ["eui.IThemeAdapter"]);
    var AssetAdapter = (function () {
        function AssetAdapter() {
        }
        AssetAdapter.prototype.getAsset = function (source, compFunc, thisObject) {
            function onGetRes(data) {
                compFunc.call(thisObject, data, source);
            }
            var data = RES.getRes(source);
            if (data) {
                onGetRes(data);
            }
            else {
                RES.getResAsync(source, onGetRes, this);
            }
        };
        return AssetAdapter;
    }());
    __reflect(AssetAdapter.prototype, "AssetAdapter", ["eui.IAssetAdapter"]);
})(examples || (examples = {}));
