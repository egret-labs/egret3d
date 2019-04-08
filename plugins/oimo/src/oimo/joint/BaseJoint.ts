namespace egret3d.oimo {

    const enum ValueType {
        CollisionEnabled,
        UseWorldAnchor,
        BreakForce,
        BreakTorque,
    }
    /**
     * 基础关节组件。
     * - 全部关节组件的基类。
     */
    @paper.abstract
    export abstract class BaseJoint<T extends OIMO.Joint> extends paper.BaseComponent {
        /**
         * 关节类型。
         */
        public readonly jointType: JointType = -1;

        @paper.serializedField
        protected readonly _anchor: Vector3 = Vector3.create();
        /**
         * CollisionEnabled, UseGlobalAnchor
         * 0, 0,
         */
        @paper.serializedField
        protected readonly _values: Float32Array;
        protected _rigidbody: Rigidbody | null = null;
        protected _connectedBody: Rigidbody | null = null;
        protected _oimoJoint: T | null = null;

        protected abstract _createJoint(): T;

        public initialize() {
            super.initialize();

            this._values[ValueType.CollisionEnabled] = 0;
            this._values[ValueType.UseWorldAnchor] = 0;
            this._values[ValueType.BreakForce] = 0.0;
            this._values[ValueType.BreakTorque] = 0.0;
            this._rigidbody = this.entity.getComponent(Rigidbody)!;
        }

        public uninitialize() {
            super.uninitialize();

            this._anchor.clear();
            this._rigidbody = null;
            this._connectedBody = null;
            this._oimoJoint = null;
        }
        /**
         * 获取该关节的在连接刚体上的锚点。
         */
        public getConnectedAnchor(output: Vector3 | null = null, isWorldSpace: boolean = false): Vector3 {
            if (output === null) {
                output = Vector3.create();
            }

            if (this._oimoJoint !== null) {
                if (isWorldSpace) {
                    this._oimoJoint.getAnchor2To(output as any);
                }
                else {
                    this._oimoJoint.getLocalAnchor2To(output as any);
                }
            }
            else {
                output.copy(this.anchor);

                if (isWorldSpace) {
                    if (!this.useWorldSpace) {
                        output.applyMatrix(this.gameObject.transform.localToWorldMatrix);
                    }
                }
                else if (this.useWorldSpace) {
                    output.applyMatrix(this.gameObject.transform.worldToLocalMatrix);
                }
            }

            return output;
        }
        /**
         * 获取该关节承受的力。
         */
        public getAppliedForce(output: Vector3 | null = null): Vector3 {
            if (output === null) {
                output = Vector3.create();
            }

            if (this._oimoJoint !== null) {
                this._oimoJoint.getAppliedForceTo(output as any);
            }

            return output;
        }
        /**
         * 获取该关节承受的扭矩。
         */
        public getAppliedTorque(output: Vector3 | null = null): Vector3 {
            if (output === null) {
                output = Vector3.create();
            }

            if (this._oimoJoint !== null) {
                this._oimoJoint.getAppliedTorqueTo(output as any);
            }

            return output;
        }
        /**
         * 该关节所连接的两个刚体之间是否允许碰撞。
         * - 默认 `false` ，不允许碰撞。
         */
        @paper.editor.property(paper.editor.EditType.CHECKBOX)
        public get collisionEnabled(): boolean {
            return this._values[ValueType.CollisionEnabled] === 1;
        }
        public set collisionEnabled(value: boolean) {
            if (this.collisionEnabled === value) {
                return;
            }

            this._values[ValueType.CollisionEnabled] = value ? 1 : 0;

            if (this._oimoJoint !== null) {
                this._oimoJoint.setAllowCollision(value);
            }
        }
        /**
         * 该关节的锚点和轴是否为世界坐标系。
         * - 默认 `false` ，使用本地坐标系。
         */
        @paper.editor.property(paper.editor.EditType.CHECKBOX)
        public get useWorldSpace(): boolean {
            return this._values[ValueType.UseWorldAnchor] > 0;
        }
        public set useWorldSpace(value: boolean) {
            if (this._oimoJoint === null) {
                this._values[ValueType.UseWorldAnchor] = value ? 1 : 0;
            }
            else if (DEBUG) {
                console.warn("Cannot change the useWorldAnchor after the joint has been created.");
            }
        }
        /**
         * 该关节的锚点。
         */
        @paper.editor.property(paper.editor.EditType.VECTOR3)
        public get anchor(): Readonly<Vector3> {
            return this._anchor;
        }
        public set anchor(value: Readonly<Vector3>) {
            if (this._oimoJoint === null) {
                this._anchor.copy(value);
            }
            else if (DEBUG) {
                console.warn("Cannot change the anchor after the joint has been created.");
            }
        }
        /**
         * 该关节依附的刚体。
         */
        public get rigidbody(): Rigidbody {
            return this._rigidbody!;
        }
        /**
         * 该关节连接的刚体。
         */
        @paper.editor.property(paper.editor.EditType.COMPONENT, { componentClass: Rigidbody })
        @paper.serializedField
        public get connectedRigidbody(): Rigidbody | null {
            return this._connectedBody;
        }
        public set connectedRigidbody(value: Rigidbody | null) {
            if (this._connectedBody === this._rigidbody) {
                if (DEBUG) {
                    console.warn("Cannot set the connected rigidbody same as the rigibody.");
                }

                this._connectedBody = null;
            }

            if (this._connectedBody === value) {
                return;
            }

            if (this._oimoJoint === null) {
                this._connectedBody = value;
            }
            else if (DEBUG) {
                console.warn("Cannot change the connected rigidbody after the joint has been created.");
            }
        }
        /**
         * 该关节的 OIMO 关节。
         */
        public get oimoJoint(): T {
            if (this._oimoJoint === null) {
                this._oimoJoint = this._createJoint();
            }

            return this._oimoJoint;
        }
    }
}