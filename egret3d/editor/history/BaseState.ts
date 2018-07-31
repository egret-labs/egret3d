namespace paper.editor {
    export abstract class BaseState {
        public autoClear: boolean = false;
        public batchIndex: number = 0;
        private _isDone: boolean = false;
        public data:any;

        public undo(): boolean {
            if (this._isDone) {
                this._isDone = false;
                return true;
            }
            return false;
        }

        public redo(): boolean {
            if (this._isDone) {
                return false;
            }
            this._isDone = true;
            return true;
        }

        public get isDone(): boolean {
            return this._isDone;
        }

        public set isDone(value: boolean) {
            this._isDone = value;
        }
        public dispatchEditorModelEvent(type: string, data?: any) {
            Editor.editorModel.dispatchEvent(new EditorModelEvent(type, data));
        }
        public serialize():any{
            return null;
        }
        public deserialize(data:any):void{
        }
    }
}