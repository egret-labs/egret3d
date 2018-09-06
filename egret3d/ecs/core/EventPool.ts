namespace paper {
    /**
     * 组件事件。
     */
    export namespace EventPool {
        /**
         * @internal
         */
        export const enum EventType {
            Enabled = "__enabled__",
            Disabled = "__disabled__",
        }

        /**
         * 事件回调类型
         */
        export type EventListener<T extends BaseComponent> = (component: T, extend?: any) => void;
        const _behaviourComponentType = egret.getQualifiedClassName(Behaviour);
        const _componentListeners: { [componentType: string]: { [eventType: string]: EventListener<any>[] } } = {};

        function _dispatchEvent<T extends BaseComponent>(type: string, componentType: string, component: T, extend?: any) {
            const componentListeners = _componentListeners[componentType];
            if (type in componentListeners) {
                const eventListeners = componentListeners[type];
                for (const listener of eventListeners) {
                    // 监听直接派发，所以监听都应注意 bind 问题。
                    if (extend) {
                        listener(component, extend);
                    }
                    else {
                        listener(component);
                    }
                }
            }
        }

        /**
         * 添加事件监听
         */
        export function addEventListener<T extends BaseComponent>(eventType: string, componentClass: ComponentClass<T>, callback: EventListener<T>) {
            const componentType = egret.getQualifiedClassName(componentClass);
            const componentListeners = componentType in _componentListeners ? _componentListeners[componentType] : _componentListeners[componentType] = {};
            const eventListeners = eventType in componentListeners ? componentListeners[eventType] : componentListeners[eventType] = [];
            eventListeners.push(callback);
        }

        /**
         * 移除事件监听
         */
        export function removeEventListener<T extends BaseComponent>(eventType: string, componentClass: ComponentClass<T>, callback: EventListener<T>) {
            const componentType = egret.getQualifiedClassName(componentClass);
            if (componentType in _componentListeners) {
                const componentListeners = _componentListeners[componentType];
                if (eventType in componentListeners) {
                    const eventListeners = componentListeners[eventType];
                    for (let i = 0, l = eventListeners.length; i < l; i++) {
                        if (eventListeners[i] === callback) {
                            eventListeners.splice(i, 1);
                            break;
                        }
                    }
                }
            }
        }

        /**
         * 移除所有该类型的事件监听
         */
        export function removeAllEventListener<T extends BaseComponent>(eventType: string, componentClass: ComponentClass<T>) {
            const componentType = egret.getQualifiedClassName(componentClass);
            if (componentType in _componentListeners) {
                const componentListeners = _componentListeners[componentType];
                if (eventType) {
                    if (eventType in componentListeners) {
                        componentListeners[eventType].length = 0;
                    }
                }
                else {
                    delete _componentListeners[componentType];
                }
            }
        }

        /**
         * 发送组件事件: 
         * @param type event type:
         * @param component component
         */
        export function dispatchEvent<T extends BaseComponent>(type: string, component: T, extend?: any) {
            // 如果是组件的添加或删除事件，并且该组件派生自 Behaviour 组件，则需要使用基类的组件类型，这些组件发出的添加或删除事件都能被生命周期系统收到。 
            if (type === EventType.Enabled || type === EventType.Disabled) {
                if (egret.is(component, _behaviourComponentType)) {
                    _dispatchEvent(type, _behaviourComponentType, component);
                }
            }

            const componentType = egret.getQualifiedClassName(component);
            if (componentType in _componentListeners) {
                _dispatchEvent(type, componentType, component, extend);
            }
        }
    }
}
