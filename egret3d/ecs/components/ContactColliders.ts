namespace paper {
    /**
     * 
     */
    export class ContactColliders extends SingletonComponent {
        /**
         * 
         */
        public readonly begin: any[] = [];
        /**
         * 
         */
        public readonly stay: any[] = [];
        /**
         * 
         */
        public readonly end: any[] = [];
        /**
         * @internal
         */
        public clear() {
            this.begin.length = 0;
            this.end.length = 0;
        }
    }
}
