namespace paper.editor {
    export interface IEventDispatcher {
        addEventListener(type: string, fun: Function, thisObj: any): void;
        removeEventListener(type: string, fun: Function, thisObj: any): void;
        dispatchEvent(event: BaseEvent): void
    }
    /**
     * 事件派发器
     */
    export class EventDispatcher implements IEventDispatcher {
        __z_e_listeners: any = {};
        public constructor() {

        }
        addEventListener(type: string, fun: Function, thisObj: any, level: number = 0): void {
            let list: any[] = this.__z_e_listeners[type];
            if (list === undefined) {
                list = [];
                this.__z_e_listeners[type] = list;
            }
            var item = {
                func: fun,
                context: thisObj,
                level: level
            };
            list.push(item);
            list.sort((a, b) => {
                return b.level - a.level;
            });
        }
        removeEventListener(type: string, fun: Function, thisObj: any): void {
            var list = this.__z_e_listeners[type];
            if (list !== undefined) {
                var size = list.length;
                for (var i = 0; i < size; i++) {
                    var obj = list[i];
                    if (obj.func === fun && obj.context === thisObj) {
                        list.splice(i, 1);
                        return;
                    }
                }
            }
        }
        dispatchEvent(event: BaseEvent): void {
            var list = this.__z_e_listeners[event.type];
            if (list !== undefined) {
                list.forEach((ef:any) => {
                    ef['___dirty___'] = true;
                });
                var size = list.length;
                for (var i = 0; i < size; i++) {
                    var ef = list[i];
                    if (ef['___dirty___']) {
                        var fun = ef.func;
                        var context = ef.context;
                        if (context) {
                            fun.call(context, event);
                        } else {
                            fun(event);
                        }
                        ef['___dirty___'] = false;
                    }
                    if (size != list.length) {
                        size = list.length;
                        i = 0;
                    }
                }
            }
        }
    }
    /**
     * 事件
     */
    export class BaseEvent {
        public type: string;
        public data: any;
        public constructor(type: string, data?: any) {
            this.type = type;
            this.data = data;
        }
    }

}
