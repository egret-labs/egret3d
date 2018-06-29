namespace egret3d {

    let helpVec3 = new Vector3();
    let helpVec3_2 = new Vector3();
    let helpMat4 = new Matrix();
    let helpQuat4 = new Quaternion();
    let helpQuat4_2 = new Quaternion();

    let helpVector: Vector3 = new Vector3();
    let helpRotation: Quaternion = new Quaternion();
    let helpUp: Vector3 = new Vector3(0, 1, 0);
    let helpRight: Vector3 = new Vector3(1, 0, 0);
    let helpFoward: Vector3 = new Vector3(0, 0, 1);

    /**
     * Transform Class
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * Transform实例可以被添加到3D场景中，并持有一个GameObejct实例
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    export class Transform extends paper.BaseComponent {
        private _dirtyAABB: boolean = true;
        private _dirtyLocal: boolean = true;
        private _dirtyWorld: boolean = true;
        /**
         * 世界矩阵的行列式，如果小于0，说明进行了反转
         * @internal
         */
        public _worldMatrixDeterminant: number = 0.0;
        private readonly localMatrix: Matrix = new Matrix();
        private readonly worldMatrix: Matrix = new Matrix();
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.VECTOR3, { set: "setLocalPosition" })
        private readonly localPosition: Vector3 = new Vector3();
        @paper.editor.extraProperty(paper.editor.EditType.VECTOR3, { set: "setPosition" })
        private readonly position: Vector3 = new Vector3();
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.QUATERNION, { set: "setLocalRotation" })
        private readonly localRotation: Quaternion = new Quaternion();
        @paper.editor.extraProperty(paper.editor.EditType.QUATERNION, { set: "setRotation" })
        private readonly rotation: Quaternion = new Quaternion();
        @paper.editor.extraProperty(paper.editor.EditType.VECTOR3, { set: "setLocalEulerAngles" })
        private readonly localEulerAngles: Vector3 = new Vector3();
        private readonly eulerAngles: Vector3 = new Vector3();
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.VECTOR3, { set: "setLocalScale" })
        private readonly localScale: Vector3 = new Vector3(1.0, 1.0, 1.0);
        @paper.editor.extraProperty(paper.editor.EditType.VECTOR3, { set: "setScale" })
        private readonly scale: Vector3 = new Vector3(1.0, 1.0, 1.0);
        private readonly _children: Transform[] = [];
        private _aabb: AABB = null as any;
        private _parent: Transform | null = null;

        private _removeFromChildren(value: Transform) {
            let index = 0;
            for (const child of this._children) {
                if (child === value) {
                    this._children.splice(index, 1);
                    break;
                }

                index++;
            }
        }

        private _buildAABB(): AABB {
            const vertexPosition = new Vector3();
            const minimum = new Vector3();
            const maximum = new Vector3();

            const filter = this.gameObject.getComponent(MeshFilter);
            if (filter && filter.mesh) {
                Vector3.set(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE, minimum);
                Vector3.set(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE, maximum);

                let subMeshIndex = 0;
                for (const _primitive of filter.mesh.glTFMesh.primitives) {
                    const vertices = filter.mesh.getVertices(subMeshIndex);

                    for (let i = 0, l = vertices.length; i < l; i += 3) {
                        Vector3.set(vertices[i], vertices[i + 1], vertices[i + 2], vertexPosition);
                        Vector3.max(vertexPosition, maximum, maximum);
                        Vector3.min(vertexPosition, minimum, minimum);
                    }

                    subMeshIndex++;
                }
            }
            else {
                const skinmesh = this.gameObject.getComponent(SkinnedMeshRenderer);
                if (skinmesh && skinmesh.mesh) {
                    Vector3.set(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE, minimum);
                    Vector3.set(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE, maximum);

                    let subMeshIndex = 0;
                    for (const _primitive of skinmesh.mesh.glTFMesh.primitives) {
                        const vertices = skinmesh.mesh.getVertices(subMeshIndex);

                        for (let i = 0, l = vertices.length; i < l; i += 3) {
                            Vector3.set(vertices[i], vertices[i + 1], vertices[i + 2], vertexPosition);
                            Vector3.max(vertexPosition, maximum, maximum);
                            Vector3.min(vertexPosition, minimum, minimum);
                        }

                        subMeshIndex++;
                    }
                }
                else {
                    minimum.x = -1;
                    minimum.y = -1;
                    minimum.z = -1;

                    maximum.x = 1;
                    maximum.y = 1;
                    maximum.z = 1;
                }
            }

            const aabb = new AABB(minimum, maximum);

            return aabb;
        }

        private _sync() {
            if (this._dirtyLocal) {
                Matrix.fromRTS(this.localPosition, this.localScale, this.localRotation, this.localMatrix);
                this._dirtyLocal = false;
            }

            if (this._dirtyWorld) {
                if (!this._parent) {
                    Matrix.copy(this.localMatrix, this.worldMatrix);
                } else {
                    Matrix.multiply(this._parent.worldMatrix, this.localMatrix, this.worldMatrix);
                }
                this._worldMatrixDeterminant = Matrix.determinant(this.worldMatrix);
                this._dirtyWorld = false;
            }
        }

        private _dirtify(local: boolean = false) {
            if ((!local || (local && this._dirtyLocal)) && this._dirtyWorld) {
                return;
            }
            if (local) {
                this._dirtyLocal = true;
            }
            if (!this._dirtyWorld) {
                this._dirtyWorld = true;
                let i = this._children.length;
                while (i--) {
                    if (this._children[i]._dirtyWorld) {
                        continue;
                    }
                    this._children[i]._dirtify();
                }
            }
            // transform dirty
            this._dirtyAABB = true;
        }

        /**
         * 父节点发生改变的回调方法
         * 子类可通过重载此方法进行标脏状态传递
         */
        protected _onParentChange(newParent: Transform | null, oldParent: Transform | null) {
            const prevActive = oldParent ? oldParent.gameObject.activeInHierarchy : this.gameObject.activeSelf;
            if ((newParent ? newParent.gameObject.activeInHierarchy : this.gameObject.activeSelf) !== prevActive) {
                this.gameObject._activeInHierarchyDirty(prevActive);
            }

            this._dirtify();
        }

        /**
         * 
         */
        public $getGlobalPosition(): ImmutableVector4 {
            const position = this.getPosition();
            return new Float32Array([position.x, position.y, position.z, 1]);
        }

        public deserialize(element: any) {
            super.deserialize(element); // TODO

            this.localPosition.deserialize(element.localPosition);
            this.localRotation.deserialize(element.localRotation);
            this.localScale.deserialize(element.localScale);

            this._children.length = 0;
            if (element.children) {
                for (let i = 0, l = element.children.length; i < l; i++) {
                    const child = paper.getDeserializedObject<Transform>(element.children[i]);
                    if (child) {
                        child._parent = this;
                        this._children.push(child);
                    }
                }
            }
        }

        /**
         * 设置父节点 
         */
        public setParent(newParent: Transform | null, worldPositionStays: boolean = false) {
            const oldParent = this._parent;

            if (oldParent === newParent) {
                return;
            }

            if (worldPositionStays) {
                Vector3.copy(this.getPosition(), helpVector3A);
            }

            if (oldParent) {
                oldParent._removeFromChildren(this);
            }

            if (newParent) {
                newParent._children.push(this);
            }

            this._parent = newParent;
            this._onParentChange(newParent, oldParent);

            if (worldPositionStays) {
                this.setPosition(helpVector3A);
            }
        }

        /**
         * 获取对象下标的子集对象
         * @param index 
         */
        public getChild(index: number) {
            return 0 <= index && index < this._children.length ? this._children[index] : null;
        }

        /**
         * get local matrix
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 获得本地矩阵
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public getLocalMatrix(): Matrix {
            if (this._dirtyLocal) {
                Matrix.fromRTS(this.localPosition, this.localScale, this.localRotation, this.localMatrix);
                this._dirtyLocal = false;
            }
            return this.localMatrix;
        }

        /**
         * get world matrix
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 获得世界矩阵
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public getWorldMatrix(): Matrix {
            if (!this._dirtyLocal && !this._dirtyWorld) {
                return this.worldMatrix;
            }

            if (this._parent) {
                this._parent.getWorldMatrix();
            }

            this._sync();

            return this.worldMatrix;
        }

        /**
         * get local position
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 获得本地位置
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public getLocalPosition(): Vector3 {
            return this.localPosition;
        }

        /**
         * set local position
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 设置本地位置
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public setLocalPosition(v: Vector3): void;
        public setLocalPosition(x: number, y: number, z: number): void;
        public setLocalPosition(p1: Vector3 | number, p2?: number, p3?: number): void {
            if (p1.hasOwnProperty("x")) {
                Vector3.copy(<Vector3>p1, this.localPosition);
            } else {
                this.localPosition.x = <number>p1;
                this.localPosition.y = p2 || 0;
                this.localPosition.z = p3 || 0;
            }
            if (!this._dirtyLocal) {
                this._dirtify(true);
            }
        }

        /**
         * get position
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 获得位置
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public getPosition(): Readonly<Vector3> {
            Matrix.getTranslation(this.getWorldMatrix(), this.position);
            return this.position;
        }

        /**
         * set rotation
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 设置位置
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public setPosition(v: Vector3): void;
        public setPosition(x: number, y: number, z: number): void;
        public setPosition(p1: Readonly<Vector3> | number, p2?: number, p3?: number): void {
            if (p1.hasOwnProperty("x")) {
                Vector3.copy(<Vector3>p1, helpVec3);
            } else {
                helpVec3.x = <number>p1;
                helpVec3.y = p2 || 0;
                helpVec3.z = p3 || 0;
            }
            if (!this._parent) {
                Vector3.copy(helpVec3, this.localPosition);
            } else {
                Matrix.inverse(this._parent.getWorldMatrix(), helpMat4);
                Matrix.transformVector3(helpVec3, helpMat4, this.localPosition); // transform point
            }
            if (!this._dirtyLocal) {
                this._dirtify(true);
            }
        }

        /**
         * get local rotation
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 获取本地旋转
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public getLocalRotation(): Readonly<Quaternion> {
            return this.localRotation;
        }

        /**
         * set local rotation
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 设置本地旋转
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public setLocalRotation(v: Quaternion): void;
        public setLocalRotation(x: number, y: number, z: number, w: number): void;
        public setLocalRotation(p1: Quaternion | number, p2?: number, p3?: number, p4?: number): void {
            if (p1.hasOwnProperty("x")) {
                this.localRotation.copy(p1 as Quaternion);
            } else {
                this.localRotation.x = <number>p1;
                this.localRotation.y = p2 || 0;
                this.localRotation.z = p3 || 0;
                this.localRotation.w = p4 !== undefined ? p4 : 1;
            }
            if (!this._dirtyLocal) {
                this._dirtify(true);
            }
        }

        /**
         * get rotation
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 获得旋转
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public getRotation(): Readonly<Quaternion> {
            Quaternion.fromMatrix(this.getWorldMatrix(), this.rotation);
            return this.rotation;
        }

        /**
         * set rotation
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 设置旋转
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public setRotation(v: Quaternion): void;
        public setRotation(x: number, y: number, z: number, w: number): void;
        public setRotation(q1: Quaternion | number, q2?: number, q3?: number, q4?: number): void {
            if (q1.hasOwnProperty("x")) {
                Quaternion.copy(<Quaternion>q1, helpQuat4);
            } else {
                helpQuat4.x = <number>q1;
                helpQuat4.y = q2 || 0;
                helpQuat4.z = q3 || 0;
                helpQuat4.w = q4 !== undefined ? q4 : 1;
            }

            if (!this._parent) {
                Quaternion.copy(helpQuat4, this.localRotation);
            } else {
                let parentRot = this._parent.getRotation();
                Quaternion.copy(parentRot, helpQuat4_2);
                Quaternion.multiply(helpQuat4_2.inverse(), helpQuat4, this.localRotation);
            }

            if (!this._dirtyLocal) {
                this._dirtify(true);
            }
        }

        /**
         * get local euler angles
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 获取本地欧拉角
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public getLocalEulerAngles(): Readonly<Vector3> {
            Quaternion.toEulerAngles(this.localRotation, this.localEulerAngles);
            return this.localEulerAngles;
        }

        /**
         * set local euler angles
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 设置本地欧拉角
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public setLocalEulerAngles(v: Vector3): void;
        public setLocalEulerAngles(x: number, y: number, z: number): void;
        public setLocalEulerAngles(p1: Vector3 | number, p2?: number, p3?: number): void {
            if (p1.hasOwnProperty("x")) {
                p1 = <Vector3>p1;
                Quaternion.fromEulerAngles(p1.x, p1.y, p1.z, this.localRotation);
            } else {
                Quaternion.fromEulerAngles(p1 as number, p2 as number, p3 as number, this.localRotation);
            }
            if (!this._dirtyLocal) {
                this._dirtify(true);
            }
        }

        /**
         * get euler angles
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 获取欧拉角
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public getEulerAngles(): Readonly<Vector3> {
            Matrix.toEulerAngles(this.getWorldMatrix(), this.eulerAngles);
            return this.eulerAngles;
        }

        /**
         * set euler angles
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 设置欧拉角
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public setEulerAngles(v: Vector3): void;
        public setEulerAngles(x: number, y: number, z: number): void;
        public setEulerAngles(q1: Vector3 | number, q2?: number, q3?: number) {
            if (q1.hasOwnProperty("x")) {
                q1 = <Vector3>q1;
                Quaternion.fromEulerAngles(q1.x, q1.y, q1.z, helpQuat4);
            } else {
                Quaternion.fromEulerAngles(<number>q1, q2 || 0, q3 || 0, helpQuat4);
            }

            if (!this._parent) {
                Quaternion.copy(helpQuat4, this.localRotation);
            } else {
                let parentRot = this._parent.getRotation();
                Quaternion.copy(parentRot, helpQuat4_2);
                Quaternion.multiply(helpQuat4_2.inverse(), helpQuat4, this.localRotation);
            }

            if (!this._dirtyLocal) {
                this._dirtify(true);
            }
        }

        /**
         * get local scale
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 获得本地缩放
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public getLocalScale(): Readonly<Vector3> {
            return this.localScale;
        }

        /**
         * set local scale
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 设置本地缩放
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public setLocalScale(v: Vector3): void;
        public setLocalScale(x: number, y: number, z: number): void;
        public setLocalScale(p1: Vector3 | number, p2?: number, p3?: number): void {
            if (p1.hasOwnProperty("x")) {
                Vector3.copy(<Vector3>p1, this.localScale);
            } else {
                this.localScale.x = <number>p1;
                this.localScale.y = p2 !== undefined ? p2 : 1;
                this.localScale.z = p3 !== undefined ? p3 : 1;
            }
            if (!this._dirtyLocal) {
                this._dirtify(true);
            }
        }

        /**
         * get scale
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 获得缩放
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public getScale(): Readonly<Vector3> {
            Matrix.getScale(this.getWorldMatrix(), this.scale);
            return this.scale;
        }

        /**
         * set scale
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 设置缩放
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public setScale(v: Vector3): void;
        public setScale(x: number, y: number, z: number): void;
        public setScale(p1: Vector3 | number, p2?: number, p3?: number): void {
            if (p1.hasOwnProperty("x")) {
                Vector3.copy(<Vector3>p1, helpVec3);
            } else {
                helpVec3.x = <number>p1;
                helpVec3.y = p2 !== undefined ? p2 : 1;
                helpVec3.z = p3 !== undefined ? p3 : 1;
            }
            if (!this._parent) {
                Vector3.copy(helpVec3, this.localScale);
            } else {
                Matrix.inverse(this._parent.getWorldMatrix(), helpMat4);
                Matrix.transformVector3(helpVec3, helpMat4, this.localScale); // transform vector3
            }
            if (!this._dirtyLocal) {
                this._dirtify(true);
            }
        }

        /**
         * look at a target
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 旋转当前transform 到指定的目标
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public lookAt(target: Transform | Vector3, up?: Vector3) {
            if (target instanceof Transform) {
                Vector3.copy(target.getPosition(), helpVector);
            } else {
                Vector3.copy(target, helpVector);
            }

            if (up === undefined) {
                Quaternion.lookAt(this.getPosition(), helpVector, helpRotation);
            } else {
                Quaternion.lookAtWithUp(this.getPosition(), helpVector, up, helpRotation);
            }

            this.setRotation(helpRotation);
        }

        /**
         * z-axis towards in world space
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 获取世界坐标系下当前z轴的朝向
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public getForward(out: Vector3): Vector3 {
            Matrix.transformNormal(helpFoward, this.getWorldMatrix(), out);
            Vector3.normalize(out);
            return out;
        }

        /**
         * x-axis towards in world space
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 获取世界坐标系下当前x轴的朝向
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public getRight(out: Vector3) {
            Matrix.transformNormal(helpRight, this.getWorldMatrix(), out);
            Vector3.normalize(out);
        }

        /**
         * y-axis towards in world space
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 获取世界坐标系下当前y轴的朝向
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public getUp(out: Vector3) {
            Matrix.transformNormal(helpUp, this.getWorldMatrix(), out);
            Vector3.normalize(out);
        }

        /**
         * Finds a child by name or path and returns it.
         * @param nameOrPath 
         */
        public find(nameOrPath: string) {
            const names = nameOrPath.split("/");
            let ancestor: Transform = this;
            let result: Transform | null = null;

            for (const name of names) {
                for (const child of ancestor._children) {
                    if (child.gameObject.name === name) {
                        result = child;
                        break;
                    }
                }

                if (result) {
                    ancestor = result;
                }
                else {
                    break;
                }
            }

            return result;
        }
        /**
         * @internal
         */
        public getAllChildren() {
            const children: Transform[] = [];
            this._getAllChildren(children);

            return children;
        }

        private _getAllChildren(children: Transform[]) {
            for (const child of this._children) {
                children.push(child);
                child._getAllChildren(children);
            }
        }

        /**
         * 当前子集对象的数量
         */
        public get childCount(): number {
            return this._children.length;
        }

        /**
         * 
         */
        public get aabb() {
            if (!this._aabb) {
                this._aabb = this._buildAABB();
            }

            if (this._dirtyAABB) {
                this._aabb.update(this.getWorldMatrix());
                this._dirtyAABB = false;
            }

            return this._aabb;
        }

        /**
         * children list
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 子物体列表
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        @paper.serializedField
        public get children(): ReadonlyArray<Transform> {
            return this._children;
        };
        /**
         * 仅用于反序列化。
         * @internal
         */
        public set children(value: ReadonlyArray<Transform>) {
            this._children.length = 0;
            for (const component of value) {
                this._children.push(component);
            }
        };
        /**
         * instance of parent transform
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 父元素实例
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public get parent() {
            return this._parent;
        }
        public set parent(value: Transform | null) {
            this.setParent(value, false);
        }
    }

    // export type SerializeObject = { hashCode: number, class: string, localPosition: number[], localRotation: number[], localScale: number[], _parent: {}, children: Array<any> };
    export type ImmutableVector4 = Readonly<Float32Array>;

}
