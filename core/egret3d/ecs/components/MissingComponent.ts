namespace paper {
    /**
     * 已丢失或不支持的组件数据备份。
     */
    export class MissingComponent extends BaseComponent {
        @serializedField
        public missingObject: any | null = null;
    }
}
