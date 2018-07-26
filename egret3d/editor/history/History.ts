namespace paper.editor {
    export type EventData = { isUndo: boolean };

    export const EventType = {
        HistoryState: "HistoryState",
        HistoryAdd: "HistoryAdd",
        HistoryFree: "HistoryFree"
    };

    export class History {
        public dispatcher: EventDispatcher | null = null;
        private _locked: 0 | 1 | 2 | 3 = 0;
        private _index: number = -1;
        private _batchIndex: number = 0;
        private _states: BaseState[] = [];
        private _batchStates: BaseState[] = [];
        private _events: EventData[] = [];

        private _free(): void {
            if (this._states.length > this._index + 1) {
                this._states.length = this._index + 1; // TODO release.
                if (this.dispatcher) {
                    this.dispatcher.dispatchEvent(new BaseEvent(EventType.HistoryFree, null));
                }
            }
        }

        private _doState(state: BaseState, isUndo: boolean): boolean {
            if (isUndo) {
                state.undo();
            }
            else {
                state.redo();
            }
            let d = isUndo ? "undo" : "redo";
            if (this.dispatcher) {
                const data = { isUndo: isUndo };
                this._events.push(data);
            }
            return state.batchIndex > 0 && (isUndo ? this._index >= 0 : this._index < this._states.length - 1);
        }

        public back(): boolean {
            if (this._index < 0 || this._batchIndex > 0) {
                return false;
            }
            this._locked |= 1;
            while (this._doState(this._states[this._index--], true)) {
            }
            if (this.dispatcher && this._events.length > 0) {
                for (const event of this._events) {
                    this.dispatcher.dispatchEvent(new BaseEvent(EventType.HistoryState, event));
                }
                this._events.length = 0;
            }
            this._locked &= 2;
            return true;
        }

        public forward(): boolean {
            if (this._index >= this._states.length - 1 || this._batchIndex > 0) {
                return false;
            }
            this._locked |= 1;
            while (this._doState(this._states[++this._index], false)) {
            }
            if (this.dispatcher && this._events.length > 0) {
                for (const event of this._events) {
                    this.dispatcher.dispatchEvent(new BaseEvent(EventType.HistoryState, event));
                }
                this._events.length = 0;
            }
            this._locked &= 2;
            return true;
        }

        public go(index: number): boolean {
            if (this._batchIndex > 0) {
                return false;
            }
            let result = false;
            if (this._index < index) {
                while (this._index !== index && this.forward()) {
                    result = true;
                }
            }
            else {
                while (this._index !== index && this.back()) {
                    result = true;
                }
            }
            return result;
        }

        public add(state: BaseState): void {
            if (this._locked !== 0) {
                return;
            }
            if (this._batchIndex > 0) {
                state.batchIndex = this._batchIndex;
                this._batchStates.push(state);
            }
            else {
                this._states[this._index + 1] = state;
                if (this.dispatcher !== null) {
                    this.dispatcher.dispatchEvent(new BaseEvent(EventType.HistoryAdd, event));
                }
                this.forward();
                this._free();
            }
        }

        public beginBatch(): void {
            this._batchIndex++;
        }

        public endBatch(): void {
            if (this._batchIndex === 0) {
                return;
            }
            this._batchIndex--;
            if (this._batchIndex === 0) {
                let index = this._index + 1;
                for (const state of this._batchStates) {
                    this._states[index++] = state;
                }
                if (this.dispatcher !== null) {
                    this.dispatcher.dispatchEvent(new BaseEvent(EventType.HistoryAdd, event));
                }
                this._batchStates.length = 0;
                this.go(this._states.length - 1);
            }
        }

        public getState(index: number): BaseState | null {
            return this._states[index];
        }

        public get enabled(): boolean {
            return this._locked === 0;
        }
        public set enabled(value: boolean) {
            if (value) {
                this._locked &= 1;
            }
            else {
                this._locked |= 2;
            }
        }

        public get count(): number {
            return this._states.length;
        }

        public get index(): number {
            return this._index;
        }

        public get batchIndex(): number {
            return this._batchIndex;
        }

        public get locked(): 0 | 1 | 2 | 3 {
            return this._locked;
        }

        public get states(): BaseState[] {
            return this._states;
        }

        public serialize(): any {
            const states: BaseState[] = this.states;
            const statesData: any[] = [];
            for (let index = 0; index < states.length; index++) {
                const element = states[index];
                const className = egret.getQualifiedClassName(element);
                const data = {
                    className,
                    batchIndex: element.batchIndex,
                    data: (element as Object).hasOwnProperty('deserialize') ? element['serialize']() : element.data,
                    autoClear: element.autoClear,
                    isDone: element.isDone,
                }
                statesData.push(data);
            }
            const serializeHistory = {
                index: this.index,
                batchIndex: this.batchIndex,
                locked: this.locked,
                statesData,
            }
            return serializeHistory;
        }

        public deserialize(serializeHistory: any): void {
            const states: BaseState[] = [];
            const statesData: any[] = serializeHistory.statesData;
            for (let index = 0; index < statesData.length; index++) {
                const element = statesData[index];
                const clazz = egret.getDefinitionByName(element.className);
                let state: BaseState = null;
                if (clazz) {
                    state = new clazz();
                    state.batchIndex = element.batchIndex;
                    state.data = (element as Object).hasOwnProperty('deserialize') ? element['deserialize'](element.data) : element.data;
                    state.autoClear = element.autoClear;
                    state.isDone = element.isDone;
                    states.push(state);
                }
            }
            const initData = {
                states,
                index: serializeHistory.index,
                batchIndex: serializeHistory.batchIndex,
                locked: serializeHistory.locked,
            }
            this._index = initData ? initData.index : -1;
            this._locked = initData ? initData.locked : 0;
            this._batchIndex = initData ? initData.batchIndex : 0;
            this._states = initData ? initData.states : [];
        }

    }
}