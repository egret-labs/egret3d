namespace egret3d.oimo {
    const enum ValueType {
        CollisionGroup,
        CollisionMask,
        Friction,
        Restitution,
        Density,
    }
    /**
     * 碰撞体基类。
     */
    export abstract class BaseCollider extends paper.BaseComponent implements egret3d.ICollider {
        protected static readonly _config: OIMO.ShapeConfig = new OIMO.ShapeConfig();

        public readonly colliderType: egret3d.ColliderType = -1;
        /**
         * [Type, Mass, LinearDamping, AngularDamping];
         */
        @paper.serializedField
        protected readonly _values: Float32Array = new Float32Array([
            paper.Layer.Everything, paper.Layer.Everything, OIMO.Setting.defaultFriction, OIMO.Setting.defaultRestitution, OIMO.Setting.defaultDensity,
        ]);
        protected _oimoShape: OIMO.Shape = null as any;

        protected abstract _createShape(): OIMO.Shape;

        protected _updateConfig() {
            const config = BaseCollider._config;
            config.collisionGroup = this.collisionGroup;
            config.collisionMask = this.collisionMask;
            config.friction = this.friction;
            config.restitution = this.restitution;
            config.density = this.density;

            return config;
        }
        /**
         * 
         */
        public get collisionGroup() {
            return this._values[ValueType.CollisionGroup];
        }
        public set collisionGroup(value: paper.CullingMask) {
            if (this._values[ValueType.CollisionGroup] === value) {
                return;
            }

            this._values[ValueType.CollisionGroup] = value;

            if (this._oimoShape) {
                this._oimoShape.setCollisionGroup(value);
            }
        }
        /**
         * 
         */
        public get collisionMask() {
            return this._values[ValueType.CollisionMask];
        }
        public set collisionMask(value: paper.CullingMask) {
            if (this._values[ValueType.CollisionMask] === value) {
                return;
            }

            this._values[ValueType.CollisionMask] = value;

            if (this._oimoShape) {
                this._oimoShape.setCollisionMask(value);
            }
        }
        /**
         * 
         */
        public get friction() {
            return this._values[ValueType.Friction];
        }
        public set friction(value: number) {
            if (this._values[ValueType.Friction] === value) {
                return;
            }

            this._values[ValueType.Friction] = value;

            if (this._oimoShape) {
                this._oimoShape.setFriction(value);
            }
        }
        /**
         * 
         */
        public get restitution() {
            return this._values[ValueType.Restitution];
        }
        public set restitution(value: number) {
            if (this._values[ValueType.Restitution] === value) {
                return;
            }

            this._values[ValueType.Restitution] = value;

            if (this._oimoShape) {
                this._oimoShape.setRestitution(value);
            }
        }
        /**
         * 
         */
        public get density() {
            return this._values[ValueType.Density];
        }
        public set density(value: number) {
            if (this._values[ValueType.Density] === value) {
                return;
            }

            this._values[ValueType.Density] = value;

            if (this._oimoShape) {
                this._oimoShape.setDensity(value);
            }
        }
        /**
         * 
         */
        public get oimoShape() {
            if (!this._oimoShape) {
                this._oimoShape = this._createShape();
            }

            return this._oimoShape;
        }
    }
}