namespace egret3d {
    const _helpVector3 = Vector3.create();
    const _helpRotation = Quaternion.create();
    const _helpMatrix = Matrix4.create();

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
        // private _dirtyLocalT: boolean = true;
        // private _dirtyLocalRS: boolean = true;
        // private _dirtyWorldT: boolean = true;
        // private _dirtyWorldRS: boolean = true;
        private _dirtyLocal: boolean = true;
        private _dirtyWorld: boolean = true;
        /**
         * 世界矩阵的行列式，如果小于0，说明进行了反转
         * @internal
         */
        public _worldMatrixDeterminant: number = 0.0;
        private readonly _localMatrix: Matrix4 = Matrix4.create();
        private readonly _worldMatrix: Matrix4 = Matrix4.create();

        @paper.serializedField("localPosition")
        private readonly _localPosition: Vector3 = Vector3.create();
        @paper.serializedField("localRotation")
        private readonly _localRotation: Quaternion = Quaternion.create();
        private readonly _localEulerAngles: Vector3 = Vector3.create();
        @paper.serializedField("localScale")
        private readonly _localScale: Vector3 = Vector3.ONE.clone();

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

        private _dirtify(isLocalDirty: ConstrainBoolean) {
            if (isLocalDirty) {
                this._dirtyLocal = true;
            }

            if (!this._dirtyWorld) {
                this._dirtyWorld = true;

                for (const child of this._children) {
                    if (child._dirtyWorld) {
                        continue;
                    }

                    child._dirtify(false);
                }
            }

            if (this.gameObject.renderer) {
                this.gameObject.renderer._boundingSphereDirty = true;
            }
        }

        // private _dirtify(isLocalDirty: boolean, isTranslateDirty: boolean) {
        //     if (isLocalDirty) {
        //         if (isTranslateDirty) {
        //             this._dirtyLocalT = true;
        //         }
        //         else {
        //             this._dirtyLocalRS = true;
        //         }
        //     }

        //     if (isTranslateDirty) {
        //         if (!this._dirtyWorldT) {
        //             this._dirtyWorldT = true;

        //             for (const child of this._children) {
        //                 if (child._dirtyWorldT) {
        //                     continue;
        //                 }

        //                 child._dirtify(false, isTranslateDirty);
        //             }
        //         }
        //     }
        //     else if (!this._dirtyWorldRS) {
        //         this._dirtyWorldRS = true;

        //         for (const child of this._children) {
        //             if (child._dirtyWorldRS) {
        //                 continue;
        //             }

        //             child._dirtify(false, isTranslateDirty);
        //         }
        //     }


        //     if (this.gameObject.renderer) {
        //         this.gameObject.renderer._boundingSphereDirty = true;
        //     }
        // }
        /**
         * 父节点发生改变的回调方法
         * 子类可通过重载此方法进行标脏状态传递
         */
        protected _onParentChange(newParent: Transform | null, oldParent: Transform | null) {
            const prevActive = oldParent ? oldParent.gameObject.activeInHierarchy : this.gameObject.activeSelf;
            if ((newParent ? newParent.gameObject.activeInHierarchy : this.gameObject.activeSelf) !== prevActive) {
                this.gameObject._activeInHierarchyDirty(prevActive);
            }

            // this._dirtify(false, false);
            this._dirtify(false);
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
                _helpVector3.copy(this.getPosition());
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
                this.setPosition(_helpVector3);
            }

            return this;
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

            for (const name of names) {
                if (!name) {
                    return ancestor;
                }

                const prevAncestor = ancestor;
                for (const child of ancestor._children) {
                    if (child.gameObject.name === name) {
                        ancestor = child;
                        break;
                    }
                }

                if (prevAncestor === ancestor) {
                    return null;
                }
            }

            return ancestor;
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
            return this._localPosition;
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
        public setLocalPosition(position: Readonly<IVector3>): this;
        public setLocalPosition(x: number, y: number, z: number): this;
        public setLocalPosition(p1: Readonly<IVector3> | number, p2?: number, p3?: number) {
            if (p1.hasOwnProperty("x")) {
                this._localPosition.copy(p1 as Readonly<IVector3>);
            }
            else {
                this._localPosition.set(p1 as number, p2 || 0.0, p3 || 0.0);
            }

            // if (!this._dirtyLocalT) {
            //     this._dirtify(true, true);
            // }

            if (!this._dirtyLocal) {
                this._dirtify(true);
            }

            return this;
        }
        /**
         * 
         */
        @paper.editor.property(paper.editor.EditType.VECTOR3)
        public get localPosition(): Readonly<Vector3> {
            return this._localPosition;
        }
        public set localPosition(value: Readonly<Vector3>) {
            this._localPosition.copy(value);

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
            return this._localRotation;
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
        public setLocalRotation(rotation: Readonly<IVector4>): this;
        public setLocalRotation(x: number, y: number, z: number, w: number): this;
        public setLocalRotation(p1: Readonly<IVector4> | number, p2?: number, p3?: number, p4?: number) {
            if (p1.hasOwnProperty("x")) {
                this._localRotation.copy(p1 as Readonly<IVector4>);
            }
            else {
                this._localRotation.set(p1 as number, p2 || 0.0, p3 || 0.0, p4 !== undefined ? p4 : 1.0);
            }

            // if (!this._dirtyLocalRS) {
            //     this._dirtify(true, false);
            // }

            if (!this._dirtyLocal) {
                this._dirtify(true);
            }

            return this;
        }
        /**
         * 
         */
        @paper.editor.property(paper.editor.EditType.VECTOR4)
        public get localRotation(): Readonly<IVector4> {
            return this._localRotation;
        }
        public set localRotation(value: Readonly<IVector4>) {
            this._localRotation.copy(value);

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
        public getLocalEulerAngles(order?: EulerOrder): Readonly<Vector3> {
            // if (this._dirtyLocalRS) {
            if (this._dirtyLocal) {
                this.getLocalMatrix().toEuler(this._localEulerAngles, order).multiplyScalar(RAD_DEG);
            }

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
        public setLocalEulerAngles(euler: Readonly<IVector3>, order?: EulerOrder): this;
        public setLocalEulerAngles(x: number, y: number, z: number, order?: EulerOrder): this;
        public setLocalEulerAngles(p1: Readonly<IVector3> | number, p2?: EulerOrder | number, p3?: number, p4?: EulerOrder) {
            if (p1.hasOwnProperty("x")) {
                _helpVector3.multiplyScalar(DEG_RAD, p1 as Readonly<IVector3>);
                this._localRotation.fromEuler(_helpVector3, p2 as EulerOrder);
            }
            else {
                _helpVector3.set(p1 as number * DEG_RAD, p2 as number * DEG_RAD, p3 as number * DEG_RAD);
                this._localRotation.fromEuler(_helpVector3, p4 as EulerOrder);
            }

            // if (!this._dirtyLocalRS) {
            //     this._dirtify(true, false);
            // }

            if (!this._dirtyLocal) {
                this._dirtify(true);
            }

            return this;
        }
        /**
         * 
         */
        @paper.editor.property(paper.editor.EditType.VECTOR3)
        public get localEulerAngles(): Readonly<Vector3> {
            return this.getLocalEulerAngles();
        }
        public set localEulerAngles(value: Readonly<Vector3>) {
            _helpVector3.multiplyScalar(DEG_RAD, value);
            this._localRotation.fromEuler(_helpVector3);

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
            return this._localScale;
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
        public setLocalScale(v: Readonly<IVector3>): this;
        public setLocalScale(x: number, y: number, z: number): this;
        public setLocalScale(p1: Readonly<IVector3> | number, p2?: number, p3?: number) {
            if (p1.hasOwnProperty("x")) {
                this._localScale.copy(p1 as Readonly<IVector3>);
            }
            else {
                this._localScale.set(p1 as number, p2 !== undefined ? p2 : 1.0, p3 !== undefined ? p3 : 1.0);
            }

            // if (!this._dirtyLocalRS) {
            //     this._dirtify(true, false);
            // }

            if (!this._dirtyLocal) {
                this._dirtify(true);
            }

            return this;
        }
        /**
         * 
         */
        @paper.editor.property(paper.editor.EditType.VECTOR3)
        public get localScale(): Readonly<Vector3> {
            return this._localScale;
        }
        public set localScale(value: Readonly<Vector3>) {
            this._localScale.copy(value);

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
        public getLocalMatrix(): Readonly<Matrix4> {
            // if (this._dirtyLocalRS) {
            //     this._localMatrix.compose(this.localPosition, this.localRotation, this.localScale);
            //     this._dirtyLocalT = false;
            //     this._dirtyLocalRS = false;
            // }
            // else if (this._dirtyLocalT) {
            //     this._localMatrix.fromTranslate(this.localPosition, true);
            //     this._dirtyLocalT = false;
            // }

            if (this._dirtyLocal) {
                this._localMatrix.compose(this._localPosition, this._localRotation, this._localScale);
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
            // if (this._dirtyWorldT) {
            // if (this._dirtyWorld) {
            //     this.getWorldMatrix().decompose(this._position, this._rotation, this._scale);
            // }

            this.getWorldMatrix().decompose(this._position, null, null);

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
        public setPosition(position: IVector3): this;
        public setPosition(x: number, y: number, z: number): this;
        public setPosition(p1: Readonly<IVector3> | number, p2?: number, p3?: number) {
            if (p1.hasOwnProperty("x")) {
                this._localPosition.copy(p1 as IVector3);
            }
            else {
                this._localPosition.set(p1 as number, p2 || 0.0, p3 || 0.0);
            }

            if (this._parent) {
                this._localPosition.applyMatrix(_helpMatrix.inverse(this._parent.getWorldMatrix()));
            }

            // if (!this._dirtyWorldT) {
            //     this._dirtify(true, true);
            // }

            if (!this._dirtyLocal) {
                this._dirtify(true);
            }
            return this;
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
            // if (this._dirtyWorldRS) {
            // if (this._dirtyWorld) {
            //     this.getWorldMatrix().decompose(this._position, this._rotation, this._scale);
            // }

            this.getWorldMatrix().decompose(null, this._rotation, null);

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
        public setRotation(v: IVector4): this;
        public setRotation(x: number, y: number, z: number, w: number): this;
        public setRotation(q1: IVector4 | number, q2?: number, q3?: number, q4?: number) {
            if (q1.hasOwnProperty("x")) {
                this._localRotation.copy(q1 as IVector4);
            }
            else {
                this._localRotation.set(q1 as number, q2 || 0.0, q3 || 0.0, q4 !== undefined ? q4 : 1.0);
            }

            if (this._parent) {
                this._localRotation.premultiply(_helpRotation.inverse(this._parent.getRotation()));
            }

            // if (!this._dirtyWorldRS) {
            //     this._dirtify(true, false);
            // }

            if (!this._dirtyLocal) {
                this._dirtify(true);
            }

            return this;
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
        public getEulerAngles(order?: EulerOrder): Readonly<Vector3> {
            // if (this._dirtyWorldRS) {
            // if (this._dirtyWorld) {
            //     this.getWorldMatrix().decompose(this._position, this._rotation, this._scale).toEuler(this._eulerAngles).multiplyScalar(RAD_DEG);
            // }

            this.getWorldMatrix().toEuler(this._eulerAngles, order).multiplyScalar(RAD_DEG);

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
        public setEulerAngles(v: Readonly<IVector3>, order?: EulerOrder): this;
        public setEulerAngles(x: number, y: number, z: number, order?: EulerOrder): this;
        public setEulerAngles(q1: Readonly<IVector3> | number, q2?: EulerOrder | number, q3?: number, q4?: EulerOrder) {
            if (q1.hasOwnProperty("x")) {
                _helpVector3.multiplyScalar(DEG_RAD, q1 as Readonly<IVector3>);
                this._localRotation.fromEuler(_helpVector3, q2 as EulerOrder);
            }
            else {
                _helpVector3.set(q1 as number * DEG_RAD, q2 as number * DEG_RAD, q3 as number * DEG_RAD);
                this._localRotation.fromEuler(_helpVector3, q4 as EulerOrder);
            }

            if (this._parent) {
                this._localRotation.premultiply(_helpRotation.inverse(this._parent.getRotation()));
            }

            // if (!this._dirtyWorldRS) {
            //     this._dirtify(true, false);
            // }

            if (!this._dirtyLocal) {
                this._dirtify(true);
            }

            return this;
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
            // if (this._dirtyWorldRS) {
            // if (this._dirtyWorld) {
            //     this.getWorldMatrix().decompose(this._position, this._rotation, this._scale);
            // }

            this.getWorldMatrix().decompose(null, null, this._scale);

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
        public setScale(v: IVector3): this;
        public setScale(x: number, y: number, z: number): this;
        public setScale(p1: IVector3 | number, p2?: number, p3?: number) {
            if (p1.hasOwnProperty("x")) {
                this._localScale.copy(p1 as IVector3);
            }
            else {
                this._localScale.set(p1 as number, p2 !== undefined ? p2 : 1.0, p3 !== undefined ? p3 : 1.0);
            }

            if (this._parent) {
                this._localScale.applyDirection(_helpMatrix.inverse(this._parent.getWorldMatrix()));
            }

            // if (!this._dirtyWorldRS) {
            //     this._dirtify(true, false);
            // }

            if (!this._dirtyLocal) {
                this._dirtify(true);
            }

            return this;
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
        public getWorldMatrix(): Readonly<Matrix4> {
            // if (this._dirtyWorldT || this._dirtyWorldRS) {
            //     const localMatrix = this.getLocalMatrix();

            //     if (this._parent) {
            //         this._worldMatrix.multiply(this._parent.getWorldMatrix(), localMatrix);
            //     }
            //     else {
            //         this._worldMatrix.copy(localMatrix);
            //     }

            //     this._worldMatrixDeterminant = this._worldMatrix.determinant();
            //     this._dirtyWorldT = false;
            //     this._dirtyWorldRS = false;
            // }

            if (this._dirtyWorld) {
                const localMatrix = this.getLocalMatrix();

                if (this._parent) {
                    this._worldMatrix.multiply(this._parent.getWorldMatrix(), localMatrix);
                }
                else {
                    this._worldMatrix.copy(localMatrix);
                }

                this._worldMatrixDeterminant = this._worldMatrix.determinant();
                this._dirtyWorld = false;
            }

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
                this._localRotation.fromMatrix(_helpMatrix.lookAt(this.getPosition(), _helpVector3, up));
            }
            else {
                this._localRotation.lookAt(this.getPosition(), _helpVector3);
            }

            this.setRotation(this._localRotation);

            return this;
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
}
