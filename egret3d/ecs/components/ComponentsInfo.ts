namespace paper {
    /**
     * 
     */
    export class ComponentsInfo extends SingletonComponent {
        /**
         * 
         */
        public readonly componentClasses: ReadonlyArray<{ new(): BaseComponent }> = BaseComponent._componentClasses;
        /**
         * 
         */
        public readonly singletonComponents: Readonly<{ [key: string]: SingletonComponent }> = SingletonComponent._instances;
    }
}
