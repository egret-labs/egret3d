namespace paper {
    /**
     * 基础单例组件。
     * - 全部单例组件的基类。
     */
    export abstract class SingletonComponent extends BaseComponent {
        /**
         * @internal
         */
        public static readonly __isSingleton: boolean = true;
    }
}