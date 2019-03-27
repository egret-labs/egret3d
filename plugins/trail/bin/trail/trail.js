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
/**
 * TODO:
 *
 * * 目前并未支持颜色参数, 因为渲染器还无法正常工作
 * * 支持除 `TrailTextureMode.stretch` 以外的 `TrailTextureMode`, 未完成
 * * 支持宽度曲线和颜色渐变以及相应的取样算法
 */
var egret3d;
(function (egret3d) {
    var trail;
    (function (trail) {
        // 为增加可读性添加的帮助函数
        function vec3() { return egret3d.Vector3.create().release(); }
        /**
         * 获得两个向量相加的结果向量
         * @param a
         * @param b
         */
        function vec3Add(a, b) { return vec3().add(a, b); }
        /**
         * 获得两个向量相减的结果向量
         * @param a
         * @param b
         */
        function vec3Substract(a, b) { return vec3().subtract(a, b); }
        /**
         * 获得向量乘以一个标量的的结果向量
         * @param a 向量
         * @param b 标量
         */
        function vec3Mutiply(a, b) { return vec3().multiplyScalar(b, a); }
        /**
         * 获得两个向量叉乘的结果向量
         * @param a
         * @param b
         */
        function vec3Cross(a, b) { return vec3().cross(a, b); }
        /**
         * 用 `TrailComponent` 数据生成对应用于绘制的 `Mesh` 数据
         * @internal
         */
        var TrailBatcher = (function () {
            function TrailBatcher() {
                // 设置数据
                /**
                 * 最大片段数
                 * 假设存活 5 秒, 每秒 60 帧, 则最多在存活时间内生成 300 个片段
                 */
                this._maxFragmentCount = 5 * 60;
                // 状态数据
                /**
                 * 各个片段的数据
                 */
                // 每个片段
                this._points = [];
                /**
                 * 暂停时候的时间戳, 用于在恢复播放时计算时间差
                 */
                this._pausedTime = -1;
                /**
                 * 定点, 每 3 个值对应一个顶点
                 */
                this._verticles = [];
                /**
                 * UV, 每 2 个值对应一个 uv
                 */
                this._uvs = [];
                /**
                 * 颜色, 每 4 个值对应一个颜色, 顺序为 rgba
                 */
                this._colors = [];
                /**
                 * 三角形对应的定点索引, 每 3 个值对应一个三角形
                 */
                this._indices = [];
                /**
                 * 点和点之间的距离, 为了便于对齐, 第一个值为零
                 */
                this._pointDistances = [0.0];
                /**
                 * 点和点之间的距离的总和
                 */
                this._distanceSum = 0;
            }
            /**
             * 暂停
             */
            TrailBatcher.prototype.pause = function () {
                this._pausedTime = paper.clock.timestamp();
            };
            /**
             * 恢复
             */
            TrailBatcher.prototype.resume = function () {
                if (this._pausedTime < 0) {
                    console.warn("_pausedTime should not be less than 0 in TrailBatcher.resume()");
                }
                var frozenTime = paper.clock.timestamp() - this._pausedTime;
                for (var _i = 0, _a = this._points; _i < _a.length; _i++) {
                    var p = _a[_i];
                    p.timeCreated += frozenTime;
                }
            };
            /**
             * 清理状态数据
             */
            TrailBatcher.prototype.clean = function () {
                this._points.length = 0;
                this._lastPosition = null;
                this._pausedTime = -1;
                this._distanceSum = 0;
                this._pointDistances.length = 1;
                this._resetMeshData();
            };
            /**
             * 初始化
             * @param comp 对应的 Trail 组件
             */
            TrailBatcher.prototype.init = function (comp) {
                this._comp = comp;
                this._createMesh();
            };
            /**
             * 每帧刷新
             * @param elapsedTime 此帧的时长(秒) (未使用此参数)
             */
            TrailBatcher.prototype.update = function (elapsedTime) {
                if (!this._comp) {
                    return;
                }
                var comp = this._comp;
                // 暂停情况下不更新
                if (comp.isPaused) {
                    return;
                }
                // 自动销毁
                if (!comp.isPlaying) {
                    if (comp.autoDestruct && this._points.length < 2) {
                        comp.gameObject.destroy();
                    }
                }
                var now = paper.clock.timestamp();
                // 更新片段数据
                this._updateSegments(now);
                // 重新构建组成 mesh 的相关数据
                this._rebuildMeshData(now);
                // 更新 mesh
                this._composeMesh();
            };
            /**
             * 在拖尾相关的组件初始化齐全后配置渲染相关的参数
             */
            TrailBatcher.prototype.setupRenderer = function () {
                // 把 mesh 传给 MeshFilter 组件
                var meshFilter = this._comp.gameObject.getComponent(egret3d.MeshFilter);
                if (!meshFilter) {
                    console.warn("no MeshFilter on Trail object(" + this._comp.gameObject.name + ")");
                    return;
                }
                meshFilter.mesh = this._mesh;
                // TODO: 设置使用颜色
                // const meshRenderer = this._comp.gameObject.getComponent(MeshRenderer);
                // meshRenderer.material.addDefine(egret3d.ShaderDefine.USE_COLOR);
            };
            /**
             * 更新片段数据
             * @param now 当前时间戳
             */
            TrailBatcher.prototype._updateSegments = function (now) {
                var comp = this._comp;
                if (comp.isPaused) {
                    return;
                }
                var curPosition = comp.transform.position;
                // 如果移动了足够远, 就生成新的点, 否则只是修正最后的点
                var theDistance = this._lastPosition ? curPosition.getDistance(this._lastPosition) : -1;
                var count = this._points.length;
                var isPlaying = comp.isPlaying;
                var prevLastPoint = this._points[count - 1];
                if (isPlaying) {
                    if (theDistance > comp.minVertexDistance || theDistance < 0) {
                        this._points.push({ position: egret3d.Vector3.create().copy(curPosition), timeCreated: now });
                        if (!this._lastPosition) {
                            this._lastPosition = egret3d.Vector3.create();
                        }
                        this._lastPosition.copy(curPosition);
                        // 添加新的点到上一个点的距离
                        if (prevLastPoint) {
                            var newDistance = prevLastPoint.position.getDistance(curPosition);
                            this._pointDistances.push(newDistance);
                            this._distanceSum += newDistance;
                        }
                    }
                    else if (count > 0) {
                        prevLastPoint.position.copy(curPosition);
                        prevLastPoint.timeCreated = now;
                        // 更新末尾点到上一个点的距离
                        if (count > 1) {
                            var newDistance = prevLastPoint.position.getDistance(this._points[count - 2].position);
                            this._distanceSum = this._distanceSum - this._pointDistances[count - 1] + newDistance;
                            this._pointDistances[count - 1] = newDistance;
                        }
                    }
                }
                // 移除过期的片段
                this._removeDeadPoints(now, comp.time * 1000);
            };
            /**
             * 移除超过生命周期的片段
             * @param now 当前时间戳
             * @param lifeTime 片段可存活时间
             */
            TrailBatcher.prototype._removeDeadPoints = function (now, lifeTime) {
                var len = this._points.length;
                if (len === 0) {
                    return;
                }
                for (var i = 0; i < len; i++) {
                    if (now - this._points[i].timeCreated < lifeTime) {
                        if (i > 0) {
                            this._points.splice(0, i);
                            for (var j = 0; j < i; j++) {
                                this._distanceSum -= this._pointDistances[j];
                            }
                            this._pointDistances.splice(0, i);
                        }
                        break;
                    }
                }
            };
            /**
             * 重新组成 mesh 的相关数据
             * @param now 当前时间戳
             */
            TrailBatcher.prototype._rebuildMeshData = function (now) {
                this._resetMeshData();
                var count = this._points.length;
                if (count < 2) {
                    return;
                }
                // 获取 camera
                var camera = this._getCamera();
                if (!camera) {
                    return;
                }
                var comp = this._comp;
                var ratioSum = 0.0;
                var worldToLocalMatrix = comp.gameObject.transform.worldToLocalMatrix;
                for (var i = 0; i < count; ++i) {
                    var p = this._points[i];
                    // 根据片段生存的时间获取对应的宽度和颜色采样
                    var time = (now - p.timeCreated) / comp.time;
                    // const color: Color = this._getColorSample(comp, time);
                    var width = this._getWidthSample(comp, time);
                    // 当前拖尾片段的向量
                    var lineDirection = i === 0
                        ? vec3Substract(p.position, this._points[i + 1].position)
                        : vec3Substract(this._points[i - 1].position, p.position);
                    // 当前摄像机到游戏对象的向量
                    var vectorFacing = comp.Alignment === trail.TrailAlignment.View
                        ? vec3Substract(camera.transform.position, p.position)
                        : comp.gameObject.transform.getForward(vec3());
                    // 以上两者的叉乘即为拖尾移动方向的垂直向量
                    var perpendicular = vec3Cross(lineDirection, vectorFacing).normalize();
                    // 上述向量正反方向各走半个宽度值即为两个新的顶点值
                    var vertex = void 0;
                    vertex = vec3Add(p.position, vec3Mutiply(perpendicular, width * 0.5));
                    vertex.applyMatrix(worldToLocalMatrix);
                    this._verticles[i * 6 + 0] = vertex.x;
                    this._verticles[i * 6 + 1] = vertex.y;
                    this._verticles[i * 6 + 2] = vertex.z;
                    vertex = vec3Add(p.position, vec3Mutiply(perpendicular, -width * 0.5));
                    vertex.applyMatrix(worldToLocalMatrix);
                    this._verticles[i * 6 + 3] = vertex.x;
                    this._verticles[i * 6 + 4] = vertex.y;
                    this._verticles[i * 6 + 5] = vertex.z;
                    // 同样的颜色值
                    // this._colors[i * 8 + 0] = color.r;
                    // this._colors[i * 8 + 1] = color.g;
                    // this._colors[i * 8 + 2] = color.b;
                    // this._colors[i * 8 + 3] = color.a;
                    // this._colors[i * 8 + 4] = color.r;
                    // this._colors[i * 8 + 5] = color.g;
                    // this._colors[i * 8 + 6] = color.b;
                    // this._colors[i * 8 + 7] = color.a;
                    // 两点的 uv 值
                    if (comp.textureMode === trail.TrailTextureMode.Stretch) {
                        var ratio = this._distanceSum ? this._pointDistances[i] / this._distanceSum : 0;
                        ratioSum += ratio;
                        this._uvs[i * 4 + 0] = ratioSum;
                        this._uvs[i * 4 + 1] = 1;
                        this._uvs[i * 4 + 2] = ratioSum;
                        this._uvs[i * 4 + 3] = 0;
                    }
                    else {
                        // TODO: not finished
                        this._uvs[i * 2 + 0] = 0;
                        this._uvs[i * 2 + 1] = 1;
                        this._uvs[i * 2 + 0] = 0;
                        this._uvs[i * 2 + 1] = 0;
                    }
                    if (i > 0) {
                        this._indices[(i - 1) * 6 + 0] = (i * 2) - 2;
                        this._indices[(i - 1) * 6 + 1] = (i * 2) - 1;
                        this._indices[(i - 1) * 6 + 2] = i * 2;
                        this._indices[(i - 1) * 6 + 3] = (i * 2) + 1;
                        this._indices[(i - 1) * 6 + 4] = i * 2;
                        this._indices[(i - 1) * 6 + 5] = (i * 2) - 1;
                    }
                }
            };
            // TODO: 支持颜色参数
            // /**
            //  * 根据时间在获得颜色值取样
            //  * @param comp 拖尾组件
            //  * @param time 时间比例值
            //  */
            // private _getColorSample(comp: TrailComponent, time: float): Color {
            //     const color: Color = Color.create();
            //     if (comp.color.length > 0) {
            //         const colorTime = time * (comp.color.length - 1);
            //         const min = Math.floor(colorTime);
            //         const max = math.clamp(Math.ceil(colorTime), 0, comp.color.length - 1);
            //         const lerp = math.inverseLerp(min, max, colorTime);
            //         color.lerp(comp.color[min], comp.color[max], lerp);
            //     } else {
            //         color.lerp(Color.WHITE, Color.ZERO, time);
            //     }
            //     return comp.color;
            // }
            /**
             * 根据时间在获得宽度值取样
             * @param comp 拖尾组件
             * @param time 时间比例值
             */
            TrailBatcher.prototype._getWidthSample = function (comp, time) {
                // let width: float;
                // if (comp.width.length > 0) {
                //     const widthTime = time * (comp.width.length - 1);
                //     const min = Math.floor(widthTime);
                //     const max = math.clamp(Math.ceil(widthTime), 0, comp.width.length - 1);
                //     const lerp = math.inverseLerp(min, max, widthTime);
                //     width = math.lerp(comp.width[min], comp.width[max], lerp);
                // } else {
                //     width = 1;
                // }
                return comp.width;
            };
            /**
             * 获取渲染用的相机
             */
            TrailBatcher.prototype._getCamera = function () {
                return egret3d.Camera.main;
            };
            /**
             * 重置组成 `Mesh` 的相关数据
             */
            TrailBatcher.prototype._resetMeshData = function () {
                this._verticles.length = 0;
                this._uvs.length = 0;
                this._colors.length = 0;
                this._indices.length = 0;
            };
            /**
             * 更新 `Mesh` 内容
             */
            TrailBatcher.prototype._composeMesh = function () {
                if (this._points.length > this._maxFragmentCount) {
                    this._maxFragmentCount = this._points.length;
                    this._createMesh();
                }
                var buff = this._mesh.getAttributes("POSITION" /* POSITION */);
                if (buff) {
                    buff.fill(0.0);
                }
                this._mesh.setAttributes("POSITION" /* POSITION */, this._verticles);
                buff = this._mesh.getAttributes("TEXCOORD_0" /* TEXCOORD_0 */);
                if (buff) {
                    buff.fill(0.0);
                }
                this._mesh.setAttributes("TEXCOORD_0" /* TEXCOORD_0 */, this._uvs);
                // buff = this._mesh.getAttributes(gltf.AttributeSemantics.COLOR_0);
                // if (buff) { buff.fill(0.0); }
                // this._mesh.setAttributes(gltf.AttributeSemantics.COLOR_0, this._colors);
                buff = this._mesh.getIndices();
                if (buff) {
                    buff.fill(0.0);
                }
                this._mesh.setIndices(this._indices);
                this._mesh.uploadVertexBuffer();
                this._mesh.uploadSubIndexBuffer(0);
            };
            /**
             * 生成 `Mesh` 对象
             */
            TrailBatcher.prototype._createMesh = function () {
                this._mesh = egret3d.Mesh.create(this._maxFragmentCount * 4, (this._maxFragmentCount - 1) * 6);
            };
            return TrailBatcher;
        }());
        trail.TrailBatcher = TrailBatcher;
        __reflect(TrailBatcher.prototype, "egret3d.trail.TrailBatcher");
    })(trail = egret3d.trail || (egret3d.trail = {}));
})(egret3d || (egret3d = {}));
var egret3d;
(function (egret3d) {
    var trail;
    (function (trail) {
        /**
         * 拖尾的朝向
         */
        var TrailAlignment;
        (function (TrailAlignment) {
            /**
             * 始终面对摄像机
             */
            TrailAlignment["View"] = "View";
            /**
             * 使用自己的 Transform 设置
             */
            TrailAlignment["Local"] = "Local";
        })(TrailAlignment = trail.TrailAlignment || (trail.TrailAlignment = {}));
        /**
         * 拖尾的材质模式
         */
        var TrailTextureMode;
        (function (TrailTextureMode) {
            /**
             * 伸展到整个拖尾
             */
            TrailTextureMode["Stretch"] = "Stretch";
            /**
             * 每个拖尾片段使用一个材质
             */
            TrailTextureMode["PerSegment"] = "PerSegment";
            /**
             * 重复平铺
             */
            TrailTextureMode["Tile"] = "Tile";
        })(TrailTextureMode = trail.TrailTextureMode || (trail.TrailTextureMode = {}));
        /**
         * 拖尾组件
         */
        var TrailComponent = (function (_super) {
            __extends(TrailComponent, _super);
            function TrailComponent() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                /**
                 * 拖尾的存活时间 (秒)
                 */
                _this.time = 3.0;
                /**
                 * 生成下一个拖尾片段的最小距离
                 */
                _this.minVertexDistance = 0.1;
                /**
                 * 拖尾的宽度 (值 / 变化曲线)
                 */
                _this.width = 1.0;
                // /**
                //  * 拖尾的颜色 (值 / 变化曲线) 
                //  */
                // @paper.serializedField
                // @paper.editor.property(paper.editor.EditType.COLOR)
                // public color: Color = Color.WHITE;
                /**
                 * 生命期结束后是否自动销毁
                 */
                _this.autoDestruct = false;
                /**
                 * 拖尾的朝向是始终面对摄像机还是有自己的单独设置
                 * @see {TrailAlignment}
                 */
                _this.Alignment = TrailAlignment.View;
                /**
                 * 拖尾的材质模式
                 * @see {TrailTextureMode}
                 */
                _this.textureMode = TrailTextureMode.Stretch;
                /**
                 * @internal
                 */
                _this._isPlaying = true;
                /**
                 * @internal
                 */
                _this._isPaused = false;
                _this._timeScale = 1.0;
                _this._batcher = new trail.TrailBatcher();
                return _this;
            }
            /**
             * @internal
             */
            TrailComponent.prototype._clean = function () {
                this._batcher.clean();
            };
            TrailComponent.prototype.initialize = function () {
                _super.prototype.initialize.call(this);
                this._batcher.init(this);
                this._clean();
            };
            TrailComponent.prototype.uninitialize = function () {
                _super.prototype.uninitialize.call(this);
                this._clean();
            };
            /**
             * @internal
             */
            TrailComponent.prototype.update = function (elapsedTime) {
                this._batcher.update(elapsedTime * this._timeScale);
            };
            /**
             * 从头开始播放
             */
            TrailComponent.prototype.play = function () {
                this._isPlaying = true;
                this._isPaused = false;
                this._batcher.clean();
            };
            /**
             * (从暂停中)恢复播放, 如果未暂停, 就从头开始播放
             */
            TrailComponent.prototype.resume = function () {
                if (this._isPaused) {
                    this._isPaused = false;
                    this._batcher.resume();
                }
                else {
                    if (this._isPlaying) {
                        return;
                    }
                    this.play();
                }
            };
            /**
             * 暂停
             */
            TrailComponent.prototype.pause = function () {
                if (!this._isPlaying) {
                    return;
                }
                this._isPaused = true;
            };
            /**
             * 停止播放
             */
            TrailComponent.prototype.stop = function () {
                this._isPlaying = false;
                this._isPaused = false;
            };
            Object.defineProperty(TrailComponent.prototype, "isPlaying", {
                /**
                 * 是否正在播放
                 */
                get: function () {
                    return this._isPlaying;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TrailComponent.prototype, "isPaused", {
                /**
                 * 是否播放已经暂停
                 */
                get: function () {
                    return this._isPaused;
                },
                enumerable: true,
                configurable: true
            });
            TrailComponent.prototype.setupRenderer = function () {
                this._batcher.setupRenderer();
            };
            __decorate([
                paper.serializedField,
                paper.editor.property("FLOAT" /* FLOAT */, { minimum: 0.0 })
            ], TrailComponent.prototype, "time", void 0);
            __decorate([
                paper.serializedField,
                paper.editor.property("FLOAT" /* FLOAT */, { minimum: 0.0 })
            ], TrailComponent.prototype, "minVertexDistance", void 0);
            __decorate([
                paper.serializedField,
                paper.editor.property("FLOAT" /* FLOAT */, { minimum: 0.0 })
            ], TrailComponent.prototype, "width", void 0);
            __decorate([
                paper.serializedField,
                paper.editor.property("CHECKBOX" /* CHECKBOX */)
            ], TrailComponent.prototype, "autoDestruct", void 0);
            __decorate([
                paper.serializedField,
                paper.editor.property("LIST" /* LIST */, { listItems: paper.editor.getItemsFromEnum(egret3d.trail.TrailAlignment) })
            ], TrailComponent.prototype, "Alignment", void 0);
            __decorate([
                paper.serializedField
            ], TrailComponent.prototype, "textureMode", void 0);
            TrailComponent = __decorate([
                paper.requireComponent(egret3d.MeshFilter),
                paper.requireComponent(egret3d.MeshRenderer)
            ], TrailComponent);
            return TrailComponent;
        }(paper.BaseComponent));
        trail.TrailComponent = TrailComponent;
        __reflect(TrailComponent.prototype, "egret3d.trail.TrailComponent");
    })(trail = egret3d.trail || (egret3d.trail = {}));
})(egret3d || (egret3d = {}));
var egret3d;
(function (egret3d) {
    var trail;
    (function (trail_1) {
        /**
         * 拖尾系统
         */
        var TrailSystem = (function (_super) {
            __extends(TrailSystem, _super);
            function TrailSystem() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            TrailSystem.prototype.getMatchers = function () {
                return [
                    paper.Matcher.create(egret3d.Transform, egret3d.MeshFilter, egret3d.MeshRenderer, trail_1.TrailComponent),
                ];
            };
            TrailSystem.prototype.onEntityAdded = function (entity) {
                var trail = entity.getComponent(trail_1.TrailComponent);
                if (trail) {
                    trail.setupRenderer();
                }
            };
            TrailSystem.prototype.onFrame = function (deltaTime) {
                for (var _i = 0, _a = this.groups[0].entities; _i < _a.length; _i++) {
                    var entity = _a[_i];
                    var trail_2 = entity.getComponent(trail_1.TrailComponent);
                    if (!trail_2) {
                        continue;
                    }
                    trail_2.update(deltaTime);
                }
            };
            return TrailSystem;
        }(paper.BaseSystem));
        trail_1.TrailSystem = TrailSystem;
        __reflect(TrailSystem.prototype, "egret3d.trail.TrailSystem");
        function createTrail(name) {
            var o = egret3d.creater.createGameObject(name);
            o.addComponent(egret3d.trail.TrailComponent);
            return o;
        }
        trail_1.createTrail = createTrail;
        // 注册拖尾系统
        paper.Application.systemManager.preRegister(TrailSystem, paper.Application.gameObjectContext, 7000 /* BeforeRenderer */ - 1);
    })(trail = egret3d.trail || (egret3d.trail = {}));
})(egret3d || (egret3d = {}));
