namespace paper.editor {
    /**
     * 状态组
     * @author 杨宁
     */
    export class StateGroup extends BaseState {
        private stateList: BaseState[];
        public static create(stateList: BaseState[]): StateGroup {
            let instance = new StateGroup();
            instance.stateList = stateList;
            return instance;
        }
        public redo(): boolean {
            for (let i: number = 0; i < this.stateList.length; i++) {
                this.stateList[i].redo();
            }
            return true;
        }
        public undo(): boolean {
            for (let i: number = this.stateList.length - 1; i >= 0; i--) {
                this.stateList[i].undo();
            }
            return true;
        }
        public serialize(): any {
            const states: BaseState[] = this.stateList;
            const statesData: any[] = [];
            for (let index = 0; index < states.length; index++) {
                const element = states[index];
                const className = egret.getQualifiedClassName(element);
                const data = {
                    className,
                    batchIndex: element.batchIndex,
                    data: element['serialize'] ? element['serialize']() : element.data,
                    autoClear: element.autoClear,
                    isDone: element.isDone,
                }
                statesData.push(data);
            }
            return states;
        }
        public deserialize(data: any): void {
            this.stateList = [];
            const statesData: any[] = data;
            for (let index = 0; index < statesData.length; index++) {
                const element = statesData[index];
                const clazz = egret.getDefinitionByName(element.className);
                let state: BaseState = null;
                if (clazz) {
                    state = new clazz();
                    state.batchIndex = element.batchIndex;
                    state.data = element['deserialize'] ? element['deserialize'](element.data) : element.data;
                    state.autoClear = element.autoClear;
                    state.isDone = element.isDone;
                    this.stateList.push(state);
                }
            }
        }
    }
}