namespace paper {
    /**
     * 单例组件基类。
     */
    export class SingletonComponent extends BaseComponent {
        /**
         * @internal
         */
        public static readonly _instances: { [key: string]: SingletonComponent } = {};

        public initialize() {
            super.initialize();

            const className = egret.getQualifiedClassName(this);

            if (className in SingletonComponent._instances) {
                console.error("Cannot add singleton component again.", className);
            }
            else {
                SingletonComponent._instances[className] = this;
            }
        }

        public uninitialize() {
            super.uninitialize();

            const className = egret.getQualifiedClassName(this);

            if (className in SingletonComponent._instances && SingletonComponent._instances[className] === this) {
                delete SingletonComponent._instances[className];
            }
        }
    }
}