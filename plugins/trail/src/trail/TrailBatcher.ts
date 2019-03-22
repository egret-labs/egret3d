namespace egret3d.trail {
    function vec3Add(a: Vector3, b: Vector3): Vector3 { return new Vector3().add(a, b); }
    function vec3Substract(a: Vector3, b: Vector3): Vector3 { return new Vector3().subtract(a, b); }
    function vec3Mutiply(a: Vector3, b: float): Vector3 { return new Vector3().multiplyScalar(b, a); }
    function vec3Cross(a: Vector3, b: Vector3): Vector3 { return new Vector3().cross(a, b); }

    interface TrailRenderSegment {
        position: Vector3;
        timeCreated: uint;
        lineBreak: boolean;
    }

    /**
     * @internal
     */
    export class TrailBatcher {
        // 假设存活 5 秒, 每秒 60 帧, 则最多在存活时间内生成 300 个片段
        private _maxFragmentCount: uint = 5 * 60;
        private _points: TrailRenderSegment[] = []; // 每个片段
        private _lastPosition: Readonly<Vector3> | undefined; // 上一次添加片段的位置
        private _lastFrameEmit: boolean = true;
        private _pausedTime: uint = -1;     // 暂停时候的时间戳

        private _verticles: float[] = [];   // 定点, 每 3 个值对应一个定点
        private _uvs: float[] = [];         // UV, 每 2 个值对应一个定点
        private _colors: float[] = [];      // 颜色, 每 4 个值对应一个颜色
        private _indices: uint[] = [];      // 三角形对应的定点索引, 每 3 个值对应一个颜色

        private _mesh: Mesh;

        private _comp: TrailComponent;

        public pause(): void {
            this._pausedTime = paper.clock.timestamp();
        }
        public resume(): void {
            if (this._pausedTime < 0) {
                console.warn("_pausedTime should not be less than 0 in TrailBatcher.resume()");
            }
            const freezeTime = paper.clock.timestamp() - this._pausedTime;
            for (const p of this._points) {
                p.timeCreated += freezeTime;
            }
        }
        public clean() {
            this._lastPosition = (void 0);
            this._points.length = 0;
            this._pausedTime = -1;
            this._resetMeshData();
        }

        public init(comp: TrailComponent) {
            this._comp = comp;
            this._createMesh();
        }

        public update(elapsedTime: float) {
            if (!this._comp) { return; }
            const comp: TrailComponent = this._comp;

            // 暂停情况下不更新
            if (comp.isPaused) { return; }

            // 自动销毁
            if (!comp.isPlaying) {
                if (comp.autoDestruct && this._points.length < 2) {
                    comp.gameObject.destroy();
                }
            }

            const now = paper.clock.timestamp();

            // 更新片段数据
            this._updateSegments(now);

            // 重新构建组成 mesh 的相关数据
            this._rebuildMeshData(now);

            // 更新 mesh
            this._composeMesh();
        }
        /**
         * 更新片段数据
         * @param now 当前时间戳
         */
        private _updateSegments(now: float) {
            const comp = this._comp;
            const curPosition = comp.transform.position;

            // 如果移动了足够远, 就生成新的点并重新构建 mesh, 否则只是修正最后的点
            const theDistance = this._lastPosition ? curPosition.getDistance(this._lastPosition) : -1;
            const count: uint = this._points.length;
            const isPlaying = comp.isPlaying;

            if (isPlaying) {
                if (theDistance > comp.minVertexDistance || theDistance < 0) {
                    this._points.push({ position: curPosition, timeCreated: now, lineBreak: false });
                    this._lastPosition = curPosition;
                } else if (count > 0) {
                    const lastPoint = this._points[count - 1];
                    lastPoint.position = curPosition;
                    lastPoint.timeCreated = now;
                }
            }

            if (!isPlaying && this._lastFrameEmit && count > 0) {
                this._points[count - 1].lineBreak = true;
                this._lastFrameEmit = false;
            }

            // 移除过期的片段
            this._removeDeadPoints(now, comp.time);
        }
        /**
         * 移除超过生命周期的片段
         * @param now 当前时间戳
         * @param lifeTime 片段可存活时间
         */
        private _removeDeadPoints(now: float, lifeTime: float): void {
            const len = this._points.length;
            if (len === 0) { return; }

            for (let i: uint = 0; i < len; i++) {
                if (now - this._points[i].timeCreated < lifeTime) {
                    if (i > 0) { this._points = this._points.splice(0, i); }
                    break;
                }
            }
        }
        /**
         * 重新组成 mesh 的相关数据
         * @param now 当前时间戳
         */
        private _rebuildMeshData(now: float): void {
            const uvLengthScale = 0.01;

            this._resetMeshData();

            const count = this._points.length;
            if (count < 2) { return; }

            const camera = this._getCamera();

            // 如果没有可用的 camera
            if (!camera) { return; }

            let curDistance = 0.00;
            const comp = this._comp;

            for (let i = 0; i < count; ++i) {
                const p = this._points[i];
                
                // 根据片段生存的时间获取对应的宽度和颜色采样
                const time = (now - p.timeCreated) / comp.time;
                const color: Color = this._getColorSample(comp, time);
                const width: float = this._getWidthSample(comp, time);

                // 当前拖尾片段的向量
                const lineDirection = i === 0
                    ? vec3Substract(p.position, this._points[i + 1].position)
                    : vec3Substract(this._points[i - 1].position, p.position)

                // 当前摄像机到游戏对象的向量
                const vectorToCamera = vec3Substract(camera.transform.position, p.position);

                // 以上两者的叉乘即为拖尾移动方向的垂直向量
                const perpendicular = vec3Cross(lineDirection, vectorToCamera).normalize();

                // 上述向量正反方向各走半个宽度值即为两个新的顶点值
                let vertex: Vector3;
                vertex = vec3Add(p.position, vec3Mutiply(perpendicular, width * 0.5));
                this._verticles[i * 6 + 0] = vertex.x;
                this._verticles[i * 6 + 1] = vertex.y;
                this._verticles[i * 6 + 2] = vertex.z;

                vertex = vec3Add(p.position, vec3Mutiply(perpendicular, -width * 0.5));
                this._verticles[i * 6 + 3] = vertex.x;
                this._verticles[i * 6 + 4] = vertex.y;
                this._verticles[i * 6 + 5] = vertex.z;

                // 同样的颜色值
                this._colors[i * 8 + 0] = color.r;
                this._colors[i * 8 + 1] = color.g;
                this._colors[i * 8 + 2] = color.b;
                this._colors[i * 8 + 3] = color.a;
                this._colors[i * 8 + 4] = color.r;
                this._colors[i * 8 + 5] = color.g;
                this._colors[i * 8 + 6] = color.b;
                this._colors[i * 8 + 7] = color.a;

                // 两点的 uv 值
                if (comp.textureMode === TrailTextureMode.Stretch) {
                    this._uvs[i * 2 + 0] = curDistance * uvLengthScale;
                    this._uvs[i * 2 + 1] = 1;
                    this._uvs[i * 2 + 0] = curDistance * uvLengthScale;
                    this._uvs[i * 2 + 1] = 0;
                } else {
                    // TODO: 在每个片段上重复贴图
                    this._uvs[i * 2 + 0] = 0;
                    this._uvs[i * 2 + 1] = 1;
                    this._uvs[i * 2 + 0] = 0;
                    this._uvs[i * 2 + 1] = 0;
                }

                if (i > 0 && !this._points[count - 1].lineBreak) {
                    curDistance += p.position.getDistance(this._points[count - 1].position);

                    this._indices[(i - 1) * 6 + 0] = (i * 2) - 2;
                    this._indices[(i - 1) * 6 + 1] = (i * 2) - 1;
                    this._indices[(i - 1) * 6 + 2] = i * 2;
                    this._indices[(i - 1) * 6 + 3] = (i * 2) + 1;
                    this._indices[(i - 1) * 6 + 4] = i * 2;
                    this._indices[(i - 1) * 6 + 5] = (i * 2) - 1;
                }
            }
        }
        /**
         * 根据时间在获得颜色值取样
         * @param comp 拖尾组件
         * @param time 时间比例值
         */
        private _getColorSample(comp: TrailComponent, time: float): Color {
            const color: Color = Color.create();
            if (comp.colors.length > 0) {
                const colorTime = time * (comp.colors.length - 1);
                const min = Math.floor(colorTime);
                const max = math.clamp(Math.ceil(colorTime), 0, comp.colors.length - 1);
                const lerp = math.inverseLerp(min, max, colorTime);
                color.lerp(lerp, comp.colors[min], comp.colors[max]);
            } else {
                color.lerp(time, Color.WHITE, Color.ZERO);
            }
            return color;
        }
        /**
         * 根据时间在获得宽度值取样
         * @param comp 拖尾组件
         * @param time 时间比例值
         */
        private _getWidthSample(comp: TrailComponent, time: float): number {
            let width: float;
            if (comp.widths.length > 0) {
                const widthTime = time * (comp.widths.length - 1);
                const min = Math.floor(widthTime);
                const max = math.clamp(Math.ceil(widthTime), 0, comp.widths.length - 1);
                const lerp = math.inverseLerp(min, max, widthTime);
                width = math.lerp(comp.widths[min], comp.widths[max], lerp);
            } else {
                width = 1;
            }
            return width;
        }
        /**
         * 获取渲染用的相机
         */
        private _getCamera(): Camera | undefined {
            return Camera.main;
        }
        /**
         * 重置组成 mesh 的相关数据
         */
        private _resetMeshData() {
            this._verticles.length = 0;
            this._uvs.length = 0;
            this._colors.length = 0;
            this._indices.length = 0;
        }
        /**
         * 更新 mesh
         */
        private _composeMesh() {
            if (this._points.length > this._maxFragmentCount) {
                this._createMesh();
            }
            this._mesh.setAttributes(gltf.AttributeSemantics.POSITION, this._verticles);
            this._mesh.setAttributes(gltf.AttributeSemantics.TEXCOORD_0, this._uvs);
            this._mesh.setAttributes(gltf.AttributeSemantics.COLOR_0, this._colors);
            this._mesh.setIndices(this._indices);
        }
        /**
         * 生成 mesh 对象
         */
        private _createMesh() {
            // TODO: 在极端的情况 (tile 模式贴图), 无法准确的预估生成的顶点数
            this._mesh = Mesh.create(this._maxFragmentCount * 4, (this._maxFragmentCount - 1) * 6);
        }
    }
}
