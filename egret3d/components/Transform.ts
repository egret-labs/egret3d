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
        private readonly _localToWorld: Matrix4 = Matrix4.create();

        @paper.serializedField("localPosition")
        private readonly _localPosition: Vector3 = Vector3.create();
        @paper.serializedField("localRotation")
        private readonly _localRotation: Quaternion = Quaternion.create();
        private readonly _localEuler: Vector3 = Vector3.create();
        private readonly _localEulerAngles: Vector3 = Vector3.create();
        @paper.serializedField("localScale")
        private readonly _localScale: Vector3 = Vector3.ONE.clone();

        private readonly _position: Vector3 = Vector3.create();
        private readonly _rotation: Quaternion = Quaternion.create();
        private readonly _euler: Vector3 = Vector3.create();
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
        private _updateEuler(order?: EulerOrder, isWorldSpace?: boolean) {
            if (isWorldSpace) {

            }
            else {
                this.getLocalMatrix().toEuler(this._localEuler, order);
                this._localEulerAngles.multiplyScalar(RAD_DEG, this._localEuler);
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

            // this._dirtify(false, false);
            this._dirtify(false);
        }
        /**
         * @internal
         */
        public getAllChildren(out: Transform[] | { [key: string]: Transform | (Transform[]) } = []) {
            for (const child of this._children) {
                if (Array.isArray(out)) {
                    out.push(child);
                }
                else {
                    const childName = child.gameObject.name;
                    if (childName in out) {
                        const transformOrTransforms = out[childName];
                        if (Array.isArray(transformOrTransforms)) {
                            transformOrTransforms.push(child);
                        }
                        else {
                            out[childName] = [transformOrTransforms, child];
                        }
                    }
                    else {
                        out[childName] = child;
                    }
                }

                child.getAllChildren(out);
            }

            return out;
        }
        /**
         * 
         */
        public destroyChildren() {
            let i = this._children.length;
            while (i--) {
                this._children[i].gameObject.destroy();
            }
        }

        public contains(value: Transform): boolean {
            if (value === this) {
                return false;
            }

            let ancestor: Transform | null = value;
            while (ancestor !== this && ancestor !== null) {
                ancestor = ancestor.parent;
            }

            return ancestor === this;
        }
        /**
         * 设置父节点 
         */
        public setParent(value: Transform | null, worldPositionStays: boolean = false) {
            const prevParent = this._parent;
            if (prevParent === value) {
                return this;
            }

            if (
                value &&
                this.gameObject.scene !== value.gameObject.scene
            ) {
                console.warn("Cannot change the parent to a different scene.");
                return this;
            }

            if (this === value || this.contains(value)) {
                console.error("Set the parent error.");
                return this;
            }

            if (worldPositionStays) {
                _helpVector3.copy(this.getPosition());
            }

            if (prevParent) {
                prevParent._removeFromChildren(this);
            }

            if (value) {
                value._children.push(this);
            }

            this._parent = value;
            this._onParentChange(value, prevParent);

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
         * 本地位置。
         */
        public getLocalPosition(): Readonly<Vector3> {
            return this._localPosition;
        }
        /**
         * 本地位置。
         */
        public setLocalPosition(position: Readonly<IVector3>): this;
        public setLocalPosition(x: number, y: number, z: number): this;
        public setLocalPosition(p1: Readonly<IVector3> | number, p2?: number, p3?: number) {
            if (p1.hasOwnProperty("x")) {
                this._localPosition.x = (p1 as Readonly<IVector3>).x;
                this._localPosition.y = (p1 as Readonly<IVector3>).y;
                this._localPosition.z = (p1 as Readonly<IVector3>).z;
            }
            else {
                this._localPosition.x = p1 as number;
                this._localPosition.y = p2 || 0.0;
                this._localPosition.z = p3 || 0.0;
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
         * 本地位置。
         */
        @paper.editor.property(paper.editor.EditType.VECTOR3)
        public get localPosition(): Readonly<Vector3 | IVector3> {
            return this._localPosition;
        }
        public set localPosition(value: Readonly<Vector3 | IVector3>) {
            this._localPosition.x = value.x;
            this._localPosition.y = value.y;
            this._localPosition.z = value.z;

            if (!this._dirtyLocal) {
                this._dirtify(true);
            }
        }
        /**
         * 本地旋转。
         */
        public getLocalRotation(): Readonly<Quaternion> {
            return this._localRotation;
        }
        /**
         * 本地旋转。
         */
        public setLocalRotation(rotation: Readonly<IVector4>): this;
        public setLocalRotation(x: number, y: number, z: number, w: number): this;
        public setLocalRotation(p1: Readonly<IVector4> | number, p2?: number, p3?: number, p4?: number) {
            if (p1.hasOwnProperty("x")) {
                this._localRotation.x = (p1 as Readonly<IVector3>).x;
                this._localRotation.y = (p1 as Readonly<IVector3>).y;
                this._localRotation.z = (p1 as Readonly<IVector3>).z;
                this._localRotation.w = (p1 as Readonly<IVector4>).w;
            }
            else {
                this._localRotation.x = p1 as number;
                this._localRotation.y = p2 || 0.0;
                this._localRotation.z = p3 || 0.0;
                this._localRotation.w = p4 !== undefined ? p4 : 1.0;
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
         * 本地旋转。
         */
        @paper.editor.property(paper.editor.EditType.VECTOR4)
        public get localRotation(): Readonly<Quaternion | IVector4> {
            return this._localRotation;
        }
        public set localRotation(value: Readonly<Quaternion | IVector4>) {
            this._localRotation.x = value.x;
            this._localRotation.y = value.y;
            this._localRotation.z = value.z;
            this._localRotation.w = value.w;

            if (!this._dirtyLocal) {
                this._dirtify(true);
            }
        }
        /**
         * 本地欧拉弧度。
         */
        public getLocalEuler(order?: EulerOrder): Readonly<Vector3> {
            // if (this._dirtyLocalRS) {
            if (this._dirtyLocal) {
                this._updateEuler(order);
            }

            return this._localEuler;
        }
        /**
         * 本地欧拉弧度。
         */
        public setLocalEuler(value: Readonly<IVector3>, order?: EulerOrder): this;
        public setLocalEuler(x: number, y: number, z: number, order?: EulerOrder): this;
        public setLocalEuler(p1: Readonly<IVector3> | number, p2?: EulerOrder | number, p3?: number, p4?: EulerOrder) {
            if (p1.hasOwnProperty("x")) {
                this._localRotation.fromEuler(p1 as Readonly<IVector3>, p2 as EulerOrder);
            }
            else {
                _helpVector3.set(p1 as number, p2 as number, p3 as number);
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
         * 本地欧拉弧度。
         */
        public get localEuler(): Readonly<Vector3 | IVector3> {
            // if (this._dirtyLocalRS) {
            if (this._dirtyLocal) {
                this._updateEuler();
            }

            return this._localEuler;
        }
        public set localEuler(value: Readonly<Vector3 | IVector3>) {
            this._localRotation.fromEuler(value);

            if (!this._dirtyLocal) {
                this._dirtify(true);
            }
        }
        /**
         * 本地欧拉角度。
         */
        public getLocalEulerAngles(order?: EulerOrder): Readonly<Vector3> {
            // if (this._dirtyLocalRS) {
            if (this._dirtyLocal) {
                this._updateEuler(order);
            }

            return this._localEulerAngles;
        }
        /**
         * 本地欧拉角度。
         */
        public setLocalEulerAngles(value: Readonly<IVector3>, order?: EulerOrder): this;
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
         * 本地欧拉角度。
         */
        @paper.editor.property(paper.editor.EditType.VECTOR3)
        public get localEulerAngles(): Readonly<Vector3 | IVector3> {
            // if (this._dirtyLocalRS) {
            if (this._dirtyLocal) {
                this._updateEuler();
            }

            return this._localEulerAngles;
        }
        public set localEulerAngles(value: Readonly<Vector3 | IVector3>) {
            _helpVector3.multiplyScalar(DEG_RAD, value);
            this._localRotation.fromEuler(_helpVector3);

            if (!this._dirtyLocal) {
                this._dirtify(true);
            }
        }
        /**
         * 本地缩放。
         */
        public getLocalScale(): Readonly<Vector3> {
            return this._localScale;
        }
        /**
         * 本地缩放。
         */
        public setLocalScale(v: Readonly<IVector3>): this;
        public setLocalScale(x: number, y?: number, z?: number): this;
        public setLocalScale(p1: Readonly<IVector3> | number, p2?: number, p3?: number) {
            if (p1.hasOwnProperty("x")) {
                this._localScale.x = (p1 as Readonly<IVector3>).x;
                this._localScale.y = (p1 as Readonly<IVector3>).y;
                this._localScale.z = (p1 as Readonly<IVector3>).z;
            }
            else {
                this._localScale.x = p1 as number;
                this._localScale.y = p2 !== undefined ? p2 : p1 as number;
                this._localScale.z = p3 !== undefined ? p3 : p1 as number;
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
         * 本地缩放。
         */
        @paper.editor.property(paper.editor.EditType.VECTOR3)
        public get localScale(): Readonly<Vector3 | IVector3> {
            return this._localScale;
        }
        public set localScale(value: Readonly<Vector3 | IVector3>) {
            this._localScale.x = value.x;
            this._localScale.y = value.y;
            this._localScale.z = value.z;

            if (!this._dirtyLocal) {
                this._dirtify(true);
            }
        }
        /**
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
         * 
         */
        public get localMatrix(): Readonly<Matrix4> {
            if (this._dirtyLocal) {
                this._localMatrix.compose(this._localPosition, this._localRotation, this._localScale);
                this._dirtyLocal = false;
            }

            return this._localMatrix;
        }
        /**
         * 世界位置。
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
         * 世界位置。
         */
        public setPosition(position: Readonly<IVector3>): this;
        public setPosition(x: number, y: number, z: number): this;
        public setPosition(p1: Readonly<IVector3> | number, p2?: number, p3?: number) {
            if (p1.hasOwnProperty("x")) {
                this._localPosition.x = (p1 as Readonly<IVector3>).x;
                this._localPosition.y = (p1 as Readonly<IVector3>).y;
                this._localPosition.z = (p1 as Readonly<IVector3>).z;
            }
            else {
                this._localPosition.x = p1 as number;
                this._localPosition.y = p2 || 0.0;
                this._localPosition.z = p3 || 0.0;
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
         * 世界位置。
         */
        public get position(): Readonly<Vector3 | IVector3> {
            // if (this._dirtyWorldT) {
            // if (this._dirtyWorld) {
            //     this.getWorldMatrix().decompose(this._position, this._rotation, this._scale);
            // }

            this.getWorldMatrix().decompose(this._position, null, null);

            return this._position;
        }
        public set position(value: Readonly<Vector3 | IVector3>) {
            this._localPosition.x = value.x;
            this._localPosition.y = value.y;
            this._localPosition.z = value.z;

            if (this._parent) {
                this._localPosition.applyMatrix(_helpMatrix.inverse(this._parent.getWorldMatrix()));
            }

            // if (!this._dirtyWorldT) {
            //     this._dirtify(true, true);
            // }

            if (!this._dirtyLocal) {
                this._dirtify(true);
            }
        }
        /**
         * 世界旋转。
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
         * 世界旋转。
         */
        public setRotation(v: Readonly<IVector4>): this;
        public setRotation(x: number, y: number, z: number, w: number): this;
        public setRotation(p1: Readonly<IVector4> | number, p2?: number, p3?: number, p4?: number) {
            if (p1.hasOwnProperty("x")) {
                this._localRotation.x = (p1 as Readonly<IVector3>).x;
                this._localRotation.y = (p1 as Readonly<IVector3>).y;
                this._localRotation.z = (p1 as Readonly<IVector3>).z;
                this._localRotation.w = (p1 as Readonly<IVector4>).w;
            }
            else {
                this._localRotation.x = p1 as number;
                this._localRotation.y = p2 || 0.0;
                this._localRotation.z = p3 || 0.0;
                this._localRotation.w = p4 !== undefined ? p4 : 1.0;
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
         * 世界旋转。
         */
        public get rotation(): Readonly<Quaternion | IVector4> {
            // if (this._dirtyWorldRS) {
            // if (this._dirtyWorld) {
            //     this.getWorldMatrix().decompose(this._position, this._rotation, this._scale);
            // }

            this.getWorldMatrix().decompose(null, this._rotation, null);

            return this._rotation;
        }
        public set rotation(value: Readonly<Quaternion | IVector4>) {
            this._localRotation.x = value.x;
            this._localRotation.y = value.y;
            this._localRotation.z = value.z;
            this._localRotation.w = value.w;

            if (this._parent) {
                this._localRotation.premultiply(_helpRotation.inverse(this._parent.getRotation()));
            }

            // if (!this._dirtyWorldRS) {
            //     this._dirtify(true, false);
            // }

            if (!this._dirtyLocal) {
                this._dirtify(true);
            }
        }
        /**
         * 世界欧拉弧度。
         */
        public getEuler(order?: EulerOrder): Readonly<Vector3> {
            // if (this._dirtyWorldRS) {
            // if (this._dirtyWorld) {
            //     this.getWorldMatrix().decompose(this._position, this._rotation, this._scale).toEuler(this._eulerAngles).multiplyScalar(RAD_DEG);
            // }

            this.getWorldMatrix().toEuler(this._euler, order);

            return this._euler;
        }
        /**
         * 世界欧拉弧度。
         */
        public setEuler(v: Readonly<IVector3>, order?: EulerOrder): this;
        public setEuler(x: number, y: number, z: number, order?: EulerOrder): this;
        public setEuler(q1: Readonly<IVector3> | number, q2?: EulerOrder | number, q3?: number, q4?: EulerOrder) {
            if (q1.hasOwnProperty("x")) {
                this._localRotation.fromEuler(q1 as Readonly<IVector3>, q2 as EulerOrder);
            }
            else {
                _helpVector3.set(q1 as number, q2 as number, q3 as number);
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
         * 世界欧拉弧度。
         */
        public get euler(): Readonly<Vector3 | IVector3> {
            // if (this._dirtyWorldRS) {
            // if (this._dirtyWorld) {
            //     this.getWorldMatrix().decompose(this._position, this._rotation, this._scale).toEuler(this._eulerAngles).multiplyScalar(RAD_DEG);
            // }

            this.getWorldMatrix().toEuler(this._euler);

            return this._euler;
        }
        public set euler(value: Readonly<Vector3 | IVector3>) {
            this._localRotation.fromEuler(value);

            if (this._parent) {
                this._localRotation.premultiply(_helpRotation.inverse(this._parent.getRotation()));
            }

            // if (!this._dirtyWorldRS) {
            //     this._dirtify(true, false);
            // }

            if (!this._dirtyLocal) {
                this._dirtify(true);
            }
        }
        /**
         * 世界欧拉角度。
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
         * 世界欧拉角度。
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
         * 世界欧拉角度。
         */
        public get eulerAngles(): Readonly<Vector3 | IVector3> {
            // if (this._dirtyWorldRS) {
            // if (this._dirtyWorld) {
            //     this.getWorldMatrix().decompose(this._position, this._rotation, this._scale).toEuler(this._eulerAngles).multiplyScalar(RAD_DEG);
            // }

            this.getWorldMatrix().toEuler(this._eulerAngles).multiplyScalar(RAD_DEG);

            return this._eulerAngles;
        }
        public set eulerAngles(value: Readonly<Vector3 | IVector3>) {
            _helpVector3.multiplyScalar(DEG_RAD, value);
            this._localRotation.fromEuler(_helpVector3);

            if (this._parent) {
                this._localRotation.premultiply(_helpRotation.inverse(this._parent.getRotation()));
            }

            // if (!this._dirtyWorldRS) {
            //     this._dirtify(true, false);
            // }

            if (!this._dirtyLocal) {
                this._dirtify(true);
            }
        }
        /**
         * 世界缩放。
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
         * 世界缩放。
         */
        public setScale(v: Readonly<IVector3>): this;
        public setScale(x: number, y?: number, z?: number): this;
        public setScale(p1: Readonly<IVector3> | number, p2?: number, p3?: number) {
            if (p1.hasOwnProperty("x")) {
                this._localScale.x = (p1 as Readonly<IVector3>).x;
                this._localScale.y = (p1 as Readonly<IVector3>).y;
                this._localScale.z = (p1 as Readonly<IVector3>).z;
            }
            else {
                this._localScale.x = p1 as number;
                this._localScale.y = p2 !== undefined ? p2 : p1 as number;
                this._localScale.z = p3 !== undefined ? p3 : p1 as number;
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
         * 世界缩放。
         */
        public get scale(): Readonly<Vector3 | IVector3> {
            // if (this._dirtyWorldRS) {
            // if (this._dirtyWorld) {
            //     this.getWorldMatrix().decompose(this._position, this._rotation, this._scale);
            // }

            this.getWorldMatrix().decompose(null, null, this._scale);

            return this._scale;
        }
        public set scale(value: Readonly<Vector3 | IVector3>) {
            this._localScale.x = value.x;
            this._localScale.y = value.y;
            this._localScale.z = value.z;

            if (this._parent) {
                this._localScale.applyDirection(_helpMatrix.inverse(this._parent.getWorldMatrix()));
            }

            // if (!this._dirtyWorldRS) {
            //     this._dirtify(true, false);
            // }

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
                    this._localToWorld.multiply(this._parent.getWorldMatrix(), localMatrix);
                }
                else {
                    this._localToWorld.copy(localMatrix);
                }

                this._worldMatrixDeterminant = this._localToWorld.determinant();
                this._dirtyWorld = false;
            }

            return this._localToWorld;
        }
        /**
         * 
         */
        public get worldMatrix(): Readonly<Matrix4> {
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
                    this._localToWorld.multiply(this._parent.getWorldMatrix(), localMatrix);
                }
                else {
                    this._localToWorld.copy(localMatrix);
                }

                this._worldMatrixDeterminant = this._localToWorld.determinant();
                this._dirtyWorld = false;
            }

            return this._localToWorld;
        }
        /**
         * 
         */
        public translate(value: Readonly<IVector3>, isWorldSpace?: boolean): this;
        public translate(x: number, y: number, z: number, isWorldSpace?: boolean): this;
        public translate(p1: Readonly<IVector3> | number, p2?: boolean | number, p3?: number, p4?: boolean) {
            if (p1.hasOwnProperty("x")) {
                if (p2) {
                    this.position = this._localPosition.add(p1 as Readonly<IVector3>, this.position);
                }
                else {
                    this.localPosition = this._localPosition.add(p1 as Readonly<IVector3>);
                }
            }
            else {
                _helpVector3.set(p1 as number, p2 as number, p3 as number);

                if (p4) {
                    this.position = this._localPosition.add(_helpVector3, this.position);
                }
                else {
                    this.localPosition = this._localPosition.add(_helpVector3);
                }
            }

            return this;
        }
        /**
         * 
         */
        public rotate(value: Readonly<IVector3>, isWorldSpace?: boolean, order?: EulerOrder): this;
        public rotate(x: number, y: number, z: number, isWorldSpace?: boolean, order?: EulerOrder): this;
        public rotate(p1: Readonly<IVector3> | number, p2?: boolean | number, p3?: EulerOrder | number, p4?: boolean, p5?: EulerOrder) {
            if (p1.hasOwnProperty("x")) {
                if (p2) {
                    this.euler = this._localEuler.add(p1 as Readonly<IVector3>, this.euler);
                }
                else {
                    this.localEuler; //
                    this.localEuler = this._localEuler.add(p1 as Readonly<IVector3>);
                }
            }
            else {
                _helpVector3.set(p1 as number, p2 as number, p3 as number);

                if (p4) {
                    this.euler = this._localEuler.add(_helpVector3, this.euler);
                }
                else {
                    this.localEuler; //
                    this.localEuler = this._localEuler.add(_helpVector3);
                }
            }

            return this;
        }
        /**
         * 
         */
        public rotateAngle(value: Readonly<IVector3>, isWorldSpace?: boolean, order?: EulerOrder): this;
        public rotateAngle(x: number, y: number, z: number, isWorldSpace?: boolean, order?: EulerOrder): this;
        public rotateAngle(p1: Readonly<IVector3> | number, p2?: boolean | number, p3?: EulerOrder | number, p4?: boolean, p5?: EulerOrder) {
            if (p1.hasOwnProperty("x")) {
                if (p2) {
                    this.eulerAngles = this._localEulerAngles.add(p1 as Readonly<IVector3>, this.eulerAngles);
                }
                else {
                    this.localEulerAngles; //
                    this.localEulerAngles = this._localEulerAngles.add(p1 as Readonly<IVector3>);
                }
            }
            else {
                _helpVector3.set(p1 as number, p2 as number, p3 as number);

                if (p4) {
                    this.eulerAngles = this._localEulerAngles.add(_helpVector3, this.eulerAngles);
                }
                else {
                    this.localEulerAngles; //
                    this.localEulerAngles = this._localEulerAngles.add(_helpVector3);
                }
            }

            return this;
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
