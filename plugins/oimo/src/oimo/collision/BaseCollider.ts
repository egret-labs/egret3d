namespace egret3d.oimo {

    const enum ValueType {
        CollisionMask,
        Friction,
        Restitution,
        Density,
    }
    /**
     * 基础碰撞体组件。
     * - 全部碰撞体组件的基类。
     */
    @paper.abstract
    export abstract class BaseCollider extends paper.BaseComponent implements egret3d.ICollider {

        protected static readonly _config: OIMO.ShapeConfig = new OIMO.ShapeConfig();

        public readonly colliderType: egret3d.ColliderType = -1;
        /**
         * [CollisionMask, Friction, Restitution, Density];
         */
        @paper.serializedField
        protected readonly _values: Float32Array = new Float32Array([
            paper.Layer.Default, OIMO.Setting.defaultFriction, OIMO.Setting.defaultRestitution, OIMO.Setting.defaultDensity,
        ]);
        protected _oimoShape: OIMO.Shape = null!;

        protected abstract _createShape(): OIMO.Shape;

        protected _updateConfig() {
            const config = BaseCollider._config;
            config.collisionGroup = this.gameObject.layer; // TODO 动态改变
            config.collisionMask = this.collisionMask;
            config.friction = this.friction;
            config.restitution = this.restitution;
            config.density = this.density;

            return config;
        }
        /**
         * 该碰撞体的碰撞掩码。
         */
        @paper.editor.property(paper.editor.EditType.LIST, { listItems: paper.editor.getItemsFromEnum((paper as any).Layer) }) // TODO
        public get collisionMask(): paper.Layer {
            return this._values[ValueType.CollisionMask];
        }
        public set collisionMask(value: paper.Layer) {
            if (this._values[ValueType.CollisionMask] === value) {
                return;
            }

            this._values[ValueType.CollisionMask] = value;

            if (this._oimoShape) {
                this._oimoShape.setCollisionMask(value);
            }
        }
        /**
         * 该碰撞体的摩擦力。
         */
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0 })
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
         * 该碰撞体的恢复系数。
         */
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0, maximum: 1.0 })
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
         * 该碰撞体的密度。
         * - 单位为`千克/立方米`。
         */
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0 })
        public get density(): number {
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
         * 该碰撞体的 OIMO 碰撞体。
         */
        public get oimoShape(): OIMO.Shape {
            if (!this._oimoShape) {
                this._oimoShape = this._createShape();
            }

            return this._oimoShape;
        }
    }
}
