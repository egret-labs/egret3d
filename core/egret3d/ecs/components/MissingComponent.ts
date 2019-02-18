namespace paper {
    /**
     * 已丢失或不支持的组件数据备份。
     */
    export class MissingComponent extends Component {
        /**
         * 丢失的组件类名
         */
        @editor.property(editor.EditType.TEXT, { readonly: true })
        public get missingClass(): string {
            if (this.missingObject) {
                return this.missingObject.class;
            }

            return "";
        }
        /**
         * 已丢失或不支持的组件数据。
         */
        @serializedField
        public missingObject: any | null = null;
    }
}
