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
            /**
             * 初始化
             * @param comp 对应的 Trail 组件
             */
            function TrailBatcher(gameObject, comp) {
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
                this._gameObject = gameObject;
                this._comp = comp;
                this._onPausedChanged = this._onPausedChanged.bind(this);
                this._onEmittingChanged = this._onEmittingChanged.bind(this);
            }
            /**
             * 暂停
             */
            TrailBatcher.prototype.pause = function () {
                this._pausedTime = paper.clock.timestamp();
            };
            TrailBatcher.prototype.initialize = function () {
                this._comp.onPausedChanged.add(this._onPausedChanged);
                this._comp.onEmittingChanged.add(this._onEmittingChanged);
                this._createMesh();
            };
            TrailBatcher.prototype.uninitialize = function () {
                this._comp.onPausedChanged.remove(this._onPausedChanged);
                this._comp.onEmittingChanged.remove(this._onEmittingChanged);
                this._releaseMesh();
            };
            Object.defineProperty(TrailBatcher.prototype, "gameObject", {
                /**
                 * 对应的组件
                 */
                get: function () {
                    return this._gameObject;
                },
                enumerable: true,
                configurable: true
            });
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
             * 每帧刷新
             * @param elapsedTime 此帧的时长(秒) (未使用此参数)
             */
            TrailBatcher.prototype.update = function (elapsedTime) {
                if (!this._comp) {
                    return;
                }
                var comp = this._comp;
                // 暂停情况下不更新
                if (comp.paused) {
                    return;
                }
                // 自动销毁
                if (!comp.emitting) {
                    if (comp.autoDestruct && this._points.length < 2) {
                        comp.gameObject.destroy();
                        return;
                    }
                }
                // 当前时间戳
                var now = paper.clock.timestamp();
                // 更新片段数据
                this._updateSegments(now);
                // 重新构建组成 mesh 的相关数据
                this._rebuildMeshData(now);
                // 更新 mesh
                this._composeMesh();
            };
            /**
             * 清理状态数据
             */
            TrailBatcher.prototype._reset = function () {
                this._points.length = 0;
                this._lastPosition = null;
                this._pausedTime = -1;
                this._distanceSum = 0;
                this._pointDistances.length = 1;
                this._resetMeshData();
            };
            /**
             * 更新片段数据
             * @param now 当前时间戳
             */
            TrailBatcher.prototype._updateSegments = function (now) {
                var comp = this._comp;
                if (comp.paused) {
                    return;
                }
                var curPosition = comp.transform.position;
                // 如果移动了足够远, 就生成新的点, 否则只是修正最后的点
                var theDistance = this._lastPosition ? curPosition.getDistance(this._lastPosition) : -1;
                var count = this._points.length;
                var prevLastPoint = this._points[count - 1];
                if (comp.emitting) {
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
                var flip = false;
                var lastDirection = null;
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
                    if (comp.autoFlip && i > 0 && lastDirection) {
                        if (lastDirection.dot(lineDirection) < 0) {
                            flip = !flip;
                        }
                    }
                    lastDirection = lineDirection;
                    // 上述向量正反方向各走半个宽度值即为两个新的顶点值
                    var vertex1 = vec3Add(p.position, vec3Mutiply(perpendicular, width * 0.5)).applyMatrix(worldToLocalMatrix);
                    var vertex2 = vec3Add(p.position, vec3Mutiply(perpendicular, -width * 0.5)).applyMatrix(worldToLocalMatrix);
                    if (flip) {
                        var temp = vertex1;
                        vertex1 = vertex2;
                        vertex2 = temp;
                    }
                    switch (comp.textureMode) {
                        case trail.TrailTextureMode.Stretch:
                            ratioSum = this._buildMeshForTextureStretch(vertex1, vertex2, i, ratioSum);
                            break;
                        case trail.TrailTextureMode.PerSegment:
                            this._buildMeshForTexturePerSegment(vertex1, vertex2, i);
                            break;
                        default: break;
                    }
                }
            };
            TrailBatcher.prototype._buildMeshForTextureStretch = function (vertex1, vertex2, index, ratioSum) {
                var i = index * 6;
                this._verticles[i + 0] = vertex1.x;
                this._verticles[i + 1] = vertex1.y;
                this._verticles[i + 2] = vertex1.z;
                this._verticles[i + 3] = vertex2.x;
                this._verticles[i + 4] = vertex2.y;
                this._verticles[i + 5] = vertex2.z;
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
                var ratio = this._distanceSum ? this._pointDistances[index] / this._distanceSum : 0;
                ratioSum += ratio;
                i = index * 4;
                this._uvs[i + 0] = ratioSum;
                this._uvs[i + 1] = 1;
                this._uvs[i + 2] = ratioSum;
                this._uvs[i + 3] = 0;
                if (index > 0) {
                    i = (index - 1) * 6;
                    var i2 = index * 2;
                    this._indices[i + 0] = i2 - 2;
                    this._indices[i + 1] = i2 - 1;
                    this._indices[i + 2] = i2;
                    this._indices[i + 3] = i2 + 1;
                    this._indices[i + 4] = i2;
                    this._indices[i + 5] = i2 - 1;
                }
                return ratioSum;
            };
            TrailBatcher.prototype._buildMeshForTexturePerSegment = function (vertex1, vertex2, index) {
                var vIndex = (index - 1) * 12 + 6;
                this._verticles[vIndex + 0] = vertex1.x;
                this._verticles[vIndex + 1] = vertex1.y;
                this._verticles[vIndex + 2] = vertex1.z;
                this._verticles[vIndex + 3] = vertex2.x;
                this._verticles[vIndex + 4] = vertex2.y;
                this._verticles[vIndex + 5] = vertex2.z;
                var uvIndex = (index - 1) * 8 + 4;
                var uv = index > 0 ? 1 : 0;
                this._uvs[uvIndex + 0] = uv;
                this._uvs[uvIndex + 1] = 1;
                this._uvs[uvIndex + 2] = uv;
                this._uvs[uvIndex + 3] = 0;
                if (index > 0 && index < this._points.length) {
                    if (index < this._points.length) {
                        vIndex += 6;
                        this._verticles[vIndex + 0] = vertex1.x;
                        this._verticles[vIndex + 1] = vertex1.y;
                        this._verticles[vIndex + 2] = vertex1.z;
                        this._verticles[vIndex + 3] = vertex2.x;
                        this._verticles[vIndex + 4] = vertex2.y;
                        this._verticles[vIndex + 5] = vertex2.z;
                        uvIndex += 4;
                        uv = 0;
                        this._uvs[uvIndex + 0] = uv;
                        this._uvs[uvIndex + 1] = 1;
                        this._uvs[uvIndex + 2] = uv;
                        this._uvs[uvIndex + 3] = 0;
                    }
                    var iIndex = (index - 1) * 6;
                    var i = (index - 1) * 4 + 2;
                    this._indices[iIndex + 0] = i - 2;
                    this._indices[iIndex + 1] = i - 1;
                    this._indices[iIndex + 2] = i - 0;
                    this._indices[iIndex + 3] = i + 1;
                    this._indices[iIndex + 4] = i - 0;
                    this._indices[iIndex + 5] = i - 1;
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
                if (!this._mesh) {
                    return;
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
                this._mesh = egret3d.Mesh.create((this._maxFragmentCount - 1) * 4, (this._maxFragmentCount - 1) * 6);
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
             * 销毁时释放 mesh
             */
            TrailBatcher.prototype._releaseMesh = function () {
                var meshFilter = this._comp.gameObject.getComponent(egret3d.MeshFilter);
                if (!meshFilter) {
                    console.warn("no MeshFilter on Trail object(" + this._comp.gameObject.name + ")");
                    return;
                }
                if (meshFilter.mesh === this._mesh) {
                    meshFilter.mesh = null;
                }
                ;
                this._mesh = null;
            };
            TrailBatcher.prototype._onPausedChanged = function () {
                if (this._comp.paused) {
                    this.pause();
                }
                else {
                    this.resume();
                }
            };
            TrailBatcher.prototype._onEmittingChanged = function () {
                // 重新播放前重置状态
                if (this._comp.emitting) {
                    this._reset();
                }
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
                 * 在移动突然反向时是否自动翻转, 避免出现尖角现象
                 */
                _this.autoFlip = false;
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
                 * 发射状态发生改变时产生的信号
                 */
                _this.onEmittingChanged = new signals.Signal();
                _this._emitting = true;
                /**
                 * 暂停状态发生改变时产生的信号
                 */
                _this.onPausedChanged = new signals.Signal();
                _this._paused = false;
                return _this;
            }
            Object.defineProperty(TrailComponent.prototype, "emitting", {
                /**
                 * 发射状态: 表示拖尾是否在不断的生成新的拖尾片段
                 */
                get: function () {
                    return this._emitting;
                },
                set: function (isPlaying) {
                    if (this._emitting === isPlaying) {
                        return;
                    }
                    this._emitting = isPlaying;
                    this.onEmittingChanged.dispatch(isPlaying);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TrailComponent.prototype, "paused", {
                /**
                 * 暂停状态
                 * 处于暂停状态的拖尾不生成新的片段, 已有的片段也不衰老消失, 就像时间暂停了
                 */
                get: function () {
                    return this._paused;
                },
                set: function (isPaused) {
                    if (this._paused === isPaused) {
                        return;
                    }
                    this._paused = isPaused;
                    this.onPausedChanged.dispatch(isPaused);
                },
                enumerable: true,
                configurable: true
            });
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
                paper.editor.property("CHECKBOX" /* CHECKBOX */)
            ], TrailComponent.prototype, "autoFlip", void 0);
            __decorate([
                paper.serializedField,
                paper.editor.property("LIST" /* LIST */, { listItems: paper.editor.getItemsFromEnum(egret3d.trail.TrailAlignment) })
            ], TrailComponent.prototype, "Alignment", void 0);
            __decorate([
                paper.serializedField,
                paper.editor.property("LIST" /* LIST */, { listItems: paper.editor.getItemsFromEnum(egret3d.trail.TrailTextureMode) })
            ], TrailComponent.prototype, "textureMode", void 0);
            __decorate([
                paper.serializedField,
                paper.editor.property("CHECKBOX" /* CHECKBOX */)
            ], TrailComponent.prototype, "emitting", null);
            __decorate([
                paper.serializedField,
                paper.editor.property("CHECKBOX" /* CHECKBOX */)
            ], TrailComponent.prototype, "paused", null);
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
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this._batchers = [];
                return _this;
            }
            /**
             * `GameObject` 的以下各个组件齐全时才会进入到此系统, 触发 `onEntityAdded()`
             */
            TrailSystem.prototype.getMatchers = function () {
                return [
                    paper.Matcher.create(egret3d.Transform, egret3d.MeshFilter, egret3d.MeshRenderer, trail_1.TrailComponent),
                ];
            };
            /**
             * TrailComponent 需要依赖 MeshFilter 等组件
             * , 在 `onEntityAdded()` 可以确保 TrailComponent 本身和它依赖的组件都添加完成了
             *
             * @param entity 进入系统的对象
             */
            TrailSystem.prototype.onEntityAdded = function (entity) {
                var trail = entity.getComponent(trail_1.TrailComponent);
                if (!trail) {
                    return;
                }
                // 添加并初始化
                var batcher = new trail_1.TrailBatcher(entity, trail);
                batcher.initialize();
                this._batchers.push(batcher);
            };
            /**
             *
             * @param entity 离开系统的对象
             */
            TrailSystem.prototype.onEntityRemoved = function (entity) {
                for (var i = 0; i < this._batchers.length; i++) {
                    var batcher = this._batchers[i];
                    if (batcher.gameObject !== entity) {
                        continue;
                    }
                    // 反初始化并移除
                    batcher.uninitialize();
                    this._batchers.splice(i, 1);
                    return;
                }
            };
            /**
             * 渲染帧更新
             * @param deltaTime 帧时长(秒)
             */
            TrailSystem.prototype.onFrame = function (deltaTime) {
                this._batchers.map(function (batcher) { return batcher.update(deltaTime); });
            };
            return TrailSystem;
        }(paper.BaseSystem));
        trail_1.TrailSystem = TrailSystem;
        __reflect(TrailSystem.prototype, "egret3d.trail.TrailSystem");
        /**
         * 创建拖尾对象
         * @param name 对象名称
         */
        function createTrail(name) {
            var o = egret3d.creater.createGameObject(name);
            // `MeshFilter` 和 `MeshRenderer` 两个组件会在 `createGameObject()` 里面创建
            // , 所以这里只需要添加 `TrailComponent` 
            o.addComponent(egret3d.trail.TrailComponent);
            return o;
        }
        trail_1.createTrail = createTrail;
        // 注册拖尾系统, 因为依赖 MeshRenderSystem, 所以在每帧中应该在它之前执行
        paper.Application.systemManager.preRegister(TrailSystem, paper.Application.gameObjectContext, 7000 /* BeforeRenderer */ - 1);
    })(trail = egret3d.trail || (egret3d.trail = {}));
})(egret3d || (egret3d = {}));
