namespace egret3d.oimo {

    const enum ValueType {
        CollisionEnabled,
        UseWorldAnchor,
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
        @paper.serializedField
        protected _rigidbody: Rigidbody | null = null;
        @paper.serializedField
        protected _connectedBody: Rigidbody | null = null;
        protected _oimoJoint: T | null = null;

        protected abstract _createJoint(): T;
        /**
         * 获取该关节承受的力。
         */
        public getAppliedForce(output: Vector3 | null): Vector3 {
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
        public getAppliedTorque(output?: Vector3): Vector3 {
            if (!output) {
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

            if (this._oimoJoint) {
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
            if (!this._oimoJoint) {
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
            if (!this._oimoJoint) {
                this._anchor.copy(value);
            }
            else if (DEBUG) {
                console.warn("Cannot change the anchor after the joint has been created.");
            }
        }
        /**
         * 该关节依附的刚体。
         */
        @paper.editor.property(paper.editor.EditType.COMPONENT)
        public get rigidbody(): Rigidbody {
            return this._rigidbody!;
        }
        /**
         * 该关节连接的刚体。
         */
        @paper.editor.property(paper.editor.EditType.COMPONENT)
        public get connectedRigidbody(): Rigidbody | null {
            return this._connectedBody;
        }
        public set connectedRigidbody(value: Rigidbody | null) {
            if (this._connectedBody === value) {
                return;
            }

            if (!this._oimoJoint) {
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
            if (!this._oimoJoint) {
                this._oimoJoint = this._createJoint();
            }

            return this._oimoJoint;
        }
    }
}