namespace paper {
    /**
     * 单例组件基类。
     */
    export abstract class SingletonComponent extends BaseComponent {
        /**
         * @internal
         */
        public static readonly __isSingleton: boolean = true;
    }
}