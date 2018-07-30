namespace egret3d {

    let helpVec3_1: Vector3 = new Vector3();
    let helpVec3_2: Vector3 = new Vector3();
    let helpVec3_3: Vector3 = new Vector3();
    let helpVec3_4: Vector3 = new Vector3();

    const _attributes = [
        gltf.MeshAttributeType.POSITION,
        gltf.MeshAttributeType.COLOR_0,
        gltf.MeshAttributeType.TEXCOORD_0,
    ];
    /**
     * 
     */
    export const enum TrailRenderEventType {
        Meterial = "material",
    }

    /**
     * Trail Renderer Component
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 拖尾渲染组件
     * @version paper 1.0
     * @platform Web
     * @language
     */
    @paper.disallowMultipleComponent
    export class TrailRenderer extends paper.BaseRenderer {
        /**
         * extend direction
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 拖尾延伸方向。
         * true为单方向延伸，false为双向延伸
         * @version paper 1.0
         * @platform Web
         * @language
         */
        @paper.serializedField
        public extenedOneSide: boolean = true;

        private _vertexCount = 24;
        /**
         *  
         */
        @paper.serializedField
        private _material: Material | null;
        /**
         * 
         */
        public _mesh: Mesh;

        private _sticks: TrailStick[];

        /**
         * trail material
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 拖尾的材质
         * @version paper 1.0
         * @platform Web
         * @language
         */
        public get material() {
            return this._material;
        }
        public set material(material: Material | null) {
            this._material = material;
            paper.EventPool.dispatchEvent(TrailRenderEventType.Meterial, this);
        }

        /**
         * material color
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 材质颜色
         * @version paper 1.0
         * @platform Web
         * @language
         */
        @paper.serializedField
        public readonly color: Color = new Color(1, 1, 1, 1);

        /**
         * set trail width
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 设置拖尾宽度
         * @version paper 1.0
         * @platform Web
         * @language
         */
        @paper.serializedField
        public width: number = 1.0;

        /**
         * set trail speed（0 - 1）
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 设置拖尾速度，调节拖尾长短（0-1）
         * @version paper 1.0
         * @platform Web
         * @language
         */
        @paper.serializedField
        public speed: number = 0.5;

        /**
         * look at camera
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 拖尾是否朝向相机
         * @version paper 1.0
         * @platform Web
         * @language
         */
        @paper.serializedField
        public lookAtCamera: boolean = false;

        /**
         *  
         */
        public $active: boolean = false;
        private _reInit: boolean = false;

        /**
         * 
         */
        constructor() {
            super();

            this._material = new Material(DefaultShaders.DIFFUSE);
        }

        /**
         * @inheritDoc
         */
        public initialize() {
            super.initialize();

            this._buildMesh(this._vertexCount);
        }
        /**
         * @inheritDoc
         */
        public uninitialize() {
            super.uninitialize();

            if (this._mesh) {
                this._mesh.dispose();
            }

            this._mesh = null;
        }

        /**
         * 
         */
        public update(delta: number) {
            if (!this.$active) return;

            if (this._reInit) {
                this._buildData(this._vertexCount);
                this._reInit = false;
            }

            const camera = Camera.main;
            let targetPosition = this.gameObject.transform.getPosition();

            // set first stick's up direction
            if (this.lookAtCamera) {
                if (camera) {
                    let cameraPosition = Vector3.copy(camera.gameObject.transform.getPosition(), helpVec3_1);
                    let cameraDirection = Vector3.subtract(cameraPosition, this._sticks[0].location, helpVec3_2);
                    Vector3.normalize(cameraDirection);
                    let direction: Vector3 = helpVec3_3;
                    Vector3.subtract(targetPosition, this._sticks[0].location, direction);
                    Vector3.normalize(direction);
                    Vector3.cross(cameraDirection, direction, this._sticks[0].up);
                    Vector3.scale(this._sticks[0].up, this.width);
                }
            }
            else {
                this.gameObject.transform.getUp(this._sticks[0].up);
                Vector3.scale(this._sticks[0].up, this.width);
            }

            // set first stick's position
            Vector3.copy(targetPosition, this._sticks[0].location);

            // lerp set other sticks' position
            let length = this._sticks.length;
            for (let i = 1; i < length; i++) {
                Vector3.lerp(this._sticks[i].location, this._sticks[i - 1].location, this.speed, this._sticks[i].location);
            }

            // set other sticks's updir
            if (this.lookAtCamera) {
                if (camera) {
                    let cameraPosition = Vector3.copy(camera.gameObject.transform.getPosition(), helpVec3_1);
                    for (let i = 1; i < length; i++) {
                        let cameraDirection = Vector3.subtract(cameraPosition, this._sticks[i].location, helpVec3_1);
                        Vector3.normalize(cameraDirection);
                        let moveDirection = Vector3.subtract(this._sticks[i - 1].location, this._sticks[i].location, helpVec3_2);
                        Vector3.normalize(moveDirection);
                        Vector3.cross(cameraDirection, moveDirection, this._sticks[i].up);
                        Vector3.scale(this._sticks[i].up, this.width);
                    }
                }
            } else {
                for (let i = 1; i < length; i++) {
                    Vector3.lerp(this._sticks[i].up, this._sticks[i - 1].up, this.speed, this._sticks[i].up);
                }
            }

            this._updateTrailData();
        }

        private _buildMesh(vertexcount: number): void {
            this._mesh = new Mesh(vertexcount, (vertexcount / 2 - 1) * 6, _attributes, MeshDrawMode.Dynamic);
        }

        private _buildData(vertexCount: number) {
            let length = vertexCount / 2;

            // create sticks
            this._sticks = [];
            let position = this.gameObject.transform.getPosition();
            let up = new Vector3();
            this.gameObject.transform.getUp(up);
            Vector3.scale(up, this.width);
            for (let i = 0; i < length; i++) {
                let stick = new TrailStick();
                Vector3.copy(position, stick.location);
                Vector3.copy(up, stick.up);
                this._sticks.push(stick);
            }

            for (let i = 0; i < length; i++) {
                const iD = i * 2;
                const u = i / (length - 1);

                this._mesh.setAttribute(
                    iD, gltf.MeshAttributeType.POSITION, 0,
                    0, 0, 0
                );
                this._mesh.setAttribute(
                    iD, gltf.MeshAttributeType.COLOR_0, 0,
                    this.color.r, this.color.g, this.color.b, this.color.a
                );
                this._mesh.setAttribute(
                    iD, gltf.MeshAttributeType.TEXCOORD_0, 0,
                    u, 0
                );

                this._mesh.setAttribute(
                    iD + 1, gltf.MeshAttributeType.POSITION, 0,
                    0, 0, 0
                );
                this._mesh.setAttribute(
                    iD + 1, gltf.MeshAttributeType.COLOR_0, 0,
                    this.color.r, this.color.g, this.color.b, this.color.a
                );
                this._mesh.setAttribute(
                    iD + 1, gltf.MeshAttributeType.TEXCOORD_0, 0,
                    u, 1
                );
            }

            const indices = this._mesh.getIndices();
            for (let k = 0; k < length - 1; k++) {
                const iD = k * 6;
                const a = k * 2;
                const b = (k + 1) * 2;
                const c = k * 2 + 1;
                const d = (k + 1) * 2 + 1;
                indices[iD + 0] = a;
                indices[iD + 1] = b;
                indices[iD + 2] = c;
                indices[iD + 3] = c;
                indices[iD + 4] = b;
                indices[iD + 5] = d;
            }

            this._mesh.uploadSubVertexBuffer(_attributes);
            this._mesh.uploadSubIndexBuffer();
        }

        private _updateTrailData() {
            let length = this._vertexCount / 2;

            let pos, up;
            if (this.extenedOneSide) {
                for (let i = 0; i < length; i++) {
                    const iD = i * 2;
                    pos = this._sticks[i].location;
                    up = this._sticks[i].up;

                    this._mesh.setAttribute(
                        iD, gltf.MeshAttributeType.POSITION, 0,
                        pos.x, pos.y, pos.z
                    );

                    this._mesh.setAttribute(
                        iD + 1, gltf.MeshAttributeType.POSITION, 0,
                        pos.x + up.x, pos.y + up.y, pos.z + up.z
                    );
                }
            }
            else {
                for (let i = 0; i < length; i++) {
                    const iD = i * 2;
                    pos = this._sticks[i].location;
                    up = this._sticks[i].up;

                    this._mesh.setAttribute(
                        iD, gltf.MeshAttributeType.POSITION, 0,
                        pos.x, pos.y, pos.z
                    );

                    this._mesh.setAttribute(
                        iD + 1, gltf.MeshAttributeType.POSITION, 0,
                        pos.x + up.x, pos.y + up.y, pos.z + up.z
                    );
                }
            }

            this._mesh.uploadSubVertexBuffer(gltf.MeshAttributeType.POSITION);
        }
    }
    /**
     * stick
     */
    class TrailStick {
        public readonly location: Vector3 = new Vector3(0, 0, 0);
        public readonly up: Vector3 = new Vector3(0, 1, 0);
    }
}
