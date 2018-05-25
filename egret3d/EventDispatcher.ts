namespace egret3d {

    type eventObj = {listener: Function, thisObject: any};
    
    export class EventDispatcher {
        private _eventMap:{[key:string]:eventObj[]} = {};
        public addEventListener(type:string, listener:Function, thisObject:any) {
            var list = this._eventMap[type];

            if(!list) {
                list = this._eventMap[type] = [];
            }

            list.push({listener: listener, thisObject: thisObject || this});
        }
        public removeEventListener(type:string, listener:Function, thisObject:any) {
            var list = this._eventMap[type];

            if(!list) {
                return;
            }

            for(var i = 0, len = list.length; i < len; i++) {
                var bin = list[i];
                if(bin.listener == listener && bin.thisObject == (thisObject || this)) {
                    list.splice(i, 1);
                    break;
                }
            }
        }
        public dispatchEvent(event:any) {
            event.target = this;
            this.notifyListener(event);
        }
        private notifyListener(event:any) {
            var list = this._eventMap[event.type || event];

            if(!list) {
                return;
            }

            for(var i = 0, len = list.length; i < len; i++) {
                var bin = list[i];
                bin.listener.call(bin.thisObject, event);
            }
        }
    }
}