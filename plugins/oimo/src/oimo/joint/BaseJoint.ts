namespace egret3d.oimo {

    const enum ValueType {
        CollisionEnabled,
        UseGlobalAnchor,
    }
    /**
     * 基础关节组件。
     * - 全部关节组件的基类。
     */
    @paper.abstract
    export abstract class BaseJoint<T extends OIMO.Joint> extends paper.BaseComponent {
        /**
         * @internal
         */
        public static readonly isAbstract: paper.IComponentClass<paper.IComponent> = BaseJoint as any;
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
        protected _oimoJoint: T = null!;
        @paper.serializedField
        protected _rigidbody: Rigidbody = null!;
        @paper.serializedField
        protected _connectedBody: Rigidbody | null = null;

        protected abstract _createJoint(): T;
        /**
         * 获取该关节承受的力。
         */
        public getAppliedForce(out?: Vector3): Vector3 {
            if (!out) {
                out = Vector3.create();
            }

            this._oimoJoint.getAppliedForceTo(out as any); // TODO

            return out;
        }
        /**
         * 获取该关节承受的扭矩。
         */
        public getAppliedTorque(out?: Vector3): Vector3 {
            if (!out) {
                out = Vector3.create();
            }

            this._oimoJoint.getAppliedTorqueTo(out as any); // TODO

            return out;
        }
        /**
         * 该关节所连接的两个刚体之前是否允许碰撞。
         */
        @paper.editor.property(paper.editor.EditType.CHECKBOX)
        public get collisionEnabled(): boolean {
            return this._values[ValueType.CollisionEnabled] > 0;
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
         * 该关节的锚点是否为世界坐标系。
         */
        @paper.editor.property(paper.editor.EditType.CHECKBOX)
        public get useWorldAnchor(): boolean {
            return this._values[ValueType.UseGlobalAnchor] > 0;
        }
        public set useWorldAnchor(value: boolean) {
            if (!this._oimoJoint) {
                this._values[ValueType.UseGlobalAnchor] = value ? 1 : 0;
            }
            else if (DEBUG) {
                console.warn("Cannot change the useWorldAnchor after the joint has been created.");
            }
        }
        /**
         * 该关节在锚点。
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
            return this._rigidbody;
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