namespace paper {
    /**
     * 已丢失或不支持的组件数据备份。
     */
    export class MissingComponent extends BaseComponent {
        /**
         * 已丢失或不支持的组件数据。
         */
        @serializedField
        public missingObject: any | null = null;
    }
}
