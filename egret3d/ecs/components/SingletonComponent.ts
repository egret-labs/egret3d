namespace paper {
    /**
     * 单例组件基类。
     */
    export class SingletonComponent extends BaseComponent {
        /**
         * 
         */
        public static instance: SingletonComponent = null as any;

        public initialize() {
            super.initialize();

            if (!(this.constructor as SingletonComponentClass<SingletonComponent>).instance) {
                (this.constructor as SingletonComponentClass<SingletonComponent>).instance = this;
            }
            else {
                console.error("Cannot add singleton component again.", egret.getQualifiedClassName(this));
            }
        }

        public uninitialize() {
            super.uninitialize();

            if ((this.constructor as SingletonComponentClass<SingletonComponent>).instance === this) {
                (this.constructor as SingletonComponentClass<SingletonComponent>).instance = null as any;
            }
        }
    }
}