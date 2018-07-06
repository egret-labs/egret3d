namespace paper {
    /**
     * 单例组件基类。
     */
    export class SingletonComponent extends BaseComponent {
        public initialize() {
            super.initialize();

            if (this.constructor.prototype["instance"]) {
                console.error("Cannot add singleton component again.", egret.getQualifiedClassName(this), this.uuid);
            }
            else {
                this.constructor.prototype["instance"] = this;
            }
        }

        public uninitialize() {
            super.uninitialize();

            if (this.constructor.prototype["instance"] === this) {
                delete this.constructor.prototype["instance"];
            }
        }
    }
}