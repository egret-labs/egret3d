namespace egret3d.oimo {
    egret3d.oimo.RigidbodyType.Dynamic; // Import error.

    const enum ValueType {
        Type,
        Mass,
        GravityScale,
        LinearDamping,
        AngularDamping,
    }
    /**
     * 刚体组件。
     */
    export class Rigidbody extends paper.BaseComponent implements egret3d.IRigidbody {
        private static readonly _config: OIMO.RigidBodyConfig = new OIMO.RigidBodyConfig();
        private static readonly _massData: OIMO.MassData = new OIMO.MassData();

        private readonly _linearVelocity: Vector3 = Vector3.create();
        private readonly _angularVelocity: Vector3 = Vector3.create();
        /**
         * [Type, Mass, LinearDamping, AngularDamping];
         */
        @paper.serializedField
        private readonly _values: Float32Array = new Float32Array([
            RigidbodyType.Dynamic, 1.0, 1.0, 0.0, 0.0,
        ]);
        private _oimoRigidbody: OIMO.RigidBody | null = null;

        protected _createRigidbody() {
            const config = Rigidbody._config;
            config.type = this.type;
            config.linearDamping = this.linearDamping;
            config.angularDamping = this.angularDamping;
            config.linearVelocity = this._linearVelocity as any; // 
            config.angularVelocity = this._angularVelocity as any; // 

            const oimoRigidbody = new OIMO.RigidBody(config);
            oimoRigidbody.userData = this;
            // this._updateMass(rigidbody); // TODO update mesh and type.
            oimoRigidbody.setGravityScale(this.gravityScale);

            return oimoRigidbody;
        }
        /**
         * @internal
         */
        public _updateMass(rigidbody: OIMO.RigidBody) {
            const massData = Rigidbody._massData;
            rigidbody.getMassDataTo(massData); // Copy mass data from rigibody.
            massData.mass = this._values[ValueType.Mass]; // Update mass.
            rigidbody.setMassData(massData); // Set mass data to rigibody.
        }

        private _checkRigidbody(message?: string) {
            if (this._oimoRigidbody === null && this.oimoRigidbody.getNumShapes() === 0) {
                for (const shape of this.gameObject.getComponents(BaseCollider as any, true) as BaseCollider[]) {
                    this.oimoRigidbody.addShape(shape.oimoShape);
                    // rigidbody._updateMass(rigidbody.oimoRigidbody);
                }
            }

            if (this._oimoRigidbody!.getNumShapes() === 0) {
                if (DEBUG) {
                    console.warn(message || "Cannot affect a rigidbody's velocity or force without adding a shape.");
                }

                return false;
            }

            return true;
        }
        /**
         * 将该刚体唤醒。
         */
        public wakeUp(): this {
            if (this._oimoRigidbody !== null) {
                this._oimoRigidbody.wakeUp();
            }

            return this;
        }
        /**
         * 将该刚体休眠。
         */
        public sleep(): this {
            if (this._oimoRigidbody !== null) {
                this._oimoRigidbody.sleep();
            }

            return this;
        }
        /**
         * 增加该刚体的线性速度。
         */
        public addLinearVelocity(veloctity: Readonly<IVector3>): this {
            if (this._checkRigidbody()) {
                this._oimoRigidbody!.addLinearVelocity(veloctity as any);
            }

            return this;
        }
        /**
         * 增加该刚体的角速度。
         */
        public addAngularVelocity(veloctity: Readonly<IVector3>): this {
            if (this._checkRigidbody()) {
                this._oimoRigidbody!.addAngularVelocity(veloctity as any);
            }

            return this;
        }
        /**
         * 对该刚体施加力。
         */
        public applyForce(force: Readonly<IVector3>, worldPosition: Readonly<IVector3>): this {
            if (this._checkRigidbody()) {
                this._oimoRigidbody!.applyForce(force as any, worldPosition as any);
            }

            return this;
        }
        /**
         * 对该刚体的中心点施加力。
         */
        public applyForceToCenter(force: Readonly<IVector3>): this {
            if (this._checkRigidbody()) {
                this._oimoRigidbody!.applyForceToCenter(force as any);
            }

            return this;
        }
        /**
         * 对该刚体施加扭转力。
         */
        public applyTorque(torque: Readonly<IVector3>): this {
            if (this._checkRigidbody()) {
                this._oimoRigidbody!.applyTorque(torque as any);
            }

            return this;
        }
        /**
         * 对该刚体施加冲量。
         */
        public applyImpulse(impulse: Readonly<IVector3>, worldPosition: Readonly<IVector3>): this {
            if (this._checkRigidbody()) {
                this._oimoRigidbody!.applyImpulse(impulse as any, worldPosition as any);
            }

            return this;
        }
        /**
         * 对该刚体施加线性冲量。
         */
        public applyLinearImpulse(impulse: Readonly<IVector3>): this {
            if (this._checkRigidbody()) {
                this._oimoRigidbody!.applyLinearImpulse(impulse as any);
            }

            return this;
        }
        /**
         * 对该刚体施加角冲量。
         */
        public applyAngularImpulse(impulse: Readonly<IVector3>): this {
            if (this._checkRigidbody()) {
                this._oimoRigidbody!.applyAngularImpulse(impulse as any);
            }

            return this;
        }
        /**
         * 
         */
        public syncTransform(transform?: Transform): this {
            const oimoRigidbody = this._oimoRigidbody;

            if (oimoRigidbody !== null) {
                const oimoTransform = PhysicsSystem._helpTransform;
                if (!transform) {
                    transform = this.gameObject.transform;
                }

                oimoTransform.setPosition(transform.position as any);
                oimoTransform.setOrientation(transform.rotation as any);
                oimoRigidbody.setTransform(oimoTransform);
            }

            return this;
        }
        /**
         * 该刚体是否正在休眠。
         */
        public get isSleeping(): boolean {
            if (this._oimoRigidbody !== null) {
                return this._oimoRigidbody.isSleeping();
            }

            return false;
        }
        /**
         * 该刚体此次休眠的累计时间。
         */
        public get sleepTime(): float {
            if (this._oimoRigidbody !== null) {
                return this._oimoRigidbody.getSleepTime();
            }

            return 0.0;
        }
        /**
         * 该刚体的类型。
         */
        @paper.editor.property(paper.editor.EditType.LIST, { listItems: paper.editor.getItemsFromEnum((egret3d.oimo as any).RigidbodyType) })
        public get type(): RigidbodyType {
            return this._values[ValueType.Type];
        }
        public set type(value: RigidbodyType) {
            if (this._values[ValueType.Type] === value) {
                return;
            }

            this._values[ValueType.Type] = value;

            if (this._oimoRigidbody !== null) {
                this._oimoRigidbody.setType(value);
            }
        }
        /**
         * 该刚体的质量。
         */
        @paper.editor.property(paper.editor.EditType.FLOAT)
        public get mass(): float {
            return this._values[ValueType.Mass];
        }
        public set mass(value: float) {
            if (value <= 0.0) {
                value = 0.01;
            }

            if (this._values[ValueType.Mass] === value) {
                return;
            }

            this._values[ValueType.Mass] = value;

            if (this._oimoRigidbody !== null) {
                this._updateMass(this._oimoRigidbody);
            }
        }
        /**
         * 该刚体的重力缩放系数。
         */
        @paper.editor.property(paper.editor.EditType.FLOAT)
        public get gravityScale(): float {
            return this._values[ValueType.GravityScale];
        }
        public set gravityScale(value: float) {
            if (this._values[ValueType.GravityScale] === value) {
                return;
            }

            this._values[ValueType.GravityScale] = value;

            if (this._oimoRigidbody !== null) {
                this._oimoRigidbody.setGravityScale(value);
            }
        }
        /**
         * 该刚体的线性阻尼。
         */
        @paper.editor.property(paper.editor.EditType.FLOAT)
        public get linearDamping(): float {
            return this._values[ValueType.LinearDamping];
        }
        public set linearDamping(value: float) {
            if (this._values[ValueType.LinearDamping] === value) {
                return;
            }

            this._values[ValueType.LinearDamping] = value;

            if (this._oimoRigidbody !== null) {
                this._oimoRigidbody.setLinearDamping(value);
            }
        }
        /**
         * 该刚体的旋转阻尼。
         */
        @paper.editor.property(paper.editor.EditType.FLOAT)
        public get angularDamping(): float {
            return this._values[ValueType.AngularDamping];
        }
        public set angularDamping(value: float) {
            if (this._values[ValueType.AngularDamping] === value) {
                return;
            }

            this._values[ValueType.AngularDamping] = value;

            if (this._oimoRigidbody !== null) {
                this._oimoRigidbody.setAngularDamping(value);
            }
        }
        /**
         * 该刚体的线性速度。
         */
        public get linearVelocity(): Readonly<Vector3> {
            if (this._oimoRigidbody !== null) {
                this._oimoRigidbody.getLinearVelocityTo(this._linearVelocity as any); //
            }

            return this._linearVelocity;
        }
        public set linearVelocity(value: Readonly<Vector3>) {
            this._linearVelocity.copy(value);

            if (this._oimoRigidbody !== null) {
                this._oimoRigidbody.setLinearVelocity(this._linearVelocity as any); //
            }
        }
        /**
         * 该刚体的角速度。
         */
        public get angularVelocity(): Readonly<Vector3> {
            if (this._oimoRigidbody !== null) {
                this._oimoRigidbody.getAngularVelocityTo(this._angularVelocity as any); //
            }

            return this._angularVelocity;
        }
        public set angularVelocity(value: Readonly<Vector3>) {
            this._angularVelocity.copy(value);

            if (this._oimoRigidbody !== null) {
                this._oimoRigidbody.setAngularVelocity(this._angularVelocity as any); //
            }
        }
        /**
         * 该刚体的 OIMO 刚体。
         */
        public get oimoRigidbody(): OIMO.RigidBody {
            if (this._oimoRigidbody === null) {
                this._oimoRigidbody = this._createRigidbody();
                this.syncTransform();
            }

            return this._oimoRigidbody;
        }
    }
}