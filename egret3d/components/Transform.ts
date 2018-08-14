namespace egret3d {
    const _helpVector3 = Vector3.create();
    const _helpRotationA = Quaternion.create();
    const _helpRotationB = Quaternion.create();
    const _helpMatrix = Matrix.create();

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
        private _dirtyLocal: boolean = true;
        private _dirtyWorld: boolean = true;
        /**
         * 世界矩阵的行列式，如果小于0，说明进行了反转
         * @internal
         */
        public _worldMatrixDeterminant: number = 0.0;
        private readonly _localMatrix: Matrix = Matrix.create();
        private readonly _worldMatrix: Matrix = Matrix.create();

        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.VECTOR3, { set: "setLocalPosition" })
        private readonly localPosition: Vector3 = Vector3.create();
        @paper.serializedField
        private readonly localRotation: Quaternion = Quaternion.create();
        @paper.editor.extraProperty(paper.editor.EditType.VECTOR3, { set: "setLocalEulerAngles" })
        private readonly _localEulerAngles: Vector3 = Vector3.create();
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.VECTOR3, { set: "setLocalScale" })
        private readonly localScale: Vector3 = Vector3.ONE.clone();

        // @paper.editor.extraProperty(paper.editor.EditType.VECTOR3, { set: "setPosition" })
        // @paper.editor.extraProperty(paper.editor.EditType.QUATERNION, { set: "setRotation" })
        // @paper.editor.extraProperty(paper.editor.EditType.VECTOR3, { set: "setScale" })

        private readonly _position: Vector3 = Vector3.create();
        private readonly _rotation: Quaternion = Quaternion.create();
        private readonly _eulerAngles: Vector3 = Vector3.create();
        private readonly _scale: Vector3 = Vector3.ONE.clone();
        /**
         * @internal
         */
        public readonly _children: Transform[] = [];
        /**
         * @internal
         */
        public _parent: Transform | null = null;

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

        private _sync() {
            if (this._dirtyLocal) {
                this._localMatrix.compose(this.localPosition, this.localRotation, this.localScale);
                this._dirtyLocal = false;
            }

            if (this._dirtyWorld) {
                if (!this._parent) {
                    this._worldMatrix.copy(this._localMatrix);
                }
                else {
                    this._worldMatrix.multiply(this._localMatrix);
                }

                this._worldMatrixDeterminant = this._worldMatrix.determinant();
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

            if (this.gameObject.renderer) {
                this.gameObject.renderer._boundingSphereDirty = true;
            }
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

        private _getAllChildren(children: Transform[]) {
            for (const child of this._children) {
                children.push(child);
                child._getAllChildren(children);
            }
        }
        /**
         * @internal
         */
        public getAllChildren() {
            const children: Transform[] = [];
            this._getAllChildren(children);

            return children;
        }
        /**
         * 设置父节点 
         */
        public setParent(newParent: Transform | null, worldPositionStays: boolean = false) {
            const oldParent = this._parent;
            if (oldParent === newParent) {
                return;
            }

            if (
                newParent &&
                this.gameObject.scene !== newParent.gameObject.scene
            ) {
                console.warn("Cannot change the parent to a different scene.");
                return;
            }

            if (worldPositionStays) {
                helpVector3A.copy(this.getPosition());
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

        public getChildIndex(value: Transform) {
            if (value.parent !== this) {
                return -1;
            }

            return this._children.indexOf(value);
        }

        public setChildIndex(value: Transform, index: number) {
            if (value.parent !== this) {
                return;
            }

            const prevIndex = this._children.indexOf(value);
            if (prevIndex === index) {
                return;
            }

            this._children.splice(prevIndex, 1);
            this._children.splice(index, 0, value);
        }
        /**
         * 获取对象下标的子集对象
         * @param index 
         */
        public getChildAt(index: number) {
            return 0 <= index && index < this._children.length ? this._children[index] : null;
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
        public getLocalPosition(): Readonly<Vector3> {
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
        public setLocalPosition(position: Readonly<IVector3>): void;
        public setLocalPosition(x: number, y: number, z: number): void;
        public setLocalPosition(p1: Readonly<IVector3> | number, p2?: number, p3?: number): void {
            if (p1.hasOwnProperty("x")) {
                this.localPosition.copy(p1 as Readonly<IVector3>);
            }
            else {
                this.localPosition.x = p1 as number;
                this.localPosition.y = p2 || 0.0;
                this.localPosition.z = p3 || 0.0;
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
        public setLocalRotation(rotation: Readonly<IVector4>): void;
        public setLocalRotation(x: number, y: number, z: number, w: number): void;
        public setLocalRotation(p1: Readonly<IVector4> | number, p2?: number, p3?: number, p4?: number): void {
            if (p1.hasOwnProperty("x")) {
                this.localRotation.copy(p1 as Readonly<IVector4>);
            }
            else {
                this.localRotation.x = p1 as number;
                this.localRotation.y = p2 || 0.0;
                this.localRotation.z = p3 || 0.0;
                this.localRotation.w = p4 !== undefined ? p4 : 1.0;
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
            this.getLocalMatrix().toEuler(this._localEulerAngles).multiplyScalar(RAD_DEG);

            return this._localEulerAngles;
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
        public setLocalEulerAngles(euler: Readonly<IVector3>): void;
        public setLocalEulerAngles(x: number, y: number, z: number): void;
        public setLocalEulerAngles(p1: Readonly<IVector3> | number, p2?: number, p3?: number): void {
            if (p1.hasOwnProperty("x")) {
                _helpVector3.multiplyScalar(DEG_RAD, p1 as Readonly<IVector3>);
                this.localRotation.fromEuler(_helpVector3);
            }
            else {
                _helpVector3.set(p1 as number * DEG_RAD, p2 as number * DEG_RAD, p3 as number * DEG_RAD);
            }

            this.localRotation.fromEuler(_helpVector3);

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
        public setLocalScale(v: Readonly<IVector3>): void;
        public setLocalScale(x: number, y: number, z: number): void;
        public setLocalScale(p1: Readonly<IVector3> | number, p2?: number, p3?: number): void {
            if (p1.hasOwnProperty("x")) {
                this.localScale.copy(p1 as Readonly<IVector3>);
            }
            else {
                this.localScale.x = p1 as number;
                this.localScale.y = p2 !== undefined ? p2 : 1.0;
                this.localScale.z = p3 !== undefined ? p3 : 1.0;
            }

            if (!this._dirtyLocal) {
                this._dirtify(true);
            }
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
        public getLocalMatrix(): Readonly<Matrix> {
            if (this._dirtyLocal) {
                this._localMatrix.compose(this.localPosition, this.localRotation, this.localScale);
                this._dirtyLocal = false;
            }

            return this._localMatrix;
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
            this.getWorldMatrix().decompose(this._position, null, null); // TODO dirty.
            return this._position;
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
        public setPosition(position: IVector3): void;
        public setPosition(x: number, y: number, z: number): void;
        public setPosition(p1: Readonly<IVector3> | number, p2?: number, p3?: number): void {
            if (p1.hasOwnProperty("x")) {
                _helpVector3.copy(p1 as IVector3);
            }
            else {
                _helpVector3.x = p1 as number;
                _helpVector3.y = p2 || 0.0;
                _helpVector3.z = p3 || 0.0;
            }

            if (this._parent) {
                _helpMatrix.inverse(this._parent.getWorldMatrix()).transformVector3(_helpVector3);
            }

            this.localPosition.copy(_helpVector3);

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
            this.getWorldMatrix().decompose(null, this._rotation, null); // TODO dirty.
            return this._rotation;
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
        public setRotation(v: IVector4): void;
        public setRotation(x: number, y: number, z: number, w: number): void;
        public setRotation(q1: IVector4 | number, q2?: number, q3?: number, q4?: number): void {
            if (q1.hasOwnProperty("x")) {
                _helpRotationA.copy(q1 as IVector4);
            } else {
                _helpRotationA.x = q1 as number;
                _helpRotationA.y = q2 || 0.0;
                _helpRotationA.z = q3 || 0.0;
                _helpRotationA.w = q4 !== undefined ? q4 : 1.0;
            }

            if (!this._parent) {
                this.localRotation.copy(_helpRotationA);
            } else {
                let parentRot = this._parent.getRotation();
                _helpRotationB.copy(parentRot);
                this.localRotation.multiply(_helpRotationB.inverse(), _helpRotationA);
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
            this.getWorldMatrix().toEuler(this._eulerAngles).multiplyScalar(RAD_DEG); // TODO dirty
            return this._eulerAngles;
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
        public setEulerAngles(v: Readonly<IVector3>): void;
        public setEulerAngles(x: number, y: number, z: number): void;
        public setEulerAngles(q1: Readonly<IVector3> | number, q2?: number, q3?: number) {
            if (q1.hasOwnProperty("x")) {
                _helpVector3.multiplyScalar(DEG_RAD, q1 as Readonly<IVector3>);
                this.localRotation.fromEuler(_helpVector3);
            }
            else {
                _helpVector3.set(q1 as number * DEG_RAD, q2 as number * DEG_RAD, q3 as number * DEG_RAD);
            }

            _helpRotationA.fromEuler(_helpVector3);

            if (!this._parent) {
                this.localRotation.copy(_helpRotationA);
            }
            else {
                _helpRotationB.copy(this._parent.getRotation());
                this.localRotation.multiply(_helpRotationB.inverse(), _helpRotationA);
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
            this.getWorldMatrix().decompose(null, null, this._scale); // TODO dirty.
            return this._scale;
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
        public setScale(v: IVector3): void;
        public setScale(x: number, y: number, z: number): void;
        public setScale(p1: IVector3 | number, p2?: number, p3?: number): void {
            if (p1.hasOwnProperty("x")) {
                _helpVector3.copy(p1 as IVector3);
            }
            else {
                _helpVector3.x = p1 as number;
                _helpVector3.y = p2 !== undefined ? p2 : 1.0;
                _helpVector3.z = p3 !== undefined ? p3 : 1.0;
            }

            if (this._parent) {
                _helpMatrix.inverse(this._parent.getWorldMatrix()).transformVector3(_helpVector3);
            }

            this.localScale.copy(_helpVector3);

            if (!this._dirtyLocal) {
                this._dirtify(true);
            }
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
        public getWorldMatrix(): Readonly<Matrix> {
            if (!this._dirtyLocal && !this._dirtyWorld) {
                return this._worldMatrix;
            }

            if (this._parent) {
                this._parent.getWorldMatrix();
            }

            this._sync();

            return this._worldMatrix;
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
        public getRight(out?: Vector3) {
            if (!out) {
                out = Vector3.create();
            }

            return out.applyDirection(this.getWorldMatrix(), Vector3.RIGHT).normalize();
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
        public getUp(out?: Vector3) {
            if (!out) {
                out = Vector3.create();
            }

            return out.applyDirection(this.getWorldMatrix(), Vector3.UP).normalize();
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
        public getForward(out?: Vector3) {
            if (!out) {
                out = Vector3.create();
            }

            return out.applyDirection(this.getWorldMatrix(), Vector3.FORWARD).normalize();
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
        public lookAt(target: Readonly<Transform> | Readonly<IVector3>, up?: Readonly<IVector3>) {
            if (target instanceof Transform) {
                _helpVector3.copy(target.getPosition());
            }
            else {
                _helpVector3.copy(target as Readonly<IVector3>);
            }

            if (up) {
                _helpRotationA.fromMatrix(_helpMatrix.lookAt(this.getPosition(), _helpVector3, up));
            }
            else {
                _helpRotationA.lookAt(this.getPosition(), _helpVector3);
            }

            this.setRotation(_helpRotationA);
        }
        /**
         * 当前子集对象的数量
         */
        public get childCount(): number {
            return this._children.length;
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
        @paper.deserializedIgnore
        public get children(): ReadonlyArray<Transform> {
            return this._children;
        }
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

    export type ImmutableVector4 = Readonly<Float32Array>;
}
