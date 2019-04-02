// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
// Type definitions for JS-Signals 1.0
// Project: http://millermedeiros.github.io/js-signals/
// Definitions by: Diullei Gomes <https://github.com/diullei>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var signals: signals.SignalWrapper;

declare namespace signals {
    interface SignalWrapper<T = any> {
        Signal: Signal<T>;
    }

    interface SignalBinding<T = any> {
        active: boolean;
        context: any;
        params: any;
        detach(): Function;
        execute(paramsArr?: any[]): any;
        getListener(): (...params: T[]) => void;
        getSignal(): Signal<T>;
        isBound(): boolean;
        isOnce(): boolean;
    }

    interface Signal<T = any> {
        /**
         * Custom event broadcaster
         * <br />- inspired by Robert Penner's AS3 Signals.
         * @author Miller Medeiros
         */
        new (): Signal<T>;

        /**
         * If Signal is active and should broadcast events.
         */
        active: boolean;

        /**
         * If Signal should keep record of previously dispatched parameters and automatically
         * execute listener during add()/addOnce() if Signal was already dispatched before.
         */
        memorize: boolean;

        /**
         * Signals Version Number
         */
        VERSION: string;

        /**
         * Add a listener to the signal.
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *        Listeners with higher priority will be executed before listeners with lower priority.
         *        Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        add(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         *
         * @param listener Signal handler function.
         * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param priority The priority level of the event listener.
         *                 Listeners with higher priority will be executed before listeners with lower priority.
         *                 Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         */
        addOnce(listener: (...params: T[]) => void, listenerContext?: any, priority?: Number): SignalBinding<T>;

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         *
         * @param params Parameters that should be passed to each handler.
         */
        dispatch(...params: T[]): void;

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         */
        dispose(): void;

        /**
         * Forget memorized arguments.
         */
        forget(): void;

        /**
         * Returns a number of listeners attached to the Signal.
         */
        getNumListeners(): number;

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         */
        halt(): void;

        /**
         * Check if listener was attached to Signal.
         */
        has(listener: (...params: T[]) => void, context?: any): boolean;

        /**
         * Remove a single listener from the dispatch queue.
         */
        remove(listener: (...params: T[]) => void, context?: any): Function;

        removeAll(): void;
    }
}
declare type int = number;
declare type uint = number;
declare type float = number;
declare namespace paper {
    /**
     *
     */
    const enum HideFlags {
        /**
         *
         */
        None = 0,
        /**
         *
         */
        NotEditable = 1,
        /**
         *
         */
        NotTouchable = 2,
        /**
         *
         */
        DontSave = 4,
        /**
         *
         */
        Hide = 10,
        /**
         *
         */
        HideAndDontSave = 14,
    }
    /**
     *
     */
    const enum DefaultNames {
        NoName = "NoName",
        Default = "Default",
        Global = "Global",
        MainCamera = "Main Camera",
        EditorCamera = "Editor Camera",
        Editor = "Editor",
        MissingPrefab = "Missing Prefab",
    }
    /**
     * 默认标识和自定义标识。
     */
    const enum DefaultTags {
        Untagged = "Untagged",
        Respawn = "Respawn",
        Finish = "Finish",
        EditorOnly = "EditorOnly",
        MainCamera = "MainCamera",
        Player = "Player",
        GameController = "GameController",
        Global = "Global",
    }
    /**
     * 内置层级和自定义层级。
     */
    const enum Layer {
        Nothing = 0,
        Everything = 4294967295,
        BuiltinLayer0 = 1,
        BuiltinLayer1 = 2,
        BuiltinLayer2 = 4,
        BuiltinLayer3 = 8,
        BuiltinLayer4 = 16,
        BuiltinLayer5 = 32,
        BuiltinLayer6 = 64,
        BuiltinLayer7 = 128,
        UserLayer8 = 256,
        UserLayer9 = 512,
        UserLayer10 = 1024,
        UserLayer11 = 2048,
        UserLayer12 = 4096,
        UserLayer13 = 8192,
        UserLayer14 = 16384,
        UserLayer15 = 32768,
        UserLayer16 = 65536,
        UserLayer17 = 131072,
        UserLayer18 = 262144,
        UserLayer19 = 524288,
        UserLayer20 = 1048576,
        UserLayer21 = 2097152,
        UserLayer22 = 4194304,
        UserLayer23 = 8388608,
        UserLayer24 = 16777216,
        UserLayer25 = 33554432,
        UserLayer26 = 67108864,
        UserLayer27 = 134217728,
        UserLayer28 = 268435456,
        UserLayer29 = 536870912,
        UserLayer30 = 1073741824,
        UserLayer31 = 2147483648,
        Default = 1,
        TransparentFX = 2,
        IgnoreRayCast = 4,
        Water = 16,
        UI = 32,
        Editor = 64,
        EditorUI = 128,
        Postprocessing = 256,
    }
    /**
     * 系统排序。
     */
    const enum SystemOrder {
        Begin = 0,
        Enable = 1000,
        Start = 2000,
        FixedUpdate = 3000,
        Update = 4000,
        Animation = 5000,
        LateUpdate = 6000,
        BeforeRenderer = 7000,
        Renderer = 8000,
        Disable = 9000,
        End = 10000,
    }
    /**
     * 应用程序运行模式。
     */
    const enum PlayerMode {
        /**
         *
         */
        Player = 1,
        /**
         *
         */
        DebugPlayer = 2,
        /**
         *
         */
        Editor = 4,
    }
    /**
     *
     */
    type EntityExtras = {
        linkedID?: string;
        rootID?: string;
        prefab?: Prefab;
    };
    /**
     *
     */
    type ComponentExtras = {
        linkedID?: string;
    };
    /**
     * @private
     */
    interface IUUID {
        /**
         * 对象的唯一标识。
         * @readonly
         */
        readonly uuid: string;
    }
    /**
     *
     */
    interface IAssetReference {
        /**
         *
         */
        readonly asset: int;
    }
    /**
     *
     */
    interface IClass {
        /**
         *
         */
        readonly class: string;
    }
    /**
     *
     */
    interface ICCS<T extends ICCS<T>> {
        /**
         * 克隆。
         */
        clone(): T;
        /**
         * 拷贝。
         */
        copy(value: Readonly<T>): T;
        /**
         * 设置。
         */
        set(...args: any[]): T;
    }
    /**
     *
     */
    interface ISerializedObject extends IUUID, IClass {
        [key: string]: any | IUUID | IAssetReference;
    }
    /**
     *
     */
    interface ISerializedStruct extends IClass {
        [key: string]: any | IUUID | IAssetReference;
    }
    /**
     * 序列化数据接口。
     */
    interface ISerializedData {
        /**
         *
         */
        version?: string;
        /**
         *
         */
        compatibleVersion?: string;
        /**
         * 所有资源。
         */
        readonly assets?: string[];
        /**
         * 所有实体。（至多含一个场景）
         */
        readonly objects?: ISerializedObject[];
        /**
         * 所有组件。
         */
        readonly components?: ISerializedObject[];
    }
    /**
     * 序列化接口。
     */
    interface ISerializable {
        /**
         * 序列化。
         * @returns 序列化后的数据。
         */
        serialize(): any;
        /**
         * 反序列化。
         * @param data 反序列化数据。
         * @param deserializer Deserializer。
         * @returns 反序列化后的数据。
         */
        deserialize(data: any, deserializer?: Deserializer): this | any;
    }
    /**
     * 基础对象类接口。
     * - 仅用于约束基础对象的装饰器。
     */
    interface IBaseClass extends Function {
    }
    /**
     * 实体类接口。
     * - 仅用于约束实体类传递。
     */
    interface IEntityClass<TEntity extends IEntity> {
        /**
         * 禁止实例化实体。
         * @protected
         */
        new (): TEntity;
    }
    /**
     * 组件类接口。
     * - 仅用于约束组件类传递。
     */
    interface IComponentClass<TComponent extends IComponent> extends IBaseClass {
        /**
         * 该组件是否在编辑模式拥有生命周期。
         */
        readonly executeInEditMode: boolean;
        /**
         * 是否允许在同一实体上添加多个该组件。
         */
        readonly allowMultiple: boolean;
        /**
         * 该组件依赖的其他前置组件。
         */
        readonly requireComponents: IComponentClass<IComponent>[] | null;
        /**
         * 该组件是否为抽象组件。
         */
        readonly isAbstract: IComponentClass<IComponent>;
        /**
         * 该组件是否为单例组件。
         */
        readonly isSingleton: boolean;
        /**
         * 该组件是否为 Behaviour 组件。
         */
        readonly isBehaviour: boolean;
        /**
         * 该组件索引。
         */
        readonly componentIndex: int;
        /**
         * 禁止实例化组件。
         * @protected
         */
        new (): TComponent;
    }
    /**
     * 系统类接口。
     */
    interface ISystemClass<TSystem extends ISystem<TEntity>, TEntity extends IEntity> {
        /**
         * 该系统允许运行的模式。
         */
        readonly executeMode: PlayerMode;
        /**
         * 禁止实例化系统。
         * @protected
         */
        new (...args: any[]): TSystem;
    }
    /**
     * 实体接口。
     */
    interface IEntity extends IUUID {
        /**
         * 该实体是否已经被销毁。
         */
        readonly isDestroyed: boolean;
        /**
         * 该实体的激活状态。
         */
        enabled: boolean;
        /**
         * 该实体是否可以被销毁。
         * - 当此值为 `true` 时，将会被添加到全局场景，反之将被添加到激活场景。
         * - 设置此属性时，可能改变该实体的父级。
         */
        dontDestroy: boolean;
        /**
         * 该实体的名称。
         */
        name: string;
        /**
         * 该实体的标签。
         */
        tag: DefaultTags | string;
        /**
         *
         */
        hideFlags: HideFlags;
        /**
         * 该实体已经添加的全部组件。
         */
        readonly components: ReadonlyArray<IComponent>;
        /**
         * 该实体所属的场景。
         */
        scene: IScene;
        /**
         * 仅保存在编辑器环境的额外数据，项目发布该数据将被移除。
         */
        extras?: EntityExtras;
        /**
         * 实体内部初始化时执行。
         * - 重写此方法时，必须调用 `super.initialize()`。
         */
        initialize(): void;
        /**
         * 实体内部卸载时执行。
         * - 重写此方法时，必须调用 `super.uninitialize()`。
         */
        uninitialize(): void;
        /**
         * 销毁该实体。
         */
        destroy(): boolean;
        /**
         * 添加一个指定组件实例。
         * @param componentClass 组件类。
         * @param config BaseComponent 组件 `initialize(config?: any)` 方法或 Behaviour 组件 `onAwake(config?: any)` 方法的可选参数。
         */
        addComponent<T extends IComponent>(componentClass: IComponentClass<T>, config?: any): T;
        /**
         * 移除一个指定组件实例。
         * @param componentInstanceOrClass 组件类或组件实例。
         * @param isExtends 是否尝试移除全部派生自此组件的实例。
         */
        removeComponent<T extends IComponent>(componentInstanceOrClass: IComponentClass<T> | T, isExtends?: boolean): boolean;
        /**
         * 移除全部指定组件的实例。
         * - 通常只有该组件类允许同一个实体添加多个组件实例时才需要此操作。
         * @param componentClass 组件类。
         * @param isExtends 是否尝试移除全部派生自此组件的实例。
         */
        removeAllComponents<T extends IComponent>(componentClass?: IComponentClass<T>, isExtends?: boolean): boolean;
        /**
         * 从该实体已注册的全部组件中获取一个指定组件实例，如果未添加该组件，则添加该组件。
         * @param componentClass 组件类。
         * @param isExtends 是否尝试获取全部派生自此组件的实例。
         */
        getOrAddComponent<T extends IComponent>(componentClass: IComponentClass<T>, isExtends?: boolean): T;
        /**
         * 获取一个指定组件实例。
         * @param componentClass 组件类。
         * @param isExtends 是否尝试获取全部派生自此组件的实例。
         */
        getComponent<T extends IComponent>(componentClass: IComponentClass<T>, isExtends?: boolean): T | null;
        /**
         * 获取全部指定组件实例。
         * @param componentClass 组件类。
         * @param isExtends 是否尝试获取全部派生自此组件的实例。
         */
        getComponents<T extends IComponent>(componentClass: IComponentClass<T>, isExtends?: boolean): T[];
        /**
         *
         * @param componentClasses
         */
        hasComponents(componentClasses: IComponentClass<IComponent>[], componentEnabled: boolean): boolean;
        /**
         *
         * @param componentClasses
         */
        hasAnyComponents(componentClasses: IComponentClass<IComponent>[], componentEnabled: boolean): boolean;
    }
    /**
     * 组件接口。
     */
    interface IComponent extends IUUID {
        /**
         * 该组件是否已经被销毁。
         */
        readonly isDestroyed: boolean;
        /**
         * 该组件自身的激活状态。
         */
        enabled: boolean;
        /**
         * 该组件全局的激活状态。
         */
        readonly isActiveAndEnabled: boolean;
        /**
         *
         */
        hideFlags: HideFlags;
        /**
         * 该组件的实体。
         */
        readonly entity: IEntity;
        /**
         * 仅保存在编辑器环境的额外数据，项目发布该数据将被移除。
         */
        extras?: ComponentExtras;
        /**
         * 组件被添加后，内部初始化时执行。
         * - 重写此方法时，必须调用 `super.initialize()`。
         * @param config 实体添加该组件时可以传递的初始化数据。（注意：如果添加该组件时，实体未处于激活状态，则该属性无效）
         */
        initialize(config?: any): void;
        /**
         * 组件被移除后，内部卸载时执行。
         * - 重写此方法时，必须调用 `super.uninitialize()`。
         */
        uninitialize(): void;
        /**
         *
         */
        dispatchEnabledEvent(enabled: boolean): void;
    }
    /**
     * 系统接口。
     */
    interface ISystem<TEntity extends IEntity> {
        /**
         * 该系统是否被激活。
         */
        enabled: boolean;
        /**
         * 该系统的执行顺序。
         */
        readonly order: SystemOrder;
        /**
         * 该系统在调试模式时每帧消耗的时间，仅用于性能统计。（以毫秒为单位）
         */
        readonly deltaTime: uint;
        /**
         *
         */
        readonly groups: ReadonlyArray<Group<TEntity>>;
        /**
         *
         */
        readonly collectors: ReadonlyArray<Collector<TEntity>>;
        /**
         * 该系统初始化时调用。
         * @param config 该系统被注册时可以传递的初始化数据。
         */
        onAwake?(config?: any): void;
        /**
         * 该系统被激活时调用。
         * @see paper.BaseSystem#enabled
         */
        onEnable?(): void;
        /**
         * 该系统开始运行时调用。
         */
        onStart?(): void;
        /**
         * 充分非必要组件从实体移除时调用。
         * @param component 移除的实体组件。
         * @param group 移除实体组件的实体组。
         */
        onComponentRemoved?(component: IComponent, group: Group<TEntity>): void;
        /**
         * 实体从系统移除时调用。
         * @param entity 移除的实体。
         * @param group 移除实体的实体组。
         */
        onEntityRemoved?(entity: TEntity, group: Group<TEntity>): void;
        /**
         * 实体被添加到系统时调用。
         * @param entity 收集的实体。
         * @param group 收集实体的实体组。
         */
        onEntityAdded?(entity: TEntity, group: Group<TEntity>): void;
        /**
         * 充分非必要组件添加到实体时调用。
         * @param component 收集的实体组件。
         * @param group 收集实体组件的实体组。
         */
        onComponentAdded?(component: IComponent, group: Group<TEntity>): void;
        /**
         * 生成一个新的逻辑帧时调用
         * @param deltaTime 上一逻辑帧到此帧流逝的时间。（以秒为单位）
         */
        onTick?(deltaTime?: float): void;
        /**
         * 在新的逻辑帧的清理阶段调用
         * @param deltaTime 上一逻辑帧到此帧流逝的时间。（以秒为单位）
         */
        onTickCleanup?(deltaTime?: float): void;
        /**
         * 生成一个新的渲染帧时调用
         * @param deltaTime 上一帧到此帧流逝的时间。（以秒为单位）
         */
        onFrame?(deltaTime?: float): void;
        /**
         * 在新的渲染帧的清理阶段调用
         * @param deltaTime 上一渲染帧到此帧流逝的时间。（以秒为单位）
         */
        onFrameCleanup?(deltaTime?: float): void;
        /**
         * 该系统被禁用时调用。
         * @see paper.BaseSystem#enabled
         */
        onDisable?(): void;
        /**
         * 该系统被注销时调用。
         * @see paper.SystemManager#unregister()
         * @see paper.Application#systemManager
         */
        onDestroy?(): void;
    }
    /**
     * 实体组件匹配器接口。
     */
    interface IMatcher<TEntity extends IEntity> {
        /**
         * 该匹配器是否以组件的激活状态做为匹配条件。
         * - 默认为 `true`。
         */
        readonly componentEnabledFilter: boolean;
        /**
         * 该匹配器的唯一标识。
         */
        readonly id: string;
        /**
         * 该匹配器的全部组件。
         */
        readonly components: ReadonlyArray<IComponentClass<IComponent>>;
        /**
         * 指定的实体是否与该匹配器的规则相匹配。
         * @param entity 指定的实体。
         */
        matches(entity: TEntity, component: IComponentClass<IComponent> | null, isAdd: boolean, isAdded: boolean): -2 | -1 | 0 | 1 | 2;
    }
    /**
     *
     */
    interface ICompoundMatcher<TEntity extends IEntity> extends IMatcher<TEntity> {
        /**
         * 必须包含的全部组件。
         */
        readonly allOfComponents: ReadonlyArray<IComponentClass<IComponent>>;
        /**
         * 必须包含的任一组件。
         */
        readonly anyOfComponents: ReadonlyArray<IComponentClass<IComponent>>;
        /**
         * 不能包含的任一组件。
         */
        readonly noneOfComponents: ReadonlyArray<IComponentClass<IComponent>>;
        /**
         * 可以包含的任一组件。
         */
        readonly extraOfComponents: ReadonlyArray<IComponentClass<IComponent>>;
    }
    /**
     * 不能包含任一组件的匹配器接口。
     */
    interface INoneOfMatcher<TEntity extends IEntity> extends ICompoundMatcher<TEntity> {
        /**
         * 设置可以包含的任一组件。
         * @param componentClasses 可以包含的任一组件。
         */
        extraOf(...componentClasses: IComponentClass<IComponent>[]): INoneOfMatcher<TEntity>;
    }
    /**
     * 必须包含任一组件的匹配器接口。
     */
    interface IAnyOfMatcher<TEntity extends IEntity> extends INoneOfMatcher<TEntity> {
        /**
         * 设置不能包含的任一组件。
         * @param componentClasses 不能包含的任一组件。
         */
        noneOf(...componentClasses: IComponentClass<IComponent>[]): INoneOfMatcher<TEntity>;
    }
    /**
     * 必须包含全部组件的匹配器接口。
     */
    interface IAllOfMatcher<TEntity extends IEntity> extends IAnyOfMatcher<TEntity> {
        /**
         * 设置必须包含的任一组件。
         * @param componentClasses 必须包含的任一组件。
         */
        anyOf(...componentClasses: IComponentClass<IComponent>[]): IAnyOfMatcher<TEntity>;
    }
    /**
     * 场景接口。
     */
    interface IScene extends IUUID {
        /**
         * 该场景是否已经被销毁。
         */
        readonly isDestroyed: boolean;
        /**
         * 该场景的实体总数。
         */
        readonly entityCount: uint;
        /**
         * 该场景的名称。
         */
        name: string;
        /**
         * 该场景的全部实体。
         */
        readonly entities: ReadonlyArray<IEntity>;
        /**
         * 场景内部初始化时执行。
         */
        initialize(): void;
        /**
         * 场景内部卸载时执行。
         */
        uninitialize(): void;
        /**
         * 销毁该场景。
         */
        destroy(): boolean;
        /**
         * 该场景是否包含指定实体。
         */
        containsEntity(entity: IEntity): boolean;
        /**
         * 通过实体名称获取该场景的一个实体。
         */
        find(name: string): IEntity | null;
    }
    /**
     *
     */
    interface RunOptions {
        /**
         *
         */
        playerMode?: PlayerMode;
        /**
         * 编辑器覆盖整个程序入口。
         */
        editorEntry?: string;
        /**
         * 程序启动后需要显示调用的入口。
         */
        entry?: string;
        /**
         * 程序启动后加载的入口场景。
         */
        scene?: string;
        /**
         * 逻辑帧频率, 单位为(帧/秒), 例如设置为 60 为每秒 60 帧
         */
        tickRate?: uint;
        /**
         * 渲染帧频率, 单位为(帧/秒), 例如设置为 60 为每秒 60 帧
         */
        frameRate?: uint;
        /**
         * 是否显示状态面板。
         * - 未设置则默认为 PC 模式显示，手机模式不显示。
         * - 包含 FPS、TPS、内存消耗、渲染耗时、DrawCall 等。
         */
        showStats?: boolean;
        /**
         * 是否显示 Inspector 面板。
         * - 未设置则默认为 PC 模式显示，手机模式不显示。
         */
        showInspector?: boolean;
        /**
         * 可扩展的。
         */
        [key: string]: any;
    }
}
declare namespace paper {
    /**
     * 通过装饰器标记序列化属性。
     * @param classPrototype 类原型。
     * @param key 键值。
     */
    function serializedField(classPrototype: any, key: string): void;
    /**
     * 通过装饰器标记序列化属性。
     * @param oldKey 兼容旧序列化键值。
     */
    function serializedField(oldKey: string): Function;
    /**
     * 通过装饰器标记反序列化时需要忽略的属性。
     * @param classPrototype 类原型。
     * @param key 键值。
     */
    function deserializedIgnore(classPrototype: any, key: string): void;
    /**
     * 通过装饰器标记组件是否为抽象组件。
     * @param componentClass 组件类。
     */
    function abstract(componentClass: any): void;
    /**
     * 通过装饰器标记组件是否为单例组件。
     * @param componentClass 组件类。
     */
    function singleton(componentClass: IComponentClass<IComponent>): void;
    /**
     * 通过装饰器标记组件允许在同一实体上添加多个实例。
     * - 实体上允许添加相同的组件对实体组件系统并不友好，所以通常不要这么做。
     * @param componentClass 组件类。
     */
    function allowMultiple(componentClass: IComponentClass<IComponent>): void;
    /**
     * 通过装饰器标记脚本组件是否在编辑模式也拥有生命周期。
     * @param componentClass 组件类。
     */
    function executeInEditMode(componentClass: IComponentClass<Behaviour>): void;
    /**
     * 通过装饰器标记组件依赖的其他组件。
     * @param requireComponentClass 依赖的组件类。
     */
    function requireComponent(requireComponentClass: IComponentClass<IComponent>): (componentClass: IComponentClass<IComponent>) => void;
    /**
     * 通过装饰器标记系统在哪些模式可以被执行。
     * @param executeMode 系统可以被运行的模式。
     */
    function executeMode(executeMode: PlayerMode): (systemClass: ISystemClass<ISystem<IEntity>, IEntity>) => void;
    /**
     * 通过装饰器标记 API 已被废弃。
     * @param version 废弃的版本。
     */
    function deprecated(version: string): (target: any, key: string, descriptor: PropertyDescriptor) => void;
}
declare namespace paper {
    /**
     * 生成 uuid 的方式。
     * @private
     */
    let createUUID: () => string;
    /**
     * 可以被 paper.DisposeCollecter 收集，并在此帧末尾释放的基础对象。
     */
    abstract class BaseRelease<T extends BaseRelease<T>> {
        /**
         *
         */
        onUpdateTarget?: any;
        /**
         * 是否已被释放。
         * - 将对象从对象池取出时，需要设置此值为 `false`。
         */
        protected _released?: boolean;
        /**
         * 更新该对象，使得该对象的 `onUpdate()` 被执行。
         */
        update(): this;
        /**
         * 在此帧末尾释放该对象。
         * - 释放该对象后，必须清除所有对该对象的显示引用。（该问题必须引起足够的重视）
         * - 不能在静态解释阶段执行。
         */
        release(): this;
        /**
         *
         */
        onUpdate?(object: T): void;
        /**
         * 在此帧末尾释放时调用。
         */
        onClear?(): void;
    }
    /**
     * 基础对象。
     */
    abstract class BaseObject implements IUUID {
        uuid: string;
    }
}
declare namespace paper.editor {
    /**
     * 属性信息。
     */
    class PropertyInfo {
        /**
         * 属性名称。
         */
        name: string;
        /**
         * 编辑类型。
         */
        editType: EditType;
        /**
         * 属性配置。
         */
        option?: PropertyOption;
        constructor(name: string, editType: EditType, option?: PropertyOption);
    }
    /**
     * 下拉列表项。
     */
    type ListItem = {
        label: string;
        value: any;
    };
    /**
     * 属性配置。
     */
    type PropertyOption = {
        readonly?: boolean;
        /**
         * UINT, INT, FLOAT 类型的最小值。
         */
        minimum?: number;
        /**
         * UINT, INT, FLOAT 类型的最大值。
         */
        maximum?: number;
        /**
         * UINT, INT, FLOAT 类型的步进值。
         */
        step?: number;
        /**
         * UINT, INT, FLOAT 类型的数值精度。 TODO
         */
        precision?: number;
        /**
         * 赋值函数
         */
        set?: string;
        /**
         *
         */
        componentClass?: IComponentClass<IComponent> | string;
        /**
         * 下拉项。
         */
        listItems?: ListItem[] | string | ((value: any) => ListItem[]);
    };
    /**
     * 编辑类型。
     */
    const enum EditType {
        /**
         * 选中框。
         */
        CHECKBOX = "CHECKBOX",
        /**
         * 正整数。
         */
        UINT = "UINT",
        /**
         * 整数。
         */
        INT = "INT",
        /**
         * 浮点数。
         */
        FLOAT = "FLOAT",
        /**
         * 文本。
         */
        TEXT = "TEXT",
        /**
         * 下拉列表。
         */
        LIST = "LIST",
        /**
         * 数组。
         */
        ARRAY = "ARRAY",
        /**
         * 尺寸。
         */
        SIZE = "SIZE",
        /**
         * 矩形。
         */
        RECT = "RECT",
        /**
         * 二维向量。
         */
        VECTOR2 = "VECTOR2",
        /**
         * 三维向量。
         */
        VECTOR3 = "VECTOR3",
        /**
         * 四维向量。
         */
        VECTOR4 = "VECTOR4",
        /**
         * 四元数。
         */
        QUATERNION = "QUATERNION",
        /**
         * 颜色选择器。
         */
        COLOR = "COLOR",
        /**
         * 着色器。
         */
        SHADER = "SHADER",
        /**
         * 材质。
         */
        MATERIAL = "MATERIAL",
        /**
         * 材质数组。
         */
        MATERIAL_ARRAY = "MATERIAL_ARRAY",
        /**
         * 贴图纹理。
         */
        TEXTUREDESC = "TEXTUREDESC",
        /**
         * 网格。
         */
        MESH = "MESH",
        /**
         * 实体。
         */
        GAMEOBJECT = "GAMEOBJECT",
        /**
         * 组件。
         */
        COMPONENT = "COMPONENT",
        /**
         * 声音。
         */
        SOUND = "SOUND",
        /**
         * 按钮。
         */
        BUTTON = "BUTTON",
        /**
         * 3x3 矩阵。
         */
        MAT3 = "MAT3",
        /**
         * 内嵌的。
         */
        NESTED = "NESTED",
        /**变换 TODO remove*/
        TRANSFROM = "TRANSFROM",
    }
    /**
     * 自定义装饰器。
     */
    function custom(): (target: any) => void;
    /**
     * 属性装饰器。
     * @param editType 编辑类型。
     * @param option 配置。
     */
    function property(editType?: EditType, option?: PropertyOption): (target: any, property: string) => void;
    /**
     * 从枚举中生成装饰器列表项。
     */
    function getItemsFromEnum(enumObject: any): {
        label: string;
        value: any;
    }[];
}
declare namespace egret3d {
    /**
     * 二维向量接口。
     */
    interface IVector2 {
        /**
         * X 轴分量。
         */
        x: float;
        /**
         * Y 轴分量。
         */
        y: float;
    }
    /**
     * 二维向量。
     */
    class Vector2 extends paper.BaseRelease<Vector2> implements IVector2, paper.ICCS<Vector2>, paper.ISerializable {
        static readonly ZERO: Readonly<Vector2>;
        static readonly ONE: Readonly<Vector2>;
        static readonly MINUS_ONE: Readonly<Vector2>;
        private static readonly _instances;
        /**
         * 创建一个二维向量。
         * @param x X 轴分量。
         * @param y Y 轴分量。
         */
        static create(x?: float, y?: float): Vector2;
        x: float;
        y: float;
        /**
         * 请使用 `egret3d.Vector2.create()` 创建实例。
         * @see egret3d.Vector2.create()
         * @deprecated
         * @private
         */
        constructor(x?: float, y?: float);
        serialize(): number[];
        deserialize(value: [float, float]): this;
        copy(value: Readonly<IVector2>): this;
        clone(): Vector2;
        set(x: float, y: float): this;
        clear(): this;
        fromArray(array: ArrayLike<float>, offset?: uint): this;
        /**
         * 归一化该向量。
         * - v /= v.length
         */
        normalize(): this;
        /**
         * 将输入向量的归一化结果写入该向量。
         * - v = input / input.length
         * @param input 输入向量。
         */
        normalize(input: Readonly<IVector2>): this;
        /**
         * 将该向量加上一个向量。
         * - v += vector
         * @param vector 一个向量。
         */
        add(vector: Readonly<IVector2>): this;
        /**
         * 将两个向量相加的结果写入该向量。
         * - v = vectorA + vectorB
         * @param vectorA 一个向量。
         * @param vectorB 另一个向量。
         */
        add(vectorA: Readonly<IVector2>, vectorB: Readonly<IVector2>): this;
        /**
         * 将该向量减去一个向量。
         * - v -= vector
         * @param vector 一个向量。
         */
        subtract(vector: Readonly<IVector2>): this;
        /**
         * 将两个向量相减的结果写入该向量。
         * - v = vectorA - vectorB
         * @param vectorA 一个向量。
         * @param vectorB 另一个向量。
         */
        subtract(vectorA: Readonly<IVector2>, vectorB: Readonly<IVector2>): this;
        /**
         * 将该向量加上一个标量。
         * - v += scalar
         * @param scalar 标量。
         */
        addScalar(scalar: float): this;
        /**
         * 将输入向量与标量相加的结果写入该向量。
         * - v = input + scalar
         * @param scalar 一个标量。
         * @param input 输入向量。
         */
        addScalar(scalar: float, input: Readonly<IVector2>): this;
        /**
         *
         * @param scalar
         */
        multiplyScalar(scalar: float): this;
        /**
         *
         * @param scalar
         * @param input
         */
        multiplyScalar(scalar: float, input: Readonly<IVector2>): this;
        /**
         *
         * @param vector
         */
        min(vector: Readonly<IVector2>): this;
        /**
         *
         * @param vectorA
         * @param vectorB
         */
        min(vectorA: Readonly<IVector2>, vectorB: Readonly<IVector2>): this;
        /**
         *
         * @param vector
         */
        max(vector: Readonly<IVector2>): this;
        /**
         *
         * @param vectorA
         * @param vectorB
         */
        max(vectorA: Readonly<IVector2>, vectorB: Readonly<IVector2>): this;
        /**
         * 限制该向量，使其在最小向量和最大向量之间。
         * @param min 最小向量。
         * @param max 最大向量。
         */
        clamp(min: Readonly<IVector2>, max: Readonly<IVector2>): this;
        /**
         * 将限制输入向量在最小向量和最大向量之间的结果写入该向量。
         * @param min 最小向量。
         * @param max 最大向量。
         * @param input 输入向量。
         */
        clamp(min: Readonly<IVector2>, max: Readonly<IVector2>, input: Readonly<IVector2>): this;
        /**
         * 该向量的长度。
         * - 该值是实时计算的。
         */
        readonly length: float;
        /**
         * 该向量的长度的平方。
         * - 该值是实时计算的。
         */
        readonly sqrtLength: float;
        /**
         * @deprecated
         */
        static add(v1: Vector2, v2: Vector2, out: Vector2): Vector2;
        /**
         * @deprecated
         */
        static subtract(v1: Vector2, v2: Vector2, out: Vector2): Vector2;
        /**
         * @deprecated
         */
        static multiply(v1: Vector2, v2: Vector2, out: Vector2): Vector2;
        /**
         * @deprecated
         */
        static dot(v1: Vector2, v2: Vector2): float;
        /**
         * @deprecated
         */
        static scale(v: Vector2, scaler: float): Vector2;
        /**
         * @deprecated
         */
        static getLength(v: Vector2): float;
        /**
         * @deprecated
         */
        static getDistance(v1: Vector2, v2: Vector2): float;
        /**
         * @deprecated
         */
        static equal(v1: Vector2, v2: Vector2, threshold?: float): boolean;
        /**
         * @deprecated
         */
        static lerp(v1: Vector2, v2: Vector2, value: float, out: Vector2): Vector2;
    }
}
declare namespace paper {
    /**
     * 基础资源。
     * - 全部资源的基类。
     * - 资源不能直接静态初始化，需要等待引擎启动完毕后初始化。
     */
    abstract class Asset extends BaseObject {
        /**
         * 将一个资源注册为全局可访问资源。
         * - 资源引用计数加 1 。
         */
        static register(asset: Asset): boolean;
        /**
         * 通过资源名获取一个已注册的指定资源。
         */
        static find<T extends Asset>(name: string): T | null;
        /**
         * 资源名称。
         */
        name: string;
        protected _referenceCount: int;
        /**
         * 请使用 `T.create()` 创建实例。
         */
        protected constructor();
        /**
         * 该资源内部初始化。
         * - 重写此方法时，必须调用 `super.initialize();`。
         */
        initialize(...args: any[]): void;
        /**
         * 该资源的引用计数加一。
         */
        retain(): this;
        /**
         * 该资源的引用计数减一。
         */
        release(): this;
        /**
         * 释放该资源。
         * - 重写此方法时，必须调用 `super.dispose();`。
         * @returns 释放是否成功。（已经释放过的资源，无法再次释放）
         */
        dispose(): boolean;
        /**
         *
         * @param isZero
         */
        onReferenceCountChange?(isZero: boolean): boolean;
        /**
         * 该资源是否已经被释放。
         */
        readonly isDisposed: boolean;
        /**
         * 该资源的引用计数。
         * - 当引用计数为 0 时，该资源将在本帧末尾被释放。
         */
        readonly referenceCount: uint;
    }
}
declare namespace paper {
    /**
     * 基础组件。
     * - 所有组件的基类。
     * - 在纯粹的实体组件系统中，组件通常应只包含数据，不应有业务逻辑、行为和生命周期。
     */
    abstract class Component extends BaseObject implements IComponent {
        /**
         * 当组件被创建时派发事件。
         */
        static readonly onComponentCreated: signals.Signal<[IEntity, IComponent]>;
        /**
         * 当组件被激活时派发事件。
         */
        static readonly onComponentEnabled: signals.Signal<[IEntity, IComponent]>;
        /**
         * 当组件被禁用时派发事件。
         */
        static readonly onComponentDisabled: signals.Signal<[IEntity, IComponent]>;
        /**
         * 当组件将要被销毁时派发事件。
         */
        static readonly onComponentDestroy: signals.Signal<[IEntity, IComponent]>;
        /**
         * 当组件被销毁时派发事件。
         */
        static readonly onComponentDestroyed: signals.Signal<[IEntity, IComponent]>;
        /**
         *
         */
        static createDefaultEnabled: boolean;
        /**
         * 该组件的实例是否在编辑模式拥有生命周期。
         */
        static readonly executeInEditMode: boolean;
        /**
         * 是否允许在同一实体上添加多个该组件的实例。
         */
        static readonly allowMultiple: boolean;
        /**
         * 该组件实例依赖的其他前置组件。
         */
        static readonly requireComponents: IComponentClass<IComponent>[] | null;
        /**
         *
         */
        static readonly isAbstract: IComponentClass<IComponent>;
        /**
         * 该组件实例是否为单例组件。
         */
        static readonly isSingleton: boolean;
        /**
         *
         */
        static readonly isBehaviour: boolean;
        /**
         * 该组件实例索引。
         */
        static readonly componentIndex: int;
        /**
         * 所有已注册的单例组件类。
         */
        private static readonly _allAbstractComponents;
        /**
         * 所有已注册的单例组件类。
         */
        private static readonly _allSingletonComponents;
        /**
         * 所有已注册的组件类。
         */
        private static readonly _allComponents;
        hideFlags: HideFlags;
        readonly entity: IEntity;
        extras?: ComponentExtras;
        protected _isDestroyed: boolean;
        protected _enabled: boolean;
        /**
         * 禁止实例化组件。
         * @protected
         */
        constructor();
        protected _setEnabled(value: boolean): void;
        initialize(config?: any): void;
        uninitialize(): void;
        dispatchEnabledEvent(enabled: boolean): void;
        readonly isDestroyed: boolean;
        enabled: boolean;
        readonly isActiveAndEnabled: boolean;
    }
}
declare namespace egret3d {
    /**
     * 渲染排序。
     */
    const enum RenderQueue {
        Background = 1000,
        Geometry = 2000,
        Mask = 2450,
        Blend = 3000,
        Overlay = 4000,
    }
    /**
     * 混合模式。
     */
    const enum BlendMode {
        /**
         * 不混合。
         */
        None = 0,
        /**
         * 正常。
         */
        Normal = 2,
        /**
         * 正常并预乘。
         */
        Normal_PreMultiply = 3,
        /**
         * 相加。
         */
        Additive = 4,
        /**
         * 相加并预乘。
         */
        Additive_PreMultiply = 5,
        /**
         * 相减。
         */
        Subtractive = 8,
        /**
         * 相减并预乘。
         */
        Subtractive_PreMultiply = 9,
        /**
         * 相乘。
         */
        Multiply = 16,
        /**
         * 相乘并预乘。
         */
        Multiply_PreMultiply = 17,
        /**
         * 自定义混合。
         */
        Custom = -1,
    }
    /**
     *
     */
    const enum ToneMapping {
        None = 0,
        LinearToneMapping = 1,
        ReinhardToneMapping = 2,
        Uncharted2ToneMapping = 3,
        CineonToneMapping = 4,
    }
    /**
     * 纹理编码。
     */
    const enum TextureEncoding {
        LinearEncoding = 1,
        sRGBEncoding = 2,
        RGBEEncoding = 3,
        RGBM7Encoding = 4,
        RGBM16Encoding = 5,
        RGBDEncoding = 6,
        GammaEncoding = 7,
    }
    /**
     *
     */
    const enum TextureUVMapping {
        UV = 0,
        Cube = 1,
        CubeUV = 2,
        Equirectangular = 3,
        Spherical = 4,
    }
    /**
     *
     */
    const enum ApplyRootMotion {
        X = 1,
        Y = 2,
        Z = 4,
        RY = 16,
        XZ = 5,
    }
    /**
     * 扩展 glTF。
     */
    interface GLTF extends gltf.GLTF {
        version: string;
        extensions: {
            KHR_techniques_webgl?: gltf.KhrTechniqueWebglGlTfExtension;
            paper?: {
                animationMasks?: {
                    name?: string;
                    retargeting: string[];
                    joints: gltf.Index[];
                }[];
                animationControllers?: {
                    name?: string;
                    layers: AnimationLayer[];
                    parameters: AnimationParameter[];
                }[];
            };
        };
        extensionsUsed: string[];
        extensionsRequired: string[];
    }
    /**
     * 扩展 glTF 材质。
     * - 仅用于存储材质初始值。
     */
    interface GLTFMaterial extends gltf.Material {
        extensions: {
            KHR_techniques_webgl: gltf.KhrTechniquesWebglMaterialExtension;
            paper: {
                renderQueue: RenderQueue | uint;
                /**
                 * 该值如果定义，则覆盖着色器中的值。
                 */
                states?: gltf.States;
                /**
                 * 该值如果定义，则覆盖着色器中的值。
                 */
                defines?: string[];
            };
        };
    }
    /**
     *
     */
    interface GLTFTextureExtension {
        /**
         * @defaults 0
         */
        flipY?: 0 | 1;
        /**
         * @defaults 0
         */
        premultiplyAlpha?: 0 | 1;
        /**
         * 纹理宽。
         */
        width?: uint;
        /**
         * 纹理高。
         */
        height?: uint;
        /**
         * @defaults 1
         */
        anisotropy?: uint;
        /**
         * 纹理数据格式。
         * @defaults gltf.TextureFormat.RGBA
         */
        format?: gltf.TextureFormat;
        /**
         * 纹理数据类型。
         * @defaults gltf.ComponentType.UnsignedByte
         */
        type?: gltf.ComponentType;
        /**
         * 纹理对齐方式。
         * @defaults gltf.TextureAlignment.Four
         */
        unpackAlignment?: gltf.TextureAlignment;
        /**
         * 纹理编码格式
         */
        encoding?: TextureEncoding;
        /**
         * @defaults 1
         */
        depth?: uint;
        /**
         * @defaults 1
         */
        layers?: uint;
        /**
         * @defaults 1
         */
        faces?: uint;
        /**
         * 使用 mipmap 的方式。
         * - 0: 自动生成。
         * - 1：不使用 mipmap 。
         * - N: 提供 mipmap 。
         * @defaults 1
         */
        levels?: uint;
        /**
         * @defaults true
         */
        depthBuffer?: boolean;
        /**
         * @defaults false
         */
        stencilBuffer?: boolean;
        /**
         * @defaults Normal
         */
        mapping?: TextureUVMapping;
    }
    /**
     *
     */
    interface GLTFTexture extends gltf.Texture {
        extensions: {
            paper: GLTFTextureExtension;
        };
    }
    /**
     * @private
     */
    interface GLTFSkin extends gltf.Skin {
        extensions: {
            paper: {
                retargeting?: {
                    [key: string]: gltf.Index;
                };
            };
        };
    }
    /**
     * @private
     */
    interface GLTFAnimation extends gltf.Animation {
        extensions: {
            paper: {
                frameRate: number;
                clips: GLTFAnimationClip[];
                events?: GLTFAnimationFrameEvent[];
            };
        };
    }
    /**
     * @private
     */
    interface GLTFAnimationChannel extends gltf.AnimationChannel {
        extensions?: {
            paper: {
                type: string;
                property: string;
                uri?: string;
                needUpdate?: int;
            };
        };
    }
    /**
     *
     */
    interface GLTFAnimationFrameEvent {
        /**
         * 事件名称。
         */
        name: string;
        /**
         *
         */
        position: number;
        /**
         * 事件 int 变量。
         */
        intVariable?: int;
        /**
         * 事件 float 变量。
         */
        floatVariable?: number;
        /**
         * 事件 string 变量。
         */
        stringVariable?: string;
    }
    /**
     *
     */
    interface GLTFAnimationClip {
        /**
         * 动画剪辑名称。
         */
        name: string;
        /**
         * 播放次数。
         */
        playTimes?: uint;
        /**
         * 开始时间。（以秒为单位）
         */
        position: number;
        /**
         * 持续时间。（以秒为单位）
         */
        duration: number;
        root?: gltf.Index;
        applyRootMotion?: ApplyRootMotion;
    }
    /**
     * @private
     */
    const enum AnimationBlendType {
        E1D = 0,
    }
    /**
     * @private
     */
    interface AnimationParameter {
        type: int;
        value: boolean | int | number;
    }
    /**
     * @private
     */
    interface StateMachineNode {
        name: string;
    }
    /**
     * @private
     */
    interface StateMachine extends StateMachineNode {
        nodes: StateMachineNode[];
    }
    /**
     * @private
     */
    interface AnimationLayer {
        additive: boolean;
        weight: number;
        name: string;
        source?: string | null;
        mask?: string | AnimationMask | null;
        machine: StateMachine;
    }
    /**
     * @private
     */
    interface AnimationBaseNode extends StateMachineNode {
        timeScale: number;
        positionX?: number;
        positionY?: number;
    }
    /**
     * @private
     */
    interface AnimationTree extends AnimationBaseNode {
        blendType: AnimationBlendType;
        parameters: string[];
        nodes: AnimationBaseNode[];
    }
    /**
     * @private
     */
    interface AnimationNode extends AnimationBaseNode {
        asset: string;
    }
}
declare namespace gltf {
    /**
     * 绘制缓存掩码。
     */
    const enum BufferMask {
        None = 0,
        Depth = 256,
        Stencil = 1024,
        Color = 16384,
        DepthAndStencil = 1280,
        DepthAndColor = 16640,
        StencilAndColor = 17408,
        All = 17664,
    }
    const enum BlendEquation {
        Add = 32774,
        Subtract = 32778,
        ReverseSubtract = 32779,
    }
    const enum BlendFactor {
        ZERO = 0,
        ONE = 1,
        SRC_COLOR = 768,
        ONE_MINUS_SRC_COLOR = 769,
        DST_COLOR = 774,
        ONE_MINUS_DST_COLOR = 775,
        SRC_ALPHA = 770,
        ONE_MINUS_SRC_ALPHA = 771,
        DST_ALPHA = 772,
        ONE_MINUS_DST_ALPHA = 773,
        CONSTANT_COLOR = 32769,
        ONE_MINUS_CONSTANT_COLOR = 32770,
        CONSTANT_ALPHA = 32771,
        ONE_MINUS_CONSTANT_ALPHA = 32772,
        SRC_ALPHA_SATURATE = 776,
    }
    const enum CullFace {
        Front = 1028,
        Back = 1029,
        FrontAndBack = 1032,
    }
    const enum FrontFace {
        CW = 2304,
        CCW = 2305,
    }
    const enum MeshPrimitiveMode {
        Points = 0,
        Lines = 1,
        LineLoop = 2,
        LineStrip = 3,
        Triangles = 4,
        TrianglesStrip = 5,
        TrianglesFan = 6,
    }
    /**
     *
     */
    const enum DrawMode {
        Stream = 35040,
        Static = 35044,
        Dynamic = 35048,
    }
    /**
     *
     */
    const enum TextureFormat {
        RGB = 6407,
        RGBA = 6408,
        Luminance = 6409,
        RGBA4 = 32854,
    }
    /**
     *
     */
    const enum TextureFilter {
        Nearest = 9728,
        Linear = 9729,
        NearestMipmapNearest = 9984,
        LinearMipmapNearest = 9985,
        NearestMipMapLinear = 9986,
        LinearMipMapLinear = 9987,
    }
    /**
     *
     */
    const enum TextureWrappingMode {
        Repeat = 10497,
        ClampToEdge = 33071,
        MirroredRepeat = 33648,
    }
    /**
     *
     */
    const enum EnableState {
        Blend = 3042,
        CullFace = 2884,
        DepthTest = 2929,
        StencilTest = 2960,
        PolygonOffsetFill = 32823,
        SampleAlphaToCoverage = 32926,
    }
    /**
     *
     */
    const enum DepthFunc {
        Never = 512,
        Less = 513,
        Lequal = 515,
        Equal = 514,
        Greater = 516,
        NotEqual = 517,
        GEqual = 518,
        Always = 519,
    }
}
declare namespace gltf {
    /**
     * glTF index.
     */
    type Index = uint;
    /**
     * BufferView target.
     */
    const enum BufferViewTarget {
        ArrayBuffer = 34962,
        ElementArrayBuffer = 34963,
    }
    /**
     * Component type.
     */
    const enum ComponentType {
        STRUCT = -1,
        Byte = 5120,
        UnsignedByte = 5121,
        Short = 5122,
        UnsignedShort = 5123,
        Int = 5124,
        UnsignedInt = 5125,
        Float = 5126,
        UnsignedShort4444 = 32819,
        UnsignedShort5551 = 32820,
        UnsignedShort565 = 33635,
        FloatVec2 = 35664,
        FloatVec3 = 35665,
        FloatVec4 = 35666,
        IntVec2 = 35667,
        IntVec3 = 35668,
        IntVec4 = 35669,
        BOOL = 35670,
        BoolVec2 = 35671,
        BoolVec3 = 35672,
        BoolVec4 = 35673,
        FloatMat2 = 35674,
        FloatMat3 = 35675,
        FloatMat4 = 35676,
        Sampler2D = 35678,
        SamplerCube = 35680,
    }
    /**
     * The uniform type.  All valid values correspond to WebGL enums.
     */
    const enum UniformType {
        INT = 5124,
        FLOAT = 5126,
        FLOAT_VEC2 = 35664,
        FLOAT_VEC3 = 35665,
        FLOAT_VEC4 = 35666,
        INT_VEC2 = 35667,
        INT_VEC3 = 35668,
        INT_VEC4 = 35669,
        BOOL = 35670,
        BOOL_VEC2 = 35671,
        BOOL_VEC3 = 35672,
        BOOL_VEC4 = 35673,
        FLOAT_MAT2 = 35674,
        FLOAT_MAT3 = 35675,
        FLOAT_MAT4 = 35676,
        SAMPLER_2D = 35678,
        SAMPLER_CUBE = 35680,
    }
    /**
     *
     */
    const enum TextureType {
        Texture2DStart = 33984,
        TextureCubeStart = 34069,
        Texture1D = -1,
        Texture2D = 3553,
        Texture3D = 32879,
        TextureCube = 34067,
    }
    /**
     *
     */
    const enum TextureAlignment {
        One = 1,
        Two = 2,
        Four = 4,
        Eight = 8,
    }
    /**
     * The shader stage.  All valid values correspond to WebGL enums.
     */
    const enum ShaderStage {
        Fragment = 35632,
        Vertex = 35633,
    }
    /**
     *
     */
    const enum AttributeSemantics {
        POSITION = "POSITION",
        NORMAL = "NORMAL",
        TANGENT = "TANGENT",
        TEXCOORD_0 = "TEXCOORD_0",
        TEXCOORD_1 = "TEXCOORD_1",
        COLOR_0 = "COLOR_0",
        COLOR_1 = "COLOR_1",
        JOINTS_0 = "JOINTS_0",
        WEIGHTS_0 = "WEIGHTS_0",
        MORPHTARGET_0 = "WEIGHTS_0",
        MORPHTARGET_1 = "WEIGHTS_1",
        MORPHTARGET_2 = "WEIGHTS_2",
        MORPHTARGET_3 = "WEIGHTS_3",
        MORPHTARGET_4 = "WEIGHTS_4",
        MORPHTARGET_5 = "WEIGHTS_5",
        MORPHTARGET_6 = "WEIGHTS_6",
        MORPHTARGET_7 = "WEIGHTS_7",
        MORPHNORMAL_0 = "MORPHNORMAL_0",
        MORPHNORMAL_1 = "MORPHNORMAL_1",
        MORPHNORMAL_2 = "MORPHNORMAL_2",
        MORPHNORMAL_3 = "MORPHNORMAL_3",
        _INSTANCE_DISTANCE = "_INSTANCE_DISTANCE",
        _INSTANCE_START = "_INSTANCE_START",
        _INSTANCE_END = "_INSTANCE_END",
        _INSTANCE_COLOR_START = "_INSTANCE_COLOR_START",
        _INSTANCE_COLOR_END = "_INSTANCE_COLOR_END",
        _INSTANCE_DISTANCE_START = "_INSTANCE_DISTANCE_START",
        _INSTANCE_DISTANCE_END = "_INSTANCE_DISTANCE_END",
        _CORNER = "_CORNER",
        _START_POSITION = "_START_POSITION",
        _START_VELOCITY = "_START_VELOCITY",
        _START_COLOR = "_START_COLOR",
        _START_SIZE = "_START_SIZE",
        _START_ROTATION = "_START_ROTATION",
        _TIME = "_TIME",
        _RANDOM0 = "_RANDOM0",
        _RANDOM1 = "_RANDOM1",
        _WORLD_POSITION = "_WORLD_POSITION",
        _WORLD_ROTATION = "_WORLD_ROTATION",
    }
    const enum UniformSemantics {
        LOCAL = "LOCAL",
        MODEL = "MODEL",
        VIEW = "VIEW",
        PROJECTION = "PROJECTION",
        MODELVIEW = "MODELVIEW",
        MODELVIEWPROJECTION = "MODELVIEWPROJECTION",
        MODELINVERSE = "MODELINVERSE",
        VIEWINVERSE = "VIEWINVERSE",
        PROJECTIONINVERSE = "PROJECTIONINVERSE",
        MODELVIEWINVERSE = "MODELVIEWINVERSE",
        MODELVIEWPROJECTIONINVERSE = "MODELVIEWPROJECTIONINVERSE",
        MODELINVERSETRANSPOSE = "MODELINVERSETRANSPOSE",
        MODELVIEWINVERSETRANSPOSE = "MODELVIEWINVERSETRANSPOSE",
        VIEWPORT = "VIEWPORT",
        JOINTMATRIX = "JOINTMATRIX",
        _BONETEXTURE = "_BONETEXTURE",
        _BONETEXTURESIZE = "_BONETEXTURESIZE",
        _RESOLUTION = "_RESOLUTION",
        _CLOCK = "_CLOCK",
        _VIEWPROJECTION = "_VIEWPROJECTION",
        _CAMERA_POS = "_CAMERA_POS",
        _CAMERA_UP = "_CAMERA_UP",
        _CAMERA_FORWARD = "_CAMERA_FORWARD",
        _AMBIENTLIGHTCOLOR = "_AMBIENTLIGHTCOLOR",
        _DIRECTLIGHTS = "_DIRECTLIGHTS",
        _SPOTLIGHTS = "_SPOTLIGHTS",
        _RECTAREALIGHTS = "_RECTAREALIGHTS",
        _POINTLIGHTS = "_POINTLIGHTS",
        _HEMILIGHTS = "_HEMILIGHTS",
        _DIRECTIONSHADOWMAT = "_DIRECTIONSHADOWMAT",
        _SPOTSHADOWMAT = "_SPOTSHADOWMAT",
        _POINTSHADOWMAT = "_POINTSHADOWMAT",
        _DIRECTIONSHADOWMAP = "_DIRECTIONSHADOWMAP",
        _POINTSHADOWMAP = "_POINTSHADOWMAP",
        _SPOTSHADOWMAP = "_SPOTSHADOWMAP",
        _LIGHTMAPTEX = "_LIGHTMAPTEX",
        _LIGHTMAPINTENSITY = "_LIGHTMAPINTENSITY",
        _LIGHTMAP_SCALE_OFFSET = "_LIGHTMAP_SCALE_OFFSET",
        _REFERENCEPOSITION = "_REFERENCEPOSITION",
        _NEARDICTANCE = "_NEARDICTANCE",
        _FARDISTANCE = "_FARDISTANCE",
        _TONE_MAPPING_EXPOSURE = "_TONE_MAPPING_EXPOSURE",
        _TONE_MAPPING_WHITE_POINT = "_TONE_MAPPING_WHITE_POINT",
        _LOG_DEPTH_BUFFC = "_LOG_DEPTH_BUFFC",
        _FOG_COLOR = "_FOG_COLOR",
        _FOG_DENSITY = "_FOG_DENSITY",
        _FOG_NEAR = "_FOG_NEAR",
        _FOG_FAR = "_FOG_FAR",
        _ROTATION = "_ROTATION",
        _SCALE2D = "_SCALE2D",
    }
    const enum AccessorType {
        SCALAR = "SCALAR",
        VEC2 = "VEC2",
        VEC3 = "VEC3",
        VEC4 = "VEC4",
        MAT2 = "MAT2",
        MAT3 = "MAT3",
        MAT4 = "MAT4",
    }
    /**
     *
     */
    type ImageSource = ImageBitmap | ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement;
    /**
     * Indices of those attributes that deviate from their initialization value.
     */
    interface AccessorSparseIndices {
        /**
         * The index of the bufferView with sparse indices. Referenced bufferView can't have ARRAY_BUFFER or ELEMENT_ARRAY_BUFFER target.
         */
        bufferView: Index;
        /**
         * The offset relative to the start of the bufferView in bytes. Must be aligned.
         */
        byteOffset?: number;
        /**
         * The indices data type.
         */
        componentType: ComponentType.UnsignedByte | ComponentType.UnsignedShort | ComponentType.UnsignedInt;
        extensions?: any;
        extras?: any;
    }
    /**
     * Array of size `accessor.sparse.count` times number of components storing the displaced accessor attributes pointed by `accessor.sparse.indices`.
     */
    interface AccessorSparseValues {
        /**
         * The index of the bufferView with sparse values. Referenced bufferView can't have ARRAY_BUFFER or ELEMENT_ARRAY_BUFFER target.
         */
        bufferView: Index;
        /**
         * The offset relative to the start of the bufferView in bytes. Must be aligned.
         */
        byteOffset?: number;
        extensions?: any;
        extras?: any;
    }
    /**
     * Sparse storage of attributes that deviate from their initialization value.
     */
    interface AccessorSparse {
        /**
         * Number of entries stored in the sparse array.
         */
        count: number;
        /**
         * Index array of size `count` that points to those accessor attributes that deviate from their initialization value. Indices must strictly increase.
         */
        indices: AccessorSparseIndices;
        /**
         * Array of size `count` times number of components, storing the displaced accessor attributes pointed by `indices`. Substituted values must have the same `componentType` and number of components as the base accessor.
         */
        values: AccessorSparseValues;
        extensions?: any;
        extras?: any;
    }
    /**
     * A typed view into a bufferView.  A bufferView contains raw binary data.  An accessor provides a typed view into a bufferView or a subset of a bufferView similar to how WebGL's `vertexAttribPointer()` defines an attribute in a buffer.
     */
    interface Accessor {
        /**
         * The index of the bufferView.
         */
        bufferView?: Index;
        /**
         * The offset relative to the start of the bufferView in bytes.
         */
        byteOffset?: number;
        /**
         * The datatype of components in the attribute.
         */
        componentType: ComponentType;
        /**
         * Specifies whether integer data values should be normalized.
         */
        normalized?: boolean;
        /**
         * The number of attributes referenced by this accessor.
         */
        count: number;
        /**
         * Specifies if the attribute is a scalar, vector, or matrix.
         */
        type: AccessorType;
        /**
         * Specifies if the attribute is a scalar, vector, or matrix.
         */
        typeCount?: number;
        /**
         * Maximum value of each component in this attribute.
         */
        max?: number[];
        /**
         * Minimum value of each component in this attribute.
         */
        min?: number[];
        /**
         * Sparse storage of attributes that deviate from their initialization value.
         */
        sparse?: AccessorSparse;
        name?: string;
        extensions?: any;
        extras?: any;
    }
    /**
     * The index of the node and TRS property that an animation channel targets.
     */
    interface AnimationChannelTarget {
        /**
         * The index of the node to target.
         */
        node?: Index;
        /**
         * The name of the node's TRS property to modify, or the "weights" of the Morph Targets it instantiates. For the "translation" property, the values that are provided by the sampler are the translation along the x, y, and z axes. For the "rotation" property, the values are a quaternion in the order (x, y, z, w), where w is the scalar. For the "scale" property, the values are the scaling factors along the x, y, and z axes.
         */
        path: "translation" | "rotation" | "scale" | "weights" | string;
        extensions?: any;
        extras?: any;
    }
    /**
     * Targets an animation's sampler at a node's property.
     */
    interface AnimationChannel {
        /**
         * The index of a sampler in this animation used to compute the value for the target.
         */
        sampler: Index;
        /**
         * The index of the node and TRS property to target.
         */
        target: AnimationChannelTarget;
        extensions?: any;
        extras?: any;
    }
    /**
     * Combines input and output accessors with an interpolation algorithm to define a keyframe graph (but not its target).
     */
    interface AnimationSampler {
        /**
         * The index of an accessor containing keyframe input values, e.g., time.
         */
        input: Index;
        /**
         * Interpolation algorithm.
         */
        interpolation?: "LINEAR" | "STEP" | "CUBICSPLINE" | string;
        /**
         * The index of an accessor, containing keyframe output values.
         */
        output: Index;
        extensions?: any;
        extras?: any;
    }
    /**
     * A keyframe animation.
     */
    interface Animation {
        /**
         * An array of channels, each of which targets an animation's sampler at a node's property. Different channels of the same animation can't have equal targets.
         */
        channels: AnimationChannel[];
        /**
         * An array of samplers that combines input and output accessors with an interpolation algorithm to define a keyframe graph (but not its target).
         */
        samplers: AnimationSampler[];
        name?: string;
        extensions?: any;
        extras?: any;
    }
    /**
     * Metadata about the glTF asset.
     */
    interface Asset {
        /**
         * A copyright message suitable for display to credit the content creator.
         */
        copyright?: string;
        /**
         * Tool that generated this glTF model.  Useful for debugging.
         */
        generator?: string;
        /**
         * The glTF version that this asset targets.
         */
        version: string;
        /**
         * The minimum glTF version that this asset targets.
         */
        minVersion?: string;
        extensions?: any;
        extras?: any;
    }
    /**
     * A buffer points to binary geometry, animation, or skins.
     */
    interface Buffer {
        /**
         * The uri of the buffer.
         */
        uri?: string;
        /**
         * The length of the buffer in bytes.
         */
        byteLength: number;
        name?: string;
        extensions?: any;
        extras?: any;
    }
    /**
     * A view into a buffer generally representing a subset of the buffer.
     */
    interface BufferView {
        /**
         * The index of the buffer.
         */
        buffer: Index;
        /**
         * The offset into the buffer in bytes.
         */
        byteOffset?: number;
        /**
         * The length of the bufferView in bytes.
         */
        byteLength: number;
        /**
         * The stride, in bytes.
         */
        byteStride?: number;
        /**
         * The target that the GPU buffer should be bound to.
         */
        target?: BufferViewTarget;
        name?: string;
        extensions?: any;
        extras?: any;
    }
    /**
     * An orthographic camera containing properties to create an orthographic projection matrix.
     */
    interface CameraOrthographic {
        /**
         * The floating-point horizontal magnification of the view. Must not be zero.
         */
        xmag: number;
        /**
         * The floating-point vertical magnification of the view. Must not be zero.
         */
        ymag: number;
        /**
         * The floating-point distance to the far clipping plane. `zfar` must be greater than `znear`.
         */
        zfar: number;
        /**
         * The floating-point distance to the near clipping plane.
         */
        znear: number;
        extensions?: any;
        extras?: any;
    }
    /**
     * A perspective camera containing properties to create a perspective projection matrix.
     */
    interface CameraPerspective {
        /**
         * The floating-point aspect ratio of the field of view.
         */
        aspectRatio?: number;
        /**
         * The floating-point vertical field of view in radians.
         */
        yfov: number;
        /**
         * The floating-point distance to the far clipping plane.
         */
        zfar?: number;
        /**
         * The floating-point distance to the near clipping plane.
         */
        znear: number;
        extensions?: any;
        extras?: any;
    }
    /**
     * A camera's projection.  A node can reference a camera to apply a transform to place the camera in the scene.
     */
    interface Camera {
        /**
         * An orthographic camera containing properties to create an orthographic projection matrix.
         */
        orthographic?: CameraOrthographic;
        /**
         * A perspective camera containing properties to create a perspective projection matrix.
         */
        perspective?: CameraPerspective;
        /**
         * Specifies if the camera uses a perspective or orthographic projection.
         */
        type: "perspective" | "orthographic" | string;
        name?: string;
        extensions?: any;
        extras?: any;
    }
    /**
     * Image data used to create a texture. Image can be referenced by URI or `bufferView` index. `mimeType` is required in the latter case.
     */
    interface Image {
        /**
         * The uri of the image.
         */
        uri?: string | ImageSource | ((string | ImageSource)[]);
        /**
         * The image's MIME type.
         */
        mimeType?: "image/jpeg" | "image/png" | "image/ktx" | string;
        /**
         * The index of the bufferView that contains the image. Use this instead of the image's uri property.
         */
        bufferView?: Index | (Index[]);
        name?: string;
        extensions?: any;
        extras?: any;
    }
    /**
     * Reference to a texture.
     */
    interface TextureInfo {
        /**
         * The index of the texture.
         */
        index: Index;
        /**
         * The set index of texture's TEXCOORD attribute used for texture coordinate mapping.
         */
        texCoord?: number;
        extensions?: any;
        extras?: any;
    }
    /**
     * A set of parameter values that are used to define the metallic-roughness material model from Physically-Based Rendering (PBR) methodology.
     */
    interface MaterialPbrMetallicRoughness {
        /**
         * The material's base color factor.
         */
        baseColorFactor?: number[];
        /**
         * The base color texture.
         */
        baseColorTexture?: TextureInfo;
        /**
         * The metalness of the material.
         */
        metallicFactor?: number;
        /**
         * The roughness of the material.
         */
        roughnessFactor?: number;
        /**
         * The metallic-roughness texture.
         */
        metallicRoughnessTexture?: TextureInfo;
        extensions?: any;
        extras?: any;
    }
    interface MaterialNormalTextureInfo {
        index?: any;
        texCoord?: any;
        /**
         * The scalar multiplier applied to each normal vector of the normal texture.
         */
        scale?: number;
        extensions?: any;
        extras?: any;
    }
    interface MaterialOcclusionTextureInfo {
        index?: any;
        texCoord?: any;
        /**
         * A scalar multiplier controlling the amount of occlusion applied.
         */
        strength?: number;
        extensions?: any;
        extras?: any;
    }
    /**
     * The material appearance of a primitive.
     */
    interface Material {
        name?: string;
        extensions?: any;
        extras?: any;
        /**
         * A set of parameter values that are used to define the metallic-roughness material model from Physically-Based Rendering (PBR) methodology. When not specified, all the default values of `pbrMetallicRoughness` apply.
         */
        pbrMetallicRoughness?: MaterialPbrMetallicRoughness;
        /**
         * The normal map texture.
         */
        normalTexture?: MaterialNormalTextureInfo;
        /**
         * The occlusion map texture.
         */
        occlusionTexture?: MaterialOcclusionTextureInfo;
        /**
         * The emissive map texture.
         */
        emissiveTexture?: TextureInfo;
        /**
         * The emissive color of the material.
         */
        emissiveFactor?: number[];
        /**
         * The alpha rendering mode of the material.
         */
        alphaMode?: "OPAQUE" | "MASK" | "BLEND" | string;
        /**
         * The alpha cutoff value of the material.
         */
        alphaCutoff?: number;
        /**
         * Specifies whether the material is double sided.
         */
        doubleSided?: boolean;
    }
    /**
     * Geometry to be rendered with the given material.
     */
    interface MeshPrimitive {
        /**
         * A dictionary object, where each key corresponds to mesh attribute semantic and each value is the index of the accessor containing attribute's data.
         */
        attributes: {
            POSITION?: Index;
            NORMAL?: Index;
            TANGENT?: Index;
            TEXCOORD_0?: Index;
            TEXCOORD_1?: Index;
            COLOR_0?: Index;
            COLOR_1?: Index;
            JOINTS_0?: Index;
            WEIGHTS_0?: Index;
            [k: string]: Index | undefined;
        };
        /**
         * The index of the accessor that contains the indices.
         */
        indices?: Index;
        /**
         * The index of the material to apply to this primitive when rendering.
         */
        material?: Index;
        /**
         * The type of primitives to render.
         */
        mode?: MeshPrimitiveMode;
        /**
         * An array of Morph Targets, each  Morph Target is a dictionary mapping attributes (only `POSITION`, `NORMAL`, and `TANGENT` supported) to their deviations in the Morph Target.
         */
        targets?: {
            [k: string]: Index;
        }[];
        extensions?: any;
        extras?: any;
    }
    /**
     * A set of primitives to be rendered.  A node can contain one mesh.  A node's transform places the mesh in the scene.
     */
    interface Mesh {
        /**
         * An array of primitives, each defining geometry to be rendered with a material.
         */
        primitives: MeshPrimitive[];
        /**
         * Array of weights to be applied to the Morph Targets.
         */
        weights?: number[];
        name?: string;
        extensions?: any;
        extras?: any;
    }
    /**
     * A node in the node hierarchy.  When the node contains `skin`, all `mesh.primitives` must contain `JOINTS_0` and `WEIGHTS_0` attributes.  A node can have either a `matrix` or any combination of `translation`/`rotation`/`scale` (TRS) properties. TRS properties are converted to matrices and postmultiplied in the `T * R * S` order to compose the transformation matrix; first the scale is applied to the vertices, then the rotation, and then the translation. If none are provided, the transform is the identity. When a node is targeted for animation (referenced by an animation.channel.target), only TRS properties may be present; `matrix` will not be present.
     */
    interface Node {
        /**
         * The index of the camera referenced by this node.
         */
        camera?: Index;
        /**
         * The indices of this node's children.
         */
        children?: Index[];
        /**
         * The index of the skin referenced by this node.
         */
        skin?: Index;
        /**
         * A floating-point 4x4 transformation matrix stored in column-major order.
         */
        matrix?: number[];
        /**
         * The index of the mesh in this node.
         */
        mesh?: Index;
        /**
         * The node's unit quaternion rotation in the order (x, y, z, w), where w is the scalar.
         */
        rotation?: number[];
        /**
         * The node's non-uniform scale, given as the scaling factors along the x, y, and z axes.
         */
        scale?: number[];
        /**
         * The node's translation along the x, y, and z axes.
         */
        translation?: number[];
        /**
         * The weights of the instantiated Morph Target. Number of elements must match number of Morph Targets of used mesh.
         */
        weights?: number[];
        name?: string;
        extensions?: any;
        extras?: any;
    }
    /**
     * Texture sampler properties for filtering and wrapping modes.
     */
    interface Sampler {
        /**
         * Magnification filter.
         * @defaults gltf.TextureFilter.Nearest
         */
        magFilter?: gltf.TextureFilter;
        /**
         * Minification filter.
         * @defaults gltf.TextureFilter.Nearest
         */
        minFilter?: gltf.TextureFilter;
        /**
         * s wrapping mode.
         * @defaults gltf.TextureWrap.Repeat
         */
        wrapS?: TextureWrappingMode;
        /**
         * t wrapping mode.
         * @defaults gltf.TextureWrap.Repeat
         */
        wrapT?: TextureWrappingMode;
        name?: string;
        extensions?: any;
        extras?: any;
    }
    /**
     * The root nodes of a scene.
     */
    interface Scene {
        /**
         * The indices of each root node.
         */
        nodes?: Index[];
        name?: string;
        extensions?: any;
        extras?: any;
    }
    /**
     * Joints and matrices defining a skin.
     */
    interface Skin {
        /**
         * The index of the accessor containing the floating-point 4x4 inverse-bind matrices.  The default is that each matrix is a 4x4 identity matrix, which implies that inverse-bind matrices were pre-applied.
         */
        inverseBindMatrices?: Index;
        /**
         * The index of the node used as a skeleton root. When undefined, joints transforms resolve to scene root.
         */
        skeleton?: Index;
        /**
         * Indices of skeleton nodes, used as joints in this skin.
         */
        joints: Index[];
        name?: string;
        extensions?: any;
        extras?: any;
    }
    /**
     * A texture and its sampler.
     */
    interface Texture {
        /**
         * The index of the sampler used by this texture. When undefined, a sampler with repeat wrapping and auto filtering should be used.
         */
        sampler?: Index;
        /**
         * The index of the image used by this texture.
         */
        source?: Index;
        name?: string;
        extensions?: any;
        extras?: any;
    }
    /**
     * The root object for a glTF asset.
     */
    interface GLTF {
        /**
         * Names of glTF extensions used somewhere in this asset.
         */
        extensionsUsed?: string[];
        /**
         * Names of glTF extensions required to properly load this asset.
         */
        extensionsRequired?: string[];
        /**
         * An array of accessors.
         */
        accessors?: Accessor[];
        /**
         * An array of keyframe animations.
         */
        animations?: Animation[];
        /**
         * Metadata about the glTF asset.
         */
        asset: Asset;
        /**
         * An array of buffers.
         */
        buffers?: Buffer[];
        /**
         * An array of bufferViews.
         */
        bufferViews?: BufferView[];
        /**
         * An array of cameras.
         */
        cameras?: Camera[];
        /**
         * An array of images.
         */
        images?: Image[];
        /**
         * An array of materials.
         */
        materials?: Material[];
        /**
         * An array of meshes.
         */
        meshes?: Mesh[];
        /**
         * An array of nodes.
         */
        nodes?: Node[];
        /**
         * An array of samplers.
         */
        samplers?: Sampler[];
        /**
         * The index of the default scene.
         */
        scene?: Index;
        /**
         * An array of scenes.
         */
        scenes?: Scene[];
        /**
         * An array of skins.
         */
        skins?: Skin[];
        /**
         * An array of textures.
         */
        textures?: Texture[];
        extensions?: any;
        extras?: any;
    }
    /**
    * A vertex or fragment shader. Exactly one of `uri` or `bufferView` must be provided for the GLSL source.
    */
    interface Shader {
        /**
         * The uri of the GLSL source.
         */
        uri?: string;
        /**
         * The shader stage.
         */
        type: ShaderStage;
        /**
         * The index of the bufferView that contains the GLSL shader source. Use this instead of the shader's uri property.
         */
        bufferView?: Index;
        name?: string;
        extensions?: any;
        extras?: any;
    }
    /**
     * An attribute input to a technique and the corresponding semantic.
     */
    interface Attribute {
        /**
         * Identifies a mesh attribute semantic.
         */
        semantic: string;
        extensions?: any;
        extras?: any;
        [k: string]: any;
    }
    type UniformValue = any;
    /**
     * A uniform input to a technique, and an optional semantic and value.
     */
    interface Uniform {
        /**
         * When defined, the uniform is an array of count elements of the specified type.  Otherwise, the uniform is not an array.
         */
        count?: number;
        /**
         * The index of the node whose transform is used as the uniform's value.
         */
        node?: Index;
        /**
         * The uniform type.
         */
        type: UniformType;
        /**
         * Identifies a uniform with a well-known meaning.
         */
        semantic?: string;
        /**
         * The value of the uniform.
         * TODO 默认值
         */
        value: UniformValue;
        name?: string;
        extensions?: any;
        extras?: any;
    }
    /**
     * A template for material appearances.
     */
    interface Technique {
        /**
         * The index of the program.
         */
        program?: Index;
        /**
         * A dictionary object of `Attribute` objects.
         */
        attributes: {
            /**
             * An attribute input to a technique and the corresponding semantic.
             */
            [k: string]: gltf.Attribute;
        };
        /**
         * A dictionary object of `Uniform` objects.
         */
        uniforms: {
            /**
             * A uniform input to a technique, and an optional semantic and value.
             */
            [k: string]: gltf.Uniform;
        };
        name?: string;
        states?: States;
        extensions?: any;
        extras?: any;
        [k: string]: any;
    }
    /**
     * A shader program, including its vertex and fragment shaders.
     */
    interface Program {
        /**
         * The index of the fragment shader.
         */
        fragmentShader: Index;
        /**
         * The index of the vertex shader.
         */
        vertexShader: Index;
        /**
         * The names of required WebGL 1.0 extensions.
         */
        glExtensions?: string[];
        name?: string;
        extensions?: any;
        extras?: any;
        [k: string]: any;
    }
    interface KhrTechniqueWebglGlTfExtension {
        /**
         * An array of shaders.
         */
        shaders: Shader[];
        /**
         * An array of techniques.
         */
        techniques: Technique[];
        /**
         * An array of programs.
         */
        programs: Program[];
    }
    /**
    * The technique to use for a material and any additional uniform values.
    */
    interface KhrTechniquesWebglMaterialExtension {
        /**
         * The index of the technique.
         */
        technique: string;
        /**
         * Dictionary object of uniform values.
         */
        values?: {
            [k: string]: UniformValue;
        };
        [k: string]: any;
    }
    /**
    * The technique to use for a material and any additional uniform values.
    */
    interface KhrBlendMaterialExtension {
        blendEquation: number[];
        blendFactors: number[];
    }
    /**
     * Arguments for fixed-function rendering state functions other than `enable()`/`disable()`.
     */
    interface Functions {
        /**
         * Floating-point values passed to `blendColor()`. [red, green, blue, alpha]
         */
        blendColor?: number[];
        /**
         * Integer values passed to `blendEquationSeparate()`.
         */
        blendEquationSeparate?: BlendEquation[];
        /**
         * Integer values passed to `blendFuncSeparate()`.
         */
        blendFuncSeparate?: BlendFactor[];
        /**
         * Boolean values passed to `colorMask()`. [red, green, blue, alpha].
         */
        colorMask?: boolean[];
        /**
         * Integer value passed to `cullFace()`.
         */
        cullFace?: CullFace[];
        /**
         * Integer values passed to `depthFunc()`.
         */
        depthFunc?: DepthFunc[];
        /**
         * Boolean value passed to `depthMask()`.
         */
        depthMask?: boolean[];
        /**
         * Floating-point values passed to `depthRange()`. [zNear, zFar]
         */
        depthRange?: number[];
        /**
         * Integer value passed to `frontFace()`.
         */
        frontFace?: FrontFace[];
        /**
         * Floating-point value passed to `lineWidth()`.
         */
        lineWidth?: number[];
        /**
         * Floating-point value passed to `polygonOffset()`.  [factor, units]
         */
        polygonOffset?: number[];
        extensions?: any;
        extras?: any;
        [k: string]: any;
    }
    /**
     * Fixed-function rendering states.
     */
    interface States {
        /**
         * WebGL states to enable.
         */
        enable?: EnableState[];
        /**
         * Arguments for fixed-function rendering state functions other than `enable()`/`disable()`.
         */
        functions?: Functions;
        extensions?: any;
        extras?: any;
    }
}
declare namespace paper {
    /**
     * 传统的基础组件。
     */
    abstract class BaseComponent extends Component {
        /**
         * 该组件的游戏实体。
         */
        readonly gameObject: GameObject;
        protected _setEnabled(value: boolean): void;
        initialize(config?: any): void;
        uninitialize(): void;
        /**
         * 该组件在场景的激活状态。
         */
        readonly isActiveAndEnabled: boolean;
        /**
         *
         */
        readonly transform: egret3d.Transform;
    }
}
declare namespace egret3d {
    /**
     * glTF 资源。
     */
    abstract class GLTFAsset extends paper.Asset {
        /**
         *
         */
        static getComponentTypeCount(type: gltf.ComponentType): uint;
        /**
         *
         */
        static getAccessorTypeCount(type: gltf.AccessorType): uint;
        /**
         * @private
         */
        static createConfig(): GLTF;
        /**
         * @private
         */
        static parseFromBinary(array: Uint32Array): {
            config: GLTF;
            buffers: ArrayBufferView[];
        } | undefined;
        /**
         * Buffer 列表。
         */
        readonly buffers: Array<ArrayBufferView>;
        /**
         * 配置。
         */
        readonly config: GLTF;
        initialize(name: string, config: GLTF, buffers: ReadonlyArray<ArrayBufferView> | null, ...args: Array<any>): void;
        dispose(): boolean;
        /**
         *
         */
        updateAccessorTypeCount(): this;
        /**
         * 根据指定 BufferView 创建二进制数组。
         */
        createTypeArrayFromBufferView(bufferView: gltf.BufferView, componentType: gltf.ComponentType): ArrayBufferView;
        /**
         * 根据指定 Accessor 创建二进制数组。
         */
        createTypeArrayFromAccessor(accessor: gltf.Accessor, offset?: uint, count?: uint): ArrayBufferView;
        /**
         * 通过 Accessor 获取指定 BufferLength。
         */
        getBufferLength(accessor: gltf.Accessor): uint;
        /**
         * 通过 Accessor 获取指定 BufferOffset。
         */
        getBufferOffset(accessor: gltf.Accessor): uint;
        /**
         * 通过 Accessor 获取指定 Buffer。
         */
        getBuffer(accessor: gltf.Accessor): ArrayBufferView;
        /**
         * 通过 Accessor 获取指定 BufferView。
         */
        getBufferView(accessor: gltf.Accessor): gltf.BufferView;
        /**
         * 通过 Accessor 索引，获取指定 Accessor。
         */
        getAccessor(index: gltf.Index): gltf.Accessor;
        /**
         * 获取节点。
         */
        getNode(index: gltf.Index): gltf.Node;
    }
}
declare namespace egret3d {
    /**
     * 三维向量接口。
     */
    interface IVector3 extends IVector2 {
        /**
         * Z 轴分量。
         */
        z: float;
    }
    /**
     * 欧拉旋转顺序。
     */
    const enum EulerOrder {
        XYZ = 1,
        XZY = 2,
        YXZ = 3,
        YZX = 4,
        ZXY = 5,
        ZYX = 6,
    }
    /**
     * 三维向量。
     */
    class Vector3 extends paper.BaseRelease<Vector3> implements IVector3, paper.ICCS<Vector3>, paper.ISerializable {
        /**
         * 零向量。
         * - 请注意不要修改该值。
         */
        static readonly ZERO: Readonly<Vector3>;
        /**
         * 三方向均为一的向量。
         * - 请注意不要修改该值。
         */
        static readonly ONE: Readonly<Vector3>;
        /**
         * 三方向均为负一的向量。
         * - 请注意不要修改该值。
         */
        static readonly MINUS_ONE: Readonly<Vector3>;
        /**
         * 上向量。
         * - 请注意不要修改该值。
         */
        static readonly UP: Readonly<Vector3>;
        /**
         * 下向量。
         * - 请注意不要修改该值。
         */
        static readonly DOWN: Readonly<Vector3>;
        /**
         * 左向量。
         * - 请注意不要修改该值。
         */
        static readonly LEFT: Readonly<Vector3>;
        /**
         * 右向量。
         * - 请注意不要修改该值。
         */
        static readonly RIGHT: Readonly<Vector3>;
        /**
         * 前向量。
         * - 请注意不要修改该值。
         */
        static readonly FORWARD: Readonly<Vector3>;
        /**
         * 后向量。
         * - 请注意不要修改该值。
         */
        static readonly BACK: Readonly<Vector3>;
        private static readonly _instances;
        /**
         * 创建一个三维向量。
         * @param x X 轴分量。
         * @param y Y 轴分量。
         * @param z Z 轴分量。
         */
        static create(x?: float, y?: float, z?: float): Vector3;
        x: float;
        y: float;
        z: float;
        /**
         * 请使用 `egret3d.Vector3.create()` 创建实例。
         * @see egret3d.Vector3.create()
         * @deprecated
         * @private
         */
        constructor(x?: float, y?: float, z?: float);
        serialize(): number[];
        deserialize(value: Readonly<[float, float, float]>): this;
        copy(value: Readonly<IVector3>): this;
        clone(): Vector3;
        set(x: float, y: float, z: float): this;
        fromArray(array: ArrayLike<float>, offset?: uint): this;
        fromMatrixPosition(matrix: Readonly<Matrix4>): this;
        fromMatrixColumn(matrix: Readonly<Matrix4>, index: 0 | 1 | 2): this;
        clear(): this;
        /**
         * 判断该向量是否和一个向量相等。
         * @param value 一个向量。
         * @param threshold 阈值。
         */
        equal(value: Readonly<IVector3>, threshold?: float): boolean;
        /**
         * 归一化该向量。
         * - v /= v.length
         */
        normalize(): this;
        /**
         * 将输入向量的归一化结果写入该向量。
         * - v = input / input.length
         * @param input 输入向量。
         */
        normalize(input: Readonly<IVector3>): this;
        normalize(input: Readonly<IVector3>, defaultVector: Readonly<IVector3>): this;
        /**
         * 归一化该向量，并使该向量垂直于自身。
         * - 向量长度不能为 `0` 。
         */
        orthoNormal(): this;
        /**
         * 归一化该向量，并使该向量垂直于输入向量。
         * @param input 输入向量。
         * - 向量长度不能为 `0` 。
         */
        orthoNormal(input: Readonly<IVector3>): this;
        /**
         * 反转该向量。
         */
        negate(): this;
        /**
         * 将输入向量的反转结果写入该向量。
         * @param input 输入向量。
         */
        negate(input: Readonly<IVector3>): this;
        /**
         * 通过一个球面坐标设置该向量。
         * @param vector 一个球面坐标。
         * - x：球面半径，y：极角，z：赤道角
         */
        fromSphericalCoords(vector: Readonly<IVector3>): this;
        /**
         * @param radius 从球面半径或球面一点到球原点的欧氏距离（直线距离）。
         * @param phi 相对于 Y 轴的极角。
         * @param theta 围绕 Y 轴的赤道角。
         */
        fromSphericalCoords(radius: float, phi: float, theta: float): this;
        /**
         * 将该向量乘以一个 3x3 矩阵。
         * - v *= matrix
         * @param matrix 一个 3x3 矩阵。
         */
        applyMatrix3(matrix: Readonly<Matrix3 | Matrix4>): this;
        /**
         * 将输入向量与一个 3x3 矩阵相乘的结果写入该向量。
         * - v = input * matrix
         * @param matrix 一个 3x3 矩阵。
         * @param input 输入向量。
         */
        applyMatrix3(matrix: Readonly<Matrix3 | Matrix4>, input: Readonly<IVector3>): this;
        /**
         * 将该向量乘以一个矩阵。
         * - v *= matrix
         * @param matrix 一个矩阵。
         */
        applyMatrix(matrix: Readonly<Matrix4>): this;
        /**
         * 将输入向量与一个矩阵相乘的结果写入该向量。
         * - v = input * matrix
         * @param matrix 一个矩阵。
         * @param input 输入向量。
         */
        applyMatrix(matrix: Readonly<Matrix4>, input: Readonly<IVector3>): this;
        /**
         * 将该向量乘以一个矩阵。
         * - v *= matrix
         * - 矩阵的平移数据不会影响向量。
         * - 结果被归一化。
         * @param matrix 一个矩阵。
         */
        applyDirection(matrix: Readonly<Matrix4>): this;
        /**
         * 将输入向量与一个矩阵相乘的结果写入该向量。
         * - v = input * matrix
         * - 矩阵的平移数据不会影响向量。
         * - 结果被归一化。
         * @param matrix 一个矩阵。
         * @param input 输入向量。
         */
        applyDirection(matrix: Readonly<Matrix4>, input: Readonly<IVector3>): this;
        /**
         * 将该向量乘以一个四元数。
         * - v *= quaternion
         * @param quaternion 一个四元数。
         */
        applyQuaternion(quaternion: Readonly<IVector4>): this;
        /**
         * 将输入向量与一个四元数相乘的结果写入该向量。
         * - v = input * quaternion
         * @param quaternion 一个四元数。
         * @param input 输入向量。
         */
        applyQuaternion(quaternion: Readonly<IVector4>, input: Readonly<IVector3>): this;
        /**
         * 将该向量加上一个标量。
         * - v += scalar
         * @param scalar 标量。
         */
        addScalar(scalar: float): this;
        /**
         * 将输入向量与标量相加的结果写入该向量。
         * - v = input + scalar
         * @param scalar 一个标量。
         * @param input 输入向量。
         */
        addScalar(scalar: float, input: Readonly<IVector3>): this;
        /**
         * 将该向量乘以一个标量。
         * - v *= scalar
         * @param scalar 标量。
         */
        multiplyScalar(scalar: float): this;
        /**
         * 将输入向量与标量相乘的结果写入该向量。
         * - v = input * scalar
         * @param scalar 一个标量。
         * @param input 输入向量。
         */
        multiplyScalar(scalar: float, input: Readonly<IVector3>): this;
        /**
         * 将该向量加上一个向量。
         * - v += vector
         * @param vector 一个向量。
         */
        add(vector: Readonly<IVector3>): this;
        /**
         * 将两个向量相加的结果写入该向量。
         * - v = vectorA + vectorB
         * @param vectorA 一个向量。
         * @param vectorB 另一个向量。
         */
        add(vectorA: Readonly<IVector3>, vectorB: Readonly<IVector3>): this;
        /**
         * 将该向量减去一个向量。
         * - v -= vector
         * @param vector 一个向量。
         */
        subtract(vector: Readonly<IVector3>): this;
        /**
         * 将两个向量相减的结果写入该向量。
         * - v = vectorA - vectorB
         * @param vectorA 一个向量。
         * @param vectorB 另一个向量。
         */
        subtract(vectorA: Readonly<IVector3>, vectorB: Readonly<IVector3>): this;
        /**
         * 将该向量乘以一个向量。
         * - v *= vector
         * @param vector 一个向量。
         */
        multiply(vector: Readonly<IVector3>): this;
        /**
         * 将该两个向量相乘的结果写入该向量。
         * - v = vectorA * vectorA
         * @param vectorA 一个向量。
         * @param vectorB 另一个向量。
         */
        multiply(vectorA: Readonly<IVector3>, vectorB: Readonly<IVector3>): this;
        /**
         * 将该向量除以一个向量。
         * -  v /= vector
         * - 假设除向量分量均不为零。
         * @param vector 一个向量。
         */
        divide(vector: Readonly<IVector3>): this;
        /**
         * 将两个向量相除的结果写入该向量。
         * -  v = vectorA / vectorB
         * - 假设除向量分量均不为零。
         * @param vectorA 一个向量。
         * @param vectorB 另一个向量。
         */
        divide(vectorA: Readonly<IVector3>, vectorB: Readonly<IVector3>): this;
        /**
         * 将该向量与一个向量相点乘。
         * - v · vector
         * @param vector 一个向量。
         */
        dot(vector: Readonly<IVector3>): float;
        /**
         * 将该向量叉乘以一个向量。
         * - v ×= vector
         * @param vector 一个向量。
         */
        cross(vector: Readonly<IVector3>): this;
        /**
         * 将两个向量相叉乘的结果写入该向量。
         * - v = vectorA × vectorB
         * @param vectorA 一个向量。
         * @param vectorB 另一个向量。
         */
        cross(vectorA: Readonly<IVector3>, vectorB: Readonly<IVector3>): this;
        /**
         * 将该向量和目标向量插值的结果写入该向量。
         * - v = v * (1 - t) + to * t
         * - 插值因子不会被限制在 0 ~ 1。
         * @param to 目标向量。
         * @param t 插值因子。
         */
        lerp(to: Readonly<IVector3>, t: float): this;
        /**
         * 将两个向量插值的结果写入该向量。
         * - v = from * (1 - t) + to * t
         * - 插值因子不会被限制在 0 ~ 1。
         * @param from 起始向量。
         * @param to 目标向量。
         * @param t 插值因子。
         */
        lerp(from: Readonly<IVector3>, to: Readonly<IVector3>, t: float): this;
        /**
         * @deprecated
         */
        lerp(t: float, to: Readonly<IVector3>): this;
        /**
         * @deprecated
         */
        lerp(t: float, from: Readonly<IVector3>, to: Readonly<IVector3>): this;
        /**
         *
         */
        slerp(to: Readonly<Vector3>, t: float): this;
        slerp(from: Readonly<Vector3>, to: Readonly<Vector3>, t: float): this;
        /**
         * 将该向量与一个向量的分量取最小值。
         * @param vector 一个向量。
         */
        min(vector: Readonly<IVector3>): this;
        /**
         * 将两个向量的分量的最小值写入该向量。
         * @param vectorA 一个向量。
         * @param vectorB 另一个向量。
         */
        min(vectorA: Readonly<IVector3>, vectorB: Readonly<IVector3>): this;
        /**
         * 将该向量与一个向量的分量取最大值。
         * @param vector 一个向量。
         */
        max(vector: Readonly<IVector3>): this;
        /**
         * 将两个向量的分量的最大值写入该向量。
         * @param vectorA 一个向量。
         * @param vectorB 另一个向量。
         */
        max(vectorA: Readonly<IVector3>, vectorB: Readonly<IVector3>): this;
        /**
         * 限制该向量，使其在最小向量和最大向量之间。
         * @param min 最小向量。
         * @param max 最大向量。
         */
        clamp(min: Readonly<IVector3>, max: Readonly<IVector3>): this;
        /**
         * 将限制输入向量在最小向量和最大向量之间的结果写入该向量。
         * @param min 最小向量。
         * @param max 最大向量。
         * @param input 输入向量。
         */
        clamp(min: Readonly<IVector3>, max: Readonly<IVector3>, input: Readonly<IVector3>): this;
        /**
         * 沿着一个法线向量反射该向量。
         * - 假设法线已被归一化。
         * @param normal 一个法线向量。
         */
        reflect(normal: Readonly<IVector3>): this;
        /**
         * 将沿着一个法线向量反射输入向量的结果写入该向量。
         * @param normal 一个法线向量。
         * @param input 输入向量。
         */
        reflect(normal: Readonly<IVector3>, input: Readonly<Vector3>): this;
        /**
         * 获取一个向量和该向量的夹角。
         * - 弧度制。
         * @param vector 一个向量。
         */
        getAngle(vector: Readonly<Vector3>): float;
        /**
         * 获取一点到该点的欧氏距离（直线距离）的平方。
         * @param point 一个点。
         */
        getSquaredDistance(point: Readonly<IVector3>): float;
        /**
         * 获取一点到该点的欧氏距离（直线距离）。
         * @param point 一个点。
         */
        getDistance(point: Readonly<IVector3>): float;
        /**
         * 将该向量转换为数组。
         * @param array 数组。
         * @param offset 数组偏移。
         */
        toArray(array?: float[] | Float32Array | null, offset?: uint): float[] | Float32Array;
        /**
         * 该向量的长度。
         * - 该值是实时计算的。
         */
        readonly length: float;
        /**
         * 该向量的长度的平方。
         * - 该值是实时计算的。
         */
        readonly squaredLength: float;
        /**
         * @deprecated
         */
        static set(x: float, y: float, z: float, out: Vector3): Vector3;
        /**
         * @deprecated
         */
        static normalize(v: Vector3): Vector3;
        /**
         * @deprecated
         */
        static copy(v: Vector3, out: Vector3): Vector3;
        /**
         * @deprecated
         */
        static add(v1: Vector3, v2: Vector3, out: Vector3): Vector3;
        /**
         * @deprecated
         */
        static multiply(v1: Vector3, v2: Vector3, out: Vector3): Vector3;
        /**
         * @deprecated
         */
        static scale(v: Vector3, scale: float): Vector3;
        /**
         * @deprecated
         */
        static cross(lhs: IVector3, rhs: IVector3, out: IVector3): IVector3;
        /**
         * @deprecated
         */
        static dot(v1: Vector3, v2: Vector3): float;
        /**
         * @deprecated
         */
        static lerp(v1: Vector3, v2: Vector3, v: float, out: Vector3): Vector3;
        /**
         * @deprecated
         */
        static equal(v1: Vector3, v2: Vector3, threshold?: float): boolean;
        /**
         * @deprecated
         */
        static subtract(v1: Readonly<IVector3>, v2: Readonly<IVector3>, out: IVector3): IVector3;
        /**
         * @deprecated
         */
        static getSqrLength(v: Readonly<IVector3>): number;
        /**
         * @deprecated
         */
        static getLength(v: Readonly<IVector3>): number;
        /**
         * @deprecated
         */
        static getDistance(a: Readonly<IVector3>, b: Readonly<IVector3>): number;
    }
}
declare namespace paper {
    /**
     * 基础实体。
     */
    abstract class Entity extends BaseObject implements IEntity {
        /**
         * 当实体添加到场景时派发事件。
         */
        static readonly onEntityAddedToScene: signals.Signal<IEntity>;
        /**
         * 当实体将要被销毁时派发事件。
         */
        static readonly onEntityDestroy: signals.Signal<IEntity>;
        /**
         * 当实体被销毁时派发事件。
         */
        static readonly onEntityDestroyed: signals.Signal<IEntity>;
        /**
         *
         */
        static createDefaultEnabled: boolean;
        name: string;
        tag: DefaultTags | string;
        hideFlags: HideFlags;
        extras?: EntityExtras;
        protected _componentsDirty: boolean;
        protected _isDestroyed: boolean;
        protected _enabled: boolean;
        protected readonly _components: (IComponent | undefined)[];
        protected readonly _cachedComponents: IComponent[];
        protected _scene: Scene | null;
        /**
         * 禁止实例化实体。
         * @protected
         */
        constructor();
        protected _destroy(): void;
        protected _setScene(value: Scene | null, dispatchEvent: boolean): void;
        protected _setEnabled(value: boolean): void;
        protected _addComponent(component: IComponent, config?: any): void;
        private _getComponent(componentClass);
        private _isRequireComponent(componentClass);
        initialize(): void;
        uninitialize(): void;
        destroy(): boolean;
        addComponent<T extends IComponent>(componentClass: IComponentClass<T>, config?: any): T;
        removeComponent<T extends IComponent>(componentInstanceOrClass: IComponentClass<T> | T, isExtends?: boolean): boolean;
        removeAllComponents<T extends IComponent>(componentClass?: IComponentClass<T>, isExtends?: boolean): boolean;
        getOrAddComponent<T extends IComponent>(componentClass: IComponentClass<T>, isExtends?: boolean): T;
        getComponent<T extends IComponent>(componentClass: IComponentClass<T>, isExtends?: boolean): T | null;
        getRemovedComponent<T extends IComponent>(componentClass: IComponentClass<T>): T | null;
        getComponents<T extends IComponent>(componentClass: IComponentClass<T>, isExtends?: boolean): T[];
        hasComponents(componentClasses: IComponentClass<IComponent>[], componentEnabled: boolean): boolean;
        hasAnyComponents(componentClasses: IComponentClass<IComponent>[], componentEnabled: boolean): boolean;
        readonly isDestroyed: boolean;
        dontDestroy: boolean;
        enabled: boolean;
        readonly components: ReadonlyArray<IComponent>;
        scene: Scene;
    }
}
declare namespace egret3d {
    /**
     * 三角形。
     */
    class Triangle extends paper.BaseRelease<Triangle> implements paper.ICCS<Triangle>, paper.ISerializable, IRaycast {
        private static readonly _instances;
        /**
         * 创建一个三角形实例。
         * -   a
         * -  /·\
         * - b - c
         * @param a 点 A。
         * @param b 点 B。
         * @param c 点 C。
         */
        static create(a?: Readonly<IVector3>, b?: Readonly<IVector3>, c?: Readonly<IVector3>): Triangle;
        /**
         * 通过三个点确定一个三角形，获取该三角形的法线。
         * -   a
         * -  /·\
         * - b - c
         * @param a 点 A。
         * @param b 点 B。
         * @param c 点 C。
         * @param out 法线结果。
         */
        static getNormal(a: Readonly<IVector3>, b: Readonly<IVector3>, c: Readonly<IVector3>, out: Vector3): Vector3;
        /**
         * 点 A。
         */
        readonly a: Vector3;
        /**
         * 点 B。
         */
        readonly b: Vector3;
        /**
         * 点 C。
         */
        readonly c: Vector3;
        /**
         * 请使用 `egret3d.Triangle.create()` 创建实例。
         * @see egret3d.Triangle.create()
         */
        private constructor();
        serialize(): number[];
        deserialize(element: Readonly<[number, number, number, number, number, number, number, number, number]>): void;
        copy(value: Readonly<Triangle>): this;
        clone(): Triangle;
        set(a?: Readonly<IVector3>, b?: Readonly<IVector3>, c?: Readonly<IVector3>): this;
        fromArray(array: ArrayLike<number>, offsetA?: number, offsetB?: number, offsetC?: number): void;
        /**
         * 获取该三角形的中心点。
         * @param out 输出。
         */
        getCenter(out?: Vector3): Vector3;
        /**
         * 获取该三角形的法线。
         * @param out 输出。
         */
        getNormal(out?: Vector3): Vector3;
        /**
         *
         * @param u
         * @param v
         * @param out
         */
        getPointAt(u: number, v: number, out?: Vector3): Vector3;
        /**
         * 获取一个点到该三角形的最近点。
         * @param point 一个点。
         * @param out 最近点。
         */
        getClosestPointToPoint(point: Readonly<IVector3>, out?: Vector3): Vector3;
        raycast(ray: Readonly<Ray>, raycastInfo?: RaycastInfo | null): boolean;
        /**
         * 获取该三角形的面积。
         * - 该值是实时计算的。
         */
        readonly area: number;
    }
}
declare namespace egret3d {
    /**
     *
     */
    interface CreateTextureParameters extends gltf.Sampler, GLTFTextureExtension {
        /**
         * 纹理数据源。
         */
        source?: gltf.ImageSource | ArrayBufferView | null;
    }
    const enum FilterMode {
        Point = 0,
        Bilinear = 1,
        Trilinear = 2,
    }
    /**
     * 基础纹理资源。
     * - 纹理资源的基类。
     */
    abstract class BaseTexture extends GLTFAsset {
        protected static _createConfig(createTextureParameters: CreateTextureParameters): GLTF;
        type: gltf.TextureType;
        protected _sourceDirty: boolean;
        protected _levels: uint;
        protected _gltfTexture: GLTFTexture;
        protected _image: gltf.Image;
        protected _sampler: gltf.Sampler;
        private _formatLevelsAndSampler();
        /**
         *
         */
        setLiner(value: boolean | FilterMode): this;
        /**
         *
         */
        setRepeat(value: boolean): this;
        /**
         *
         */
        setMipmap(value: boolean): this;
        /**
         *
         */
        readonly isPowerOfTwo: boolean;
        /**
         *
         */
        readonly format: gltf.TextureFormat;
        /**
         *
         */
        readonly levels: uint;
        /**
         *
         */
        readonly width: uint;
        /**
         *
         */
        readonly height: uint;
        /**
         *
         */
        readonly sampler: gltf.Sampler;
        /**
         *
         */
        readonly gltfTexture: GLTFTexture;
    }
    /**
     * 纹理资源。
     */
    class Texture extends BaseTexture {
        /**
         *
         * @param parameters
         */
        static create(parameters: CreateTextureParameters): Texture;
        /**
         * @private
         */
        static create(name: string, config: GLTF, buffers?: ReadonlyArray<ArrayBufferView>): Texture;
        /**
         *
         */
        static createColorTexture(name: string, r: number, g: number, b: number): Texture;
        /**
         *
         * @param source
         */
        uploadTexture(source?: ArrayBuffer | gltf.ImageSource): this;
    }
}
declare namespace paper {
    /**
     * 基础渲染组件。
     */
    abstract class BaseRenderer extends BaseComponent implements egret3d.IRaycast, egret3d.ITransformObserver {
        /**
         * 当渲染组件的材质列表改变时派发事件。
         */
        static readonly onMaterialsChanged: signals.Signal<BaseRenderer>;
        /**
         * 该组件是否开启视锥剔除。
         */
        frustumCulled: boolean;
        private _boundingSphereDirty;
        protected _receiveShadows: boolean;
        protected _castShadows: boolean;
        protected readonly _boundingSphere: egret3d.Sphere;
        protected readonly _localBoundingBox: egret3d.Box;
        protected readonly _materials: (egret3d.Material | null)[];
        protected _recalculateSphere(): void;
        initialize(): void;
        uninitialize(): void;
        /**
         * @private
         */
        onTransformChange(): void;
        /**
         * 重新计算 AABB。
         */
        abstract recalculateLocalBox(): void;
        abstract raycast(ray: Readonly<egret3d.Ray>, raycastInfo: egret3d.RaycastInfo | null): boolean;
        /**
         *
         */
        getBoundingTransform(): egret3d.Transform;
        /**
         * 该组件是否接收投影。
         */
        receiveShadows: boolean;
        /**
         * 该组件是否产生投影。
         */
        castShadows: boolean;
        /**
         * 该组件的本地包围盒。
         */
        readonly localBoundingBox: Readonly<egret3d.Box>;
        /**
         * 基于该组件本地包围盒生成的世界包围球，用于摄像机视锥剔除。
         */
        readonly boundingSphere: Readonly<egret3d.Sphere>;
        /**
         * 该组件的材质列表。
         */
        materials: ReadonlyArray<egret3d.Material | null>;
        /**
         * 该组件材质列表中的第一个材质。
         */
        material: egret3d.Material | null;
        /**
         * @deprecated
         */
        readonly aabb: Readonly<egret3d.Box>;
    }
}
declare namespace egret3d {
    /**
     * 射线检测信息。
     */
    class RaycastInfo extends paper.BaseRelease<RaycastInfo> {
        private static readonly _instances;
        /**
         * 创建一个射线检测信息实例。
         */
        static create(): RaycastInfo;
        /**
         *
         */
        backfaceCulling: boolean;
        /**
         *
         */
        modifyNormal: boolean;
        /**
         *
         */
        subMeshIndex: int;
        /**
         *
         */
        triangleIndex: int;
        /**
         * 交点到射线起始点的距离。
         * - 如果未相交则为 -1.0。
         */
        distance: number;
        /**
         * 相交的点。
         */
        readonly position: Vector3;
        /**
         * 三角形或几何面相交的 UV 坐标。
         */
        readonly coord: Vector2;
        /**
         * 相交的法线向量。
         * - 设置该值，将会在检测时计算相交的法线向量，并将结果写入该值。
         * - 默认为 `null` ，不计算。
         */
        normal: Vector3 | null;
        /**
         *
         */
        textureCoordA: Vector2 | null;
        /**
         *
         */
        textureCoordB: Vector2 | null;
        /**
         * 相交的变换组件。（如果有的话）
         */
        transform: Transform | null;
        /**
         * 相交的碰撞组件。（如果有的话）
         */
        collider: ICollider | null;
        /**
         * 相交的刚体组件。（如果有的话）
         */
        rigidbody: IRigidbody | null;
        private constructor();
        onClear(): void;
        copy(value: Readonly<RaycastInfo>): this;
        clear(): this;
    }
}
declare namespace paper {
    /**
     * 基础预制体资源。
     * - 预制体资源和场景资源的基类。
     */
    abstract class BasePrefabAsset extends Asset {
        /**
         *
         */
        readonly config: ISerializedData;
        constructor(config: ISerializedData, name: string);
        dispose(): boolean;
        disposeAssets(): void;
    }
    /**
     * 预制体资源。
     */
    class Prefab extends BasePrefabAsset {
        /**
         * 通过预置体资源创建一个实体实例到激活或指定的场景。
         * @param name 资源的名称。
         */
        static create(name: string): GameObject | null;
        /**
         * @param name 资源的名称。
         * @param x X 坐标。
         * @param y Y 坐标。
         * @param z Z 坐标。
         */
        static create(name: string, x: number, y: number, z: number): GameObject | null;
        /**
         * @param name 资源的名称。
         * @param scene 指定的场景。
         */
        static create(name: string, scene: IScene): GameObject | null;
        /**
         * @param name 资源的名称。
         * @param x X 坐标。
         * @param y Y 坐标。
         * @param z Z 坐标。
         * @param scene 指定的场景。
         */
        static create(name: string, x: number, y: number, z: number, scene: IScene): GameObject | null;
        /**
         * @deprecated
         */
        createInstance(scene?: IScene | null, keepUUID?: boolean): GameObject | null;
    }
}
declare namespace egret3d {
    /**
     * 全局渲染状态组件。
     */
    class RenderState extends paper.BaseComponent {
        version: string;
        standardDerivativesEnabled: boolean;
        textureFloatEnabled: boolean;
        fragDepthEnabled: boolean;
        textureFilterAnisotropic: EXT_texture_filter_anisotropic | null;
        shaderTextureLOD: any;
        maxTextures: uint;
        maxVertexTextures: uint;
        maxTextureSize: uint;
        maxCubemapSize: uint;
        maxRenderBufferize: uint;
        maxVertexUniformVectors: uint;
        maxAnisotropy: uint;
        maxBoneCount: uint;
        maxPrecision: string;
        commonExtensions: string;
        vertexExtensions: string;
        fragmentExtensions: string;
        commonDefines: string;
        vertexDefines: string;
        fragmentDefines: string;
        readonly defines: Defines;
        readonly defaultCustomShaderChunks: Readonly<{
            [key: string]: string;
        }>;
        /**
         *
         */
        readonly caches: {
            useLightMap: boolean;
            castShadows: boolean;
            receiveShadows: boolean;
            cullingMask: paper.Layer;
            attributeCount: number;
            boneCount: number;
            egret2DOrderCount: number;
            clockBuffer: Float32Array;
            skyBoxTexture: BaseTexture | null;
        };
        customShaderChunks: {
            [key: string]: string;
        } | null;
        /**
         *
         */
        render: (camera: Camera, material?: Material, renderTarget?: RenderTexture) => void;
        /**
         *
         */
        draw: (drawCall: DrawCall, material?: Material | null) => void;
        protected readonly _viewport: Rectangle;
        protected readonly _clearColor: Color;
        protected readonly _colorMask: [boolean, boolean, boolean, boolean];
        protected _clearDepth: number;
        protected _depthMask: boolean;
        protected _clearStencil: number;
        protected _renderTarget: RenderTexture | null;
        private _logarithmicDepthBuffer;
        private _gammaInput;
        private _gammaOutput;
        private _gammaFactor;
        private _toneMapping;
        protected readonly _stateEnables: ReadonlyArray<gltf.EnableState>;
        protected readonly _cacheStateEnable: {
            [key: string]: boolean | undefined;
        };
        protected _getCommonExtensions(): void;
        protected _getCommonDefines(): void;
        protected _getEncodingComponents(encoding: TextureEncoding): string[];
        protected _getToneMappingFunction(toneMapping: ToneMapping): string;
        protected _getTexelEncodingFunction(functionName: string, encoding: TextureEncoding): string;
        protected _getTexelDecodingFunction(functionName: string, encoding: TextureEncoding): string;
        protected _setViewport(value: Readonly<Rectangle>): void;
        protected _setRenderTarget(value: RenderTexture | null): void;
        protected _setColorMask(value: Readonly<[boolean, boolean, boolean, boolean]>): void;
        initialize(): void;
        /**
         * 根据BufferMask清除缓存
         */
        clearBuffer(bufferBit: gltf.BufferMask): void;
        /**
         * 将像素复制到2D纹理图像中
         * TODO 微信上不可用
         */
        copyFramebufferToTexture(screenPostion: Vector2, target: BaseTexture, level?: uint): void;
        /**
         *
         */
        clearState(): void;
        /**
         * 设置视口
         */
        viewport: Readonly<Rectangle>;
        /**
         * 指定清除的颜色值
         */
        clearColor: Readonly<Color>;
        /**
         * 指定是否可以写入帧缓冲区中的各个颜色分量
         */
        colorMask: Readonly<[boolean, boolean, boolean, boolean]>;
        /**
         * 指定清除的深度值
         */
        clearDepth: number;
        /**
         * 指定写入模板缓存区的清除值
         */
        clearStencil: number;
        /**
         * 指定要绑定的渲染目标
         */
        renderTarget: RenderTexture | null;
        /**
         *
         */
        logarithmicDepthBuffer: boolean;
        /**
         *
         */
        gammaInput: boolean;
        /**
         *
         */
        gammaOutput: boolean;
        /**
         *
         */
        gammaFactor: float;
        /**
         *
         */
        toneMapping: ToneMapping;
        /**
         * 是否预乘
         */
        premultipliedAlpha: boolean;
        /**
         *
         */
        toneMappingExposure: float;
        /**
         *
         */
        toneMappingWhitePoint: float;
        /**
        * @deprecated
        */
        updateViewport(viewport: Rectangle): void;
        /**
         * @deprecated
         */
        updateRenderTarget(renderTarget: RenderTexture | null): void;
    }
    /**
     * 全局渲染状态组件实例。
     */
    const renderState: RenderState;
}
declare namespace egret3d {
    /**
     * 四维向量接口。
     */
    interface IVector4 extends IVector3 {
        /**
         * W 轴分量。
         */
        w: float;
    }
    /**
     * 四维向量。
     */
    class Vector4 extends paper.BaseRelease<Vector4> implements IVector4, paper.ICCS<Vector4>, paper.ISerializable {
        protected static readonly _instances: Vector4[];
        /**
         * 创建一个四维向量。
         * @param x X 轴分量。
         * @param y Y 轴分量。
         * @param z Z 轴分量。
         * @param w W 轴分量。
         */
        static create(x?: float, y?: float, z?: float, w?: float): Vector4;
        x: float;
        y: float;
        z: float;
        w: float;
        /**
         * 请使用 `egret3d.Vector4.create(); egret3d.Quaternion.create()` 创建实例。
         * @see egret3d.Quaternion.create()
         * @see egret3d.Vector4.create()
         * @deprecated
         */
        constructor(x?: float, y?: float, z?: float, w?: float);
        serialize(): number[];
        deserialize(value: Readonly<[float, float, float, float]>): this;
        copy(value: Readonly<IVector4>): this;
        clone(): Vector4;
        set(x: float, y: float, z: float, w: float): this;
        clear(): this;
        fromArray(value: ArrayLike<float>, offset?: uint): this;
        /**
         * 判断该向量是否和一个向量相等。
         * @param value 一个向量。
         * @param threshold 阈值。
         */
        equal(value: Readonly<IVector4>, threshold?: float): boolean;
        /**
         * 归一化该向量。
         * - v /= v.length
         */
        normalize(): this;
        /**
         * 将输入向量的归一化结果写入该向量。
         * - v = input / input.length
         * @param input 输入向量。
         */
        normalize(input: Readonly<IVector4>): this;
        /**
         * 反转该向量。
         */
        inverse(): this;
        /**
         * 将输入向量的反转结果写入该向量。
         * @param input 输入向量。
         */
        inverse(input: Readonly<IVector4>): this;
        /**
         * 向量与标量相乘运算。
         * - `v.multiplyScalar(scalar)` 将该向量与标量相乘，相当于 v *= scalar。
         * - `v.multiplyScalar(scalar, input)` 将输入向量与标量相乘的结果写入该向量，相当于 v = input * scalar。
         * @param scalar 标量。
         * @param input 输入向量。
         */
        multiplyScalar(scalar: float, input?: Readonly<IVector4> | null): this;
        /**
         * 将该向量与一个向量相点乘。
         * - v · vector
         * @param vector 一个向量。
         */
        dot(vector: Readonly<IVector4>): float;
        /**
         * 将该向量和目标向量插值的结果写入该向量。
         * - v = v * (1 - t) + to * t
         * - 插值因子不会被限制在 0 ~ 1。
         * @param to 目标矩阵。
         * @param t 插值因子。
         */
        lerp(to: Readonly<IVector4>, t: float): this;
        /**
         * 将两个向量插值的结果写入该向量。
         * - v = from * (1 - t) + to * t
         * - 插值因子不会被限制在 0 ~ 1。
         * @param from 起始矩阵。
         * @param to 目标矩阵。
         * @param t 插值因子。
         */
        lerp(from: Readonly<IVector4>, to: Readonly<IVector4>, t: float): this;
        /**
         * @deprecated
         */
        lerp(t: float, to: Readonly<IVector4>): this;
        /**
         * @deprecated
         */
        lerp(t: float, from: Readonly<IVector4>, to: Readonly<IVector4>): this;
        /**
         * 将该向量转换为数组。
         * @param array 数组。
         * @param offset 数组偏移。
         */
        toArray(array?: float[] | Float32Array | null, offset?: float): number[] | Float32Array;
        /**
         * 该向量的长度。
         * - 该值是实时计算的。
         */
        readonly length: float;
        /**
         * 该向量的长度的平方。
         * - 该值是实时计算的。
         */
        readonly squaredLength: float;
    }
}
declare namespace egret3d {
    /**
     * 4x4 矩阵。
     */
    class Matrix4 extends paper.BaseRelease<Matrix4> implements paper.ICCS<Matrix4>, paper.ISerializable {
        private static readonly _instances;
        /**
         * 创建一个矩阵。
         * @param arrayBuffer
         * @param byteOffset
         */
        static create(arrayBuffer?: ArrayBuffer | null, byteOffset?: uint): Matrix4;
        /**
         * 该矩阵的数据。
         */
        readonly rawData: Float32Array;
        /**
         * 请使用 `egret3d.Matrix4.create()` 创建实例。
         * @see egret3d.Matrix4.create()
         */
        private constructor();
        serialize(): Float32Array;
        deserialize(value: Readonly<[float, float, float, float, float, float, float, float, float, float, float, float, float, float, float, float]>): this;
        copy(value: Readonly<Matrix4>): this;
        clone(): this;
        set(n11: float, n12: float, n13: float, n14: float, n21: float, n22: float, n23: float, n24: float, n31: float, n32: float, n33: float, n34: float, n41: float, n42: float, n43: float, n44: float): this;
        /**
         * 将该矩阵转换为恒等矩阵。
         */
        identity(): this;
        /**
         * 通过类数组中的数值设置该矩阵。
         * @param array 类数组。
         * @param offset 索引偏移。
         * - 默认 `0`。
         */
        fromArray(array: ArrayLike<float>, offset?: uint): this;
        /**
         *
         */
        fromBuffer(buffer: ArrayBuffer, byteOffset?: uint): this;
        /**
         * 通过平移向量设置该矩阵。
         * @param translate 平移向量。
         * @param rotationAndScaleStays 是否保留该矩阵的旋转和数据。
         * - 默认 `false`。
         */
        fromTranslate(translate: Readonly<IVector3>, rotationAndScaleStays?: boolean): this;
        /**
         * 通过四元数旋转设置该矩阵。
         * @param rotation 四元数旋转。
         * @param translateStays 是否保留该矩阵的平移数据。
         * - 默认 `false`。
         */
        fromRotation(rotation: Readonly<IVector4>, translateStays?: boolean): this;
        /**
         * 通过欧拉旋转设置该矩阵。
         * @param euler 欧拉旋转。
         * @param order 欧拉旋转顺序。
         * - 默认 `egret3d.EulerOrder.YXZ`。
         * @param translateStays 是否保留该矩阵的平移数据。
         * - 默认 `false`。
         */
        fromEuler(euler: Readonly<IVector3>, order?: EulerOrder, translateStays?: boolean): this;
        /**
         * 通过缩放向量设置该矩阵。
         * @param scale 缩放向量。
         * @param translateStays 是否保留该矩阵的平移数据。
         * - 默认 `false`。
         */
        fromScale(scale: Readonly<IVector3>, translateStays?: boolean): this;
        /**
         * 通过绕 X 轴的旋转角度设置该矩阵。
         * @param angle 旋转角。
         * - 弧度制。
         */
        fromRotationX(angle: float): this;
        /**
         * 通过绕 Y 轴的旋转角度设置该矩阵。
         * @param angle 旋转角。
         * - 弧度制。
         */
        fromRotationY(angle: float): this;
        /**
         * 通过绕 Z 轴的旋转角度设置该矩阵。
         * @param angle 旋转角。
         * - 弧度制。
         */
        fromRotationZ(angle: float): this;
        /**
         * 通过旋转轴设置该矩阵。
         * - 假设旋转轴已被归一化。
         * @param axis 旋转轴。
         * @param angle 旋转角。
         * - 弧度制。
         */
        fromAxis(axis: Readonly<IVector3>, angle: float): this;
        perspectiveProjectMatrix(left: float, right: float, top: float, bottom: float, near: float, far: float): this;
        orthographicProjectMatrix(left: float, right: float, top: float, bottom: float, near: float, far: float): this;
        /**
         * 根据投影参数设置该矩阵。
         * @param offsetX 投影近平面水平偏移。
         * @param offsetY 投影远平面垂直偏移。
         * @param near 投影近平面。
         * @param far 投影远平面。
         * @param fov 投影视角。
         * - 透视投影时生效。
         * @param size 投影尺寸。
         * - 正交投影时生效。
         * @param opvalue 透视投影和正交投影的插值系数。
         * - `0.0` ~ `1.0`
         * - `0.0` 正交投影。
         * - `1.0` 透视投影。
         * @param asp 投影宽高比。
         * @param matchFactor 宽高适配的插值系数。
         * - `0.0` ~ `1.0`
         * - `0.0` 以宽适配。
         * - `1.0` 以高适配。
         */
        fromProjection(near: float, far: float, fov: float, size: float, opvalue: float, asp: float, matchFactor: float, viewport?: Rectangle | null): this;
        /**
         * 通过 X、Y、Z 轴设置该矩阵。
         * @param axisX X 轴。
         * @param axisY Y 轴。
         * @param axisZ Z 轴。
         */
        fromAxises(axisX: Readonly<IVector3>, axisY: Readonly<IVector3>, axisZ: Readonly<IVector3>): this;
        /**
         * 通过平移向量、四元数旋转、缩放向量设置该矩阵。
         * @param translation 平移向量。
         * @param rotation 四元数旋转。
         * @param scale 缩放向量。
         */
        compose(translation: Readonly<IVector3>, rotation: Readonly<IVector4>, scale: Readonly<IVector3>): this;
        /**
         * 将该矩阵分解为平移向量、四元数旋转、缩放向量。
         * @param translation 平移向量。
         * @param rotation 四元数旋转。
         * @param scale 缩放向量。
         */
        decompose(translation?: IVector3 | null, rotation?: Quaternion | null, scale?: IVector3 | null): this;
        /**
         *
         */
        extractRotation(): this;
        /**
         *
         * @param input
         */
        extractRotation(input: Readonly<Matrix4>): this;
        /**
         * 转置该矩阵。
         */
        transpose(): this;
        /**
         * 将输入矩阵转置的结果写入该矩阵。
         * @param input 输入矩阵。
         */
        transpose(input: Readonly<Matrix4>): this;
        /**
         * 将该矩阵求逆。
         */
        inverse(): this;
        /**
         * 将输入矩阵的逆矩阵写入该矩阵。
         * @param input 输入矩阵。
         */
        inverse(input: Readonly<Matrix4>): this;
        /**
         * 将该矩阵乘以一个标量。
         * - v *= scaler
         * @param scalar 标量。
         */
        multiplyScalar(scalar: float): this;
        /**
         * 将输入矩阵与一个标量相乘的结果写入该矩阵。
         * - v = input * scaler
         * @param scalar 标量。
         * @param input 输入矩阵。
         */
        multiplyScalar(scalar: float, input: Readonly<Matrix4>): this;
        /**
         * 将该矩阵乘以一个矩阵。
         * - v *= matrix
         * @param matrix 一个矩阵。
         */
        multiply(matrix: Readonly<Matrix4>): this;
        /**
         * 将两个矩阵相乘的结果写入该矩阵。
         * - v = matrixA * matrixB
         * @param matrixA 一个矩阵。
         * @param matrixB 另一个矩阵。
         */
        multiply(matrixA: Readonly<Matrix4>, matrixB: Readonly<Matrix4>): this;
        /**
         * 将一个矩阵与该矩阵相乘的结果写入该矩阵。
         * - v = matrix * v
         * @param matrix 一个矩阵。
         */
        premultiply(matrix: Readonly<Matrix4>): this;
        /**
         * 将该矩阵和目标矩阵插值的结果写入该矩阵。
         * - v = v * (1 - t) + to * t
         * @param to 目标矩阵。
         * @param t 插值因子。
         * - 插值因子不会被限制在 `0.0` ~ `1.0`。
         */
        lerp(to: Readonly<Matrix4>, t: float): this;
        /**
         * 将两个矩阵插值的结果写入该矩阵。
         * - v = from * (1 - t) + to * t
         * @param from 起始矩阵。
         * @param to 目标矩阵。
         * @param t 插值因子。
         * - 插值因子不会被限制在 `0.0` ~ `1.0`。
         */
        lerp(from: Readonly<Matrix4>, to: Readonly<Matrix4>, t: float): this;
        /**
         * 设置该矩阵，使其 Z 轴正方向与起始点到目标点的方向相一致。
         * - 矩阵的缩放值将被覆盖。
         * @param from 起始点。
         * @param to 目标点。
         * @param up
         */
        lookAt(from: Readonly<IVector3>, to: Readonly<IVector3>, up: Readonly<IVector3>): this;
        /**
         * 设置该矩阵，使其 Z 轴正方向与目标方向相一致。
         * - 矩阵的缩放值将被覆盖。
         * @param vector 目标方向。
         * @param up
         */
        lookRotation(vector: Readonly<IVector3>, up: Readonly<IVector3>): this;
        /**
         * 将该旋转矩阵转换为数组。
         * @param array 数组。
         * @param offset 索引偏移。
         * - 默认 `0`。
         */
        toArray(array?: float[] | Float32Array | null, offset?: uint): float[] | Float32Array;
        /**
         * 将该旋转矩阵转换为欧拉旋转。
         * @param euler 欧拉旋转。
         * - 弧度制。
         * @param order 欧拉旋转顺序。
         * - 默认 `egret3d.EulerOrder.YXZ`。
         */
        toEuler(euler?: Vector3 | null, order?: EulerOrder): Vector3;
        /**
         * 获取该矩阵的行列式。
         * - 该值是实时计算的。
         */
        readonly determinant: float;
        /**
         * 获取该矩阵的最大缩放值。
         * - 该值是实时计算的。
         */
        readonly maxScaleOnAxis: float;
        /**
         * 一个静态的恒等矩阵。
         * - 注意：请不要修改该值。
         */
        static readonly IDENTITY: Readonly<Matrix4>;
    }
}
declare namespace paper {
    /**
     *
     */
    class Context<TEntity extends IEntity> {
        /**
         *
         */
        static create<TEntity extends IEntity>(entityClass: IEntityClass<TEntity>): Context<TEntity>;
        private readonly _entityClass;
        private readonly _entities;
        private readonly _componentsGroups;
        private readonly _componentsGroupsB;
        private readonly _groups;
        private constructor();
        private _onComponentCreated([entity, component]);
        private _onComponentEnabled([entity, component]);
        private _onComponentDisabled([entity, component]);
        private _onComponentDestroyed([entity, component]);
        containsEntity(entity: TEntity): boolean;
        getGroup(matcher: ICompoundMatcher<TEntity>): Group<TEntity>;
        readonly entityCount: uint;
        readonly entities: ReadonlyArray<TEntity>;
    }
}
declare namespace egret3d {
    /**
     * 颜色接口。
     */
    interface IColor {
        /**
         * 红色通道。
         * - [`0.0` ~ `1.0`]
         */
        r: float;
        /**
         * 绿色通道。
         * - [`0.0` ~ `1.0`]
         */
        g: float;
        /**
         * 蓝色通道。
         * - [`0.0` ~ `1.0`]
         */
        b: float;
        /**
         * 透明通道。
         * - [`0.0` ~ `1.0`]
         */
        a: float;
    }
    /**
     * 颜色。
     */
    class Color extends paper.BaseRelease<Color> implements IColor, paper.ICCS<Color>, paper.ISerializable {
        /**
         * 所有颜色通道均为零的颜色。
         * - 请注意不要修改该值。
         */
        static readonly ZERO: Readonly<Color>;
        /**
         * 黑色。
         * - 请注意不要修改该值。
         */
        static readonly BLACK: Readonly<Color>;
        /**
         * 灰色。
         * - 请注意不要修改该值。
         */
        static readonly GRAY: Readonly<Color>;
        /**
         * 白色。
         * - 请注意不要修改该值。
         */
        static readonly WHITE: Readonly<Color>;
        /**
         * 红色。
         * - 请注意不要修改该值。
         */
        static readonly RED: Readonly<Color>;
        /**
         * 绿色。
         * - 请注意不要修改该值。
         */
        static readonly GREEN: Readonly<Color>;
        /**
         * 蓝色。
         * - 请注意不要修改该值。
         */
        static readonly BLUE: Readonly<Color>;
        /**
         * 黄色。
         * - 请注意不要修改该值。
         */
        static readonly YELLOW: Readonly<Color>;
        /**
         * 靛蓝色。
         * - 请注意不要修改该值。
         */
        static readonly INDIGO: Readonly<Color>;
        /**
         * 紫色。
         * - 请注意不要修改该值。
         */
        static readonly PURPLE: Readonly<Color>;
        private static readonly _instances;
        /**
         * 创建一个新的颜色对象实例
         * @param r 红色通道
         * @param g 绿色通道
         * @param b 蓝色通道
         * @param a 透明通道
         */
        static create(r?: float, g?: float, b?: float, a?: float): Color;
        r: float;
        g: float;
        b: float;
        a: float;
        /**
         * 请使用 `egret3d.Color.create()` 创建实例。
         * @see egret3d.Color.create()
         */
        private constructor();
        serialize(): number[];
        deserialize(value: Readonly<[float, float, float, float]>): this;
        clone(): Color;
        copy(value: Readonly<IColor>): this;
        set(r: float, g: float, b: float, a?: float): this;
        fromArray(value: ArrayLike<float>, offset?: uint): this;
        fromHex(hex: uint): this;
        /**
         * 将该颜色乘以一个颜色。
         * - v *= color
         * @param color 一个颜色。
         */
        multiply(color: Readonly<IColor>): this;
        /**
         * 将该两个颜色相乘的结果写入该颜色。
         * - v = colorA * colorB
         * @param colorA 一个向量。
         * @param colorB 另一个向量。
         */
        multiply(colorA: Readonly<IColor>, colorB: Readonly<IColor>): this;
        /**
         *
         * @param scalar
         */
        scale(scalar: float): this;
        /**
         *
         * @param scalar
         * @param input
         */
        scale(scalar: float, input: Readonly<IColor>): this;
        /**
         *
         * @param to
         * @param t
         */
        lerp(to: Readonly<IColor>, t: float): this;
        /**
         *
         * @param from
         * @param to
         * @param t
         */
        lerp(from: Readonly<IColor>, to: Readonly<IColor>, t: float): this;
    }
}
declare namespace paper {
    /**
     * 程序系统管理器。
     */
    class SystemManager {
        private static _instance;
        /**
         * 程序系统管理器单例。
         */
        static getInstance(): SystemManager;
        private _isStarted;
        /**
         * 程序启动前缓存。
         * - 系统不能直接实例化。
         */
        private readonly _preSystems;
        /**
         * 程序启动后缓存。
         * - 系统需要直接实例化，但不能立即初始化。
         */
        private readonly _cacheSystems;
        private readonly _systems;
        private readonly _startSystems;
        private readonly _reactiveSystems;
        private readonly _frameSystems;
        private readonly _frameCleanupSystems;
        private readonly _tickSystems;
        private readonly _tickCleanupSystems;
        private constructor();
        private _sortPreSystem(a, b);
        private _getSystemInsertIndex(systems, order);
        private _register(system, config?);
        private _reactive(system);
        /**
         * 在程序启动之前预注册一个指定的系统。
         */
        preRegister<TEntity extends IEntity, TSystem extends ISystem<TEntity>>(systemClass: ISystemClass<TSystem, TEntity>, context: Context<TEntity>, order?: SystemOrder, config?: any | null): SystemManager;
        /**
         * 为程序注册一个指定的系统。
         */
        register<TEntity extends IEntity, TSystem extends ISystem<TEntity>>(systemClass: ISystemClass<TSystem, TEntity>, context: Context<TEntity>, order?: SystemOrder, config?: any | null): TSystem;
        /**
         * 从程序已注册的全部系统中获取一个指定的系统。
         */
        getSystem<TEntity extends IEntity, TSystem extends ISystem<TEntity>>(systemClass: ISystemClass<TSystem, TEntity>): TSystem | null;
        /**
         * 程序已注册的全部系统。
         */
        readonly systems: ReadonlyArray<ISystem<IEntity>>;
    }
}
declare namespace paper {
    /**
     * 程序场景管理器。
     */
    class SceneManager {
        private static _instance;
        /**
         * 场景管理器单例。
         */
        static getInstance(): SceneManager;
        private readonly _scenes;
        private _globalScene;
        private _editorScene;
        private constructor();
        private _addScene([scene, isActive]);
        private _removeScene(scene);
        /**
         * 创建一个空场景。
         * @param name 该场景的名称。
         * @param isActive 是否将该场景设置为激活场景。
         * - 默认 `true`。
         */
        createEmptyScene(name: string, isActive?: boolean): Scene;
        /**
         * 通过指定的场景资源创建一个场景。
         * @param resourceName 该场景的资源名称。
         */
        createScene(resourceName: string, combineStaticObjects?: boolean): Scene | null;
        /**
         * 卸载程序中的全部场景。
         * - 不包含全局场景。
         */
        destroyAllScene(excludes?: ReadonlyArray<Scene>): void;
        /**
         * 从程序已创建的全部场景中获取指定名称的场景。
         */
        getScene(name: string): Scene | null;
        /**
         * 程序已创建的全部动态场景。
         */
        readonly scenes: ReadonlyArray<Scene>;
        /**
         *
         */
        readonly globalEntity: IEntity;
        /**
         * 全局场景。
         * - 全局场景无法被销毁。
         */
        readonly globalScene: Scene;
        /**
         * 全局编辑器场景。
         * - 全局编辑器场景无法被销毁。
         */
        readonly editorScene: Scene;
        /**
         * 当前激活的场景。
         */
        activeScene: Scene;
        /**
         * @deprecated
         */
        loadScene(resourceName: string, combineStaticObjects?: boolean): Scene | null;
        /**
         * @deprecated
         */
        unloadScene(scene: Scene): void;
        /**
         * @deprecated
         */
        unloadAllScene(excludes?: ReadonlyArray<Scene>): void;
        /**
         * @deprecated
         */
        getActiveScene(): Scene;
    }
}
declare namespace paper {
    /**
     * 默认标识和自定义标识。
     */
    const enum DefaultTags {
    }
    /**
     * 内置层级和自定义层级。
     */
    const enum Layer {
    }
}
declare namespace egret3d {
    /**
     * 渲染排序。
     */
    const enum RenderQueue {
    }
    /**
     *
     */
    const enum AttributeSemantics {
    }
    /**
     *
     */
    const enum UniformSemantics {
    }
}
declare namespace egret3d {
    /**
     * 尺寸接口。
     */
    interface ISize {
        /**
         * 宽。
         */
        w: number;
        /**
         * 高。
         */
        h: number;
    }
    /**
     * 矩形接口。
     */
    interface IRectangle extends IVector2, ISize {
    }
    /**
     * 矩形。
     */
    class Rectangle extends paper.BaseRelease<Rectangle> implements IRectangle, paper.ICCS<Rectangle>, paper.ISerializable {
        private static readonly _instances;
        /**
         * 创建一个矩形。
         * @param x 水平坐标。
         * @param y 垂直坐标。
         * @param w 宽。
         * @param h 高。
         */
        static create(x?: number, y?: number, w?: number, h?: number): Rectangle;
        x: number;
        y: number;
        w: number;
        h: number;
        constructor(x?: number, y?: number, w?: number, h?: number);
        copy(value: Readonly<IRectangle>): this;
        clone(): Rectangle;
        set(x: number, y: number, w: number, h: number): this;
        serialize(): number[];
        deserialize(element: number[]): this;
        multiplyScalar(scalar: number, input?: Readonly<IRectangle>): this;
        contains(pointOrRect: Readonly<IVector2 | Rectangle>): boolean;
    }
}
declare namespace paper {
    /**
     * 基础变换组件。
     * - 实现实体之间的父子关系。
     */
    abstract class BaseTransform extends BaseComponent {
        /**
         * 当变换组件的父级改变时派发事件。
         */
        static readonly onTransformParentChanged: signals.Signal<[BaseTransform, BaseTransform | null, BaseTransform | null]>;
        private _globalEnabled;
        private _globalEnabledDirty;
        protected readonly _children: this[];
        protected _parent: this | null;
        protected abstract _onChangeParent(isBefore: boolean, worldTransformStays: boolean): void;
        dispatchEnabledEvent(enabled: boolean): void;
        /**
         * 更改该组件的父级变换组件。
         * @param parent 父级变换组件。
         * @param worldTransformStays 是否保留当前世界空间变换。
         */
        setParent(parent: this | null, worldTransformStays?: boolean): this;
        /**
         * 销毁该组件所有子（孙）级变换组件和其实体。
         */
        destroyChildren(): void;
        /**
         *
         */
        getChildren(out?: this[] | {
            [key: string]: BaseTransform | (BaseTransform[]);
        }, depth?: uint): this[] | {
            [key: string]: BaseTransform | BaseTransform[];
        };
        /**
         *
         */
        getChildIndex(value: this): int;
        /**
         *
         */
        setChildIndex(value: this, index: uint): boolean;
        /**
         *
         */
        getChildAt(index: uint): this | null;
        /**
         * 通过指定的名称或路径获取该组件的子（孙）级变换组件。
         * @param nameOrPath 名称或路径。
         */
        find(nameOrPath: string): this | null;
        /**
         * 该组件是否包含某个子（孙）级变换组件。
         */
        contains(child: this): boolean;
        /**
         *
         */
        readonly isActiveAndEnabled: boolean;
        /**
         * 该组件的全部子级变换组件总数。（不包含孙级）
         */
        readonly childCount: uint;
        /**
         * 该组件实体的全部子级变换组件。（不包含孙级）
         */
        readonly children: ReadonlyArray<this>;
        /**
         * 该组件实体的父级变换组件。
         */
        parent: this | null;
    }
}
declare namespace egret3d {
    /**
     * 几何立方体。
     */
    class Box extends paper.BaseRelease<Box> implements paper.ICCS<Box>, paper.ISerializable, IRaycast {
        static readonly ONE: Readonly<Box>;
        private static readonly _instances;
        /**
         * 创建一个几何立方体。
         * @param minimum 最小点。
         * @param maximum 最大点。
         */
        static create(minimum?: Readonly<IVector3> | null, maximum?: Readonly<IVector3> | null): Box;
        private _dirtyRadius;
        private _dirtyCenter;
        private _dirtySize;
        private _boundingSphereRadius;
        private readonly _minimum;
        private readonly _maximum;
        private readonly _center;
        private readonly _size;
        /**
         * 请使用 `egret3d.AABB.create()` 创建实例。
         * @see egret3d.AABB.create()
         */
        private constructor();
        private _updateValue(value);
        serialize(): number[];
        deserialize(value: Readonly<[float, float, float, float, float, float]>): this;
        clone(): Box;
        copy(value: Readonly<Box>): this;
        clear(): this;
        set(minimum?: Readonly<IVector3> | null, maximum?: Readonly<IVector3> | null): this;
        fromArray(value: ArrayLike<float>, offset?: uint): this;
        /**
         * 设置该立方体，使得全部点都在立方体内。
         * @param points 全部点。
         */
        fromPoints(points: ArrayLike<IVector3>): this;
        /**
         * 将该立方体乘以一个矩阵。
         * - v *= matrix
         * @param matrix 一个矩阵。
         */
        applyMatrix(matrix: Readonly<Matrix4>): this;
        /**
         * 将输入立方体与一个矩阵相乘的结果写入该立方体。
         * - v = input * matrix
         * @param matrix 一个矩阵。
         * @param input 输入立方体。
         */
        applyMatrix(matrix: Readonly<Matrix4>, input: Readonly<Box>): this;
        /**
         * 增加该立方体的体积，使其能刚好包含指定的点或立方体。
         * @param pointOrBox 一个点或立方体。
         */
        add(pointOrBox: Readonly<IVector3 | Box>): this;
        /**
         * 增加输入立方体的体积，并将改变的结果写入该立方体，使其能刚好包含指定的点或立方体。
         * @param pointOrBox 一个点或立方体。
         * @param input 输入立方体。
         */
        add(pointOrBox: Readonly<IVector3 | Box>, input: Readonly<Box>): this;
        /**
         * 通过一个标量或向量扩大该立方体。
         * @param scalarOrVector 一个标量或向量。
         */
        expand(scalarOrVector: float | Readonly<IVector3>): this;
        /**
         * 通过一个标量或向量扩大输入立方体，并将改变的结果写入该立方体。
         * @param scalarOrVector 一个标量或向量。
         * @param input 输入立方体。
         */
        expand(scalarOrVector: float | Readonly<IVector3>, input: Readonly<Box>): this;
        /**
         * 通过一个标量或向量移动该立方体。
         * @param scalarOrVector 一个标量或向量。
         */
        translate(scalarOrVector: float | Readonly<IVector3>): this;
        /**
         * 通过一个标量或向量移动输入立方体，并将改变的结果写入该立方体。
         * @param scalarOrVector 一个标量或向量。
         * @param input 输入立方体。
         */
        translate(scalarOrVector: float | Readonly<IVector3>, input: Readonly<Box>): this;
        /**
         * 获取一个点到该立方体的最近点。（如果该点在立方体内部，则最近点就是该点）
         * @param point 一个点。
         * @param output 最近点。
         */
        getClosestPointToPoint(point: Readonly<IVector3>, output?: Vector3 | null): Vector3;
        /**
         * 获取一个点到该立方体的最近距离。
         * @param point 一个点。
         */
        getDistance(point: Readonly<IVector3>): float;
        /**
         * 该立方体是否包含指定的点或立方体。
         */
        contains(pointOrBox: Readonly<IVector3 | Box>): boolean;
        raycast(ray: Readonly<Ray>, raycastInfo?: RaycastInfo | null): boolean;
        /**
         *
         * @param sphere
         */
        intersectsSphere(sphere: Readonly<Sphere>): boolean;
        /**
         * 该立方体是否为空。
         */
        readonly isEmpty: boolean;
        /**
         * 该立方体的包围球半径。
         */
        readonly boundingSphereRadius: float;
        /**
         * 该立方体的最小点。
         */
        readonly minimum: Readonly<Vector3>;
        /**
         * 该立方体的最大点。
         */
        readonly maximum: Readonly<Vector3>;
        /**
         * 该立方体的尺寸。
         */
        size: Readonly<Vector3>;
        /**
         * 该立方体的中心点。
         */
        center: Readonly<Vector3>;
    }
}
declare namespace paper {
    /**
     * 基础系统。
     * - 全部系统的基类。
     * - 生命周期的顺序如下：
     * - onAwake();
     * - onEnable();
     * - onStart();
     * - onComponentRemoved();
     * - onEntityRemoved();
     * - onEntityAdded();
     * - onComponentAdded();
     * - onTick();
     * - onFrame();
     * - onFrameCleanup();
     * - onTickCleanup();
     * - onDisable();
     * - onDestroy();
     */
    abstract class BaseSystem<TEntity extends IEntity> implements ISystem<TEntity> {
        /**
         * 该系统允许运行的模式。
         * - 默认可以在所有模式运行。
         * - 通过系统装饰器 `@paper.executeMode()` 来修改该值。
         */
        static readonly executeMode: PlayerMode;
        enabled: boolean;
        readonly order: SystemOrder;
        readonly deltaTime: uint;
        readonly groups: ReadonlyArray<Group<TEntity>>;
        readonly collectors: ReadonlyArray<Collector<TEntity>>;
        private _context;
        /**
         * 禁止实例化系统。
         * @protected
         */
        constructor(context: Context<TEntity>, order?: SystemOrder);
        private _addGroupAndCollector(matcher);
        /**
         * 获取该系统需要响应的组件匹配器。
         */
        protected getMatchers(): ICompoundMatcher<TEntity>[] | null;
        /**
         *
         */
        protected getListeners(): {
            type: signals.Signal;
            listener: (component: any) => void;
        }[] | null;
        onAwake?(config?: any): void;
        onEnable?(): void;
        onStart?(): void;
        onComponentRemoved?(component: IComponent, group: Group<TEntity>): void;
        onEntityRemoved?(entity: TEntity, group: Group<TEntity>): void;
        onEntityAdded?(entity: TEntity, group: Group<TEntity>): void;
        onComponentAdded?(component: IComponent, group: Group<TEntity>): void;
        onTick?(deltaTime?: float): void;
        onFrame?(deltaTime?: float): void;
        onFrameCleanup?(deltaTime?: float): void;
        onTickCleanup?(deltaTime?: float): void;
        onDisable?(): void;
        onDestroy?(): void;
        /**
         * @deprecated
         */
        readonly clock: Clock;
        /**
         * @deprecated
         */
        onAddGameObject?(entity: TEntity, group: Group<TEntity>): void;
        /**
         * @deprecated
         */
        onRemoveGameObject?(entity: TEntity, group: Group<TEntity>): void;
        /**
         * @deprecated
         */
        interests: ReadonlyArray<InterestConfig | ReadonlyArray<InterestConfig>>;
    }
}
declare namespace egret3d {
    /**
     * 3×3 矩阵。
     */
    class Matrix3 extends paper.BaseRelease<Matrix3> implements paper.ICCS<Matrix3>, paper.ISerializable {
        static readonly IDENTITY: Readonly<Matrix3>;
        private static readonly _instances;
        /**
         * 创建一个矩阵。
         * @param rawData
         * @param offsetOrByteOffset
         */
        static create(rawData?: ArrayLike<number>, offsetOrByteOffset?: number): Matrix3;
        /**
         * 矩阵原始数据。
         * @readonly
         */
        rawData: Float32Array;
        /**
         * 请使用 `egret3d.Matrix3.create()` 创建实例。
         * @see egret3d.Matrix3.create()
         */
        private constructor();
        serialize(): Float32Array;
        deserialize(value: Readonly<[number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number]>): Matrix3;
        copy(value: Readonly<Matrix3>): this;
        clone(): Matrix3;
        set(n11: number, n12: number, n13: number, n21: number, n22: number, n23: number, n31: number, n32: number, n33: number): Matrix3;
        identity(): this;
        fromArray(value: ArrayLike<number>, offset?: number): this;
        fromBuffer(value: ArrayBuffer, byteOffset?: number): this;
        fromScale(vector: Readonly<IVector3>): this;
        /**
         * 通过 UV 变换设置该矩阵。
         * @param offsetX 水平偏移。
         * @param offsetY 垂直偏移。
         * @param repeatX 水平重复。
         * @param repeatY 垂直重复。
         * @param rotation 旋转。（弧度制）
         * @param pivotX 水平中心。
         * @param pivotY 垂直中心。
         */
        fromUVTransform(offsetX: number, offsetY: number, repeatX: number, repeatY: number, rotation?: number, pivotX?: number, pivotY?: number): Matrix3;
        fromMatrix4(value: Readonly<Matrix4>): this;
        inverse(input?: Matrix3): this;
        getNormalMatrix(matrix4: Readonly<Matrix4>): this;
        transpose(): this;
        /**
         * 将该矩阵乘以一个矩阵。
         * - v *= matrix
         * @param matrix 一个矩阵。
         */
        multiply(matrix: Readonly<Matrix3>): this;
        /**
         * 将两个矩阵相乘的结果写入该矩阵。
         * - v = matrixA * matrixB
         * @param matrixA 一个矩阵。
         * @param matrixB 另一个矩阵。
         */
        multiply(matrixA: Readonly<Matrix3>, matrixB: Readonly<Matrix3>): this;
        /**
         * 将一个矩阵与该矩阵相乘的结果写入该矩阵。
         * - v = matrix * v
         * @param matrix 一个矩阵。
         */
        premultiply(matrix: Readonly<Matrix3>): this;
        /**
         * 将该旋转矩阵转换为数组。
         * @param array 数组。
         * @param offset 数组偏移。
         */
        toArray(array?: number[] | Float32Array, offset?: number): number[] | Float32Array;
        readonly determinant: number;
    }
    /**
     * @@interanl
     */
    const helpMatrix3A: Matrix3;
}
declare namespace egret3d {
    /**
     *
     */
    namespace math {
        /**
         *
         */
        function euclideanModulo(n: number, m: number): number;
        /**
         *
         */
        function clamp(v: number, min?: number, max?: number): number;
        /**
         *
         */
        function lerp(from: number, to: number, t: number): number;
        /**
         * Calculates the Lerp parameter between of two values.
         * 计算两个值之间的 Lerp 参数。也就是 value 在 from 和 to 之间的比例值: inverseLerp(5.0, 10.0, 8.0) === 3/5
         * @param from start value
         * @param to end value
         * @param t target value
         */
        function inverseLerp(from: number, to: number, t: number): number;
        function randFloat(low: number, high: number): number;
        function randFloatSpread(range: number): number;
        function isPowerOfTwo(value: number): boolean;
        function ceilPowerOfTwo(value: number): uint;
        function floorPowerOfTwo(value: number): uint;
        function frustumIntersectsSphere(frustum: Readonly<Frustum>, sphere: Readonly<Sphere>): boolean;
    }
    /**
     * 内联的数字常数枚举。
     */
    const enum Const {
        PI = 3.141592653589793,
        PI_HALF = 1.5707963267948966,
        PI_QUARTER = 0.7853981633974483,
        PI_DOUBLE = 6.283185307179586,
        /**
         * 弧度制到角度制相乘的系数。
         */
        RAD_DEG = 57.29577951308232,
        /**
         * 角度制到弧度制相乘的系数。
         */
        DEG_RAD = 0.017453292519943295,
        /**
         * 大于零的最小正值。
         * - https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/EPSILON
         */
        EPSILON = 2.220446049250313e-16,
        /**
         * The square root of 2.
         */
        SQRT_2 = 1.4142135623731,
        /**
         * The square root of 0.5, or, equivalently, one divided by the square root of 2.
         */
        SQRT1_2 = 0.70710678118655,
    }
    function sign(value: number): number;
    function triangleIntersectsAABB(triangle: Readonly<Triangle>, box: Readonly<Box>): boolean;
    function planeIntersectsAABB(plane: Readonly<Plane>, box: Readonly<Box>): boolean;
    function planeIntersectsSphere(plane: Readonly<Plane>, sphere: Readonly<Sphere>): boolean;
    function aabbIntersectsSphere(box: Readonly<Box>, sphere: Readonly<Sphere>): boolean;
    function aabbIntersectsAABB(valueA: Readonly<Box>, valueB: Readonly<Box>): boolean;
    function sphereIntersectsSphere(valueA: Readonly<Sphere>, valueB: Readonly<Sphere>): boolean;
}
declare namespace egret3d {
    /**
     * @beta 这是一个试验性质的 API，有可能会被删除或修改。
     */
    abstract class CameraPostprocessing extends paper.BaseComponent {
        protected readonly _renderState: egret3d.RenderState;
        abstract onRender(camera: Camera): void;
        protected renderPostprocessTarget(camera: Camera, material?: Material, renderTarget?: RenderTexture): void;
        blit(src: BaseTexture, material?: Material | null, dest?: RenderTexture | null, bufferMask?: gltf.BufferMask | null): void;
    }
}
declare namespace egret3d {
    /**
     * 灯光组件。
     */
    abstract class BaseLight extends paper.BaseComponent {
        /**
         * TODO
         */
        cullingMask: paper.Layer;
        /**
         * 该灯光的强度。
         */
        intensity: number;
        /**
         * 该灯光的颜色。
         */
        readonly color: Color;
        /**
         * 该灯光是否投射阴影。
         */
        castShadows: boolean;
        /**
         *
         */
        readonly shadow: LightShadow;
        uninitialize(): void;
    }
}
declare namespace paper {
    /**
     * 场景资源。
     */
    class RawScene extends BasePrefabAsset {
        /**
         * @deprecated
         */
        createInstance(keepUUID?: boolean): Scene | null;
        readonly sceneName: string;
    }
}
declare namespace egret3d {
    /**
     * 网格渲染组件。
     * - 用于渲染网格筛选组件提供的网格资源。
     */
    class MeshRenderer extends paper.BaseRenderer {
        protected _lightmapIndex: number;
        /**
         * 如果该属性合并到 UV2 中，会破坏网格共享，共享的网格无法拥有不同的 lightmap UV。
         */
        protected readonly _lightmapScaleOffset: Vector4;
        /**
         * @private
         */
        recalculateLocalBox(): void;
        /**
         * 实时获取网格资源的指定三角形顶点位置。
         * @param triangleIndex 三角形索引。
         * @param out
         */
        getTriangle(triangleIndex: uint, out?: Triangle): Triangle;
        raycast(ray: Readonly<Ray>, raycastInfo?: RaycastInfo | null): boolean;
        /**
         * 该组件的光照图索引。
         */
        lightmapIndex: int;
        /**
         * TODO
         */
        readonly lightmapScaleOffset: Readonly<Vector4>;
    }
}
declare namespace egret3d {
    /**
     * 四元数。
     */
    class Quaternion extends Vector4 {
        /**
         * 恒等四元数。
         */
        static readonly IDENTITY: Readonly<Quaternion>;
        protected static readonly _instances: Quaternion[];
        /**
         * 创建一个四元数。
         */
        static create(x?: number, y?: number, z?: number, w?: number): Quaternion;
        clone(): Quaternion;
        /**
         * 通过旋转矩阵设置该四元数。
         * - 旋转矩阵不应包含缩放值。
         * @param rotateMatrix 旋转矩阵。
         */
        fromMatrix(rotateMatrix: Readonly<Matrix4>): this;
        /**
         * 通过欧拉旋转（弧度制）设置该四元数。
         * @param euler 欧拉旋转。
         * @param order 欧拉旋转顺序。
         */
        fromEuler(euler: Readonly<IVector3>, order?: EulerOrder): this;
        /**
         * 通过欧拉旋转（弧度制）设置该四元数。
         * @param eulerX 欧拉旋转 X 轴分量。
         * @param eulerY 欧拉旋转 Y 轴分量。
         * @param eulerZ 欧拉旋转 Z 轴分量。
         * @param order 欧拉旋转顺序。
         */
        fromEuler(eulerX: number, eulerY: number, eulerZ: number, order?: EulerOrder): this;
        /**
         * 通过旋转轴设置该四元数。
         * - 假设旋转轴已被归一化。
         * @param axis 旋转轴。
         * @param angle 旋转角。（弧度制）
         */
        fromAxis(axis: Readonly<IVector3>, angle: number): this;
        /**
         * 通过自起始方向到目标方向的旋转值设置该四元数。
         * - 假设方向向量已被归一化。
         * @param from 起始方向。
         * @param to 目标方向。
         */
        fromVectors(from: Readonly<IVector3>, to: Readonly<IVector3>): this;
        /**
         * 将该四元数转换为恒等四元数。
         */
        identity(): this;
        /**
         * 将该四元数乘以一个四元数。
         * - v *= quaternion
         * @param quaternion 一个四元数。
         */
        multiply(quaternion: Readonly<IVector4>): this;
        /**
         * 将两个四元数相乘的结果写入该四元数。
         * - v = quaternionA * quaternionB
         * @param quaternionA 一个四元数。
         * @param quaternionB 另一个四元数。
         */
        multiply(quaternionA: Readonly<IVector4>, quaternionB?: Readonly<IVector4>): this;
        /**
         * 将一个四元数与该四元数相乘的结果写入该四元数。
         * - v = quaternion * v
         * @param quaternion 一个四元数。
         */
        premultiply(quaternion: Readonly<IVector4>): this;
        lerp(p1: Readonly<IVector4> | number, p2: Readonly<IVector4> | number, p3?: number | Readonly<IVector4>): this;
        /**
         * 将该四元数和目标四元数球形插值的结果写入该四元数。
         * - v = v * (1 - t) + to * t
         * - 插值因子不会被限制在 0 ~ 1。
         * @param t 插值因子。
         * @param to 目标矩阵。
         */
        slerp(to: Readonly<IVector4>, t: number): this;
        /**
         * 将两个四元数球形插值的结果写入该四元数。
         * - v = from * (1 - t) + to * t
         * - 插值因子不会被限制在 0 ~ 1。
         * @param t 插值因子。
         * @param from 起始矩阵。
         * @param to 目标矩阵。
         */
        slerp(from: Readonly<IVector4>, to: Readonly<IVector4>, t: number): this;
        /**
         * @deprecated
         */
        slerp(t: number, to: Readonly<IVector4>): this;
        /**
         * @deprecated
         */
        slerp(t: number, from: Readonly<IVector4>, to: Readonly<IVector4>): this;
        /**
         * 设置该四元数，使其与起始点到目标点的方向相一致。
         * @param from 起始点。
         * @param to 目标点。
         * @param up
         */
        lookAt(from: Readonly<IVector3>, to: Readonly<IVector3>, up: Readonly<IVector3>): this;
        /**
         * 设置该四元数，使其与目标方向相一致。
         * @param vector 目标方向。
         * @param up
         */
        lookRotation(vector: Readonly<IVector3>, up: Readonly<IVector3>): this;
        /**
         * 获取该四元数和一个四元数的夹角。（弧度制）
         */
        getAngle(value: Readonly<IVector4>): number;
        /**
         * 将该四元数转换为欧拉旋转。（弧度制）
         * @param out 欧拉旋转。
         * @param order 欧拉旋转顺序。
         */
        toEuler(out?: Vector3, order?: EulerOrder): Vector3;
    }
}
declare namespace paper {
    /**
     * 游戏实体。
     */
    class GameObject extends Entity {
        /**
         * 创建游戏实体，并添加到当前场景中。
         */
        static create(name?: string, tag?: string, scene?: Scene | null): GameObject;
        /**
         * 是否是静态模式。
         */
        isStatic: boolean;
        /**
         * 层级。
         * - 用于各种层遮罩。
         */
        layer: Layer;
        /**
         * 该实体的变换组件。
         */
        readonly transform: egret3d.Transform;
        /**
         * 渲染组件。
         */
        readonly renderer: BaseRenderer | null;
        protected _destroy(): void;
        protected _setScene(value: Scene | null, dispatchEvent: boolean): void;
        protected _setEnabled(value: boolean): void;
        protected _addComponent(component: IComponent, config?: any): void;
        uninitialize(): void;
        /**
         * 获取一个自己或父级中指定的组件实例。
         * - 仅查找处于激活状态的父级实体。
         * @param componentClass 组件类。
         * @param isExtends 是否尝试获取全部派生自此组件的实例。
         */
        getComponentInParent<T extends IComponent>(componentClass: IComponentClass<T>, isExtends?: boolean): T | null;
        /**
         * 获取一个自己或子（孙）级中指定的组件实例。
         * - 仅查找处于激活状态的子（孙）级实体。
         * @param componentClass 组件类。
         * @param isExtends 是否尝试获取全部派生自此组件的实例。
         */
        getComponentInChildren<T extends IComponent>(componentClass: IComponentClass<T>, isExtends?: boolean): T | null;
        /**
         * 获取全部自己和子（孙）级中指定的组件实例。
         * @param componentClass 组件类。
         * @param isExtends 是否尝试获取全部派生自此组件的实例。
         * @param includeInactive 是否尝试查找处于未激活状态的子（孙）级实体。（默认 `false`）
         */
        getComponentsInChildren<T extends IComponent>(componentClass: IComponentClass<T>, isExtends?: boolean, includeInactive?: boolean, components?: T[] | null): T[];
        /**
         * 向该实体已激活的全部 Behaviour 组件发送消息。
         * @param methodName
         * @param parameter
         */
        sendMessage<T extends Behaviour>(methodName: keyof T, parameter?: any, requireReceiver?: boolean): this;
        /**
         * 向该实体和其父级的 Behaviour 组件发送消息。
         * @param methodName
         * @param parameter
         */
        sendMessageUpwards<T extends Behaviour>(methodName: keyof T, parameter?: any, requireReceiver?: boolean): this;
        /**
         * 向该实体和的其子（孙）级的 Behaviour 组件发送消息。
         * @param methodName
         * @param parameter
         */
        broadcastMessage<T extends Behaviour>(methodName: keyof T, parameter?: any, requireReceiver?: boolean): this;
        /**
         * 该实体自身的激活状态。
         */
        activeSelf: boolean;
        /**
         * 该实体在场景中的激活状态。
         */
        readonly activeInHierarchy: boolean;
        /**
         * 该实体的路径。
         */
        readonly path: string;
        /**
         * 该实体的父级实体。
         */
        parent: this | null;
        /**
         * @deprecated
         * @see paper.Scene#find()
         */
        static find(name: string, scene?: Scene | null): GameObject | null;
        /**
         * @deprecated
         */
        static readonly globalGameObject: GameObject;
        /**
         * @deprecated
         */
        readonly globalGameObject: this;
    }
}
declare namespace egret3d {
    /**
     * Shader 资源。
     */
    class Shader extends GLTFAsset {
        /**
         *
         * @param shader
         * @param name
         */
        static create(name: string, shader: Shader): Shader;
        /**
         * @private
         */
        static create(name: string, config: GLTF): Shader;
        /**
         * @private
         */
        static createDefaultStates(): gltf.States;
        /**
         * @private
         */
        static copyStates(source: gltf.States, target: gltf.States): void;
        /**
         * @private
         */
        customs: {
            [key: string]: string;
        } | null;
        initialize(name: string, config: GLTF, buffers: ReadonlyArray<ArrayBufferView> | null, parent: Shader | null): void;
        /**
         * @private
         */
        addDefine(defineString: string, value?: number | {
            [key: string]: string;
        }): this;
        /**
         * @private
         */
        addUniform(name: string, type: gltf.UniformType, value: any): this;
    }
}
declare namespace paper {
    /**
     * 实体组。
     * - 根据匹配器收集指定特征的实体。
     */
    class Group<TEntity extends IEntity> {
        /**
         * 当实体添加到组时派发事件。
         */
        static readonly onEntityAdded: signals.Signal<[Group<IEntity>, IEntity]>;
        /**
         * 当实体从组中移除时派发事件。
         */
        static readonly onEntityRemoved: signals.Signal<[Group<IEntity>, IEntity]>;
        /**
         * 当组中实体添加非必要组件时派发事件。
         */
        static readonly onComponentEnabled: signals.Signal<[Group<IEntity>, IComponent]>;
        /**
         * 当组中实体移除非必要组件时派发事件。
         */
        static readonly onComponentDisabled: signals.Signal<[Group<IEntity>, IComponent]>;
        private _entitiesDirty;
        private _behavioursDirty;
        private _entityCount;
        private readonly _matcher;
        private readonly _entities;
        private readonly _behaviours;
        private _singleEntity;
        private constructor();
        /**
         * 该组是否包含指定实体。
         * @param entity
         */
        containsEntity(entity: TEntity): boolean;
        /**
         * @int
         * @param entity
         * @param component
         * @param isAdd
         */
        handleEvent(entity: TEntity, component: IComponent, isAdd: boolean): void;
        /**
         * 该组匹配的实体总数。
         */
        readonly entityCount: uint;
        /**
         * 该组匹配的所有实体。
         */
        readonly entities: ReadonlyArray<TEntity>;
        /**
         * 该组的匹配器。
         */
        readonly matcher: Readonly<ICompoundMatcher<TEntity>>;
        /**
         * 该组匹配的单例实体。
         */
        readonly singleEntity: TEntity | null;
        /**
         * @deprecated
         */
        hasGameObject(entity: TEntity): boolean;
        /**
         * @deprecated
         */
        readonly gameObjects: ReadonlyArray<TEntity>;
    }
}
declare namespace egret3d {
    /**
     * 渲染纹理。
     */
    class RenderTexture extends BaseTexture {
        /**
         *
         * @param parameters
         */
        static create(parameters: CreateTextureParameters): RenderTexture;
        /**
         * @private
         */
        static create(name: string, config: GLTF): RenderTexture;
        protected _bufferDirty: boolean;
        /**
         *
         * @param index
         */
        activateTexture(index?: uint): this;
        /**
         *
         * @param source
         */
        uploadTexture(width: uint, height: uint): this;
        generateMipmap(): boolean;
    }
}
declare namespace egret3d {
    /**
     * 网格资源。
     */
    class Mesh extends GLTFAsset implements IRaycast {
        /**
         * 创建一个网格。
         * @param vertexCount
         * @param indexCount
         * @param attributeNames
         * @param attributeTypes
         */
        static create(vertexCount: uint, indexCount: uint, attributeNames?: gltf.AttributeSemantics[] | null, attributeTypes?: {
            [key: string]: gltf.AccessorType;
        } | null): Mesh;
        /**
         * 加载一个网格。
         * @private
         */
        static create(name: string, config: GLTF, buffers: ReadonlyArray<ArrayBufferView>): Mesh;
        private static _createConfig(vertexCount, indexCount, attributeNames, attributeTypes);
        private static _getMeshAttributeType(attributeName, customAttributeTypes);
        protected _drawMode: gltf.DrawMode;
        protected _vertexCount: uint;
        protected _wireframeIndex: int;
        protected readonly _attributeNames: gltf.AttributeSemantics[];
        protected readonly _attributeTypes: {
            [key: string]: gltf.AccessorType;
        };
        protected _glTFMesh: gltf.Mesh;
        protected _inverseBindMatrices: ArrayBufferView | null;
        protected _boneIndices: {
            [key: string]: uint;
        } | null;
        initialize(name: string, config: GLTF, buffers: ReadonlyArray<ArrayBufferView> | null, attributeTypes: {
            [key: string]: gltf.AccessorType;
        } | null): void;
        dispose(): boolean;
        /**
         * 克隆该网格。
         */
        clone(): Mesh;
        /**
         *
         */
        applyMatrix(matrix: Readonly<Matrix4>): this;
        /**
         *
         */
        getTriangle(triangleIndex: uint, out?: Triangle, vertices?: Float32Array | null): Triangle;
        /**
         *
         */
        raycast(ray: Readonly<Ray>, raycastInfo?: RaycastInfo | null, vertices?: Float32Array | null): boolean;
        /**
         *
         */
        addSubMesh(indexCount: uint, materialIndex?: uint, randerMode?: gltf.MeshPrimitiveMode): uint;
        /**
         * 为该网格添加线框子网格。
         * @param materialIndex
         */
        addWireframeSubMesh(materialIndex: uint): this;
        /**
         * 删除该网格已添加的线框子网格。
         */
        removeWireframeSubMesh(): this;
        /**
         *
         */
        normalizeNormals(): this;
        /**
         *
         */
        computeVertexNormals(): this;
        /**
         * 获取该网格顶点的位置属性数据。
         * - x0, y0, z0, x1, y1, z1, ...
         * @param offset 顶点偏移。（默认从第一个点开始）
         * @param count 顶点数。（默认全部顶点）
         */
        getVertices(offset?: uint, count?: uint): Float32Array | null;
        /**
         * 获取该网格顶点的 UV 属性数据。
         * - u0, v0, u1, v1, ...
         * @param offset 顶点偏移。（默认从第一个点开始）
         * @param count 顶点数。（默认全部顶点）
         */
        getUVs(offset?: uint, count?: uint): Float32Array | null;
        /**
         * 获取该网格顶点的颜色属性数据。
         * - r0, g0, b0, a0, r1, g1, b1, a1, ...
         * @param offset 顶点偏移。（默认从第一个点开始）
         * @param count 顶点数。（默认全部顶点）
         */
        getColors(offset?: uint, count?: uint): Float32Array | null;
        /**
         * 获取该网格顶点的法线属性数据。
         * - x0, y0, z0, x1, y1, z1, ...
         * @param offset 顶点偏移。（默认从第一个点开始）
         * @param count 顶点数。（默认全部顶点）
         */
        getNormals(offset?: uint, count?: uint): Float32Array | null;
        /**
         * 获取该网格顶点的切线属性数据。
         * - x0, y0, z0, w0,  x1, y1, z1, w1, ...
         * @param offset 顶点偏移。（默认从第一个点开始）
         * @param count 顶点数。（默认全部顶点）
         */
        getTangents(offset?: uint, count?: uint): Float32Array | null;
        /**
         * 获取该网格顶点的指定属性数据。
         * @param attributeType 属性名。
         * @param offset 顶点偏移。（默认从第一个点开始）
         * @param count 顶点总数。（默认全部顶点）
         */
        getAttributes(attributeType: gltf.AttributeSemantics, offset?: uint, count?: uint): Float32Array | Uint16Array | null;
        /**
         * 设置该网格指定的顶点属性数据。
         * @param attributeType 属性名。
         * @param value 属性数据。
         * @param offset 顶点偏移。（默认从第一个点开始）
         */
        setAttributes(attributeType: gltf.AttributeSemantics, value: ReadonlyArray<number>, offset?: uint): Float32Array | Uint16Array | null;
        /**
         * 获取该网格的顶点索引数据。
         * @param subMeshIndex 子网格索引。（默认第一个子网格）
         */
        getIndices(subMeshIndex?: uint): Uint16Array | null;
        /**
         * 设置该网格的顶点索引数据。
         * @param value 顶点索引数据。
         * @param subMeshIndex 子网格索引。（默认第一个子网格）
         * @param offset 索引偏移。（默认不偏移）
         */
        setIndices(value: ReadonlyArray<uint>, subMeshIndex?: uint, offset?: uint): Uint16Array | null;
        /**
         * 该网格的渲染模式。
         */
        drawMode: gltf.DrawMode;
        /**
         * 该网格的子网格总数。
         */
        readonly subMeshCount: uint;
        /**
         * 该网格的顶点总数。
         */
        readonly vertexCount: uint;
        /**
         * 该网格的全部顶点属性名称。
         */
        readonly attributeNames: ReadonlyArray<string>;
        /**
         * 获取该网格的 glTF 网格数据。
         */
        readonly glTFMesh: gltf.Mesh;
        /**
         * 当修改该网格的顶点属性后，调用此方法来更新顶点属性的缓冲区。
         * @param uploadAttributes
         * @param offset 顶点偏移。（默认不偏移）
         * @param count 顶点总数。（默认全部顶点）
         */
        uploadVertexBuffer(uploadAttributes?: gltf.AttributeSemantics | (gltf.AttributeSemantics[]), offset?: uint, count?: uint): void;
        /**
         * 当修改该网格的顶点索引后，调用此方法来更新顶点索引的缓冲区。
         * @param subMeshIndex 子网格索引。（默认第一个子网格）
         */
        uploadSubIndexBuffer(subMeshIndex?: uint, offset?: uint, count?: uint): void;
    }
}
declare namespace egret3d.webgl {
}
declare namespace paper.utility {
    /**
     *
     * @param array
     */
    function filterArray(array: any[], remove: any): void;
}
declare namespace paper {
    /**
     * @deprecated
     */
    type RenderQueue = egret3d.RenderQueue;
    /**
     * @deprecated
     */
    const RenderQueue: any;
}
declare namespace gltf {
    /**
     * @deprecated
     */
    type BlendMode = egret3d.BlendMode;
    /**
     * @deprecated
     */
    const BlendMode: any;
    /**
     * @deprecated
     */
    type MeshAttributeType = AttributeSemantics;
    /**
     * @deprecated
     */
    const MeshAttributeType: any;
}
declare namespace egret3d {
    /**
     * @deprecated
     */
    const RAD_DEG: Const;
    /**
     * @deprecated
     */
    const DEG_RAD: Const;
    /**
     * @deprecated
     */
    const EPSILON: Const;
    /**
     * @deprecated
     */
    const floatClamp: typeof math.clamp;
    /**
     * @deprecated
     */
    const numberLerp: typeof math.lerp;
    /**
     * @deprecated
     */
    type AABB = Box;
    /**
     * @deprecated
     */
    const AABB: typeof Box;
    /**
     * @deprecated
     */
    type Matrix = Matrix4;
    /**
     * @deprecated
     */
    const Matrix: typeof Matrix4;
    /**
     * @deprecated
     */
    const Prefab: typeof paper.Prefab;
    /**
     * @deprecated
     */
    type Prefab = paper.Prefab;
    /**
     * @deprecated
     */
    const RawScene: typeof paper.RawScene;
    /**
     * @deprecated
     */
    type RawScene = paper.RawScene;
    const enum RenderQueue {
        /**
         * @deprecated
         */
        AlphaTest = 2450,
        /**
         * @deprecated
         */
        Transparent = 3000,
    }
    const enum BlendMode {
        /**
         * @deprecated
         */
        Blend = 2,
        /**
         * @deprecated
         */
        Blend_PreMultiply = 3,
        /**
         * @deprecated
         */
        Add = 4,
        /**
         * @deprecated
         */
        Add_PreMultiply = 5,
    }
    /**
     * @deprecated
     */
    const InputManager: {
        mouse: {
            isPressed: (button: number) => boolean;
            wasPressed: (button: number) => boolean;
            wasReleased: (button: number) => boolean;
        };
        touch: {
            getTouch: (button: number) => Pointer;
        };
        keyboard: {
            isPressed: (key: string | number) => boolean;
            wasPressed: (key: string | number) => boolean;
        };
    };
}
declare namespace paper {
    /**
     * 脚本组件。
     * - 为了开发的便捷，允许使用脚本组件实现组件生命周期。
     * - 生命周期的顺序如下：
     * - onAwake();
     * - onReset();
     * - onEnable();
     * - onStart();
     * - onFixedUpdate();
     * - onUpdate();
     * - onAnimationEvent();
     * - onLateUpdate();
     * - onBeforeRender();
     * - onDisable();
     * - onDestroy();
     */
    abstract class Behaviour extends BaseComponent {
        initialize(config?: any): void;
        dispatchEnabledEvent(enabled: boolean): void;
        /**
         * 该组件被初始化时执行。
         * - 在该组件的整个生命周期中只执行一次。
         * @param config 该组件被添加时可以传递的初始化数据。
         * @see paper.GameObject#addComponent()
         */
        onAwake?(config?: any): void;
        /**
         * TODO
         */
        onReset?(): void;
        /**
         * 该组件或所属的实体被激活时调用。
         * @see paper.BaseComponent#enabled
         * @see paper.GameObject#activeSelf
         */
        onEnable?(): void;
        /**
         * 该组件开始运行时执行。
         * - 在该组件的整个生命周期中只执行一次。
         */
        onStart?(): void;
        /**
         * 程序运行时以固定间隔被执行。
         * @param delta 本帧距离上一帧的时长。
         * @see paper.Clock
         */
        onFixedUpdate?(delta?: number): void;
        /**
         *
         */
        onTriggerEnter?(collider: any): void;
        /**
         *
         */
        onTriggerStay?(collider: any): void;
        /**
         *
         */
        onTriggerExit?(collider: any): void;
        /**
         *
         */
        onCollisionEnter?(collider: any): void;
        /**
         *
         */
        onCollisionStay?(collider: any): void;
        /**
         *
         */
        onCollisionExit?(collider: any): void;
        /**
         * 程序运行时每帧执行。
         * @param deltaTime 上一帧到此帧流逝的时间。（以秒为单位）
         */
        onUpdate?(deltaTime: number): void;
        /**
         *
         */
        onAnimationEvent?(animationEvent: egret3d.AnimationEvent): void;
        /**
         * 程序运行时每帧执行。
         * @param deltaTime 上一帧到此帧流逝的时间。（以秒为单位）
         */
        onLateUpdate?(deltaTime: number): void;
        /**
         * 该组件的实体拥有的渲染组件被渲染时执行。
         * - 不能在该周期更改渲染组件的材质或其他可能引起绘制信息改变的操作。
         */
        onBeforeRender?(): boolean;
        /**
         * 该组件或所属的实体被禁用时执行。
         * @see paper.BaseComponent#enabled
         * @see paper.GameObject#activeSelf
         */
        onDisable?(): void;
        /**
         * 该组件或所属的实体被销毁时执行。
         * - 在该组件的整个生命周期中只执行一次。
         * @see paper.GameObject#removeComponent()
         * @see paper.GameObject#destroy()
         */
        onDestroy?(): void;
    }
}
declare namespace paper {
    interface ClockUpdateFlags {
        frameCount: uint;
        tickCount: uint;
    }
    /**
     * 全局时钟信息组件。
     */
    class Clock extends Component {
        /**
         * 逻辑帧补偿速度
         */
        tickCompensateSpeed: uint;
        /**
         * 逻辑帧时间(秒), 例如设置为 1.0 / 60.0 为每秒 60 帧
         */
        tickInterval: float;
        /**
         * 渲染帧时间(秒), 例如设置为 1.0 / 60.0 为每秒 60 帧
         */
        frameInterval: float;
        /**
         * 运行倍速
         *
         * 为了保证平滑的效果, 不会影响逻辑/渲染帧频
         */
        timeScale: float;
        /**
         * 程序启动后运行的总渲染帧数
         */
        private _frameCount;
        /**
         * 程序启动后运行的总逻辑帧数
         */
        private _tickCount;
        private _beginTime;
        private _unscaledTime;
        private _unscaledDeltaTime;
        private _fixedTime;
        private _needReset;
        private _unusedFrameDelta;
        private _unusedTickDelta;
        initialize(): void;
        /**
         * 程序启动后运行的总渲染帧数
         */
        readonly frameCount: uint;
        /**
         * 程序启动后运行的总逻辑帧数
         */
        readonly tickCount: uint;
        /**
         * 系统时间(毫秒)
         */
        readonly now: uint;
        /**
         * 从程序开始运行时的累计时间(秒)
         */
        readonly time: float;
        /**
         *
         */
        readonly fixedTime: float;
        /**
         * 此次逻辑帧的时长
         */
        readonly lastTickDelta: float;
        /**
         * 此次渲染帧的时长
         */
        readonly lastFrameDelta: float;
        /**
         *
         */
        readonly unscaledTime: float;
        /**
         *
         */
        readonly unscaledDeltaTime: float;
        /**
         * reset
         */
        reset(): void;
        /**
         * 时间戳
         *
         * 因为 `performance.now()` 精确度更高, 更应该使用它作为时间戳
         * , 但是这个 API 在微信小游戏里支持有问题, 所以暂时使用 `Date.now()` 的实现
         *
         * 关于 `Date.now()` 与 `performance.now()`
         *
         * * 两者都是以毫秒为单位
         * * `Date.now()` 是从 Unix 纪元 (1970-01-01T00:00:00Z) 至今的毫秒数, 而后者是从页面加载至今的毫秒数
         * * `Date.now()` 精确到毫秒, 一般是整数, 后者可以精确到 5 微秒 (理论上, 可能各平台各浏览器实现的不同), 为浮点数
         * * `Date.now()` 是 Javascript 的 API, 而后者为 Web API
         * * `window.requestAnimationFrame()` 回调中使用的时间戳可认为和 `performance.now()` 的基本一致, 区别只是它不是实时的 "now", 而是 `window.requestAnimationFrame()` 调用产生时的 "now"
         */
        timestamp(): float;
    }
    /**
     * 全局时钟信息组件实例。
     */
    const clock: Clock;
}
declare namespace paper {
    /**
     * 全局销毁信息收集组件。
     */
    class DisposeCollecter extends Component {
        /**
         * 缓存此帧销毁的全部场景。
         */
        readonly scenes: IScene[];
        /**
         * 缓存此帧销毁的全部实体。
         */
        readonly entities: IEntity[];
        /**
         * 缓存此帧销毁的全部组件。
         */
        readonly components: IComponent[];
        /**
         * 缓存此帧结束时释放的对象。
         */
        readonly releases: BaseRelease<any>[];
        /**
         * 缓存此帧结束时释放的资源。
         */
        readonly assets: Asset[];
        initialize(): void;
    }
    /**
     * 全局销毁信息收集组件实例。
     */
    const disposeCollecter: DisposeCollecter;
}
declare namespace egret3d {
    /**
     * 几何球体。
     */
    class Sphere extends paper.BaseRelease<Sphere> implements paper.ICCS<Sphere>, paper.ISerializable, IRaycast {
        private static readonly _instances;
        /**
         * 创建一个几何球体。
         * @param center 球体中心点。
         * @param radius 球体半径。
         */
        static create(center?: Readonly<IVector3>, radius?: number): Sphere;
        /**
         * 球体半径。
         */
        radius: number;
        /**
         * 球体中心点。
         */
        readonly center: Vector3;
        /**
         * 请使用 `egret3d.Sphere.create()` 创建实例。
         * @see egret3d.Sphere.create()
         */
        private constructor();
        serialize(): number[];
        deserialize(value: Readonly<[number, number, number, number]>): this;
        clone(): Sphere;
        copy(value: Readonly<Sphere>): this;
        set(center: Readonly<IVector3>, radius: number): this;
        applyMatrix(matrix: Readonly<Matrix4>): this;
        /**
         * 根据点集设置球体信息。
         * @param points 点集。
         * @param center 中心点。（不设置则自动计算）
         */
        fromPoints(points: ArrayLike<IVector3>, center?: Readonly<IVector3>): this;
        /**
         * 是否包含指定的点或其他球体。
         * @param value 点或球体。
         */
        contains(value: Readonly<IVector3 | Sphere>): boolean;
        /**
         * 获取一个点到该球体的最近点。（如果该点在球体内部，则最近点就是该点）
         * @param point 一个点。
         * @param out 最近点。
         */
        getClosestPointToPoint(point: Readonly<IVector3>, out?: Vector3): Vector3;
        /**
         * 获取一点到该球体表面的最近距离。
         * @param value 点。
         */
        getDistance(value: Readonly<IVector3>): number;
        raycast(ray: Readonly<Ray>, raycastInfo?: RaycastInfo | null): boolean;
    }
}
declare namespace paper {
}
declare namespace paper {
}
declare namespace paper {
    /**
     * 固定更新系统。
     * TODO
     */
    class FixedUpdateSystem extends BaseSystem<GameObject> {
        protected getMatchers(): INoneOfMatcher<GameObject>[];
        onTick(delta?: float): void;
    }
}
declare namespace paper {
}
declare namespace paper {
    /**
     * Late 更新系统。
     */
    class LateUpdateSystem extends BaseSystem<GameObject> {
        private readonly _laterCalls;
        protected getMatchers(): INoneOfMatcher<GameObject>[];
        onFrame(deltaTime: float): void;
        /**
         * @deprecated
         */
        callLater(callback: () => void): void;
    }
}
declare namespace paper {
}
declare namespace paper {
    /**
     *
     */
    class Deserializer {
        /**
         *
         * @param target
         * @param propName
         */
        static propertyHasGetterAndSetter(target: any, propName: string): boolean;
        /**
         *
         */
        readonly assets: string[];
        /**
         *
         */
        readonly objects: {
            [key: string]: IScene | IEntity;
        };
        /**
         *
         */
        readonly components: {
            [key: string]: IComponent;
        };
        root: IScene | IEntity | IComponent | null;
        private _keepUUID;
        private _makeLink;
        private readonly _deserializers;
        private readonly _prefabRootMap;
        private _rootTarget;
        private _deserializeObject(source, target);
        private _deserializeComponent(componentSource, source?, target?);
        private _deserializeChild(source, target?);
        getAssetOrComponent(source: IUUID | IAssetReference): Asset | IEntity | IComponent | null;
        /**
         * @private
         */
        deserialize<T extends (IScene | IEntity | IComponent)>(data: ISerializedData, keepUUID?: boolean, makeLink?: boolean, rootTarget?: IScene | IEntity | null): T | null;
    }
}
declare namespace paper {
    /**
     * @private
     */
    const DATA_VERSION: string;
    /**
     * @private
     */
    const DATA_VERSIONS: string[];
    /**
     * @private
     */
    function serialize(source: IScene | IEntity | IComponent, inline?: boolean): ISerializedData;
    /**
     * @private
     */
    function clone(object: IEntity): IEntity | IComponent | IScene | null;
    /**
     * @private
     */
    function equal(source: any, target: any): boolean;
    /**
     * @private
     */
    function serializeAsset(source: Asset): IAssetReference;
    /**
     * 创建指定对象的结构体。
     */
    function serializeStruct(source: BaseObject): ISerializedStruct;
}
declare namespace paper {
    /**
     * @deprecated
     */
    type CullingMask = Layer;
    /**
     * @deprecated
     */
    const CullingMask: any;
    /**
     * @deprecated
     * @see paper.singleton
     */
    class SingletonComponent extends paper.BaseComponent {
    }
    /**
     * @deprecated
     */
    type GameObjectGroup = Group<GameObject>;
    const GameObjectGroup: typeof Group;
    /**
     * @deprecated
     */
    /**
     * @deprecated
     * @see paper.clock
     */
    const Time: Clock;
    /**
     * @deprecated
     */
    const enum InterestType {
        Extends = 1,
        Exculde = 2,
        Unessential = 4,
    }
    /**
     * @deprecated
     */
    type InterestConfig = {
        componentClass: IComponentClass<BaseComponent>[] | IComponentClass<BaseComponent>;
        type?: InterestType;
        listeners?: {
            type: signals.Signal;
            listener: (component: BaseComponent) => void;
        }[];
    };
}
declare namespace egret3d {
    /**
     * Shader 通用宏定义。
     */
    const enum ShaderDefine {
        TONE_MAPPING = "TONE_MAPPING",
        GAMMA_FACTOR = "GAMMA_FACTOR",
        USE_LOGDEPTHBUF = "USE_LOGDEPTHBUF",
        USE_LOGDEPTHBUF_EXT = "USE_LOGDEPTHBUF_EXT",
        USE_COLOR = "USE_COLOR",
        USE_MAP = "USE_MAP",
        USE_ALPHAMAP = "USE_ALPHAMAP",
        USE_AOMAP = "USE_AOMAP",
        USE_BUMPMAP = "USE_BUMPMAP",
        USE_NORMALMAP = "USE_NORMALMAP",
        USE_SPECULARMAP = "USE_SPECULARMAP",
        USE_ROUGHNESSMAP = "USE_ROUGHNESSMAP",
        USE_METALNESSMAP = "USE_METALNESSMAP",
        USE_DISPLACEMENTMAP = "USE_DISPLACEMENTMAP",
        USE_EMISSIVEMAP = "USE_EMISSIVEMAP",
        USE_ENVMAP = "USE_ENVMAP",
        USE_LIGHTMAP = "USE_LIGHTMAP",
        USE_SHADOWMAP = "USE_SHADOWMAP",
        USE_SKINNING = "USE_SKINNING",
        USE_SIZEATTENUATION = "USE_SIZEATTENUATION",
        TOON = "TOON",
        STANDARD = "STANDARD",
        TEXTURE_LOD_EXT = "TEXTURE_LOD_EXT",
        ENVMAP_TYPE_CUBE = "ENVMAP_TYPE_CUBE",
        ENVMAP_TYPE_CUBE_UV = "ENVMAP_TYPE_CUBE_UV",
        ENVMAP_TYPE_EQUIREC = "ENVMAP_TYPE_EQUIREC",
        ENVMAP_TYPE_SPHERE = "ENVMAP_TYPE_SPHERE",
        ENVMAP_MODE_REFRACTION = "ENVMAP_MODE_REFRACTION",
        ENVMAP_BLENDING_MULTIPLY = "ENVMAP_BLENDING_MULTIPLY",
        ENVMAP_BLENDING_MIX = "ENVMAP_BLENDING_MIX",
        ENVMAP_BLENDING_ADD = "ENVMAP_BLENDING_ADD",
        FLAT_SHADED = "FLAT_SHADED",
        MAX_BONES = "MAX_BONES",
        BONE_TEXTURE = "BONE_TEXTURE",
        NUM_DIR_LIGHTS = "NUM_DIR_LIGHTS",
        NUM_POINT_LIGHTS = "NUM_POINT_LIGHTS",
        NUM_RECT_AREA_LIGHTS = "NUM_RECT_AREA_LIGHTS",
        NUM_SPOT_LIGHTS = "NUM_SPOT_LIGHTS",
        NUM_HEMI_LIGHTS = "NUM_HEMI_LIGHTS",
        NUM_CLIPPING_PLANES = "NUM_CLIPPING_PLANES",
        UNION_CLIPPING_PLANES = "UNION_CLIPPING_PLANES",
        SHADOWMAP_TYPE_PCF = "SHADOWMAP_TYPE_PCF",
        SHADOWMAP_TYPE_PCF_SOFT = "SHADOWMAP_TYPE_PCF_SOFT",
        DEPTH_PACKING_3200 = "DEPTH_PACKING 3200",
        DEPTH_PACKING_3201 = "DEPTH_PACKING 3201",
        FLIP_SIDED = "FLIP_SIDED",
        DOUBLE_SIDED = "DOUBLE_SIDED",
        PREMULTIPLIED_ALPHA = "PREMULTIPLIED_ALPHA",
        USE_FOG = "USE_FOG",
        FOG_EXP2 = "FOG_EXP2",
        FLIP_V = "FLIP_V",
    }
    /**
     * Shader 通用 Uniform 名称。
     */
    const enum ShaderUniformName {
        Diffuse = "diffuse",
        Opacity = "opacity",
        Size = "size",
        Map = "map",
        AlphaMap = "alphaMap",
        AOMap = "aoMap",
        BumpMap = "bumpMap",
        NormalMap = "normalMap",
        SpecularMap = "specularMap",
        GradientMap = "gradientMap",
        RoughnessMap = "roughnessMap",
        MetalnessMap = "metalnessMap",
        DisplacementMap = "displacementMap",
        EnvMap = "envMap",
        EmissiveMap = "emissiveMap",
        CubeMap = "tCube",
        EquirectMap = "tEquirect",
        Flip = "tFlip",
        UVTransform = "uvTransform",
        Reflectivity = "reflectivity",
        RefractionRatio = "refractionRatio",
        Specular = "specular",
        Shininess = "shininess",
        BumpScale = "bumpScale",
        NormalScale = "normalScale",
        Roughness = "roughness",
        Metalness = "metalness",
        Emissive = "emissive",
        EmissiveIntensity = "emissiveIntensity",
        FlipEnvMap = "flipEnvMap",
        MaxMipLevel = "maxMipLevel",
        Rotation = "rotation",
        Scale2D = "scale2D",
        Center = "center",
    }
    /**
     * Shader宏定义排序。
     */
    const enum ShaderDefineOrder {
        GammaFactor = 1,
        DecodingFun = 2,
        EncodingFun = 3,
    }
    /**
     *
     */
    const enum HumanoidMask {
        Head = 0,
        Body = 1,
        LeftArm = 2,
        RightArm = 3,
        LeftHand = 4,
        RightHand = 5,
        LeftLeg = 6,
        RightLeg = 7,
        LeftHandIK = 8,
        RightHandIK = 9,
        LeftFootIK = 10,
        RightFootIK = 11,
    }
    /**
     *
     */
    const enum HumanoidJoint {
        Heck = "H_Neck",
        Head = "H_Head",
        LeftEye = "H_LeftEye",
        RightEye = "H_RightEye",
        Jaw = "H_Jaw",
        Hips = "B_Hips",
        Spine = "B_Spine",
        Chest = "B_Chest",
        UpperChest = "B_UpperChest",
        LeftShoulder = "LA_Shoulder",
        LeftUpperArm = "LA_UpperArm",
        LeftLowerArm = "LA_LowerArm",
        LeftHand = "LA_Hand",
        RightShoulder = "RA_Shoulder",
        RightUpperArm = "RA_UpperArm",
        RightLowerArm = "RA_LowerArm",
        RightHand = "RA_Hand",
        LeftUpperLeg = "LL_UpperLeg",
        LeftLowerLeg = "LL_LowerLeg",
        LeftFoot = "LL_Foot",
        LeftToes = "LL_Toes",
        RightUpperLeg = "RL_UpperLeg",
        RightLowerLeg = "RL_LowerLeg",
        RightFoot = "RL_Foot",
        RightToes = "RL_Toes",
        LeftThumbProximal = "LH_ThumbProximal",
        LeftThumbIntermediate = "LH_ThumbIntermediate",
        LeftThumbDistal = "LH_ThumbDistal",
        LeftIndexProximal = "LH_IndexProximal",
        LeftIndexIntermediate = "LH_IndexIntermediate",
        LeftIndexDistal = "LH_IndexDistal",
        LeftMiddleProximal = "LH_MiddleProximal",
        LeftMiddleIntermediate = "LH_MiddleIntermediate",
        LeftMiddleDistal = "LH_MiddleDistal",
        LeftRingProximal = "LH_RingProximal",
        LeftRingIntermediate = "LH_RingIntermediate",
        LeftRingDistal = "LH_RingDistal",
        LeftLittleProximal = "LH_LittleProximal",
        LeftLittleIntermediate = "LH_LittleIntermediate",
        LeftLittleDistal = "LH_LittleDistal",
        RightThumbProximal = "RH_ThumbProximal",
        RightThumbIntermediate = "RH_ThumbIntermediate",
        RightThumbDistal = "RH_ThumbDistal",
        RightIndexProximal = "RH_IndexProximal",
        RightIndexIntermediate = "RH_IndexIntermediate",
        RightIndexDistal = "RH_IndexDistal",
        RightMiddleProximal = "RH_MiddleProximal",
        RightMiddleIntermediate = "RH_MiddleIntermediate",
        RightMiddleDistal = "RH_MiddleDistal",
        RightRingProximal = "RH_RingProximal",
        RightRingIntermediate = "RH_RingIntermediate",
        RightRingDistal = "RH_RingDistal",
        RightLittleProximal = "RH_LittleProximal",
        RightLittleIntermediate = "RH_LittleIntermediate",
        RightLittleDistal = "RH_LittleDistal",
    }
    /**
     * 内置提供的全局 Attribute。
     * @private
     */
    const globalAttributeSemantics: {
        [key: string]: gltf.AttributeSemantics;
    };
    /**
     * 内置提供的全局 Uniform。
     * @private
     */
    const globalUniformSemantics: {
        [key: string]: gltf.UniformSemantics;
    };
    /**
     * 内置提供的场景 Uniform。
     * @private
     */
    const sceneUniformSemantics: {
        [key: string]: gltf.UniformSemantics;
    };
    /**
     * 内置提供的摄像机 Uniform。
     * @private
     */
    const cameraUniformSemantics: {
        [key: string]: gltf.UniformSemantics;
    };
    /**
     * 内置提供的影子 Uniform。
     * @private
     */
    const shadowUniformSemantics: {
        [key: string]: gltf.UniformSemantics;
    };
    /**
     * 内置提供的模型 Uniform。
     * @private
     */
    const modelUniformSemantics: {
        [key: string]: gltf.UniformSemantics;
    };
    /**
     *
     */
    interface ITransformObserver {
        /**
         *
         */
        onTransformChange(): void;
    }
    /**
     * 渲染系统接口。
     */
    interface IRenderSystem {
        /**
         * 渲染相机。
         * @param camera
         */
        render(camera: Camera, material: Material | null, renderTarget: RenderTexture | null): void;
        /**
         * 绘制一个绘制信息。
         * @param camera
         * @param drawCall
         */
        draw(drawCall: DrawCall, material: Material | null): void;
    }
    /**
     *
     */
    interface RunOptions extends paper.RunOptions {
        /**
         * 舞台宽。
         */
        contentWidth?: number;
        /**
         * 舞台高。
         */
        contentHeight?: number;
        /**
         * 是否开启抗锯齿，默认开启。
         */
        antialias?: boolean;
        /**
         * 是否与画布背景色混合，默认不混合。
         */
        alpha?: boolean;
        /**
         * 是否预乘
         */
        premultipliedAlpha?: boolean;
        /**
         *
         */
        gammaInput?: boolean;
        antialiasSamples?: number;
        canvas?: HTMLCanvasElement;
        webgl?: WebGLRenderingContext;
    }
}
declare namespace egret3d {
    /**
     * 变换组件。
     * - 实现 3D 空间坐标系变换。
     */
    class Transform extends paper.BaseTransform {
        private _localDirty;
        private _worldDirty;
        private readonly _observers;
        initialize(): void;
        /**
         *
         * @param observer
         */
        registerObserver(observer: ITransformObserver): void;
        /**
         *
         * @param observer
         */
        unregisterObserver(observer: ITransformObserver): void;
        private readonly _localPosition;
        private readonly _localRotation;
        private readonly _localEuler;
        private readonly _localEulerAngles;
        private readonly _localScale;
        private readonly _position;
        private readonly _rotation;
        private readonly _euler;
        private readonly _eulerAngles;
        private readonly _scale;
        private readonly _localToParentMatrix;
        private readonly _worldToLocalMatrix;
        private readonly _localToWorldMatrix;
        protected _onChangeParent(isBefore: boolean, worldTransformStays: boolean): void;
        private _onPositionUpdate(position);
        private _onRotationUpdate(rotation);
        private _onEulerUpdate(euler);
        private _onEulerAnglesUpdate(euler);
        private _onScaleUpdate(scale);
        private _dirtify(isLocalDirty, dirty);
        private _updateMatrix(isWorldSpace);
        private _updateEuler(isWorldSpace, order?);
        /**
         * 设置该组件的本地位置。
         * @param position 位置。
         */
        setLocalPosition(position: Readonly<IVector3>): this;
        /**
         * 设置该组件的本地位置。
         * @param x 位置的 X 坐标。
         * @param y 位置的 Y 坐标。
         * @param z 位置的 Z 坐标。
         */
        setLocalPosition(x: number, y: number, z: number): this;
        /**
         * 该组件的本地位置。
         * - 并不会返回一个新的 `egret3d.Vector3` 实例。
         * - 可以调用 `vector3.update()` 将对该向量的修改同步到该组件，`gameObject.transform.localPosition.add(egret3d.Vector3.ONE).update()`。
         */
        localPosition: Readonly<Vector3>;
        /**
         * 设置该组件的本地四元数旋转。
         * @param rotation 四元数旋转。
         */
        setLocalRotation(rotation: Readonly<IVector4>): this;
        /**
         * 设置该组件的本地四元数旋转。
         * @param x 四元数dX 分量。
         * @param y 四元数dY 分量。
         * @param z 四元数dZ 分量。
         * @param w 四元数dW 分量。
         */
        setLocalRotation(x: number, y: number, z: number, w: number): this;
        /**
         * 该组件的本地四元数旋转。
         * - 并不会返回一个新的 `egret3d.Quaternion` 实例。
         * - 可以调用 `quaternion.update()` 将对该四元数的修改同步到该组件，`gameObject.transform.localRotation.multiplyScalar(0.1).update()`。
         */
        localRotation: Readonly<Quaternion>;
        /**
         * 设置该组件的本地欧拉旋转。（弧度制）
         * @param euler 欧拉旋转。
         */
        setLocalEuler(euler: Readonly<IVector3>, order?: EulerOrder): this;
        /**
         * 设置该组件的本地欧拉旋转。（弧度制）
         * @param x
         * @param y
         * @param z
         * @param order
         */
        setLocalEuler(x: number, y: number, z: number, order?: EulerOrder): this;
        /**
         * 该组件的本地欧拉旋转。（弧度制）
         */
        localEuler: Readonly<Vector3>;
        /**
         * 设置该组件的本地欧拉旋转。（角度制）
         * @param euler 欧拉旋转。
         */
        setLocalEulerAngles(euler: Readonly<IVector3>, order?: EulerOrder): this;
        /**
         * 设置该组件的本地欧拉旋转。（角度制）
         * @param x
         * @param y
         * @param z
         * @param order
         */
        setLocalEulerAngles(x: number, y: number, z: number, order?: EulerOrder): this;
        /**
         * 该组件的本地欧拉旋转。（角度制）
         */
        localEulerAngles: Readonly<Vector3>;
        /**
         * 设置该组件的本地缩放。
         * @param scale 缩放。
         */
        setLocalScale(scale: Readonly<IVector3>): this;
        /**
         * 设置该组件的本地缩放。
         * @param x X 轴缩放。
         * @param y Y 轴缩放。
         * @param z Z 轴缩放。
         */
        setLocalScale(x: number, y?: number, z?: number): this;
        /**
         * 该组件的本地缩放。
         */
        localScale: Readonly<Vector3>;
        /**
         * 该组件的本地矩阵。
         */
        readonly localToParentMatrix: Readonly<Matrix4>;
        /**
         * 设置该组件的世界位置。
         * @param position 位置。
         */
        setPosition(position: Readonly<IVector3>): this;
        /**
         * 设置该组件的世界位置。
         * @param x
         * @param y
         * @param z
         */
        setPosition(x: number, y: number, z: number): this;
        /**
         * 该组件的世界位置。
         */
        position: Readonly<Vector3>;
        /**
         * 设置该组件的本地四元数旋转。
         * @param rotation 四元数旋转。
         */
        setRotation(rotation: Readonly<IVector4>): this;
        /**
         * 设置该组件的本地四元数旋转。
         * @param x
         * @param y
         * @param z
         * @param w
         */
        setRotation(x: number, y: number, z: number, w: number): this;
        /**
         * 该组件的世界旋转。
         */
        rotation: Readonly<Quaternion>;
        /**
         * 该组件的世界欧拉旋转。（弧度制）
         * @param euler 欧拉旋转。
         */
        setEuler(euler: Readonly<IVector3>, order?: EulerOrder): this;
        /**
         * 该组件的世界欧拉旋转。（弧度制）
         * @param x
         * @param y
         * @param z
         * @param order
         */
        setEuler(x: number, y: number, z: number, order?: EulerOrder): this;
        /**
         * 该组件的世界欧拉旋转。（弧度制）
         */
        euler: Readonly<Vector3>;
        /**
         * 该组件的世界欧拉旋转。（角度制）
         * @param euler 欧拉旋转。
         */
        setEulerAngles(euler: Readonly<IVector3>, order?: EulerOrder): this;
        /**
         * 该组件的世界欧拉旋转。（角度制）
         * @param x
         * @param y
         * @param z
         * @param order
         */
        setEulerAngles(x: number, y: number, z: number, order?: EulerOrder): this;
        /**
         * 该组件的世界欧拉旋转。（角度制）
         */
        eulerAngles: Readonly<Vector3>;
        /**
         * 该组件的世界缩放。
         */
        /**
         * @deprecated
         */
        scale: Readonly<Vector3>;
        /**
         * 从该组件空间坐标系到世界空间坐标系的变换矩阵。
         */
        readonly localToWorldMatrix: Readonly<Matrix4>;
        /**
         * 从世界空间坐标系到该组件空间坐标系的变换矩阵。
         */
        readonly worldToLocalMatrix: Readonly<Matrix4>;
        /**
         * 将该组件位移指定距离。
         * @param isWorldSpace 是否是世界坐标系。
         */
        translate(value: Readonly<IVector3>, isWorldSpace?: boolean): this;
        translate(x: number, y: number, z: number, isWorldSpace?: boolean): this;
        /**
         * 将该组件旋转指定的欧拉旋转。（弧度制）
         * @param isWorldSpace 是否是世界坐标系。
         */
        rotate(value: Readonly<IVector3>, isWorldSpace?: boolean): this;
        rotate(x: number, y: number, z: number, isWorldSpace?: boolean): this;
        /**
         * 将该组件绕指定轴旋转指定弧度。
         * @param axis 指定轴。
         * @param angle 指定弧度。
         * @param isWorldSpace 是否是世界坐标系。
         */
        rotateOnAxis(axis: Readonly<IVector3>, angle: number, isWorldSpace?: boolean): this;
        /**
         * 将该组件绕世界指定点和世界指定轴旋转指定弧度。
         * @param worldPosition 世界指定点。
         * @param worldAxis 世界指定轴。
         * @param angle 指定弧度。
         */
        rotateAround(worldPosition: Readonly<IVector3>, worldAxis: Readonly<IVector3>, angle: number): this;
        /**
         * 通过旋转使得该组件的 Z 轴正方向指向目标点。
         * @param target 目标点。
         * @param up 旋转后，该组件在世界空间坐标系下描述的 Y 轴正方向。
         */
        lookAt(target: Readonly<this> | Readonly<IVector3>, up?: Readonly<IVector3>): this;
        /**
         * 通过旋转使得该组件的 Z 轴正方向指向目标方向。
         * @param target 目标方向。
         * @param up 旋转后，该组件在世界空间坐标系下描述的 Y 轴正方向。
         */
        lookRotation(direction: Readonly<IVector3>, up?: Readonly<IVector3>): this;
        /**
         * 获取该组件在世界空间坐标系下描述的 X 轴正方向。
         * @param out 输出向量。
         */
        getRight(out?: Vector3): Vector3;
        /**
         * 获取该组件在世界空间坐标系下描述的 Y 轴正方向。
         * @param out 输出向量。
         */
        getUp(out?: Vector3): Vector3;
        /**
         * 获取该组件在世界空间坐标系下描述的 Z 轴正方向。
         * @param out 输出向量。
         */
        getForward(out?: Vector3): Vector3;
        /**
         * @deprecated
         */
        getLocalPosition(): Readonly<Vector3>;
        /**
         * @deprecated
         */
        getLocalRotation(): Readonly<Quaternion>;
        /**
         * @deprecated
         */
        getLocalEuler(order?: EulerOrder): Readonly<Vector3>;
        /**
         * @deprecated
         */
        getLocalEulerAngles(order?: EulerOrder): Readonly<Vector3>;
        /**
         * @deprecated
         */
        getLocalScale(): Readonly<Vector3>;
        /**
         * @deprecated
         */
        getPosition(): Readonly<Vector3>;
        /**
         * @deprecated
         */
        getRotation(): Readonly<Quaternion>;
        /**
         * @deprecated
         */
        getEuler(order?: EulerOrder): Readonly<Vector3>;
        /**
         * @deprecated
         */
        getEulerAngles(order?: EulerOrder): Readonly<Vector3>;
        /**
         * @deprecated
         */
        getScale(): Readonly<Vector3>;
        /**
         * @deprecated
         */
        setScale(scale: Readonly<IVector3>): this;
        setScale(x: number, y?: number, z?: number): this;
        /**
         * @deprecated
         */
        getLocalMatrix(): Readonly<Matrix4>;
        /**
         * @deprecated
         */
        getWorldMatrix(): Readonly<Matrix4>;
        /**
         * @deprecated
         */
        readonly localMatrix: Readonly<Matrix4>;
        /**
         * @deprecated
         */
        readonly worldMatrix: Readonly<Matrix4>;
    }
}
declare namespace egret3d {
    /**
     * 全局舞台信息组件。
     */
    class Stage extends paper.BaseComponent {
        /**
         * 当屏幕尺寸改变时派发事件。
         */
        readonly onScreenResize: signals.Signal;
        /**
         * 当舞台尺寸改变时派发事件。
         */
        readonly onResize: signals.Signal;
        /**
         * 舞台到屏幕的缩放系数。
         */
        readonly scaler: float;
        private _rotated;
        private _matchFactor;
        private readonly _screenSize;
        private readonly _size;
        private readonly _viewport;
        private _updateViewport();
        initialize({size, screenSize}: {
            size: Readonly<ISize>;
            screenSize: Readonly<ISize>;
        }): void;
        /**
         * 屏幕到舞台坐标的转换。
         * @param input 屏幕坐标。
         * @param output 舞台坐标。
         */
        screenToStage(input: Readonly<IVector2>, output?: Vector3 | null): Vector3;
        /**
         * 舞台到屏幕坐标的转换。
         * @param input 舞台坐标。
         * @param output 屏幕坐标。
         */
        stageToScreen(input: Readonly<IVector2>, output?: Vector3 | null): Vector3;
        /**
         * 舞台是否因屏幕尺寸的改变而发生了旋转。
         * - 旋转不会影响渲染视口的宽高交替，引擎通过反向旋转外部画布来抵消屏幕的旋转。
         */
        readonly rotated: boolean;
        /**
         * 舞台以宽或高为基准适配屏幕的系数。
         * - [`0.0` ~ `1.0`]。
         * - `0.0` 以宽适配屏幕。
         * - `1.0` 以高适配屏幕。
         */
        matchFactor: float;
        /**
         * 程序运行使用的屏幕尺寸。
         */
        screenSize: Readonly<ISize>;
        /**
         * 舞台初始尺寸。
         * - 该尺寸仅做为横屏竖屏的选择，以及最大分辨率的依据。
         */
        size: Readonly<ISize>;
        /**
         * 舞台的渲染视口。
         * - 舞台的偏移和实际尺寸。
         */
        readonly viewport: Readonly<Rectangle>;
        /**
         * @deprecated
         */
        readonly screenViewport: Rectangle;
    }
    /**
     * 全局舞台信息组件实例。
     */
    const stage: Stage;
}
declare namespace egret3d {
    /**
     * 默认的网格资源。
     */
    class DefaultMeshes extends paper.BaseComponent {
        /**
         * 一个三角形网格。
         */
        static TRIANGLE: Mesh;
        /**
         * 一个正方形网格。
         */
        static QUAD: Mesh;
        /**
         * 一个正方形网格。
         * - 坐标系原点在其中的一边中点上。
         */
        static QUAD_PARTICLE: Mesh;
        /**
         * 一个平面网格。
         */
        static PLANE: Mesh;
        /**
         * 一个正方体网格。
         */
        static CUBE: Mesh;
        /**
         * 一个金字塔网格。
         */
        static PYRAMID: Mesh;
        /**
         * 一个圆锥体网格。
         */
        static CONE: Mesh;
        /**
         * 一个圆柱体网格。
         */
        static CYLINDER: Mesh;
        /**
         * 一个圆环体网格。
         */
        static TORUS: Mesh;
        /**
         * 一个球体网格。
         */
        static SPHERE: Mesh;
        /**
         * 渲染精灵使用的网格。
         */
        static SPRITE: Mesh;
        static LINE_X: Mesh;
        static LINE_Y: Mesh;
        static LINE_Z: Mesh;
        static CIRCLE_LINE: Mesh;
        static CUBE_LINE: Mesh;
        /**
         *
         */
        static FULLSCREEN: Mesh;
        initialize(): void;
        /**
         * @deprecated
         */
        static createObject(mesh: Mesh, name?: string, tag?: string, scene?: paper.Scene): paper.GameObject;
    }
}
declare namespace egret3d {
    /**
     * 默认的纹理资源。
     */
    class DefaultTextures extends paper.BaseComponent {
        /**
         * 纯白色纹理。
         * - 注意请不要修改该值。
         */
        static WHITE: BaseTexture;
        /**
         * 纯灰色纹理。
         * - 注意请不要修改该值。
         */
        static GRAY: BaseTexture;
        /**
         * 黑白网格纹理。
         * - 注意请不要修改该值。
         */
        static GRID: BaseTexture;
        /**
         * 用于表示纹理资源丢失的纹理。
         * - 注意请不要修改该值。
         */
        static MISSING: BaseTexture;
        initialize(): void;
    }
}
declare namespace egret3d {
    /**
     * 默认的着色器资源。
     */
    class DefaultShaders extends paper.BaseComponent {
        /**
         * 默认的 mesh basic 着色器。
         * - 注意请不要修改该值。
         */
        static MESH_BASIC: Shader;
        /**
         * 默认的 mesh normal 着色器。
         * - 注意请不要修改该值。
         */
        static MESH_NORMAL: Shader;
        /**
         * 默认的 mesh lambert 着色器。
         * - 注意请不要修改该值。
         */
        static MESH_LAMBERT: Shader;
        /**
         * 默认的 mesh phone 着色器。
         * - 注意请不要修改该值。
         */
        static MESH_PHONG: Shader;
        /**
         * 默认的 mesh physical 着色器。
         * - 注意请不要修改该值。
         */
        static MESH_PHYSICAL: Shader;
        /**
         * 默认的 mesh standard 着色器。
         * - 注意请不要修改该值。
         */
        static MESH_STANDARD: Shader;
        /**
         * 默认的 points 着色器。
         * - 注意请不要修改该值。
         */
        static POINTS: Shader;
        /**
         * 默认的 vertex color 着色器。
         * - 注意请不要修改该值。
         */
        static VERTEX_COLOR: Shader;
        /**
         * 默认的虚线着色器。
         * - 注意请不要修改该值。
         */
        static LINEDASHED: Shader;
        /**
         * 默认的 sprite 着色器。
         * - 注意请不要修改该值。
         */
        static SPRITE: Shader;
        /**
         * 默认的 cube 着色器。
         * - 注意请不要修改该值。
         */
        static CUBE: Shader;
        /**
         *
         */
        static EQUIRECT: Shader;
        /**
         *
         */
        static DEPTH: Shader;
        /**
         *
         */
        static DISTANCE_RGBA: Shader;
        /**
         *
         */
        static SHADOW: Shader;
        /**
         *
         */
        static COPY: Shader;
        /**
         *
         */
        static FXAA: Shader;
        /**
         *
         */
        static BACKGROUND: Shader;
        /**
         *
         */
        static PARTICLE: Shader;
        /**
         * @deprecated
         */
        static MATERIAL_COLOR: Shader;
        /**
         * @deprecated
         */
        static MESH_BASIC_DOUBLESIDE: Shader;
        /**
         * @deprecated
         */
        static MESH_LAMBERT_DOUBLESIDE: Shader;
        /**
         * @deprecated
         */
        static MESH_PHONE_DOUBLESIDE: Shader;
        /**
         * @deprecated
         */
        static MESH_PHYSICAL_DOUBLESIDE: Shader;
        /**
         * @deprecated
         */
        static TRANSPARENT_COLOR: Shader;
        /**
         * @deprecated
         */
        static TRANSPARENT_ADDITIVE_COLOR: Shader;
        /**
         * @deprecated
         */
        static TRANSPARENT: Shader;
        /**
         * @deprecated
         */
        static TRANSPARENT_DOUBLESIDE: Shader;
        /**
         * @deprecated
         */
        static TRANSPARENT_ADDITIVE: Shader;
        /**
         * @deprecated
         */
        static TRANSPARENT_ADDITIVE_DOUBLESIDE: Shader;
        /**
         * @deprecated
         */
        static TRANSPARENT_MULTIPLY: Shader;
        /**
         * @deprecated
         */
        static TRANSPARENT_MULTIPLY_DOUBLESIDE: Shader;
        /**
         * @deprecated
         */
        static PARTICLE_BLEND: Shader;
        /**
         * @deprecated
         */
        static PARTICLE_ADDITIVE: Shader;
        /**
         * @deprecated
         */
        static PARTICLE_MULTIPLY: Shader;
        /**
         * @deprecated
         */
        static PARTICLE_BLEND_PREMULTIPLY: Shader;
        /**
         * @deprecated
         */
        static PARTICLE_ADDITIVE_PREMULTIPLY: Shader;
        /**
         * @deprecated
         */
        static PARTICLE_MULTIPLY_PREMULTIPLY: Shader;
        private _createShader(name, config, renderQueue, tStates, defines?);
        initialize(): void;
    }
}
declare namespace egret3d {
    /**
     * 默认的材质资源。
     */
    class DefaultMaterials extends paper.BaseComponent {
        /**
         * 默认 mesh basic 材质。
         * - 注意请不要修改该值。
         */
        static MESH_BASIC: Material;
        /**
         * 默认 mesh normal 材质。
         * - 注意请不要修改该值。
         */
        static MESH_NORMAL: Material;
        /**
         * 默认 mesh lambert 材质。
         * - 注意请不要修改该值。
         */
        static MESH_LAMBERT: Material;
        /**
         * 默认 mesh phone 材质。
         * - 注意请不要修改该值。
         */
        static MESH_PHONG: Material;
        /**
         * 默认 mesh physical 材质。
         * - 注意请不要修改该值。
         */
        static MESH_PHYSICAL: Material;
        /**
         * 默认 mesh standard 材质。
         * - 注意请不要修改该值。
         */
        static MESH_STANDARD: Material;
        /**
         * 默认虚线材质。
         * - 注意请不要修改该值。
         */
        static LINEDASHED: Material;
        /**
         * 用于表示材质资源丢失的材质。
         * - 注意请不要修改该值。
         */
        static MISSING: Material;
        /**
         * 用于天空盒纯背景使用的材质
         */
        static BACKGROUND: Material;
        /**
         * @deprecated
         */
        static MESH_BASIC_DOUBLESIDE: Material;
        /**
         * @deprecated
         */
        static MESH_LAMBERT_DOUBLESIDE: Material;
        private _createMaterial(name, shader);
        initialize(): void;
    }
}
declare namespace egret3d {
    /**
     *
     */
    enum LightCountDirty {
        None = 0,
        DirectionalLight = 1,
        SpotLight = 2,
        RectangleAreaLight = 4,
        PointLight = 8,
        HemisphereLight = 16,
    }
    /**
     * 全局摄像机和灯光组件。
     */
    class CameraAndLightCollecter extends paper.BaseComponent {
        /**
         * TODO
         */
        lightCountDirty: LightCountDirty;
        /**
         *
         */
        readonly postprocessingCamera: Camera;
        /**
         *
         */
        readonly shadowCamera: Camera;
        /**
         *
         */
        readonly cameras: Camera[];
        /**
         *
         */
        readonly lights: BaseLight[];
        /**
         *
         */
        readonly directionalLights: DirectionalLight[];
        /**
         *
         */
        readonly spotLights: SpotLight[];
        /**
         *
         */
        readonly rectangleAreaLights: RectangleAreaLight[];
        /**
         *
         */
        readonly pointLights: PointLight[];
        /**
         *
         */
        readonly hemisphereLights: HemisphereLight[];
        /**
         * 在渲染阶段正在执行渲染的相机组件。
         * - 通常在后期渲染和渲染前生命周期中使用。
         */
        currentCamera: Camera | null;
        /**
         * 在渲染阶段正在执行阴影渲染的灯光组件。
         */
        currentShadowLight: BaseLight | null;
        private _sortCameras(a, b);
        /**
         * 更新相机。
         */
        updateCameras(entities: ReadonlyArray<paper.IEntity>): void;
        /**
         * 更新灯光。
         */
        updateLights(entities: ReadonlyArray<paper.IEntity>): void;
        /**
         * 排序相机。
         */
        sortCameras(): void;
        /**
         * 相机计数。
         */
        readonly cameraCount: uint;
        /**
         * 灯光计数。
         */
        readonly lightCount: uint;
    }
    /**
     * 全局摄像机和灯光组件实例。
     */
    const cameraAndLightCollecter: CameraAndLightCollecter;
}
declare namespace egret3d {
    /**
     * 全局绘制信息组件。
     */
    class DrawCallCollecter extends paper.BaseComponent {
        /**
         *
         */
        drawCallCount: uint;
        /**
         * 专用于天空盒渲染的绘制信息。
         */
        readonly skyBox: DrawCall;
        /**
         * 专用于后期渲染的绘制信息。
         */
        readonly postprocessing: DrawCall;
        private _drawCallsDirty;
        private _entities;
        private _drawCalls;
        /**
         * @interal
         */
        initialize(): void;
        /**
         * 添加绘制信息。
         * @param drawCall
         */
        addDrawCall(drawCall: DrawCall): void;
        /**
         * 移除指定渲染组件的绘制信息列表。
         */
        removeDrawCalls(entity: paper.IEntity): boolean;
        /**
         * 是否包含指定渲染组件的绘制信息列表。
         */
        hasDrawCalls(entity: paper.IEntity): boolean;
        /**
         * 此帧可能参与渲染的绘制信息列表。
         * - 未进行视锥剔除的。
         */
        readonly drawCalls: ReadonlyArray<DrawCall>;
    }
    /**
     * 全局绘制信息收集组件实例。
     */
    const drawCallCollecter: DrawCallCollecter;
}
declare namespace egret3d {
    /**
     * 全局碰撞信息收集组件。
     */
    class ContactCollecter extends paper.BaseComponent {
        /**
         * 当前帧开始碰撞的。
         */
        readonly begin: any[];
        /**
         * 当前帧维持碰撞的。
         */
        readonly stay: any[];
        /**
         * 当前帧结束碰撞的。
         */
        readonly end: any[];
    }
}
declare namespace egret3d {
    /**
     * Pointer 按钮的类型。
     * - https://www.w3.org/TR/pointerevents/#the-button-property
     */
    const enum PointerButtonType {
        None = -1,
        LeftMouse = 0,
        TouchContact = 0,
        Pencontac = 0,
        MiddleMouse = 1,
        RightMouse = 2,
        PenBarrel = 2,
        Back = 3,
        X1 = 3,
        Forward = 4,
        X2 = 4,
        PenEraser = 5,
    }
    /**
     * Pointer 按钮的状态类型。
     * - https://www.w3.org/TR/pointerevents/#the-buttons-property
     */
    const enum PointerButtonsType {
        None = 0,
        LeftMouse = 1,
        TouchContact = 1,
        PenContac = 1,
        MiddleMouse = 4,
        RightMouse = 2,
        PenBarrel = 2,
        Back = 8,
        X1 = 8,
        Forward = 16,
        X2 = 16,
        PenEraser = 32,
    }
    /**
     * 按键类型。
     */
    const enum KeyCode {
        Unknown = "Unknown",
        F1 = "F1",
        F2 = "F2",
        F3 = "F3",
        F4 = "F4",
        F5 = "F5",
        F6 = "F6",
        F7 = "F7",
        F8 = "F8",
        F9 = "F9",
        F10 = "F10",
        F11 = "F11",
        F12 = "F12",
        Digit0 = "Digit0",
        Digit1 = "Digit1",
        Digit2 = "Digit2",
        Digit3 = "Digit3",
        Digit4 = "Digit4",
        Digit5 = "Digit5",
        Digit6 = "Digit6",
        Digit7 = "Digit7",
        Digit8 = "Digit8",
        Digit9 = "Digit9",
        KeyA = "KeyA",
        KeyB = "KeyB",
        KeyC = "KeyC",
        KeyD = "KeyD",
        KeyE = "KeyE",
        KeyF = "KeyF",
        KeyG = "KeyG",
        KeyH = "KeyH",
        KeyI = "KeyI",
        KeyJ = "KeyJ",
        KeyK = "KeyK",
        KeyL = "KeyL",
        KeyM = "KeyM",
        KeyN = "KeyN",
        KeyO = "KeyO",
        KeyP = "KeyP",
        KeyQ = "KeyQ",
        KeyR = "KeyR",
        KeyS = "KeyS",
        KeyT = "KeyT",
        KeyU = "KeyU",
        KeyV = "KeyV",
        KeyW = "KeyW",
        KeyX = "KeyX",
        KeyY = "KeyY",
        KeyZ = "KeyZ",
        Backquote = "Backquote",
        Minus = "Minus",
        Equal = "Equal",
        BracketLeft = "BracketLeft",
        BracketRight = "BracketRight",
        Backslash = "Backslash",
        Semicolon = "Semicolon",
        Quote = "Quote",
        Comma = "Comma",
        Period = "Period",
        Slash = "Slash",
        Escape = "Escape",
        ScrollLock = "ScrollLock",
        Pause = "Pause",
        Backspace = "Backspace",
        Tab = "Tab",
        CapsLock = "CapsLock",
        Space = "Space",
        ContextMenu = "ContextMenu",
        ShiftLeft = "ShiftLeft",
        ControlLeft = "ControlLeft",
        AltLeft = "AltLeft",
        MetaLeft = "MetaLeft",
        ShiftRight = "ShiftRight",
        ControlRight = "ControlRight",
        AltRight = "AltRight",
        MetaRight = "MetaRight",
        Insert = "Insert",
        Delete = "Delete",
        Home = "Home",
        End = "End",
        PageUp = "PageUp",
        PageDown = "PageDown",
        ArrowUp = "ArrowUp",
        ArrowDown = "ArrowDown",
        ArrowLeft = "ArrowLeft",
        ArrowRight = "ArrowRight",
        NumpadLock = "NumLock",
        NumpadDivide = "NumpadDivide",
        NumpadMultiply = "NumpadMultiply",
        NumpadSubtract = "NumpadSubtract",
        NumpadAdd = "NumpadAdd",
        NumpadEnter = "NumpadEnter",
        NumpadDecimal = "NumpadDecimal",
        Numpad0 = "Numpad0",
        Numpad1 = "Numpad1",
        Numpad2 = "Numpad2",
        Numpad3 = "Numpad3",
        Numpad4 = "Numpad4",
        Numpad5 = "Numpad5",
        Numpad6 = "Numpad6",
        Numpad7 = "Numpad7",
        Numpad8 = "Numpad8",
        Numpad9 = "Numpad9",
    }
    /**
     * 鼠标、笔、触控等的信息。
     */
    class Pointer extends paper.BaseRelease<Pointer> {
        private static readonly _instances;
        /**
         * 创建一个 Pointer 实例。
         */
        static create(): Pointer;
        /**
         * 该 Pointer 持续按下的时间。
         */
        holdedTime: number;
        /**
         * 该 Pointer 的舞台坐标。
         */
        readonly position: egret3d.Vector3;
        /**
         * 该 Pointer 按下的舞台坐标。
         */
        readonly downPosition: egret3d.Vector3;
        /**
         * 该 Pointer 此帧的移动速度。
         */
        readonly speed: egret3d.Vector3;
        /**
         * 该 Pointer 最近的事件。
         */
        event: PointerEvent | null;
        private constructor();
        /**
         * 该 Pointer 此帧按下的状态。
         * @param value
         */
        isDown(value?: PointerButtonsType, isPlayerMode?: boolean): boolean;
        /**
         * 该 Pointer 此帧持续按下的状态。
         * @param value
         */
        isHold(value?: PointerButtonsType, isPlayerMode?: boolean): boolean;
        /**
         * 该 Pointer 此帧抬起的状态。
         * @param value
         */
        isUp(value?: PointerButtonsType, isPlayerMode?: boolean): boolean;
        /**
         * 该 Pointer 此帧移动的状态。
         * @param value
         */
        isMove(distance?: number, isPlayerMode?: boolean): boolean | null;
    }
    /**
     * 按键的信息。
     */
    class Key {
        /**
         * 该按键持续按下的时间。
         */
        holdedTime: number;
        /**
         * 该按键最近的事件。
         */
        event: KeyboardEvent | null;
        /**
         * 该按键此帧按下的状态。
         * @param value
         */
        isDown(isPlayerMode?: boolean): boolean;
        /**
         * 该按键此帧持续按下的状态。
         * @param value
         */
        isHold(isPlayerMode?: boolean): boolean;
        /**
         * 该按键此帧抬起的状态。
         * @param value
         */
        isUp(isPlayerMode?: boolean): boolean;
    }
    /**
     * 全局输入信息组件。
     * - https://www.w3.org/TR/pointerevents/
     * - https://github.com/millermedeiros/js-signals/
     */
    class InputCollecter extends paper.BaseComponent {
        /**
         * 滚轮当前值。
         */
        mouseWheel: number;
        /**
         * 通常不需要使用该事件。
         */
        readonly onPointerOver: signals.Signal;
        /**
         * 通常不需要使用该事件。
         */
        readonly onPointerEnter: signals.Signal;
        /**
         * 通常不需要使用该事件。
         */
        readonly onPointerDown: signals.Signal;
        /**
         * 通常不需要使用该事件。
         */
        readonly onPointerMove: signals.Signal;
        /**
         * 通常不需要使用该事件。
         */
        readonly onPointerUp: signals.Signal;
        /**
         * 通常不需要使用该事件。
         */
        readonly onPointerCancel: signals.Signal;
        /**
         * 通常不需要使用该事件。
         */
        readonly onPointerOut: signals.Signal;
        /**
         * 通常不需要使用该事件。
         */
        readonly onPointerLeave: signals.Signal;
        /**
         * 通常不需要使用该事件。
         */
        readonly onMouseWheel: signals.Signal;
        /**
         * 通常不需要使用该事件。
         */
        readonly onKeyDown: signals.Signal;
        /**
         * 通常不需要使用该事件。
         */
        readonly onKeyUp: signals.Signal;
        /**
         * 默认的 Pointer 实例。
         */
        readonly defaultPointer: Pointer;
        private readonly _pointers;
        private readonly _keys;
        /**
         * 此帧按下的全部 Pointer。
         */
        getDownPointers(isPlayerMode?: boolean): ReadonlyArray<Pointer>;
        /**
         * 此帧持续按下的全部 Pointer。
         */
        getHoldPointers(isPlayerMode?: boolean): ReadonlyArray<Pointer>;
        /**
         * 此帧抬起的全部 Pointer。
         */
        getUpPointers(isPlayerMode?: boolean): ReadonlyArray<Pointer>;
        /**
         * 此帧按下的全部按键。
         */
        getDownKeys(isPlayerMode?: boolean): ReadonlyArray<Key>;
        /**
         * 此帧持续按下的全部按键。
         */
        getHoldKeys(isPlayerMode?: boolean): ReadonlyArray<Key>;
        /**
         * 此帧抬起的全部按键。
         */
        getUpKeys(isPlayerMode?: boolean): ReadonlyArray<Key>;
        /**
         * 通过键名称创建或获取一个按键实例。
         */
        getKey(code: KeyCode | number): Key;
        /**
         * 设备最大可支持的多点触摸数量。
         */
        readonly maxTouchPoints: uint;
    }
    /**
     * 全局输入信息组件实例。
     */
    const inputCollecter: InputCollecter;
}
declare namespace egret3d {
    /**
     * 碰撞体类型。
     * - 枚举需要支持的全部碰撞体类型。
     */
    enum ColliderType {
        /**
         * 立方体。
         */
        Box = 0,
        /**
         * 球体。
         */
        Sphere = 1,
        /**
         * 圆柱体。
         */
        Cylinder = 2,
        /**
         * 圆锥体。
         */
        Cone = 3,
        /**
         * 胶囊体。
         */
        Capsule = 4,
        /**
         * TODO
         */
        ConvexHull = 5,
        /**
         * TODO
         */
        Mesh = 6,
    }
    /**
     * 碰撞体接口。
     * - 为多物理引擎统一接口。
     */
    interface ICollider extends paper.BaseComponent {
        /**
         * 碰撞体类型。
         */
        readonly colliderType: ColliderType;
    }
    /**
     * 立方体碰撞组件接口。
     */
    interface IBoxCollider extends ICollider {
        /**
         * 描述该碰撞体的立方体。
         */
        readonly box: Box;
    }
    /**
     * 球体碰撞组件接口。
     */
    interface ISphereCollider extends ICollider {
        /**
         * 描述该碰撞体的球体。
         */
        readonly sphere: Sphere;
    }
    /**
     * 圆柱（锥）体碰撞组件接口。
     */
    interface ICylinderCollider extends ICollider {
        /**
         * 描述该碰撞体的圆柱（锥）体。
         */
        readonly cylinder: Cylinder;
    }
    /**
     * 胶囊体碰撞组件接口。
     */
    interface ICapsuleCollider extends ICollider {
        /**
         * 描述该碰撞体的胶囊体。
         */
        readonly capsule: Capsule;
    }
    /**
     * 网格碰撞组件接口。
     */
    interface IMeshCollider extends ICollider {
    }
    /**
     *
     */
    interface IRigidbody {
    }
    /**
     * 射线检测接口。
     */
    interface IRaycast {
        /**
         * 射线检测。
         * @param ray 射线。
         * @param raycastInfo 是否将检测的详细数据写入 raycastInfo。
         */
        raycast(ray: Readonly<Ray>, raycastInfo: RaycastInfo | null): boolean;
    }
}
declare namespace egret3d {
    /**
     *
     */
    class Spherical extends paper.BaseRelease<Spherical> implements paper.ICCS<Spherical>, paper.ISerializable {
        private static readonly _instances;
        /**
         *
         */
        static create(radius?: number, phi?: number, theta?: number): Spherical;
        /**
         *
         */
        radius: number;
        /**
         *
         */
        phi: number;
        /**
         *
         */
        theta: number;
        /**
         * 请使用 `egret3d.Spherical.create()` 创建实例。
         * @see egret3d.Spherical.create()
         */
        private constructor();
        serialize(): number[];
        deserialize(value: Readonly<[number, number, number]>): this;
        clone(): Spherical;
        copy(value: Readonly<Spherical>): this;
        set(radius: number, phi: number, theta: number): this;
        fromCartesianCoords(vector3: Readonly<IVector3>): this;
        fromCartesianCoords(x: number, y: number, z: number): this;
        makeSafe(): this;
    }
}
declare namespace egret3d {
    /**
     * 立方体碰撞组件。
     */
    class BoxCollider extends paper.BaseComponent implements IBoxCollider, IRaycast {
        readonly colliderType: ColliderType;
        readonly box: Box;
        raycast(ray: Readonly<Ray>, raycastInfo?: RaycastInfo | null): boolean;
        /**
         * @deprecated
         */
        readonly aabb: Box;
    }
}
declare namespace egret3d {
    /**
     * 球体碰撞组件。
     */
    class SphereCollider extends paper.BaseComponent implements ISphereCollider, IRaycast {
        readonly colliderType: ColliderType;
        readonly sphere: Sphere;
        raycast(ray: Readonly<Ray>, raycastInfo?: RaycastInfo | null): boolean;
    }
}
declare namespace egret3d {
    /**
     * 圆柱、圆台、圆锥体碰撞组件。
     * - 与 Y 轴对齐。
     */
    class CylinderCollider extends paper.BaseComponent implements ICylinderCollider, IRaycast {
        readonly colliderType: ColliderType;
        readonly cylinder: Cylinder;
        raycast(ray: Readonly<Ray>, raycastInfo?: RaycastInfo | null): boolean;
    }
}
declare namespace paper {
    /**
     * 实体组件匹配器。
     */
    class Matcher<TEntity extends IEntity> extends BaseRelease<Matcher<TEntity>> implements IAllOfMatcher<TEntity> {
        private static readonly _instances;
        /**
         * 创建匹配器。
         * @param componentClasses 必须包含的全部组件。
         */
        static create<TEntity extends IEntity>(...componentClasses: IComponentClass<IComponent>[]): IAllOfMatcher<TEntity>;
        /**
         * 创建匹配器。
         * @param componentEnabledFilter 是否以组件的激活状态做为匹配条件。
         * @param componentClasses 必须包含的全部组件。
         */
        static create<TEntity extends IEntity>(componentEnabledFilter: false, ...componentClasses: IComponentClass<IComponent>[]): IAllOfMatcher<TEntity>;
        readonly componentEnabledFilter: boolean;
        private _id;
        private readonly _components;
        private readonly _allOfComponents;
        private readonly _anyOfComponents;
        private readonly _noneOfComponents;
        private readonly _extraOfComponents;
        private constructor();
        private _sortComponents(a, b);
        private _distinct(source, target);
        private _merge();
        onClear(): void;
        anyOf(...components: IComponentClass<IComponent>[]): IAnyOfMatcher<TEntity>;
        noneOf(...components: IComponentClass<IComponent>[]): INoneOfMatcher<TEntity>;
        extraOf(...components: IComponentClass<IComponent>[]): INoneOfMatcher<TEntity>;
        matches(entity: TEntity, component: IComponentClass<IComponent> | null, isAdd: boolean, isAdded: boolean): -2 | -1 | 0 | 1 | 2;
        readonly id: string;
        readonly components: ReadonlyArray<IComponentClass<IComponent>>;
        readonly allOfComponents: ReadonlyArray<IComponentClass<IComponent>>;
        readonly anyOfComponents: ReadonlyArray<IComponentClass<IComponent>>;
        readonly noneOfComponents: ReadonlyArray<IComponentClass<IComponent>>;
        readonly extraOfComponents: ReadonlyArray<IComponentClass<IComponent>>;
    }
}
declare namespace egret3d {
    /**
     * 网格碰撞组件。
     */
    class MeshCollider extends paper.BaseComponent implements IMeshCollider, IRaycast {
        readonly colliderType: ColliderType;
        protected readonly _localBoundingBox: Box;
        private _mesh;
        raycast(ray: Readonly<Ray>, raycastInfo?: RaycastInfo | null): boolean;
        /**
         * 该组件的网格资源。
         */
        mesh: Mesh | null;
    }
}
declare namespace egret3d {
    function _colliderRaycast(collider: ICollider, raycaster: IRaycast, preRaycaster: IRaycast | null, ray: Readonly<Ray>, raycastInfo: RaycastInfo | null, modifyNormal?: boolean): boolean;
    /**
     * 用世界空间坐标系的射线检测指定的实体。（不包含其子级）
     * @param ray 世界空间坐标系的射线。
     * @param gameObject 实体。
     * @param raycastMesh 是否检测网格。（需要消耗较多的 CPU 性能，尤其是蒙皮网格）
     * @param raycastInfo
     */
    function raycast(ray: Readonly<Ray>, gameObject: Readonly<paper.GameObject>, raycastMesh?: boolean, raycastInfo?: RaycastInfo | null): boolean;
    /**
     * 用世界空间坐标系的射线检测指定的实体或组件列表。
     * @param ray 射线。
     * @param gameObjectsOrComponents 实体或组件列表。
     * @param maxDistance 最大相交点检测距离。
     * @param cullingMask 只对特定层的实体检测。
     * @param raycastMesh 是否检测网格。（需要消耗较多的 CPU 性能，尤其是蒙皮网格）
     */
    function raycastAll(ray: Readonly<Ray>, gameObjectsOrComponents: ReadonlyArray<paper.GameObject | paper.BaseComponent>, maxDistance?: number, cullingMask?: paper.Layer, raycastMesh?: boolean, backfaceCulling?: boolean): RaycastInfo[];
}
declare namespace egret3d {
    /**
     * 碰撞系统。
     */
    class CollisionSystem extends paper.BaseSystem<paper.GameObject> {
        private readonly _contactCollecter;
        private _raycast(ray, entity, cullingMask, maxDistance, raycastInfo);
        private _raycastCollider(ray, collider, raycastInfo);
        /**
         * 使用射线检测一个实体的碰撞体，并返回是否有碰撞。
         * @param ray 一个射线。
         * @param entity 一个实体。
         * @param cullingMask 允许检测的实体层级。
         * - 默认为 `paper.Layer.Default`。
         * @param maxDistance 允许检测的射线原点到实体变换组件的最大欧氏距离。
         * - [`0.0` ~ N]
         * - `0.0`：无限制。
         * @param raycastInfo 精确检测信息。
         * - 默认为 `null`，不进行精确检测。
         */
        raycastSingle(ray: Readonly<Ray>, entity: paper.GameObject, cullingMask?: paper.Layer, maxDistance?: float, raycastInfo?: RaycastInfo | null): boolean;
        /**
         * 使用射线检测所有实体的碰撞体，并返回是否有碰撞。
         * @param ray 一个射线。
         * @param cullingMask 允许检测的实体层级。
         * - 默认为 `paper.Layer.Default`。
         * @param maxDistance 允许检测的射线原点到实体变换组件的最大欧氏距离。
         * - [`0.0` ~ N]
         * - `0.0`：无限制。
         * @param raycastInfo 精确检测信息。
         * - 默认为 `null`，不进行精确检测。
         */
        raycast(ray: Readonly<Ray>, cullingMask?: paper.Layer, maxDistance?: float, raycastInfo?: RaycastInfo | null): boolean;
        protected getMatchers(): paper.IAnyOfMatcher<paper.GameObject>[];
        onTickCleanup(): void;
    }
}
declare namespace egret3d {
    /**
     * 相机组件。
     */
    class Camera extends paper.BaseComponent implements ITransformObserver {
        /**
         * 当前场景的主相机。
         * - 如果没有则创建一个。
         */
        static readonly main: Camera;
        /**
         * 编辑相机。
         * - 如果没有则创建一个。
         */
        static readonly editor: Camera;
        /**
         *
         */
        static current: Camera | null;
        /**
         * 该相机下的对象都是用此材质渲染
         */
        overrideMaterial: Material | null;
        /**
         * 该相机的绘制缓冲掩码。
         */
        bufferMask: gltf.BufferMask;
        /**
         * 该相机的渲染剔除掩码。
         * - 用来选择性的渲染部分实体。
         * - camera.cullingMask = paper.Layer.UI;
         * - camera.cullingMask |= paper.Layer.UI;
         * - camera.cullingMask &= ~paper.Layer.UI;
         */
        cullingMask: paper.Layer;
        /**
         * 该相机渲染排序。
         * - 该值越低的相机优先绘制。
         */
        order: int;
        /**
         * 该相机的背景色。
         */
        readonly backgroundColor: Color;
        /**
         * 该相机的渲染上下文。
         */
        readonly context: CameraRenderContext;
        private _nativeCulling;
        private _nativeProjection;
        private _nativeTransform;
        private _dirtyMask;
        private _opvalue;
        private _fov;
        private _near;
        private _far;
        private _size;
        private readonly _viewport;
        private readonly _pixelViewport;
        private readonly _subViewport;
        private readonly _frustum;
        private readonly _viewportMatrix;
        private readonly _cullingMatrix;
        private readonly _projectionMatrix;
        private readonly _cameraToWorldMatrix;
        private readonly _worldToCameraMatrix;
        private readonly _worldToClipMatrix;
        private readonly _clipToWorldMatrix;
        private _readRenderTarget;
        private _writeRenderTarget;
        private _renderTarget;
        /**
         * @private
         */
        _previewRenderTarget: RenderTexture | null;
        private _onStageResize();
        private _onViewportUpdate(value);
        initialize(): void;
        uninitialize(): void;
        onTransformChange(): void;
        /**
         * 将舞台坐标基于该相机的视角转换为世界坐标。
         * @param stagePosition 舞台坐标。
         * @param worldPosition 世界坐标。
         */
        stageToWorld(stagePosition: Readonly<IVector3>, worldPosition?: Vector3 | null): Vector3;
        /**
         * 将舞台坐标基于该相机的视角转换为世界坐标。
         * @param worldPosition 世界坐标。
         * @param stagePosition 舞台坐标。
         */
        worldToStage(worldPosition: Readonly<IVector3>, stagePosition?: Vector3 | null): Vector3;
        /**
         * 将舞台坐标基于该相机的视角转换为世界射线。
         * @param stageX 舞台水平坐标。
         * @param stageY 舞台垂直坐标。
         * @param ray 射线。
         */
        stageToRay(stageX: float, stageY: float, ray?: Ray): Ray;
        /**
         *
         */
        resetCullingMatrix(): this;
        /**
         *
         */
        resetProjectionMatrix(): this;
        /**
         *
         */
        resetWorldToCameraMatrix(): this;
        /**
         *
         */
        swapPostprocessingRenderTarget(): this;
        /**
         * 控制该相机从正交到透视的过渡的系数。
         * - [`0.0` ~ `1.0`]
         * - `0.0`：正交。
         * - `1.0`：透视。
         * - 中间值则在两种状态间插值。
         */
        opvalue: float;
        /**
         * 该相机视点到近裁剪面的距离。
         * - 单位为`米`。
         * - 该值过小会引起深度冲突。
         */
        near: float;
        /**
         * 该相机的视点到远裁剪面距离。
         * - 单位为`米`。
         */
        far: float;
        /**
         * 该相机透视投影的视野。
         * - 弧度制。
         */
        fov: float;
        /**
         * 该相机正交投影的尺寸。
         * - 单位为`米`。
         */
        size: float;
        /**
         * 该相机视口的宽高比。
         */
        readonly aspect: float;
        /**
         * 该相机渲染目标的尺寸。
         * - 单位为`米`。
         */
        readonly renderTargetSize: Readonly<ISize>;
        /**
         * 该相机归一化的渲染视口。
         */
        viewport: Readonly<Rectangle>;
        subViewport: Readonly<Rectangle>;
        /**
         * 该相机像素化的渲染视口。
         * - 单位为`像素`。
         */
        pixelViewport: Readonly<IRectangle>;
        /**
         * 该相机的截头锥体。
         */
        readonly frustum: Readonly<Frustum>;
        /**
         * 该相机在世界空间坐标系的裁切矩阵。
         */
        cullingMatrix: Readonly<Matrix4>;
        /**
         * 该相机的投影矩阵。
         */
        projectionMatrix: Readonly<Matrix4>;
        /**
         * 从该相机空间坐标系到世界空间坐标系的变换矩阵。
         */
        readonly cameraToWorldMatrix: Readonly<Matrix4>;
        /**
         * 从世界空间坐标系到该相机空间坐标系的变换矩阵。
         * - 当设置该矩阵时，该相机将使用设置值代替变换组件的矩阵进行渲染。
         */
        worldToCameraMatrix: Readonly<Matrix4>;
        /**
         * 从世界变换到该相机裁切空间的矩阵。
         */
        readonly worldToClipMatrix: Readonly<Matrix4>;
        /**
         * 从该相机裁切空间变换到世界的矩阵。
         */
        readonly clipToWorldMatrix: Readonly<Matrix4>;
        /**
         * 该相机的渲染目标。
         * - 未设置该值则直接绘制到舞台。
         */
        renderTarget: RenderTexture | null;
        /**
         *
         */
        readonly postprocessingRenderTarget: RenderTexture;
        /**
         * @deprecated
         */
        getPosAtXPanelInViewCoordinateByScreenPos(screenPos: Vector2, z: float, out: Vector2): void;
        /**
         * @deprecated
         */
        calcScreenPosFromWorldPos(worldPos: Vector3, outScreenPos: Vector2): void;
        /**
         * @deprecated
         */
        calcWorldPosFromScreenPos(screenPos: Vector3, outWorldPos: Vector3): void;
        /**
         * @deprecated
         */
        createRayByScreen(screenPosX: float, screenPosY: float, ray?: Ray): Ray;
        /**
         * @deprecated
         */
        clearOption_Color: boolean;
        /**
         * @deprecated
         */
        clearOption_Depth: boolean;
    }
}
declare namespace paper {
    /**
     *
     */
    class Collector<TEntity extends IEntity> {
        readonly addedEntities: (TEntity | null)[];
        readonly removedEntities: (TEntity | null)[];
        readonly addedComponentes: (IComponent | null)[];
        readonly removedComponentes: (IComponent | null)[];
        private _group;
        private constructor();
        private _onEntityAdded([group, entity]);
        private _onEntityRemoved([group, entity]);
        private _onComponentEnabled([group, component]);
        private _onComponentDisabled([group, component]);
        clear(): void;
        readonly group: Group<TEntity>;
    }
}
declare namespace egret3d {
    /**
     * 相机渲染上下文。
     */
    class CameraRenderContext {
        /**
         *
         */
        logDepthBufFC: number;
        /**
         * 此帧的非透明绘制信息列表。
         * - 已进行视锥剔除的。
         * TODO
         */
        readonly opaqueCalls: DrawCall[];
        /**
         * 此帧的透明绘制信息列表。
         * - 已进行视锥剔除的。
         * TODO
         */
        readonly transparentCalls: DrawCall[];
        private readonly _drawCallCollecter;
        private readonly _cameraAndLightCollecter;
        private readonly _camera;
        /**
         * 禁止实例化。
         */
        private constructor();
        /**
         * 所有非透明的, 按照从近到远排序
         */
        private _sortOpaque(a, b);
        /**
         * 所有透明的，按照从远到近排序
         */
        private _sortFromFarToNear(a, b);
        private _shadowFrustumCulling();
        private _frustumCulling();
        private _updateLights();
    }
}
declare namespace egret3d {
}
declare namespace egret3d {
    /**
     * 天空盒组件。
     */
    class SkyBox extends paper.BaseComponent {
        /**
         * 是否开启反射 默认:True
         */
        reflections: boolean;
        protected readonly _materials: (Material | null)[];
        uninitialize(): void;
        /**
         * 该组件的材质列表。
         */
        materials: ReadonlyArray<Material | null>;
        /**
         * 该组件材质列表中的第一个材质。
         */
        material: Material | null;
    }
}
declare namespace egret3d.postprocess {
    class FXAAPostprocess extends egret3d.CameraPostprocessing {
        private _renderTexture;
        private _onStageResize();
        initialize(): void;
        uninitialize(): void;
        onRender(camera: egret3d.Camera): void;
    }
}
declare namespace egret3d.postprocess {
    class SSAAPostprocess extends egret3d.CameraPostprocessing {
        sampleLevel: number;
        unbiased: boolean;
        private readonly _subViewport;
        private readonly _copyMaterial;
        private readonly _clearColor;
        private readonly _sampleRenderTarget;
        private readonly _finalSampleRenderTarget;
        private _onStageResize();
        initialize(): void;
        uninitialize(): void;
        onRender(camera: egret3d.Camera): void;
    }
}
declare namespace egret3d {
    /**
     *
     */
    /**
     * 灯光的阴影。
     */
    class LightShadow implements paper.ISerializable {
        /**
         * 该阴影的边缘模糊。
         */
        radius: number;
        /**
         * 该阴影的贴图偏差。
         */
        bias: number;
        /**
         * 产生该阴影的灯光位置到近裁剪面距离。
         */
        near: number;
        /**
         * 产生该阴影的灯光位置到远裁剪面距离。
         */
        far: number;
        /**
         * 该阴影的范围。（仅用于平行光产生的阴影）
         */
        size: number;
        /**
         *
         */
        /**
         *
         */
        private _mapSize;
        private readonly _light;
        private constructor();
        serialize(): number[];
        deserialize(data: ReadonlyArray<number>): this;
        /**
         * 该阴影的贴图尺寸。
         */
        mapSize: uint;
    }
}
declare namespace egret3d {
    /**
     * 几何圆柱（椎）体。
     * - 与 Y 轴对齐。
     */
    class Cylinder extends paper.BaseRelease<Cylinder> implements paper.ICCS<Cylinder>, paper.ISerializable, IRaycast {
        private static readonly _instances;
        /**
         * 创建一个几何圆柱（椎）体。
         * @param center 中心点。
         * @param radius 半径。
         */
        static create(center?: Readonly<IVector3>, topRadius?: float, bottomRadius?: float, height?: float): Cylinder;
        /**
         * 该圆柱（锥）体的顶部半径。
         */
        topRadius: float;
        /**
         * 该圆柱（锥）体的底部半径。
         */
        bottomRadius: float;
        /**
         * 该圆柱（锥）体的高度。
         */
        height: float;
        /**
         * 该圆柱（锥）体的中心点。
         */
        readonly center: Vector3;
        /**
         * 请使用 `egret3d.Cylinder.create()` 创建实例。
         * @see egret3d.Cylinder.create()
         */
        private constructor();
        serialize(): number[];
        deserialize(value: Readonly<[float, float, float, float, float, float]>): this;
        clone(): Cylinder;
        copy(value: Readonly<Cylinder>): this;
        set(center: Readonly<IVector3>, topRadius: float, bottomRadius: float, height: float): this;
        /**
         * 该几何体是否包含指定的点。
         * @param point 一个点。
         */
        contains(point: Readonly<IVector3>): boolean;
        raycast(ray: Readonly<Ray>, raycastInfo?: RaycastInfo | null): boolean;
    }
}
declare namespace egret3d {
    /**
     * 平行光组件。
     */
    class DirectionalLight extends BaseLight {
        initialize(): void;
        private _updateShadow();
    }
}
declare namespace egret3d {
    /**
     * 聚光组件。
     */
    class SpotLight extends BaseLight {
        /**
         * 该灯光组件光照强度线性衰减的速度。
         * - 0 不衰减。
         */
        decay: number;
        /**
         * 该灯光组件光照强度线性衰减的距离。
         * - 0 不衰减。
         */
        distance: number;
        /**
         * 该聚光灯产生的光锥夹角范围。（弧度制）
         */
        angle: number;
        /**
         * 该聚光灯产生的光锥半影。
         */
        penumbra: number;
        initialize(): void;
        private _updateShadow();
    }
}
declare namespace egret3d {
    /**
     * 矩形区域光组件。
     */
    class RectangleAreaLight extends BaseLight {
        /**
         *
         */
        width: number;
        /**
         *
         */
        height: number;
    }
}
declare namespace egret3d {
    /**
     * 点光组件。
     */
    class PointLight extends BaseLight {
        /**
         * 该灯光组件光照强度线性衰减的速度。
         * - 0 不衰减。
         */
        decay: number;
        /**
         * 该灯光组件光照强度线性衰减的距离。
         * - 0 不衰减。
         */
        distance: number;
        initialize(): void;
        private _updateShadow(face);
    }
}
declare namespace egret3d {
    /**
     * 半球光组件。
     */
    class HemisphereLight extends BaseLight {
        /**
         * 该灯光的背景颜色。
         */
        readonly groundColor: Color;
    }
}
declare namespace egret3d {
    /**
     * 绘制信息。
     */
    class DrawCall extends paper.BaseRelease<DrawCall> {
        private static _instances;
        /**
         * 创建一个绘制信息。
         * - 只有在扩展渲染系统时才需要手动创建绘制信息。
         */
        static create(): DrawCall;
        /**
         * 绘制次数。
         * - 用于调试模式下检测重复绘制的情况。
         */
        drawCount: int;
        /**
         *
         */
        entity: paper.IEntity | null;
        /**
         * 此次绘制的渲染组件。
         */
        renderer: paper.BaseRenderer | null;
        /**
         * 此次绘制的世界矩阵。
         */
        matrix: Matrix4;
        /**
         * 此次绘制的子网格索引。
         */
        subMeshIndex: int;
        /**
         * 此次绘制的网格资源。
         */
        mesh: Mesh;
        /**
         * 此次绘制的材质资源。
         */
        material: Material;
        /**
         *
         */
        zdist: float;
        /**
         * TODO
         */
        count?: number;
        private constructor();
        onClear(): void;
    }
}
declare namespace egret3d {
    /**
     * 雾的模式。
     */
    const enum FogMode {
        None = 0,
        Fog = 1,
        FogEXP2 = 2,
    }
    /**
     * 雾。
     */
    class Fog implements paper.ISerializable {
        /**
         * 雾的强度。
         */
        density: float;
        /**
         * 雾的近平面。
         * - 最小值 0.01。
         */
        near: float;
        /**
         * 雾的远平面。
         * - 最小值 0.02。
         */
        far: float;
        /**
         * 雾的颜色。
         */
        readonly color: Color;
        private _mode;
        private readonly _scene;
        private constructor();
        serialize(): number[];
        deserialize(data: Readonly<[float, float, float, float, float, float, float, float]>): this;
        /**
         * 雾的模式。
         */
        mode: FogMode;
    }
}
declare namespace paper {
    /**
     * 场景。
     */
    class Scene extends BaseObject implements IScene {
        /**
         * 当场景被创建时派发事件。
         */
        static readonly onSceneCreated: signals.Signal<[Scene, boolean]>;
        /**
         * 当场景将要被销毁时派发事件。
         */
        static readonly onSceneDestroy: signals.Signal<Scene>;
        /**
         * 当场景被销毁时派发事件。
         */
        static readonly onSceneDestroyed: signals.Signal<Scene>;
        /**
         * 创建一个空场景。
         * @param name 场景的名称。
         */
        static createEmpty(name?: string, isActive?: boolean): Scene;
        /**
         * 通过指定的场景资源创建一个场景。
         * @param name 场景资源的名称。
         */
        static create(name: string, combineStaticObjects?: boolean): Scene | null;
        /**
         * 全局静态的场景。
         * - 全局场景无法被销毁。
         */
        static readonly globalScene: Scene;
        /**
         * 全局静态编辑器的场景。
         */
        static readonly editorScene: Scene;
        /**
         * 当前激活的场景。
         */
        static activeScene: Scene;
        /**
         * 该场景的名称。
         */
        name: string;
        /**
         * 额外数据，仅保存在编辑器环境，项目发布时该数据将被移除。
         */
        extras?: any;
        private _isDestroyed;
        private readonly _entities;
        private readonly _rootEntities;
        private constructor();
        initialize(): void;
        uninitialize(): void;
        destroy(): boolean;
        containsEntity(entity: IEntity): boolean;
        find<TEntity extends IEntity>(name: string): TEntity | null;
        /**
         * 获取该场景指定标识的第一个实体。
         * - 仅返回第一个符合条件的实体。
         * @param tag 标识。
         */
        findWithTag<TEntity extends IEntity>(tag: string): TEntity | null;
        /**
         * 获取该场景指定标识的全部实体。
         * - 返回符合条件的全部实体。
         * @param tag 标识。
         */
        findEntitiesWithTag<TEntity extends IEntity>(tag: string): TEntity[];
        readonly isDestroyed: boolean;
        readonly entityCount: uint;
        readonly entities: ReadonlyArray<IEntity>;
        readonly rootEntities: ReadonlyArray<IEntity>;
        /**
         * 该场景使用光照贴图时的光照强度。
         */
        lightmapIntensity: number;
        /**
         * 该场景的环境光。
         */
        readonly ambientColor: egret3d.Color;
        /**
         * 该场景的雾。
         */
        readonly fog: egret3d.Fog;
        /**
         *
         */
        readonly defines: egret3d.Defines;
        private readonly _lightmaps;
        /**
         * 该场景的光照贴图列表。
         */
        lightmaps: ReadonlyArray<egret3d.BaseTexture | null>;
        /**
         * @deprecated
         */
        findGameObjectsWithTag(tag: string): GameObject[];
        /**
         * @deprecated
         */
        getRootGameObjects(): ReadonlyArray<GameObject>;
        /**
         * @deprecated
         */
        readonly gameObjectCount: uint;
        /**
         * @deprecated
         */
        readonly gameObjects: ReadonlyArray<GameObject>;
    }
}
declare namespace egret3d {
    /**
     * 网格过滤组件。
     * - 为网格渲染组件提供网格资源。
     */
    class MeshFilter extends paper.BaseComponent {
        /**
         * 当网格过滤组件的网格资源改变时派发事件。
         */
        static readonly onMeshChanged: signals.Signal<MeshFilter>;
        private _mesh;
        /**
         * 该组件的网格资源。
         */
        mesh: Mesh | null;
    }
}
declare namespace egret3d {
    /**
     * 几何胶囊体。
     * - 与 Y 轴对齐。
     */
    class Capsule extends paper.BaseRelease<Capsule> implements paper.ICCS<Capsule>, paper.ISerializable, IRaycast {
        private static readonly _instances;
        /**
         * 创建一个几何胶囊体。
         * @param center 中心点。
         * @param radius 半径。
         */
        static create(center?: Readonly<IVector3>, radius?: float, height?: float): Capsule;
        /**
         * 该胶囊体的半径。
         */
        radius: float;
        /**
         * 该胶囊体圆柱部分的高度。
         */
        height: float;
        /**
         * 该胶囊体的中心点。
         */
        readonly center: Vector3;
        /**
         * 请使用 `egret3d.Capsule.create()` 创建实例。
         * @see egret3d.Capsule.create()
         */
        private constructor();
        serialize(): number[];
        deserialize(value: Readonly<[float, float, float, float, float]>): this;
        clone(): Capsule;
        copy(value: Readonly<Capsule>): this;
        set(center: Readonly<IVector3>, radius: float, height: float): this;
        /**
         * 该几何体是否包含指定的点。
         * @param point 一个点。
         */
        contains(point: Readonly<IVector3>): boolean;
        raycast(ray: Readonly<Ray>, raycastInfo?: RaycastInfo | null): boolean;
    }
}
declare namespace egret3d {
    /**
     * 网格渲染组件系统。
     * - 为网格渲染组件生成绘制信息。
     */
    class MeshRendererSystem extends paper.BaseSystem<paper.GameObject> {
        private readonly _drawCallCollecter;
        private readonly _materialFilter;
        private _updateDrawCalls(entity, checkState);
        protected getMatchers(): paper.IAllOfMatcher<paper.GameObject>[];
        protected getListeners(): ({
            type: signals.Signal<MeshFilter>;
            listener: (component: paper.IComponent) => void;
        } | {
            type: signals.Signal<paper.BaseRenderer>;
            listener: (component: paper.IComponent) => void;
        })[];
        onEntityAdded(entity: paper.GameObject): void;
        onEntityRemoved(entity: paper.GameObject): void;
    }
}
declare namespace egret3d {
    /**
     * 蒙皮网格渲染组件。
     */
    class SkinnedMeshRenderer extends MeshRenderer {
        /**
         * 当蒙皮网格渲染组件的网格资源改变时派发事件。
         */
        static readonly onMeshChanged: signals.Signal<SkinnedMeshRenderer>;
        /**
         * 强制使用 cpu 蒙皮。
         * - 骨骼数超过硬件支持的最大骨骼数量，或顶点权重大于 4 个，需要使用 CPU 蒙皮。
         * - CPU 蒙皮性能较低，仅是兼容方案，应合理的控制骨架的最大骨骼数量。
         */
        forceCPUSkin: boolean;
        /**
         *
         */
        boneMatrices: Float32Array | null;
        /**
         *
         */
        boneTexture: Texture | null;
        /**
         *
         */
        source: SkinnedMeshRenderer | null;
        private _skinnedDirty;
        private readonly _bones;
        private _rootBone;
        private _mesh;
        private _skinnedVertices;
        private _skinning(vertexOffset, vertexCount);
        recalculateLocalBox(): void;
        /**
         * 实时获取网格资源的指定三角形顶点位置。
         * - 采用 CPU 蒙皮指定顶点。
         */
        getTriangle(triangleIndex: uint, out?: Triangle): Triangle;
        raycast(ray: Readonly<Ray>, raycastInfo?: RaycastInfo | null): boolean;
        /**
         *
         */
        readonly boneCount: uint;
        /**
         * 该渲染组件的骨骼列表。
         */
        readonly bones: ReadonlyArray<Transform | null>;
        /**
         * 该渲染组件的根骨骼。
         */
        rootBone: Transform | null;
        /**
         * 该渲染组件的网格资源。
         */
        mesh: Mesh | null;
    }
}
declare namespace egret3d {
    /**
     * 蒙皮网格渲染组件系统。
     * - 为蒙皮网格渲染组件生成绘制信息。
     * - 更新蒙皮网格的骨骼矩阵信息。
     */
    class SkinnedMeshRendererSystem extends paper.BaseSystem<paper.GameObject> {
        private readonly _drawCallCollecter;
        private readonly _materialFilter;
        private _updateDrawCalls(entity, checkState);
        protected getMatchers(): paper.IAllOfMatcher<paper.GameObject>[];
        protected getListeners(): {
            type: signals.Signal<paper.BaseRenderer>;
            listener: (component: paper.IComponent) => void;
        }[];
        onEntityAdded(entity: paper.GameObject): void;
        onEntityRemoved(entity: paper.GameObject): void;
        onFrame(): void;
    }
}
declare namespace egret3d {
    /**
     * 可以添加egret2d显示对象（包括EUI）进行渲染。
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    class Egret2DRenderer extends paper.BaseRenderer {
        /**
         * TODO
         */
        frustumCulled: boolean;
        stage: egret.Stage;
        private _renderer;
        private _screenAdapter;
        screenAdapter: IScreenAdapter;
        root: egret.DisplayObjectContainer;
        initialize(): void;
        uninitialize(): void;
        recalculateLocalBox(): void;
        raycast(p1: Readonly<Ray>, p2?: RaycastInfo | null): boolean;
        /**
         * screen position to ui position
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 从屏幕坐标转换到当前2D系统的坐标
         * @version paper 1.0
         * @platform Web
         * @language
         */
        screenPosToUIPos(pos: Vector2, out?: Vector2): Vector2;
        private _stageWidth;
        private _stageHeight;
        private _scaler;
        /**
         * 从屏幕坐标到当前2D系统的坐标的缩放系数
         */
        readonly scaler: number;
        /**
         *
         */
        update(deltaTime: number, w: number, h: number): void;
    }
}
declare namespace egret3d {
    /**
     * Egret 传统 2D 渲染系统。
     */
    class Egret2DRendererSystem extends paper.BaseSystem<paper.GameObject> {
        /**
         * @deprecated
         */
        static canvas: HTMLCanvasElement | null;
        /**
         * @deprecated
         */
        static webgl: WebGLRenderingContext | null;
        private _entitiesDirty;
        private readonly _sortedEntities;
        private _onSortEntities(a, b);
        private _sortEntities();
        private _onTouchStart(pointer, signal);
        private _onTouchMove(pointer, signal);
        private _onTouchEnd(pointer, signal);
        protected getMatchers(): paper.IAllOfMatcher<paper.GameObject>[];
        onAwake(): void;
        onEnable(): void;
        onDisable(): void;
        onEntityAdded(entity: paper.GameObject): void;
        onEntityRemoved(entity: paper.GameObject): void;
        onFrame(deltaTime: number): void;
    }
}
declare module egret.web {
}
declare namespace egret3d {
    /**
     * IScreenAdapter
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 屏幕适配策略接口，实现此接口可以自定义适配策略
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    interface IScreenAdapter {
        $dirty: boolean;
        calculateScaler(canvasWidth: number, canvasHeight: number, out: {
            w: number;
            h: number;
            s: number;
        }): void;
    }
    /**
     * ConstantAdapter
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 恒定像素的适配策略
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    class ConstantAdapter implements IScreenAdapter {
        $dirty: boolean;
        private _scaleFactor;
        /**
         * scaleFactor
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 设置缩放值
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        scaleFactor: number;
        calculateScaler(canvasWidth: number, canvasHeight: number, out: {
            w: number;
            h: number;
            s: number;
        }): void;
    }
    /**
     * ConstantAdapter
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 拉伸扩展的适配策略
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    class ExpandAdapter implements IScreenAdapter {
        $dirty: boolean;
        private _resolution;
        /**
         * setResolution
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 设置分辨率
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        setResolution(width: number, height: number): void;
        calculateScaler(canvasWidth: number, canvasHeight: number, out: {
            w: number;
            h: number;
            s: number;
        }): void;
    }
    /**
     * ShrinkAdapter
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 缩放的适配策略
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    class ShrinkAdapter implements IScreenAdapter {
        $dirty: boolean;
        private _resolution;
        /**
         * setResolution
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 设置分辨率
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        setResolution(width: number, height: number): void;
        calculateScaler(canvasWidth: number, canvasHeight: number, out: {
            w: number;
            h: number;
            s: number;
        }): void;
    }
    /**
     * MatchWidthOrHeightAdapter
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 适应宽高适配策略
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    class MatchWidthOrHeightAdapter implements IScreenAdapter {
        $dirty: boolean;
        private _resolution;
        /**
         * setResolution
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 设置分辨率
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        setResolution(width: number, height: number): void;
        private _matchFactor;
        /**
         * matchFactor
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 设置匹配系数，0-1之间，越小越倾向以宽度适配，越大越倾向以高度适配。
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        matchFactor: number;
        calculateScaler(canvasWidth: number, canvasHeight: number, out: {
            w: number;
            h: number;
            s: number;
        }): void;
    }
}
declare namespace egret3d {
    /**
     * 动画组件。
     */
    class Animation extends paper.BaseComponent {
        /**
         * @private
         */
        autoPlay: boolean;
        /**
         * 是否将动画数据中根节点的变换动画应用到该组件实体的变换组件上。
         */
        applyRootMotion: boolean;
        /**
         * 动画速度。
         */
        timeScale: number;
        private readonly _animations;
        private _animationController;
        private _lastAnimationLayer;
        uninitialize(): void;
        /**
         * 融合播放一个指定的动画。
         * @param animationClipName 动画剪辑的名称。
         * @param fadeTime 融合的时间。
         * @param playTimes 播放次数。（-1：采用动画数据配置，0：循环播放，N：循环播放 N 次）
         * @param layerIndex 动画层索引。
         * @param layerAdditive 动画层混合方式是否为叠加。
         */
        fadeIn(animationClipName: string, fadeTime: number, playTimes?: int, layerIndex?: uint, layerAdditive?: boolean): AnimationState | null;
        /**
         * 播放一个指定的动画。
         * @param animationClipNameOrNames
         * @param playTimes 播放次数。（-1：采用动画数据配置，0：循环播放，N：循环播放 N 次）
         */
        play(animationClipNameOrNames?: string | (string[]) | null, playTimes?: int): AnimationState | null;
        /**
         *
         */
        stop(animationName?: string | null, layerIndex?: uint): void;
        /**
         *
         */
        getState(animationName: string, layerIndex?: uint): AnimationBaseState | null;
        /**
         *
         */
        hasAnimation(animationClipName: string): boolean;
        /**
         *
         */
        readonly lastAnimationnName: string;
        /**
         * 动画数据列表。
         */
        animations: ReadonlyArray<AnimationAsset | null>;
        /**
         *
         */
        readonly animationController: AnimationController | null;
        /**
         *
         */
        readonly lastAnimationState: AnimationState | null;
    }
}
declare namespace egret3d {
    /**
     * @private
     */
    class AnimationFadeState extends paper.BaseRelease<AnimationFadeState> {
        private static readonly _instances;
        static create(): AnimationFadeState;
        /**
         * -1: Fade in, 0: Fade complete, 1: Fade out;
         */
        fadeState: -1 | 0 | 1;
        /**
         * -1: Fade start, 0: Fading, 1: Fade complete;
         */
        subFadeState: -1 | 0 | 1;
        progress: number;
        time: number;
        totalTime: number;
        readonly states: AnimationBaseState[];
        private constructor();
        onClear(): void;
        fadeOut(totalTime: number): this;
    }
    /**
     *
     */
    abstract class AnimationBaseState extends paper.BaseRelease<AnimationBaseState> {
        /**
         *
         */
        weight: number;
        /**
         * @private
         */
        animationLayer: AnimationLayer;
        /**
         * @private
         */
        animationNode: AnimationBaseNode | null;
        protected constructor();
        onClear(): void;
        /**
         *
         */
        readonly abstract name: string;
    }
    /**
     *
     */
    class AnimationTreeState extends AnimationBaseState {
        private static readonly _instances;
        /**
         *
         */
        readonly name: string;
    }
    /**
     * 动画状态。
     */
    class AnimationState extends AnimationBaseState {
        private static readonly _instances;
        /**
         * 动画总播放次数。
         */
        playTimes: uint;
        /**
         * 动画当前播放次数。
         */
        currentPlayTimes: uint;
        /**
         * @private
         */
        readonly channels: AnimationChannel[];
        /**
         * 播放的动画数据。
         */
        animationAsset: AnimationAsset;
        /**
         * @private
         */
        animation: GLTFAnimation;
        /**
         * 播放的动画剪辑。
         */
        animationClip: GLTFAnimationClip;
        private _lastRootMotionRotation;
        private _lastRootMotionPosition;
        private _animation;
        onClear(): void;
        /**
         * 继续该动画状态的播放。
         */
        play(): this;
        /**
         * 停止该动画状态的播放。
         */
        stop(): this;
        /**
         * 该动画状态是否正在播放。
         */
        readonly isPlaying: boolean;
        /**
         * 该动画状态是否播放完毕。
         */
        readonly isCompleted: boolean;
        /**
         * 该动画状态的播放速度。
         */
        timeScale: number;
        /**
         * 该动画状态的总播放时间。
         */
        readonly totalTime: number;
        /**
         * 该动画状态的当前播放时间。
         */
        readonly currentTime: number;
        /**
         *
         */
        readonly name: string;
    }
}
declare namespace egret3d {
    /**
     * @private
     */
    class AnimationBinder extends paper.BaseRelease<AnimationBinder> {
        private static _instances;
        static create(): AnimationBinder;
        dirty: uint;
        weight: number;
        totalWeight: number;
        target: paper.BaseComponent | any;
        bindPose: any;
        layer: AnimationLayer | null;
        quaternions: Quaternion[] | null;
        quaternionWeights: number[] | null;
        updateTarget: () => void;
        private constructor();
        onClear(): void;
        clear(): void;
        updateBlend(animationlayer: AnimationLayer, animationState: AnimationState): boolean;
        onUpdateTranslation(): void;
        onUpdateRotation(): void;
        onUpdateScale(): void;
    }
}
declare namespace egret3d {
    /**
     * @private
     */
    class AnimationChannel extends paper.BaseRelease<AnimationChannel> {
        private static _instances;
        static create(): AnimationChannel;
        enabled: boolean;
        glTFChannel: GLTFAnimationChannel;
        glTFSampler: gltf.AnimationSampler;
        inputBuffer: Float32Array;
        outputBuffer: ArrayBufferView & ArrayLike<number>;
        binder: paper.BaseComponent | AnimationBinder | any;
        updateTarget: ((animationlayer: AnimationLayer, animationState: AnimationState) => void) | null;
        needUpdate: ((dirty: int) => void) | null;
        private constructor();
        onClear(): void;
        onUpdateTranslation(animationlayer: AnimationLayer, animationState: AnimationState): void;
        onUpdateRotation(animationlayer: AnimationLayer, animationState: AnimationState): void;
        onUpdateScale(animationlayer: AnimationLayer, animationState: AnimationState): void;
        onUpdateActive(animationlayer: AnimationLayer, animationState: AnimationState): void;
        onUpdateFloat(animationlayer: AnimationLayer, animationState: AnimationState): void;
        getFrameIndex(currentTime: number): uint;
    }
}
declare namespace egret3d {
    /**
     * 动画事件类型。
     */
    const enum AnimationEventType {
        Start = 0,
        LoopComplete = 1,
        Complete = 2,
        KeyFrame = 3,
        Sound = 4,
    }
    /**
     * 动画事件。
     */
    class AnimationEvent extends paper.BaseRelease<AnimationEvent> {
        private static _instances;
        static create(type: AnimationEventType, animationState: AnimationState, keyFrameEvent?: GLTFAnimationFrameEvent | null): AnimationEvent;
        type: AnimationEventType;
        animationState: AnimationState;
        frameEvent: GLTFAnimationFrameEvent | null;
        private constructor();
    }
}
declare namespace egret3d {
    /**
     * 动画系统。
     */
    class AnimationSystem extends paper.BaseSystem<paper.GameObject> {
        private _animation;
        private _updateAnimationFadeState(animationFadeState, deltaTime);
        private _updateAnimationTreeState(animationFadeState, animationTreeState);
        private _updateAnimationState(animationFadeState, animationState, deltaTime, forceUpdate);
        protected getMatchers(): paper.IAllOfMatcher<paper.GameObject>[];
        onEntityAdded(entity: paper.GameObject): void;
        onFrame(deltaTime: number): void;
    }
}
declare namespace egret3d.particle {
}
declare namespace egret3d.particle {
    const onMainChanged: signals.Signal;
    const onColorChanged: signals.Signal;
    const onVelocityChanged: signals.Signal;
    const onSizeChanged: signals.Signal;
    const onRotationChanged: signals.Signal;
    const onTextureSheetChanged: signals.Signal;
    const onShapeChanged: signals.Signal;
    const onStartSize3DChanged: signals.Signal;
    const onStartRotation3DChanged: signals.Signal;
    const onSimulationSpaceChanged: signals.Signal;
    const onScaleModeChanged: signals.Signal;
    const onMaxParticlesChanged: signals.Signal;
    /**
     *
     */
    const enum CurveMode {
        Constant = 0,
        Curve = 1,
        TwoCurves = 2,
        TwoConstants = 3,
    }
    /**
     *
     */
    const enum ColorGradientMode {
        Color = 0,
        Gradient = 1,
        TwoColors = 2,
        TwoGradients = 3,
        RandomColor = 4,
    }
    /**
     *
     */
    const enum SimulationSpace {
        Local = 0,
        World = 1,
        Custom = 2,
    }
    /**
     *
     */
    const enum ScalingMode {
        Hierarchy = 0,
        Local = 1,
        Shape = 2,
    }
    /**
     *
     */
    const enum ShapeType {
        None = -1,
        Sphere = 0,
        SphereShell = 1,
        Hemisphere = 2,
        HemisphereShell = 3,
        Cone = 4,
        Box = 5,
        Mesh = 6,
        ConeShell = 7,
        ConeVolume = 8,
        ConeVolumeShell = 9,
        Circle = 10,
        CircleEdge = 11,
        SingleSidedEdge = 12,
        MeshRenderer = 13,
        SkinnedMeshRenderer = 14,
        BoxShell = 15,
        BoxEdge = 16,
    }
    /**
     *
     */
    const enum ShapeMultiModeValue {
        Random = 0,
        Loop = 1,
        PingPong = 2,
        BurstSpread = 3,
    }
    /**
     *
     */
    const enum AnimationType {
        WholeSheet = 0,
        SingleRow = 1,
    }
    /**
     *
     */
    const enum UVChannelFlags {
        UV0 = 1,
        UV1 = 2,
        UV2 = 4,
        UV3 = 8,
    }
    /**
     *
     */
    const enum GradientMode {
        Blend = 0,
        Fixed = 1,
    }
    /**
     * TODO
     */
    class Keyframe implements paper.ISerializable {
        time: number;
        value: number;
        serialize(): number[];
        deserialize(element: Readonly<[number, number]>): this;
        copy(source: Readonly<Keyframe>): void;
    }
    /**
     * TODO
     */
    class AnimationCurve implements paper.ISerializable {
        /**
         * 功能与效率平衡长度取4
         */
        private readonly _keys;
        private readonly _floatValues;
        serialize(): number[][];
        deserialize(element: any): this;
        evaluate(t?: number): number;
        readonly floatValues: Readonly<Float32Array>;
        copy(source: AnimationCurve): void;
    }
    /**
     * TODO
     */
    class Burst implements paper.ISerializable {
        time: number;
        minCount: number;
        maxCount: number;
        cycleCount: number;
        repeatInterval: number;
        serialize(): number[];
        deserialize(element: Readonly<[number, number, number, number, number]>): this;
    }
    /**
     * TODO
     */
    class GradientColorKey implements paper.ISerializable {
        time: number;
        readonly color: Color;
        serialize(): {
            time: number;
            color: number[];
        };
        deserialize(element: any): this;
    }
    /**
     * TODO
     */
    class GradientAlphaKey implements paper.ISerializable {
        time: number;
        alpha: number;
        serialize(): {
            time: number;
            alpha: number;
        };
        deserialize(element: any): this;
    }
    /**
     * TODO
     */
    class Gradient implements paper.ISerializable {
        mode: GradientMode;
        private readonly alphaKeys;
        private readonly colorKeys;
        private readonly _alphaValue;
        private readonly _colorValue;
        serialize(): {
            mode: GradientMode;
            alphaKeys: {
                time: number;
                alpha: number;
            }[];
            colorKeys: {
                time: number;
                color: number[];
            }[];
        };
        deserialize(element: any): this;
        evaluate(t: number | undefined, out: Color): Color;
        readonly alphaValues: Readonly<Float32Array>;
        readonly colorValues: Readonly<Float32Array>;
    }
    /**
     * TODO create
     */
    class MinMaxCurve implements paper.ISerializable {
        mode: CurveMode;
        constant: number;
        constantMin: number;
        constantMax: number;
        readonly curve: AnimationCurve;
        readonly curveMin: AnimationCurve;
        readonly curveMax: AnimationCurve;
        serialize(): {
            mode: CurveMode;
            constant: number;
            constantMin: number;
            constantMax: number;
            curve: number[][];
            curveMin: number[][];
            curveMax: number[][];
        };
        deserialize(element: any): this;
        evaluate(t?: number): number;
        copy(source: Readonly<MinMaxCurve>): void;
    }
    /**
     * TODO create
     */
    class MinMaxGradient implements paper.ISerializable {
        mode: ColorGradientMode;
        readonly color: Color;
        readonly colorMin: Color;
        readonly colorMax: Color;
        readonly gradient: Gradient;
        readonly gradientMin: Gradient;
        readonly gradientMax: Gradient;
        serialize(): {
            mode: ColorGradientMode;
            color: number[];
            colorMin: number[];
            colorMax: number[];
            gradient: {
                mode: GradientMode;
                alphaKeys: {
                    time: number;
                    alpha: number;
                }[];
                colorKeys: {
                    time: number;
                    color: number[];
                }[];
            };
            gradientMin: {
                mode: GradientMode;
                alphaKeys: {
                    time: number;
                    alpha: number;
                }[];
                colorKeys: {
                    time: number;
                    color: number[];
                }[];
            };
            gradientMax: {
                mode: GradientMode;
                alphaKeys: {
                    time: number;
                    alpha: number;
                }[];
                colorKeys: {
                    time: number;
                    color: number[];
                }[];
            };
        };
        deserialize(element: any): this;
        evaluate(t: number | undefined, out: Color): Color;
    }
    /**
     * 粒子模块基类。
     */
    abstract class ParticleModule extends paper.BaseObject {
        enable: boolean;
        protected readonly _component: ParticleComponent;
        constructor(component: ParticleComponent);
        deserialize(_element: any): this;
    }
    /**
     *
     */
    class MainModule extends ParticleModule {
        /**
         *
         */
        loop: boolean;
        /**
         *
         */
        playOnAwake: boolean;
        /**
         *
         */
        duration: number;
        /**
         *
         */
        readonly startDelay: MinMaxCurve;
        /**
         *
         */
        readonly startLifetime: MinMaxCurve;
        /**
         *
         */
        readonly startSpeed: MinMaxCurve;
        /**
         *
         */
        readonly startSizeX: MinMaxCurve;
        /**
         *
         */
        readonly startSizeY: MinMaxCurve;
        /**
         *
         */
        readonly startSizeZ: MinMaxCurve;
        /**
         *
         */
        readonly startRotationX: MinMaxCurve;
        /**
         *
         */
        readonly startRotationY: MinMaxCurve;
        /**
         *
         */
        readonly startRotationZ: MinMaxCurve;
        /**
         *
         */
        readonly startColor: MinMaxGradient;
        /**
         *
         */
        readonly gravityModifier: MinMaxCurve;
        private _startSize3D;
        private _startRotation3D;
        private _simulationSpace;
        private _scaleMode;
        private _maxParticles;
        deserialize(element: any): this;
        startSize3D: boolean;
        /**
         *
         */
        startRotation3D: boolean;
        /**
         *
         */
        simulationSpace: SimulationSpace;
        /**
         *
         */
        scaleMode: ScalingMode;
        /**
         *
         */
        maxParticles: number;
    }
    /**
     *
     */
    class EmissionModule extends ParticleModule {
        /**
         *
         */
        readonly rateOverTime: MinMaxCurve;
        /**
         *
         */
        readonly bursts: Burst[];
        deserialize(element: any): this;
    }
    /**
     *
     */
    class ShapeModule extends ParticleModule {
        /**
         *
         */
        shapeType: ShapeType;
        /**
         *
         */
        radius: number;
        /**
         *
         */
        angle: number;
        /**
         *
         */
        length: number;
        /**
         *
         */
        readonly arcSpeed: MinMaxCurve;
        /**
         *
         */
        arcMode: ShapeMultiModeValue;
        arc: number;
        /**
         *
         */
        radiusSpread: number;
        /**
         *
         */
        radiusMode: ShapeMultiModeValue;
        /**
         *
         */
        readonly box: Vector3;
        /**
         *
         */
        randomDirection: boolean;
        /**
         *
         */
        spherizeDirection: boolean;
        deserialize(element: any): this;
    }
    /**
     *
     */
    class VelocityOverLifetimeModule extends ParticleModule {
        private _mode;
        private _space;
        private readonly _x;
        private readonly _y;
        private readonly _z;
        deserialize(element: any): this;
        /**
         *
         */
        mode: CurveMode;
        /**
         *
         */
        space: SimulationSpace;
        /**
         *
         */
        x: Readonly<MinMaxCurve>;
        /**
         *
         */
        y: Readonly<MinMaxCurve>;
        /**
         *
         */
        z: Readonly<MinMaxCurve>;
    }
    /**
     *
     */
    class ColorOverLifetimeModule extends ParticleModule {
        private _color;
        deserialize(element: any): this;
        /**
         *
         */
        color: Readonly<MinMaxGradient>;
    }
    /**
     *
     */
    class SizeOverLifetimeModule extends ParticleModule {
        private _separateAxes;
        private readonly _size;
        private readonly _x;
        private readonly _y;
        private readonly _z;
        deserialize(element: any): this;
        /**
         *
         */
        separateAxes: boolean;
        /**
         *
         */
        size: Readonly<MinMaxCurve>;
        /**
         *
         */
        x: Readonly<MinMaxCurve>;
        /**
         *
         */
        y: Readonly<MinMaxCurve>;
        /**
         *
         */
        z: Readonly<MinMaxCurve>;
    }
    /**
     *
     */
    class RotationOverLifetimeModule extends ParticleModule {
        private _separateAxes;
        private readonly _x;
        private readonly _y;
        private readonly _z;
        deserialize(element: any): this;
        /**
         *
         */
        separateAxes: boolean;
        /**
         *
         */
        x: Readonly<MinMaxCurve>;
        /**
         *
         */
        y: Readonly<MinMaxCurve>;
        /**
         *
         */
        z: Readonly<MinMaxCurve>;
    }
    /**
     *
     */
    class TextureSheetAnimationModule extends ParticleModule {
        private _useRandomRow;
        private _animation;
        private _numTilesX;
        private _numTilesY;
        private _cycleCount;
        private _rowIndex;
        private readonly _frameOverTime;
        private readonly _startFrame;
        private readonly _floatValues;
        deserialize(element: any): this;
        /**
         *
         */
        numTilesX: number;
        /**
         *
         */
        numTilesY: number;
        /**
         *
         */
        animation: AnimationType;
        /**
         *
         */
        useRandomRow: boolean;
        /**
         *
         */
        frameOverTime: Readonly<MinMaxCurve>;
        /**
         *
         */
        startFrame: Readonly<MinMaxCurve>;
        /**
         *
         */
        cycleCount: number;
        /**
         *
         */
        rowIndex: number;
        readonly floatValues: Readonly<Float32Array>;
    }
}
declare namespace egret3d.particle {
}
declare namespace egret3d.particle {
    /**
     * 粒子组件。
     */
    class ParticleComponent extends paper.BaseComponent {
        /**
         * 主模块。
         */
        readonly main: MainModule;
        /**
         * 发射模块。
         */
        readonly emission: EmissionModule;
        /**
         * 发射形状模块。
         */
        readonly shape: ShapeModule;
        /**
         * 速率变换模块。
         */
        readonly velocityOverLifetime: VelocityOverLifetimeModule;
        /**
         * 旋转变换模块。
         */
        readonly rotationOverLifetime: RotationOverLifetimeModule;
        /**
         * 尺寸变化模块。
         */
        readonly sizeOverLifetime: SizeOverLifetimeModule;
        /**
         * 颜色变化模块。
         */
        readonly colorOverLifetime: ColorOverLifetimeModule;
        /**
         * 序列帧变化模块。
         */
        readonly textureSheetAnimation: TextureSheetAnimationModule;
        private _timeScale;
        private readonly _batcher;
        private _clean(cleanPlayState?);
        initialize(): void;
        uninitialize(): void;
        play(withChildren?: boolean): void;
        pause(withChildren?: boolean): void;
        stop(withChildren?: boolean): void;
        clear(withChildren?: boolean): void;
        /**
         * 播放速度    不能小于0
         */
        timeScale: number;
        readonly isPlaying: boolean;
        readonly isPaused: boolean;
        readonly isAlive: boolean;
        readonly loop: boolean;
    }
}
declare namespace egret3d.particle {
    /**
     * 粒子渲染模式。
     */
    const enum ParticleRenderMode {
        Billboard = 0,
        Stretch = 1,
        HorizontalBillboard = 2,
        VerticalBillboard = 3,
        Mesh = 4,
        None = 5,
    }
    /**
     * 粒子渲染器。
     */
    class ParticleRenderer extends paper.BaseRenderer {
        /**
         * 渲染模式改变
         */
        static readonly onRenderModeChanged: signals.Signal;
        /**
         * TODO
         */
        static readonly onVelocityScaleChanged: signals.Signal;
        /**
         * TODO
         */
        static readonly onLengthScaleChanged: signals.Signal;
        /**
         *
         */
        static readonly onMeshChanged: signals.Signal;
        /**
         * TODO
         */
        frustumCulled: boolean;
        velocityScale: number;
        lengthScale: number;
        private _renderMode;
        private _mesh;
        uninitialize(): void;
        recalculateLocalBox(): void;
        raycast(ray: Readonly<Ray>, raycastInfo?: RaycastInfo | null): boolean;
        /**
         *
         */
        renderMode: ParticleRenderMode;
        /**
         *
         */
        mesh: Mesh | null;
    }
}
declare namespace egret3d.particle {
    /**
     *
     */
    class ParticleSystem extends paper.BaseSystem<paper.GameObject> {
        readonly interests: ({
            componentClass: typeof ParticleComponent;
            listeners: {
                type: signals.Signal<any>;
                listener: (comp: paper.BaseComponent) => void;
            }[];
        } | {
            componentClass: typeof ParticleRenderer;
            listeners: {
                type: signals.Signal<any>;
                listener: (comp: paper.BaseComponent) => void;
            }[];
        })[];
        private readonly _drawCallCollecter;
        /**
        * Buffer改变的时候，有可能是初始化，也有可能是mesh改变，此时全部刷一下
        */
        private _onUpdateBatchMesh(comp, cleanPlayState?);
        private _onRenderUpdate(render, type);
        /**
         *
         * @param render 渲染模式改变
         */
        private _onRenderMode(render);
        private _onMainUpdate(component, type);
        /**
         * 更新速率模块
         * @param component
         */
        private _onShapeChanged(comp);
        /**
         * 更新速率模块
         * @param component
         */
        private _onVelocityOverLifetime(comp);
        /**
         * 更新颜色模块
         * @param component
         */
        private _onColorOverLifetime(comp);
        /**
         * 更新大小模块
         * @param component
         */
        private _onSizeOverLifetime(comp);
        /**
         * 更新旋转模块
         * @param comp
         */
        private _onRotationOverLifetime(comp);
        private _onTextureSheetAnimation(comp);
        private _updateDrawCalls(gameObject, cleanPlayState?);
        onEntityAdded(entity: paper.GameObject): void;
        onEntityRemoved(entity: paper.GameObject): void;
        onFrame(deltaTime: number): void;
    }
}
declare namespace egret3d {
    const MAX_VERTEX_COUNT_PER_BUFFER: number;
    /**
     * 尝试对场景内所有静态对象合并
     */
    function combineScene(scene: paper.Scene): void;
    /**
     * 尝试合并静态对象列表。
     * @param instances
     * @param root
     */
    function combine(instances: ReadonlyArray<paper.GameObject>): void;
    /**
     * 尝试对场景内所有静态对象合并
     * @deprecated
     */
    function autoCombine(scene: paper.Scene): void;
}
declare namespace egret3d.creater {
    /**
     * 根据提供的参数，快速创建一个带有网格渲染组件的实体。
     */
    function createGameObject(name?: string, {tag, scene, mesh, material, materials, castShadows, receiveShadows}?: {
        tag?: paper.DefaultTags | string;
        scene?: paper.Scene | null;
        mesh?: Mesh | null;
        material?: Material | null;
        materials?: ReadonlyArray<Material> | null;
        castShadows?: boolean;
        receiveShadows?: boolean;
    }): paper.GameObject;
}
declare namespace egret3d {
    /**
     *
     * 贝塞尔曲线，目前定义了三种：线性贝塞尔曲线(两个点形成),二次方贝塞尔曲线（三个点形成），三次方贝塞尔曲线（四个点形成）
     */
    class Curve3 {
        /**
        * 贝塞尔曲线上的点，不包含第一个点
        */
        beizerPoints: egret3d.Vector3[];
        /**
        * 贝塞尔曲线上所有的个数
        */
        bezierPointNum: number;
        /**
         * 线性贝塞尔曲线
         */
        static createLinearBezier(start: egret3d.Vector3, end: egret3d.Vector3, indices: number): Curve3;
        /**
         * 二次方贝塞尔曲线路径
         * @param v0 起始点
         * @param v1 选中的节点
         * @param v2 结尾点
         * @param bezierPointNum 将贝塞尔曲线拆分bezierPointNum段，一共有bezierPointNum + 1个点
         * @returns 贝塞尔曲线对象
         */
        static createQuadraticBezier(v0: egret3d.Vector3, v1: egret3d.Vector3, v2: egret3d.Vector3, bezierPointNum: number): Curve3;
        /**
         * 三次方贝塞尔曲线路径
         * @param v0 起始点
         * @param v1 第一个插值点
         * @param v2 第二个插值点
         * @param v3 终点
         * @param bezierPointNum 将贝塞尔曲线拆分bezierPointNum段，一共有bezierPointNum + 1个点
         * @returns 贝塞尔曲线对象
         */
        static createCubicBezier(v0: egret3d.Vector3, v1: egret3d.Vector3, v2: egret3d.Vector3, v3: egret3d.Vector3, bezierPointNum: number): Curve3;
    }
}
declare namespace egret3d {
    /**
     * 射线。
     */
    class Ray extends paper.BaseRelease<Ray> implements paper.ICCS<Ray>, paper.ISerializable {
        private static readonly _instances;
        /**
         * 创建一个射线。
         * @param origin 射线的起点。
         * @param direction 射线的方向。
         */
        static create(origin?: Readonly<IVector3>, direction?: Readonly<IVector3>): Ray;
        /**
         * 射线的起点。
         */
        readonly origin: Vector3;
        /**
         * 射线的方向。
         */
        readonly direction: Vector3;
        /**
         * 请使用 `egret3d.Ray.create()` 创建实例。
         * @see egret3d.Ray.create()
         */
        private constructor();
        serialize(): number[];
        deserialize(value: Readonly<[number, number, number, number, number, number]>): this;
        copy(value: Readonly<Ray>): this;
        clone(): Ray;
        set(origin: Readonly<IVector3>, direction: Readonly<IVector3>): this;
        fromArray(value: ArrayLike<number>, offset?: number): this;
        /**
         * 设置该射线，使其从起点出发，经过终点。
         * @param from 起点。
         * @param to 终点。
         */
        fromPoints(from: Readonly<IVector3>, to: Readonly<IVector3>): this;
        /**
         * 将该射线乘以一个矩阵。
         * - v *= matrix
         * @param matrix 一个矩阵。
         */
        applyMatrix(matrix: Readonly<Matrix4>): this;
        /**
         * 将输入射线与一个矩阵相乘的结果写入该射线。
         * - v = input * matrix
         * @param matrix 一个矩阵。
         * @param input 输入射线。
         */
        applyMatrix(matrix: Readonly<Matrix4>, input: Readonly<Ray>): this;
        /**
         * 获取一个点到该射线的最近点。
         * @param point 一个点。
         * @param out 最近点。
         */
        getClosestPointToPoint(point: Readonly<IVector3>, out?: Vector3): Vector3;
        /**
         * 获取从该射线的起点沿着射线方向移动一段距离的一个点。
         * - out = ray.origin + ray.direction * distanceDelta
         * @param distanceDelta 移动距离。
         * @param out 一个点。
         */
        getPointAt(distanceDelta: number, out?: Vector3): Vector3;
        /**
         * 获取一个点到该射线的最近距离的平方。
         * @param point 一个点。
         */
        getSquaredDistance(point: Readonly<IVector3>): number;
        /**
         * 获取一个点到该射线的最近距离。
         * @param point 一个点。
         */
        getDistance(point: Readonly<IVector3>): number;
        /**
         * 获取该射线起点到一个平面的最近距离。
         * - 如果射线并不与平面相交，则返回 -1。
         * @param plane 一个平面。
         */
        getDistanceToPlane(plane: Readonly<Plane>): number;
    }
}
declare namespace paper {
    /**
     * 应用程序。
     *
     * ### 自动刷新和被动刷新
     *
     * 默认情况下
     *
     * - 自动刷新: 会以无限循环方式刷新, `PlayerMode.Player` 模式默认为自动刷新
     * - 被动刷新: 不会启动循环, 需要刷新时需调用 `update()` 方法, `PlayerMode.Editor` 模式为被动刷新
     *
     * 在运行过程中可随时调用 `resume()` 切换到自动刷新, 或者调用 `pause()` 切换为被动刷新
     *
     * ### 限制帧频
     *
     * - 通过设置 `clock.frameInterval` 来设置渲染帧间隔(秒)
     * - 通过设置 `clock.tickInterval` 来设置逻辑帧间隔(秒)
     * - 在帧补偿的时候, 为了尽快达到同步, `clock.update()` 会在同步之前忽略此间隔, 也就是说在这种情况下, 帧率会增加, 只有逻辑帧会补偿
     */
    class ECS {
        private static _instance;
        /**
         * 应用程序单例。
         */
        static getInstance(): ECS;
        private constructor();
        /**
         * 当应用程序的播放模式改变时派发事件。
         */
        readonly onPlayerModeChanged: signals.Signal<PlayerMode>;
        /**
         * 引擎版本。
         */
        readonly version: string;
        /**
         * 程序启动项。
         */
        readonly options: RunOptions;
        /**
         * 系统管理器。
         */
        readonly systemManager: SystemManager;
        /**
         * 场景管理器。
         */
        readonly sceneManager: SceneManager;
        /**
         * 游戏实体上下文。
         */
        readonly gameObjectContext: Context<GameObject>;
        private _isFocused;
        private _isRunning;
        private _playerMode;
        /**
         * core updating loop
         */
        private _loop(timestamp);
        /**
         * including calculating, status updating, rerendering and logical updating
         */
        private _update({tickCount, frameCount}?);
        /**
         * 初始化程序。
         */
        initialize(options: RunOptions): void;
        /**
         * engine start
         *
         * TODO:
         */
        start(): void;
        /**
         * TODO
         */
        pause(): void;
        /**
         * TODO
         */
        resume(): void;
        /**
         * 显式更新
         *
         * - 在暂停的情况下才有意义 (`this.isRunning === false`), 因为在运行的情况下下一帧自动会刷新
         * - 主要应用在类似编辑器模式下, 大多数情况只有数据更新的时候界面才需要刷新
         */
        update(): void;
        /**
         *
         */
        readonly isMobile: boolean;
        /**
         * 程序的运行模式。
         */
        playerMode: PlayerMode;
    }
    /**
     * 应用程序单例。
     */
    const Application: ECS;
}
declare namespace egret3d {
    /**
     * @private
     */
    const enum DefineLocation {
        None = 0,
        All = 3,
        Vertex = 1,
        Fragment = 2,
    }
    /**
     * @private
     */
    class Define {
        /**
         * 掩码索引。
         */
        readonly index: uint;
        /**
         * 掩码。
         */
        readonly mask: uint;
        /**
         * 名称。
         */
        readonly name: string;
        /**
         * 内容。
         */
        readonly context?: number | string;
        /**
         *
         */
        isCode?: boolean;
        /**
         *
         */
        order?: uint;
        /**
         *
         */
        type?: DefineLocation;
        constructor(index: uint, mask: uint, name: string, context?: number | string);
    }
    /**
     * @private
     */
    class Defines {
        static link(definess: (Defines | null)[], location: DefineLocation): string;
        private static _sortDefine(a, b);
        definesMask: string;
        private readonly _defines;
        private readonly _defineLinks;
        private _update();
        /**
         *
         */
        clear(): void;
        /**
         *
         */
        copy(value: this): void;
        /**
         *
         */
        addDefine(name: string, context?: number | string, order?: number): Define | null;
        removeDefine(name: string, needUpdate?: boolean): Define | null;
    }
}
declare namespace egret3d {
    /**
     *
     */
    const enum MaterialDirty {
        All = 1,
        None = 0,
        UVTransform = 1,
    }
    /**
     * 材质资源。
     */
    class Material extends GLTFAsset {
        /**
         * 创建一个材质。
         * @param shader 指定一个着色器。（默认：DefaultShaders.MESH_BASIC）
         */
        static create(shader?: Shader): Material;
        /**
         * 创建一个材质。
         * @param name 资源名称。
         * @param shader 指定一个着色器。
         */
        static create(name: string, shader?: Shader): Material;
        /**
         * 加载一个材质。
         * @private
         */
        static create(name: string, config: GLTF): Material;
        /**
         * @private
         */
        readonly defines: Defines;
        private readonly _uvTransform;
        private _createTechnique(shader, glTFMaterial);
        private _reset(shaderOrConfig);
        private _retainOrReleaseTextures(isRatain, isOnce);
        private _addOrRemoveTexturesDefine(add?);
        initialize(name: string, config: GLTF, buffers: ReadonlyArray<ArrayBufferView> | null, ...args: Array<any>): void;
        retain(): this;
        release(): this;
        dispose(): boolean;
        /**
         * 拷贝。
         * TODO
         */
        copy(value: Material): this;
        /**
         * 克隆该材质。
         */
        clone(): this;
        readonly needUpdate: (dirty: MaterialDirty) => void;
        setBoolean(id: string, value: boolean): this;
        setInt(id: string, value: int): this;
        setIntv(id: string, value: Float32Array | ReadonlyArray<int>): this;
        setFloat(id: string, value: number): this;
        setFloatv(id: string, value: Float32Array | ReadonlyArray<number>): this;
        setVector2(id: string, value: Readonly<IVector2>): this;
        setVector2v(id: string, value: Float32Array | ReadonlyArray<number>): this;
        setVector3(id: string, value: Readonly<IVector3>): this;
        setVector3v(id: string, value: Float32Array | ReadonlyArray<number>): this;
        setVector4(id: string, value: Readonly<IVector4>): this;
        setVector4v(id: string, value: Float32Array | ReadonlyArray<number>): this;
        setMatrix(id: string, value: Readonly<Matrix4>): this;
        setMatrixv(id: string, value: Float32Array | ReadonlyArray<number>): this;
        /**
         * 为该材质添加指定的 define。
         * @param defineString define 字符串。
         */
        addDefine(defineString: string, value?: number | string): this;
        /**
         * 从该材质移除指定的 define。
         * @param defineString define 字符串。
         */
        removeDefine(defineString: string, value?: number | string): this;
        /**
         * 设置该材质的混合模式。
         * - 该设置会修改深度缓冲的状态。
         * @param blend 混合模式。
         * @param renderQueue 渲染顺序。
         * @param opacity 透明度。（未设置则不更改透明度）
         */
        setBlend(blend: BlendMode, renderQueue: RenderQueue, opacity?: number): this;
        /**
         * @param blendEquations BlendEquation。
         * @param blendFactors BlendFactor。
         * @param renderQueue 渲染顺序。
         * @param opacity 透明度。（未设置则不更改透明度）
         */
        setBlend(blendEquations: gltf.BlendEquation[], blendFactors: gltf.BlendFactor[], renderQueue: RenderQueue, opacity?: number): this;
        /**
         * 设置该材质剔除面片的模式。
         * @param cullEnabled 是否开启剔除。
         * @param frontFace 正面的顶点顺序。
         * @param cullFace 剔除模式。
         */
        setCullFace(cullEnabled: boolean, frontFace?: gltf.FrontFace, cullFace?: gltf.CullFace): this;
        /**
         * 设置该材质的深度检测和深度缓冲。
         * @param depthTest 深度检测。
         * @param depthWrite 深度缓冲。
         */
        setDepth(depthTest: boolean, depthWrite: boolean): this;
        /**
         *
         */
        setStencil(value: boolean): this;
        /**
         * TODO
         * @private
         */
        clearStates(): this;
        /**
         * 获取该材质的主颜色。
         * @param out 颜色。
         */
        getColor(out?: Color): Color;
        /**
         * 获取该材质的指定颜色。
         * @param uniformName uniform 名称。
         * @param out 颜色。
         */
        getColor(uniformName: string, out?: Color): Color;
        /**
         * 设置该材质的主颜色。
         * @param value 颜色。
         */
        setColor(value: Readonly<IColor> | uint): this;
        /**
         * 设置该材质的主颜色。
         * @param uniformName uniform 名称。
         * @param value 颜色。
         */
        setColor(uniformName: string, value: Readonly<IColor> | uint): this;
        /**
         * 获取该材质的 UV 变换矩阵。
         * @param out 矩阵。
         */
        getUVTransform(out?: Matrix3): Matrix3;
        /**
         * 设置该材质的 UV 变换矩阵。
         * @param matrix 矩阵。
         */
        setUVTransform(matrix: Readonly<Matrix3>): this;
        /**
         * 获取该材质的主贴图。
         */
        getTexture(): BaseTexture | null;
        /**
         * 获取该材质的指定贴图。
         * @param uniformName uniform 名称。
         */
        getTexture(uniformName: string): BaseTexture | null;
        /**
         * 设置该材质的主贴图。
         * @param texture 贴图纹理。
         */
        setTexture(texture: BaseTexture | null): this;
        /**
         * 设置该材质的指定贴图。
         * @param uniformName uniform 名称。
         * @param texture 贴图纹理。
         */
        setTexture(uniformName: string, texture: BaseTexture | null): this;
        /**
         * 该材质的渲染排序。
         */
        renderQueue: RenderQueue | uint;
        /**
         * 该材质的透明度。
         */
        opacity: number;
        /**
         * 该材质的 shader。
         */
        shader: Shader;
        /**
         * 该材质的渲染技术。
         */
        readonly technique: gltf.Technique;
        /**
         * @deprecated
         */
        setRenderQueue(value: number): this;
        /**
         * @deprecated
         */
        setOpacity(value: number): this;
        /**
         * @deprecated
         */
        setShader(value: Shader): this | undefined;
    }
}
declare namespace egret3d {
    /**
     * 几何截头锥体。
     */
    class Frustum extends paper.BaseRelease<Frustum> implements paper.ICCS<Frustum>, paper.ISerializable {
        private static readonly _instances;
        /**
         * 创建一个几何截头锥体。
         */
        static create(): Frustum;
        /**
         * 构成该锥体的平面。
         */
        readonly planes: [Plane, Plane, Plane, Plane, Plane, Plane];
        /**
         * 请使用 `egret3d.Frustum.create()` 创建实例。
         * @see egret3d.Frustum.create()
         */
        private constructor();
        serialize(): number[];
        deserialize(value: ReadonlyArray<float>): this;
        clone(): Frustum;
        copy(value: Readonly<Frustum>): this;
        set(planes: [Plane, Plane, Plane, Plane, Plane, Plane]): this;
        fromArray(array: ReadonlyArray<float>, offset?: uint): this;
        /**
         * 通过一个矩阵设置该锥体。
         * @param matrix 一个矩阵。
         */
        fromMatrix(matrix: Readonly<Matrix4>): this;
        /**
         * 该锥体是否包含指定点。
         * @param point 一个点。
         */
        containsPoint(point: Readonly<IVector3>): boolean;
        /**
         *
         * @param sphere
         */
        intersectsSphere(sphere: Readonly<Sphere>): boolean;
    }
}
declare namespace egret3d {
    /**
     * 几何平面。
     */
    class Plane extends paper.BaseRelease<Plane> implements paper.ICCS<Plane>, paper.ISerializable, IRaycast {
        static UP: Readonly<Plane>;
        static DOWN: Readonly<Plane>;
        static LEFT: Readonly<Plane>;
        static RIGHT: Readonly<Plane>;
        static FORWARD: Readonly<Plane>;
        static BACK: Readonly<Plane>;
        private static readonly _instances;
        /**
         * 创建一个几何平面。
         * @param normal 法线。
         * @param constant 二维平面离原点的距离。
         */
        static create(normal?: Readonly<IVector3>, constant?: number): Plane;
        /**
         * 二维平面到原点的距离。
         */
        constant: number;
        /**
         * 平面的法线。
         */
        readonly normal: Vector3;
        /**
         * 请使用 `egret3d.Plane.create()` 创建实例。
         * @see egret3d.Plane.create()
         */
        private constructor();
        serialize(): number[] | Float32Array;
        deserialize(value: Readonly<[number, number, number, number]>): this;
        clone(): Plane;
        copy(value: Readonly<Plane>): this;
        set(normal: Readonly<IVector3>, constant?: number): this;
        fromArray(array: ArrayLike<number>, offset?: uint): this;
        fromPoint(point: Readonly<IVector3>, normal?: Vector3): this;
        fromPoints(valueA: Readonly<IVector3>, valueB: Readonly<IVector3>, valueC: Readonly<IVector3>): this;
        normalize(input?: Readonly<Plane>): this;
        negate(input?: Readonly<Plane>): this;
        applyMatrix(matrix: Readonly<Matrix4>, normalMatrix?: Readonly<Matrix3>): this;
        getDistance(point: Readonly<IVector3>): number;
        getProjectionPoint(point: Readonly<IVector3>, output?: Vector3): Vector3;
        getCoplanarPoint(output?: Vector3): Vector3;
        raycast(ray: Readonly<Ray>, raycastInfo?: RaycastInfo | null): boolean;
        toArray(array?: number[] | Float32Array, offset?: number): number[] | Float32Array;
    }
}
declare namespace paper {
}
declare namespace egret3d {
    /**
     * 动画资源。
     */
    class AnimationAsset extends GLTFAsset {
        /**
         * @private
         */
        static create(name: string, config: GLTF, buffers: ArrayBufferView[]): AnimationAsset;
        getAnimationClip(name: string): GLTFAnimationClip | null;
    }
}
declare namespace egret3d {
    /**
     * @private
     */
    class AnimationController extends GLTFAsset {
        /**
         *
         */
        static create(name: string): AnimationController;
        /**
         * @private
         */
        static create(name: string, config: GLTF): AnimationController;
        /**
         * 添加一个新的动画层。
         */
        addLayer(name: string): AnimationLayer;
        createAnimationTree(machineOrTreen: StateMachine | AnimationTree, name: string): AnimationTree;
        createAnimationNode(machineOrTreen: StateMachine | AnimationTree, asset: string, name: string): AnimationNode;
        /**
         * 获取或添加一个动画层。
         * - 层索引强制连续。
         */
        getOrAddLayer(layerIndex: uint): AnimationLayer;
        readonly layers: AnimationLayer[];
    }
}
declare namespace egret3d {
    /**
     * @private
     */
    class AnimationMask extends GLTFAsset {
        /**
         *
         */
        static create(name: string): AnimationMask;
        /**
         * @private
         */
        static create(name: string, config: GLTF): AnimationMask;
        private _jointNamesDirty;
        private readonly _jointNames;
        private _addJoint(nodes, joints, jointIndex, recursive);
        createJoints(mesh: Mesh): this;
        addJoint(name: string, recursive?: boolean): this;
        removeJoint(name: string, recursive?: boolean): this;
        removeJoints(): this;
        readonly jointNames: ReadonlyArray<string>;
    }
}
declare namespace egret3d {
    /**
     * 提供默认的几何网格资源，以及创建几何网格或几何网格实体的方式。
     */
    class MeshBuilder {
        /**
         * 创建圆形网格。
         */
        static createCircle(radius?: number, arc?: number, axis?: 1 | 2 | 3): Mesh;
        /**
         * 创建平面网格。
         * @param width 宽度。
         * @param height 高度。
         * @param centerOffsetX 中心点偏移 X。
         * @param centerOffsetY 中心点偏移 Y。
         * @param widthSegments 宽度分段。
         * @param heightSegments 高度分段。
         */
        static createPlane(width?: number, height?: number, centerOffsetX?: number, centerOffsetY?: number, widthSegments?: uint, heightSegments?: uint): Mesh;
        /**
         * 创建立方体网格。
         * @param width 宽度。
         * @param height 高度。
         * @param depth 深度。
         * @param centerOffsetX 中心点偏移 X。
         * @param centerOffsetY 中心点偏移 Y。
         * @param centerOffsetZ 中心点偏移 Z。
         * @param widthSegments 宽度分段。
         * @param heightSegments 高度分段。
         * @param depthSegments 深度分段。
         * @param differentFace 是否使用不同材质。
         */
        static createCube(width?: number, height?: number, depth?: number, centerOffsetX?: number, centerOffsetY?: number, centerOffsetZ?: number, widthSegments?: uint, heightSegments?: uint, depthSegments?: uint, differentFace?: boolean): Mesh;
        /**
         * 创建圆柱体网格。
         * @param radiusTop 顶部半径。
         * @param radiusBottom 底部半径。
         * @param height 高度。
         * @param centerOffsetX 中心点偏移 X。
         * @param centerOffsetY 中心点偏移 Y。
         * @param centerOffsetZ 中心点偏移 Z。
         * @param radialSegments 径向分段。
         * @param heightSegments 高度分段。
         * @param openEnded 是否开口。
         * @param thetaStart 起始弧度。
         * @param thetaLength 覆盖弧度。
         * @param differentFace 是否使用不同材质。
         */
        static createCylinder(radiusTop?: number, radiusBottom?: number, height?: number, centerOffsetX?: number, centerOffsetY?: number, centerOffsetZ?: number, radialSegments?: uint, heightSegments?: uint, openEnded?: boolean, thetaStart?: number, thetaLength?: number, differentFace?: boolean): Mesh;
        /**
         * 创建圆环网格。
         */
        static createTorus(radius?: number, tube?: number, radialSegments?: uint, tubularSegments?: uint, arc?: number, axis?: 1 | 2 | 3): Mesh;
        /**
        * 创建球体网格。
        * @param radius 半径。
        * @param centerOffsetX 中心点偏移 X。
        * @param centerOffsetY 中心点偏移 Y。
        * @param centerOffsetZ 中心点偏移 Z。
        * @param widthSegments 宽度分段。
        * @param heightSegments 高度分段。
        * @param phiStart 水平起始弧度。
        * @param phiLength 水平覆盖弧度。
        * @param thetaStart 垂直起始弧度。
        * @param thetaLength 垂直覆盖弧度。
        */
        static createSphere(radius?: number, centerOffsetX?: number, centerOffsetY?: number, centerOffsetZ?: number, widthSegments?: uint, heightSegments?: uint, phiStart?: number, phiLength?: number, thetaStart?: number, thetaLength?: number): Mesh;
        /**
         *
         * @param radius
         * @param tube
         * @param tubularSegments
         * @param radialSegments
         * @param p
         * @param q
         */
        static createTorusKnot(radius?: number, tube?: number, tubularSegments?: uint, radialSegments?: uint, p?: number, q?: number): Mesh;
        /**
         * 创建胶囊体网格。
         * @param radius 半径。
         * @param height 圆柱体高度。
         * @param centerOffsetX 中心点偏移 X。
         * @param centerOffsetY 中心点偏移 Y。
         * @param centerOffsetZ 中心点偏移 Z。
         * @param widthSegments 球体宽度分段。
         * @param heightSegments 球体高度分段。
         * @param middleSegments 圆柱体高度分段。
         * @param phiStart 水平起始弧度。
         * @param phiLength 水平覆盖弧度。
         * @param thetaStart 垂直起始弧度。
         * @param thetaLength 垂直覆盖弧度。
         */
        static createCapsule(radius?: number, height?: number, centerOffsetX?: number, centerOffsetY?: number, centerOffsetZ?: number, widthSegments?: uint, heightSegments?: uint, middleSegments?: uint, phiStart?: number, phiLength?: number, thetaStart?: number, thetaLength?: number): Mesh;
        private static _createPolyhedron(vertices, indices, radius, detail);
        private constructor();
    }
}
declare namespace egret3d.ShaderLib {
    const background: {
        "version": string;
        "asset": {
            "version": string;
        };
        "extensions": {
            "KHR_techniques_webgl": {
                "shaders": {
                    "name": string;
                    "type": number;
                    "uri": string;
                }[];
                "techniques": {
                    "name": string;
                    "attributes": {};
                    "uniforms": {
                        "uvTransform": {
                            "type": number;
                            "value": number[];
                        };
                        "map": {
                            "type": number;
                        };
                    };
                }[];
            };
            "paper": {};
        };
        "extensionsRequired": string[];
        "extensionsUsed": string[];
    };
    const copy: {
        "version": string;
        "asset": {
            "version": string;
        };
        "extensions": {
            "KHR_techniques_webgl": {
                "shaders": {
                    "name": string;
                    "type": number;
                    "uri": string;
                }[];
                "techniques": {
                    "name": string;
                    "attributes": {};
                    "uniforms": {
                        "opacity": {
                            "type": number;
                            "value": number;
                        };
                        "map": {
                            "type": number;
                        };
                    };
                }[];
            };
            "paper": {};
        };
        "extensionsRequired": string[];
        "extensionsUsed": string[];
    };
    const cube: {
        "version": string;
        "asset": {
            "version": string;
        };
        "extensions": {
            "KHR_techniques_webgl": {
                "shaders": {
                    "name": string;
                    "type": number;
                    "uri": string;
                }[];
                "techniques": {
                    "name": string;
                    "attributes": {};
                    "uniforms": {
                        "tCube": {
                            "type": number;
                        };
                        "tFlip": {
                            "type": number;
                            "value": number;
                        };
                        "opacity": {
                            "type": number;
                            "value": number;
                        };
                    };
                }[];
            };
            "paper": {};
        };
        "extensionsRequired": string[];
        "extensionsUsed": string[];
    };
    const depth: {
        "version": string;
        "asset": {
            "version": string;
        };
        "extensions": {
            "KHR_techniques_webgl": {
                "shaders": {
                    "name": string;
                    "type": number;
                    "uri": string;
                }[];
                "techniques": {
                    "name": string;
                    "attributes": {};
                    "uniforms": {
                        "uvTransform": {
                            "type": number;
                            "value": number[];
                        };
                        "displacementMap": {
                            "type": number;
                        };
                        "displacementScale": {
                            "type": number;
                            "value": number;
                        };
                        "displacementBias": {
                            "type": number;
                        };
                        "morphTargetInfluences[0]": {
                            "type": number;
                        };
                        "opacity": {
                            "type": number;
                            "value": number;
                        };
                        "map": {
                            "type": number;
                        };
                        "alphaMap": {
                            "type": number;
                        };
                        "clippingPlanes[0]": {
                            "type": number;
                        };
                    };
                }[];
            };
            "paper": {};
        };
        "extensionsRequired": string[];
        "extensionsUsed": string[];
    };
    const distanceRGBA: {
        "version": string;
        "asset": {
            "version": string;
        };
        "extensions": {
            "KHR_techniques_webgl": {
                "shaders": {
                    "name": string;
                    "type": number;
                    "uri": string;
                }[];
                "techniques": {
                    "name": string;
                    "attributes": {};
                    "uniforms": {
                        "uvTransform": {
                            "type": number;
                            "value": number[];
                        };
                        "displacementMap": {
                            "type": number;
                        };
                        "displacementScale": {
                            "type": number;
                            "value": number;
                        };
                        "displacementBias": {
                            "type": number;
                        };
                        "morphTargetInfluences[0]": {
                            "type": number;
                        };
                        "map": {
                            "type": number;
                        };
                        "alphaMap": {
                            "type": number;
                        };
                        "clippingPlanes[0]": {
                            "type": number;
                        };
                    };
                }[];
            };
            "paper": {};
        };
        "extensionsRequired": string[];
        "extensionsUsed": string[];
    };
    const equirect: {
        "version": string;
        "asset": {
            "version": string;
        };
        "extensions": {
            "KHR_techniques_webgl": {
                "shaders": {
                    "name": string;
                    "type": number;
                    "uri": string;
                }[];
                "techniques": {
                    "name": string;
                    "attributes": {};
                    "uniforms": {
                        "tEquirect": {
                            "type": number;
                        };
                    };
                }[];
            };
            "paper": {};
        };
        "extensionsRequired": string[];
        "extensionsUsed": string[];
    };
    const fxaa: {
        "version": string;
        "asset": {
            "version": string;
        };
        "extensions": {
            "KHR_techniques_webgl": {
                "shaders": {
                    "name": string;
                    "type": number;
                    "uri": string;
                }[];
                "techniques": {
                    "name": string;
                    "attributes": {};
                    "uniforms": {
                        "map": {
                            "type": number;
                        };
                    };
                }[];
            };
            "paper": {};
        };
        "extensionsRequired": string[];
        "extensionsUsed": string[];
    };
    const linebasic: {
        "version": string;
        "asset": {
            "version": string;
        };
        "extensions": {
            "KHR_techniques_webgl": {
                "shaders": {
                    "name": string;
                    "type": number;
                    "uri": string;
                }[];
                "techniques": {
                    "name": string;
                    "attributes": {};
                    "uniforms": {
                        "linewidth": {
                            "type": number;
                            "value": number;
                        };
                        "dashScale": {
                            "type": number;
                            "value": number;
                        };
                        "diffuse": {
                            "type": number;
                            "value": number[];
                        };
                        "opacity": {
                            "type": number;
                            "value": number;
                        };
                        "dashSize": {
                            "type": number;
                            "value": number;
                        };
                        "gapSize": {
                            "type": number;
                            "value": number;
                        };
                        "clippingPlanes[0]": {
                            "type": number;
                        };
                    };
                }[];
            };
            "paper": {};
        };
        "extensionsRequired": string[];
        "extensionsUsed": string[];
    };
    const linedashed: {
        "version": string;
        "asset": {
            "version": string;
        };
        "extensions": {
            "KHR_techniques_webgl": {
                "shaders": {
                    "name": string;
                    "type": number;
                    "uri": string;
                }[];
                "techniques": {
                    "name": string;
                    "attributes": {};
                    "uniforms": {
                        "scale": {
                            "type": number;
                            "value": number;
                        };
                        "diffuse": {
                            "type": number;
                            "value": number[];
                        };
                        "opacity": {
                            "type": number;
                            "value": number;
                        };
                        "dashSize": {
                            "type": number;
                            "value": number;
                        };
                        "totalSize": {
                            "type": number;
                            "value": number;
                        };
                        "clippingPlanes[0]": {
                            "type": number;
                        };
                    };
                }[];
            };
            "paper": {};
        };
        "extensionsRequired": string[];
        "extensionsUsed": string[];
    };
    const meshbasic: {
        "version": string;
        "asset": {
            "version": string;
        };
        "extensions": {
            "KHR_techniques_webgl": {
                "shaders": {
                    "name": string;
                    "type": number;
                    "uri": string;
                }[];
                "techniques": {
                    "name": string;
                    "attributes": {};
                    "uniforms": {
                        "uvTransform": {
                            "type": number;
                            "value": number[];
                        };
                        "refractionRatio": {
                            "type": number;
                            "value": number;
                        };
                        "morphTargetInfluences[0]": {
                            "type": number;
                        };
                        "diffuse": {
                            "type": number;
                            "value": number[];
                        };
                        "opacity": {
                            "type": number;
                            "value": number;
                        };
                        "map": {
                            "type": number;
                        };
                        "alphaMap": {
                            "type": number;
                        };
                        "aoMap": {
                            "type": number;
                        };
                        "aoMapIntensity": {
                            "type": number;
                            "value": number;
                        };
                        "reflectivity": {
                            "type": number;
                            "value": number;
                        };
                        "envMapIntensity": {
                            "type": number;
                            "value": number;
                        };
                        "envMap": {
                            "type": number;
                        };
                        "flipEnvMap": {
                            "type": number;
                            "value": number;
                        };
                        "maxMipLevel": {
                            "type": number;
                        };
                        "specularMap": {
                            "type": number;
                        };
                        "clippingPlanes[0]": {
                            "type": number;
                        };
                    };
                }[];
            };
            "paper": {};
        };
        "extensionsRequired": string[];
        "extensionsUsed": string[];
    };
    const meshlambert: {
        "version": string;
        "asset": {
            "version": string;
        };
        "extensions": {
            "KHR_techniques_webgl": {
                "shaders": {
                    "name": string;
                    "type": number;
                    "uri": string;
                }[];
                "techniques": {
                    "name": string;
                    "attributes": {};
                    "uniforms": {
                        "uvTransform": {
                            "type": number;
                            "value": number[];
                        };
                        "refractionRatio": {
                            "type": number;
                            "value": number;
                        };
                        "morphTargetInfluences[0]": {
                            "type": number;
                        };
                        "diffuse": {
                            "type": number;
                            "value": number[];
                        };
                        "emissive": {
                            "type": number;
                            "value": number[];
                        };
                        "opacity": {
                            "type": number;
                            "value": number;
                        };
                        "map": {
                            "type": number;
                        };
                        "alphaMap": {
                            "type": number;
                        };
                        "aoMap": {
                            "type": number;
                        };
                        "aoMapIntensity": {
                            "type": number;
                            "value": number;
                        };
                        "emissiveMap": {
                            "type": number;
                        };
                        "reflectivity": {
                            "type": number;
                            "value": number;
                        };
                        "envMapIntensity": {
                            "type": number;
                            "value": number;
                        };
                        "envMap": {
                            "type": number;
                        };
                        "flipEnvMap": {
                            "type": number;
                            "value": number;
                        };
                        "maxMipLevel": {
                            "type": number;
                        };
                        "specularMap": {
                            "type": number;
                        };
                        "clippingPlanes[0]": {
                            "type": number;
                        };
                    };
                }[];
            };
            "paper": {};
        };
        "extensionsRequired": string[];
        "extensionsUsed": string[];
    };
    const meshphong: {
        "version": string;
        "asset": {
            "version": string;
        };
        "extensions": {
            "KHR_techniques_webgl": {
                "shaders": {
                    "name": string;
                    "type": number;
                    "uri": string;
                }[];
                "techniques": {
                    "name": string;
                    "attributes": {};
                    "uniforms": {
                        "uvTransform": {
                            "type": number;
                            "value": number[];
                        };
                        "displacementMap": {
                            "type": number;
                        };
                        "displacementScale": {
                            "type": number;
                            "value": number;
                        };
                        "displacementBias": {
                            "type": number;
                        };
                        "refractionRatio": {
                            "type": number;
                            "value": number;
                        };
                        "morphTargetInfluences[0]": {
                            "type": number;
                        };
                        "diffuse": {
                            "type": number;
                            "value": number[];
                        };
                        "emissive": {
                            "type": number;
                            "value": number[];
                        };
                        "specular": {
                            "type": number;
                            "value": number[];
                        };
                        "shininess": {
                            "type": number;
                            "value": number;
                        };
                        "opacity": {
                            "type": number;
                            "value": number;
                        };
                        "map": {
                            "type": number;
                        };
                        "alphaMap": {
                            "type": number;
                        };
                        "aoMap": {
                            "type": number;
                        };
                        "aoMapIntensity": {
                            "type": number;
                            "value": number;
                        };
                        "emissiveMap": {
                            "type": number;
                        };
                        "reflectivity": {
                            "type": number;
                            "value": number;
                        };
                        "envMapIntensity": {
                            "type": number;
                            "value": number;
                        };
                        "envMap": {
                            "type": number;
                        };
                        "flipEnvMap": {
                            "type": number;
                            "value": number;
                        };
                        "maxMipLevel": {
                            "type": number;
                        };
                        "gradientMap": {
                            "type": number;
                        };
                        "bumpMap": {
                            "type": number;
                        };
                        "bumpScale": {
                            "type": number;
                            "value": number;
                        };
                        "normalMap": {
                            "type": number;
                        };
                        "normalScale": {
                            "type": number;
                            "value": number[];
                        };
                        "specularMap": {
                            "type": number;
                        };
                        "clippingPlanes[0]": {
                            "type": number;
                        };
                    };
                }[];
            };
            "paper": {};
        };
        "extensionsRequired": string[];
        "extensionsUsed": string[];
    };
    const meshphysical: {
        "version": string;
        "asset": {
            "version": string;
        };
        "extensions": {
            "KHR_techniques_webgl": {
                "shaders": {
                    "name": string;
                    "type": number;
                    "uri": string;
                }[];
                "techniques": {
                    "name": string;
                    "attributes": {};
                    "uniforms": {
                        "uvTransform": {
                            "type": number;
                            "value": number[];
                        };
                        "displacementMap": {
                            "type": number;
                        };
                        "displacementScale": {
                            "type": number;
                            "value": number;
                        };
                        "displacementBias": {
                            "type": number;
                        };
                        "morphTargetInfluences[0]": {
                            "type": number;
                        };
                        "diffuse": {
                            "type": number;
                            "value": number[];
                        };
                        "emissive": {
                            "type": number;
                            "value": number[];
                        };
                        "roughness": {
                            "type": number;
                            "value": number;
                        };
                        "metalness": {
                            "type": number;
                            "value": number;
                        };
                        "opacity": {
                            "type": number;
                            "value": number;
                        };
                        "clearCoat": {
                            "type": number;
                        };
                        "clearCoatRoughness": {
                            "type": number;
                        };
                        "map": {
                            "type": number;
                        };
                        "alphaMap": {
                            "type": number;
                        };
                        "aoMap": {
                            "type": number;
                        };
                        "aoMapIntensity": {
                            "type": number;
                            "value": number;
                        };
                        "emissiveMap": {
                            "type": number;
                        };
                        "reflectivity": {
                            "type": number;
                            "value": number;
                        };
                        "envMapIntensity": {
                            "type": number;
                            "value": number;
                        };
                        "envMap": {
                            "type": number;
                        };
                        "flipEnvMap": {
                            "type": number;
                            "value": number;
                        };
                        "maxMipLevel": {
                            "type": number;
                        };
                        "refractionRatio": {
                            "type": number;
                            "value": number;
                        };
                        "bumpMap": {
                            "type": number;
                        };
                        "bumpScale": {
                            "type": number;
                            "value": number;
                        };
                        "normalMap": {
                            "type": number;
                        };
                        "normalScale": {
                            "type": number;
                            "value": number[];
                        };
                        "roughnessMap": {
                            "type": number;
                        };
                        "metalnessMap": {
                            "type": number;
                        };
                        "clippingPlanes[0]": {
                            "type": number;
                        };
                    };
                }[];
            };
            "paper": {};
        };
        "extensionsRequired": string[];
        "extensionsUsed": string[];
    };
    const normal: {
        "version": string;
        "asset": {
            "version": string;
        };
        "extensions": {
            "KHR_techniques_webgl": {
                "shaders": {
                    "name": string;
                    "type": number;
                    "uri": string;
                }[];
                "techniques": {
                    "name": string;
                    "attributes": {};
                    "uniforms": {
                        "uvTransform": {
                            "type": number;
                            "value": number[];
                        };
                        "displacementMap": {
                            "type": number;
                        };
                        "displacementScale": {
                            "type": number;
                            "value": number;
                        };
                        "displacementBias": {
                            "type": number;
                        };
                        "morphTargetInfluences[0]": {
                            "type": number;
                        };
                        "opacity": {
                            "type": number;
                            "value": number;
                        };
                        "bumpMap": {
                            "type": number;
                        };
                        "bumpScale": {
                            "type": number;
                            "value": number;
                        };
                        "normalMap": {
                            "type": number;
                        };
                        "normalScale": {
                            "type": number;
                            "value": number[];
                        };
                    };
                }[];
            };
            "paper": {};
        };
        "extensionsRequired": string[];
        "extensionsUsed": string[];
    };
    const particle: {
        "version": string;
        "asset": {
            "version": string;
        };
        "extensions": {
            "KHR_techniques_webgl": {
                "shaders": {
                    "name": string;
                    "type": number;
                    "uri": string;
                }[];
                "techniques": {
                    "name": string;
                    "attributes": {};
                    "uniforms": {
                        "u_currentTime": {
                            "type": number;
                        };
                        "u_gravity": {
                            "type": number;
                        };
                        "u_worldPosition": {
                            "type": number;
                            "value": number[];
                        };
                        "u_worldRotation": {
                            "type": number;
                            "value": number[];
                        };
                        "u_startRotation3D": {
                            "type": number;
                        };
                        "u_scalingMode": {
                            "type": number;
                        };
                        "u_positionScale": {
                            "type": number;
                        };
                        "u_sizeScale": {
                            "type": number;
                        };
                        "u_lengthScale": {
                            "type": number;
                        };
                        "u_speeaScale": {
                            "type": number;
                        };
                        "u_simulationSpace": {
                            "type": number;
                        };
                        "u_spaceType": {
                            "type": number;
                        };
                        "u_velocityConst": {
                            "type": number;
                        };
                        "u_velocityCurveX[0]": {
                            "type": number;
                        };
                        "u_velocityCurveY[0]": {
                            "type": number;
                        };
                        "u_velocityCurveZ[0]": {
                            "type": number;
                        };
                        "u_velocityConstMax": {
                            "type": number;
                        };
                        "u_velocityCurveMaxX[0]": {
                            "type": number;
                        };
                        "u_velocityCurveMaxY[0]": {
                            "type": number;
                        };
                        "u_velocityCurveMaxZ[0]": {
                            "type": number;
                        };
                        "u_colorGradient[0]": {
                            "type": number;
                        };
                        "u_alphaGradient[0]": {
                            "type": number;
                        };
                        "u_colorGradientMax[0]": {
                            "type": number;
                        };
                        "u_alphaGradientMax[0]": {
                            "type": number;
                        };
                        "u_sizeCurve[0]": {
                            "type": number;
                        };
                        "u_sizeCurveMax[0]": {
                            "type": number;
                        };
                        "u_sizeCurveX[0]": {
                            "type": number;
                        };
                        "u_sizeCurveY[0]": {
                            "type": number;
                        };
                        "u_sizeCurveZ[0]": {
                            "type": number;
                        };
                        "u_sizeCurveMaxX[0]": {
                            "type": number;
                        };
                        "u_sizeCurveMaxY[0]": {
                            "type": number;
                        };
                        "u_sizeCurveMaxZ[0]": {
                            "type": number;
                        };
                        "u_rotationConst": {
                            "type": number;
                        };
                        "u_rotationConstMax": {
                            "type": number;
                        };
                        "u_rotationCurve[0]": {
                            "type": number;
                        };
                        "u_rotationCurveMax[0]": {
                            "type": number;
                        };
                        "u_rotationConstSeprarate": {
                            "type": number;
                        };
                        "u_rotationConstMaxSeprarate": {
                            "type": number;
                        };
                        "u_rotationCurveX[0]": {
                            "type": number;
                        };
                        "u_rotationCurveY[0]": {
                            "type": number;
                        };
                        "u_rotationCurveZ[0]": {
                            "type": number;
                        };
                        "u_rotationCurveW[0]": {
                            "type": number;
                        };
                        "u_rotationCurveMaxX[0]": {
                            "type": number;
                        };
                        "u_rotationCurveMaxY[0]": {
                            "type": number;
                        };
                        "u_rotationCurveMaxZ[0]": {
                            "type": number;
                        };
                        "u_rotationCurveMaxW[0]": {
                            "type": number;
                        };
                        "u_cycles": {
                            "type": number;
                        };
                        "u_subUV": {
                            "type": number;
                        };
                        "u_uvCurve[0]": {
                            "type": number;
                        };
                        "u_uvCurveMax[0]": {
                            "type": number;
                        };
                        "map": {
                            "type": number;
                        };
                        "diffuse": {
                            "type": number;
                            "value": number[];
                        };
                        "opacity": {
                            "type": number;
                            "value": number;
                        };
                    };
                }[];
            };
            "paper": {};
        };
        "extensionsRequired": string[];
        "extensionsUsed": string[];
    };
    const points: {
        "version": string;
        "asset": {
            "version": string;
        };
        "extensions": {
            "KHR_techniques_webgl": {
                "shaders": {
                    "name": string;
                    "type": number;
                    "uri": string;
                }[];
                "techniques": {
                    "name": string;
                    "attributes": {};
                    "uniforms": {
                        "size": {
                            "type": number;
                        };
                        "scale": {
                            "type": number;
                            "value": number;
                        };
                        "morphTargetInfluences[0]": {
                            "type": number;
                        };
                        "diffuse": {
                            "type": number;
                            "value": number[];
                        };
                        "opacity": {
                            "type": number;
                            "value": number;
                        };
                        "uvTransform": {
                            "type": number;
                            "value": number[];
                        };
                        "map": {
                            "type": number;
                        };
                        "clippingPlanes[0]": {
                            "type": number;
                        };
                    };
                }[];
            };
            "paper": {};
        };
        "extensionsRequired": string[];
        "extensionsUsed": string[];
    };
    const shadow: {
        "version": string;
        "asset": {
            "version": string;
        };
        "extensions": {
            "KHR_techniques_webgl": {
                "shaders": {
                    "name": string;
                    "type": number;
                    "uri": string;
                }[];
                "techniques": {
                    "name": string;
                    "attributes": {};
                    "uniforms": {
                        "color": {
                            "type": number;
                        };
                        "opacity": {
                            "type": number;
                            "value": number;
                        };
                    };
                }[];
            };
            "paper": {};
        };
        "extensionsRequired": string[];
        "extensionsUsed": string[];
    };
    const sprite: {
        "version": string;
        "asset": {
            "version": string;
        };
        "extensions": {
            "KHR_techniques_webgl": {
                "shaders": {
                    "name": string;
                    "type": number;
                    "uri": string;
                }[];
                "techniques": {
                    "name": string;
                    "attributes": {};
                    "uniforms": {
                        "center": {
                            "type": number;
                            "value": number[];
                        };
                        "uvTransform": {
                            "type": number;
                            "value": number[];
                        };
                        "diffuse": {
                            "type": number;
                            "value": number[];
                        };
                        "opacity": {
                            "type": number;
                            "value": number;
                        };
                        "map": {
                            "type": number;
                        };
                        "clippingPlanes[0]": {
                            "type": number;
                        };
                    };
                }[];
            };
            "paper": {};
        };
        "extensionsRequired": string[];
        "extensionsUsed": string[];
    };
}
declare namespace egret3d.ShaderChunk {
    const alphamap_fragment = "#ifdef USE_ALPHAMAP\n\tdiffuseColor.a *= texture2D( alphaMap, vUv ).g;\n#endif\n";
    const alphamap_pars_fragment = "#ifdef USE_ALPHAMAP\n\tuniform sampler2D alphaMap;\n#endif\n";
    const alphatest_fragment = "#ifdef ALPHATEST\n\tif ( diffuseColor.a < ALPHATEST ) discard;\n#endif\n";
    const aomap_fragment = "#ifdef USE_AOMAP\n\tfloat ambientOcclusion = ( texture2D( aoMap, vUv2 ).r - 1.0 ) * aoMapIntensity + 1.0;\n\treflectedLight.indirectDiffuse *= ambientOcclusion;\n\t#if defined( USE_ENVMAP ) && defined( PHYSICAL )\n\t\tfloat dotNV = saturate( dot( geometry.normal, geometry.viewDir ) );\n\t\treflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.specularRoughness );\n\t#endif\n#endif\n";
    const aomap_pars_fragment = "#ifdef USE_AOMAP\n\tuniform sampler2D aoMap;\n\tuniform float aoMapIntensity;\n#endif";
    const beginnormal_vertex = "\nvec3 objectNormal = vec3( normal );\n";
    const begin_vertex = "\nvec3 transformed = vec3( position );\n";
    const bsdfs = "float punctualLightIntensityToIrradianceFactor( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {\n\tif( decayExponent > 0.0 ) {\n#if defined ( PHYSICALLY_CORRECT_LIGHTS )\n\t\tfloat distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );\n\t\tfloat maxDistanceCutoffFactor = pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );\n\t\treturn distanceFalloff * maxDistanceCutoffFactor;\n#else\n\t\treturn pow( saturate( -lightDistance / cutoffDistance + 1.0 ), decayExponent );\n#endif\n\t}\n\treturn 1.0;\n}\nvec3 BRDF_Diffuse_Lambert( const in vec3 diffuseColor ) {\n\treturn RECIPROCAL_PI * diffuseColor;\n}\nvec3 F_Schlick( const in vec3 specularColor, const in float dotLH ) {\n\tfloat fresnel = exp2( ( -5.55473 * dotLH - 6.98316 ) * dotLH );\n\treturn ( 1.0 - specularColor ) * fresnel + specularColor;\n}\nfloat G_GGX_Smith( const in float alpha, const in float dotNL, const in float dotNV ) {\n\tfloat a2 = pow2( alpha );\n\tfloat gl = dotNL + sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );\n\tfloat gv = dotNV + sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );\n\treturn 1.0 / ( gl * gv );\n}\nfloat G_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {\n\tfloat a2 = pow2( alpha );\n\tfloat gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );\n\tfloat gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );\n\treturn 0.5 / max( gv + gl, EPSILON );\n}\nfloat D_GGX( const in float alpha, const in float dotNH ) {\n\tfloat a2 = pow2( alpha );\n\tfloat denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;\n\treturn RECIPROCAL_PI * a2 / pow2( denom );\n}\nvec3 BRDF_Specular_GGX( const in IncidentLight incidentLight, const in GeometricContext geometry, const in vec3 specularColor, const in float roughness ) {\n\tfloat alpha = pow2( roughness );\n\tvec3 halfDir = normalize( incidentLight.direction + geometry.viewDir );\n\tfloat dotNL = saturate( dot( geometry.normal, incidentLight.direction ) );\n\tfloat dotNV = saturate( dot( geometry.normal, geometry.viewDir ) );\n\tfloat dotNH = saturate( dot( geometry.normal, halfDir ) );\n\tfloat dotLH = saturate( dot( incidentLight.direction, halfDir ) );\n\tvec3 F = F_Schlick( specularColor, dotLH );\n\tfloat G = G_GGX_SmithCorrelated( alpha, dotNL, dotNV );\n\tfloat D = D_GGX( alpha, dotNH );\n\treturn F * ( G * D );\n}\nvec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {\n\tconst float LUT_SIZE  = 64.0;\n\tconst float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;\n\tconst float LUT_BIAS  = 0.5 / LUT_SIZE;\n\tfloat dotNV = saturate( dot( N, V ) );\n\tvec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );\n\tuv = uv * LUT_SCALE + LUT_BIAS;\n\treturn uv;\n}\nfloat LTC_ClippedSphereFormFactor( const in vec3 f ) {\n\tfloat l = length( f );\n\treturn max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );\n}\nvec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {\n\tfloat x = dot( v1, v2 );\n\tfloat y = abs( x );\n\tfloat a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;\n\tfloat b = 3.4175940 + ( 4.1616724 + y ) * y;\n\tfloat v = a / b;\n\tfloat theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;\n\treturn cross( v1, v2 ) * theta_sintheta;\n}\nvec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {\n\tvec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];\n\tvec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];\n\tvec3 lightNormal = cross( v1, v2 );\n\tif( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );\n\tvec3 T1, T2;\n\tT1 = normalize( V - N * dot( V, N ) );\n\tT2 = - cross( N, T1 );\n\tmat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );\n\tvec3 coords[ 4 ];\n\tcoords[ 0 ] = mat * ( rectCoords[ 0 ] - P );\n\tcoords[ 1 ] = mat * ( rectCoords[ 1 ] - P );\n\tcoords[ 2 ] = mat * ( rectCoords[ 2 ] - P );\n\tcoords[ 3 ] = mat * ( rectCoords[ 3 ] - P );\n\tcoords[ 0 ] = normalize( coords[ 0 ] );\n\tcoords[ 1 ] = normalize( coords[ 1 ] );\n\tcoords[ 2 ] = normalize( coords[ 2 ] );\n\tcoords[ 3 ] = normalize( coords[ 3 ] );\n\tvec3 vectorFormFactor = vec3( 0.0 );\n\tvectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );\n\tvectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );\n\tvectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );\n\tvectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );\n\tfloat result = LTC_ClippedSphereFormFactor( vectorFormFactor );\n\treturn vec3( result );\n}\nvec3 BRDF_Specular_GGX_Environment( const in GeometricContext geometry, const in vec3 specularColor, const in float roughness ) {\n\tfloat dotNV = saturate( dot( geometry.normal, geometry.viewDir ) );\n\tconst vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );\n\tconst vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );\n\tvec4 r = roughness * c0 + c1;\n\tfloat a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;\n\tvec2 AB = vec2( -1.04, 1.04 ) * a004 + r.zw;\n\treturn specularColor * AB.x + AB.y;\n}\nfloat G_BlinnPhong_Implicit(\n ) {\n\treturn 0.25;\n}\nfloat D_BlinnPhong( const in float shininess, const in float dotNH ) {\n\treturn RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );\n}\nvec3 BRDF_Specular_BlinnPhong( const in IncidentLight incidentLight, const in GeometricContext geometry, const in vec3 specularColor, const in float shininess ) {\n\tvec3 halfDir = normalize( incidentLight.direction + geometry.viewDir );\n\tfloat dotNH = saturate( dot( geometry.normal, halfDir ) );\n\tfloat dotLH = saturate( dot( incidentLight.direction, halfDir ) );\n\tvec3 F = F_Schlick( specularColor, dotLH );\n\tfloat G = G_BlinnPhong_Implicit(\n );\n\tfloat D = D_BlinnPhong( shininess, dotNH );\n\treturn F * ( G * D );\n}\nfloat GGXRoughnessToBlinnExponent( const in float ggxRoughness ) {\n\treturn ( 2.0 / pow2( ggxRoughness + 0.0001 ) - 2.0 );\n}\nfloat BlinnExponentToGGXRoughness( const in float blinnExponent ) {\n\treturn sqrt( 2.0 / ( blinnExponent + 2.0 ) );\n}\n";
    const bumpMap_pars_frag = "#ifdef USE_BUMPMAP\n\tuniform sampler2D bumpMap;\n\tuniform float bumpScale;\n\tvec2 dHdxy_fwd(vec2 uv) {\n\t\tvec2 dSTdx = dFdx( uv );\n\t\tvec2 dSTdy = dFdy( uv );\n\t\tfloat Hll = bumpScale * texture2D( bumpMap, uv ).x;\n\t\tfloat dBx = bumpScale * texture2D( bumpMap, uv + dSTdx ).x - Hll;\n\t\tfloat dBy = bumpScale * texture2D( bumpMap, uv + dSTdy ).x - Hll;\n\t\treturn vec2( dBx, dBy );\n\t}\n\tvec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy) {\n\t\tvec3 vSigmaX = dFdx( surf_pos );\n\t\tvec3 vSigmaY = dFdy( surf_pos );\n\t\tvec3 vN = surf_norm;\n\t\tvec3 R1 = cross( vSigmaY, vN );\n\t\tvec3 R2 = cross( vN, vSigmaX );\n\t\tfloat fDet = dot( vSigmaX, R1 );\n\t\tvec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );\n\t\treturn normalize( abs( fDet ) * surf_norm - vGrad );\n\t}\n#endif\n";
    const bumpmap_pars_fragment = "#ifdef USE_BUMPMAP\n\tuniform sampler2D bumpMap;\n\tuniform float bumpScale;\n\tvec2 dHdxy_fwd() {\n\t\tvec2 dSTdx = dFdx( vUv );\n\t\tvec2 dSTdy = dFdy( vUv );\n\t\tfloat Hll = bumpScale * texture2D( bumpMap, vUv ).x;\n\t\tfloat dBx = bumpScale * texture2D( bumpMap, vUv + dSTdx ).x - Hll;\n\t\tfloat dBy = bumpScale * texture2D( bumpMap, vUv + dSTdy ).x - Hll;\n\t\treturn vec2( dBx, dBy );\n\t}\n\tvec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy ) {\n\t\tvec3 vSigmaX = vec3( dFdx( surf_pos.x ), dFdx( surf_pos.y ), dFdx( surf_pos.z ) );\n\t\tvec3 vSigmaY = vec3( dFdy( surf_pos.x ), dFdy( surf_pos.y ), dFdy( surf_pos.z ) );\n\t\tvec3 vN = surf_norm;\n\t\tvec3 R1 = cross( vSigmaY, vN );\n\t\tvec3 R2 = cross( vN, vSigmaX );\n\t\tfloat fDet = dot( vSigmaX, R1 );\n\t\tfDet *= ( float( gl_FrontFacing ) * 2.0 - 1.0 );\n\t\tvec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );\n\t\treturn normalize( abs( fDet ) * surf_norm - vGrad );\n\t}\n#endif\n";
    const clipping_planes_fragment = "#if NUM_CLIPPING_PLANES > 0\n\tvec4 plane;\n\t#pragma unroll_loop\n\tfor ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {\n\t\tplane = clippingPlanes[ i ];\n\t\tif ( dot( vViewPosition, plane.xyz ) > plane.w ) discard;\n\t}\n\t#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES\n\t\tbool clipped = true;\n\t\t#pragma unroll_loop\n\t\tfor ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {\n\t\t\tplane = clippingPlanes[ i ];\n\t\t\tclipped = ( dot( vViewPosition, plane.xyz ) > plane.w ) && clipped;\n\t\t}\n\t\tif ( clipped ) discard;\n\t#endif\n#endif\n";
    const clipping_planes_pars_fragment = "#if NUM_CLIPPING_PLANES > 0\n\t#if ! defined( PHYSICAL ) && ! defined( PHONG )\n\t\tvarying vec3 vViewPosition;\n\t#endif\n\tuniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];\n#endif\n";
    const clipping_planes_pars_vertex = "#if NUM_CLIPPING_PLANES > 0 && ! defined( PHYSICAL ) && ! defined( PHONG )\n\tvarying vec3 vViewPosition;\n#endif\n";
    const clipping_planes_vertex = "#if NUM_CLIPPING_PLANES > 0 && ! defined( PHYSICAL ) && ! defined( PHONG )\n\tvViewPosition = - mvPosition.xyz;\n#endif\n";
    const color_fragment = "#ifdef USE_COLOR\n\tdiffuseColor.rgb *= vColor;\n#endif";
    const color_pars_fragment = "#ifdef USE_COLOR\n\tvarying vec3 vColor;\n#endif\n";
    const color_pars_vertex = "#ifdef USE_COLOR\n\tvarying vec3 vColor;\n#endif";
    const color_vertex = "#ifdef USE_COLOR\n\tvColor.xyz = color.xyz;\n#endif";
    const common = "#define PI 3.14159265359\n#define PI2 6.28318530718\n#define PI_HALF 1.5707963267949\n#define RECIPROCAL_PI 0.31830988618\n#define RECIPROCAL_PI2 0.15915494\n#define LOG2 1.442695\n#define EPSILON 1e-6\n#define saturate(a) clamp( a, 0.0, 1.0 )\n#define whiteCompliment(a) ( 1.0 - saturate( a ) )\nfloat pow2( const in float x ) { return x*x; }\nfloat pow3( const in float x ) { return x*x*x; }\nfloat pow4( const in float x ) { float x2 = x*x; return x2*x2; }\nfloat average( const in vec3 color ) { return dot( color, vec3( 0.3333 ) ); }\nhighp float rand( const in vec2 uv ) {\n\tconst highp float a = 12.9898, b = 78.233, c = 43758.5453;\n\thighp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );\n\treturn fract(sin(sn) * c);\n}\nstruct IncidentLight {\n\tvec3 color;\n\tvec3 direction;\n\tbool visible;\n};\nstruct ReflectedLight {\n\tvec3 directDiffuse;\n\tvec3 directSpecular;\n\tvec3 indirectDiffuse;\n\tvec3 indirectSpecular;\n};\nstruct GeometricContext {\n\tvec3 position;\n\tvec3 normal;\n\tvec3 viewDir;\n};\nvec3 transformDirection( in vec3 dir, in mat4 matrix ) {\n\treturn normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );\n}\nvec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {\n\treturn normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );\n}\nvec3 projectOnPlane(in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal ) {\n\tfloat distance = dot( planeNormal, point - pointOnPlane );\n\treturn - distance * planeNormal + point;\n}\nfloat sideOfPlane( in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal ) {\n\treturn sign( dot( point - pointOnPlane, planeNormal ) );\n}\nvec3 linePlaneIntersect( in vec3 pointOnLine, in vec3 lineDirection, in vec3 pointOnPlane, in vec3 planeNormal ) {\n\treturn lineDirection * ( dot( planeNormal, pointOnPlane - pointOnLine ) / dot( planeNormal, lineDirection ) ) + pointOnLine;\n}\nmat3 transposeMat3( const in mat3 m ) {\n\tmat3 tmp;\n\ttmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );\n\ttmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );\n\ttmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );\n\treturn tmp;\n}\nfloat linearToRelativeLuminance( const in vec3 color ) {\n\tvec3 weights = vec3( 0.2126, 0.7152, 0.0722 );\n\treturn dot( weights, color.rgb );\n}\n";
    const common_frag_def = "uniform mat4 viewMatrix;\nuniform vec3 cameraPosition;";
    const common_vert_def = "uniform mat4 modelMatrix;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform mat4 viewMatrix;\nuniform mat3 normalMatrix;\nuniform vec3 cameraPosition;\nattribute vec3 position;\nattribute vec3 normal;\nattribute vec2 uv;\n#ifdef USE_COLOR\n\tattribute vec3 color;\n#endif\n#ifdef USE_MORPHTARGETS\n\tattribute vec3 morphTarget0;\n\tattribute vec3 morphTarget1;\n\tattribute vec3 morphTarget2;\n\tattribute vec3 morphTarget3;\n\t#ifdef USE_MORPHNORMALS\n\t\tattribute vec3 morphNormal0;\n\t\tattribute vec3 morphNormal1;\n\t\tattribute vec3 morphNormal2;\n\t\tattribute vec3 morphNormal3;\n\t#else\n\t\tattribute vec3 morphTarget4;\n\t\tattribute vec3 morphTarget5;\n\t\tattribute vec3 morphTarget6;\n\t\tattribute vec3 morphTarget7;\n\t#endif\n#endif\n#ifdef USE_SKINNING\n\tattribute vec4 skinIndex;\n\tattribute vec4 skinWeight;\n#endif";
    const cube_uv_reflection_fragment = "#ifdef ENVMAP_TYPE_CUBE_UV\n#define cubeUV_textureSize (1024.0)\nint getFaceFromDirection(vec3 direction) {\n\tvec3 absDirection = abs(direction);\n\tint face = -1;\n\tif( absDirection.x > absDirection.z ) {\n\t\tif(absDirection.x > absDirection.y )\n\t\t\tface = direction.x > 0.0 ? 0 : 3;\n\t\telse\n\t\t\tface = direction.y > 0.0 ? 1 : 4;\n\t}\n\telse {\n\t\tif(absDirection.z > absDirection.y )\n\t\t\tface = direction.z > 0.0 ? 2 : 5;\n\t\telse\n\t\t\tface = direction.y > 0.0 ? 1 : 4;\n\t}\n\treturn face;\n}\n#define cubeUV_maxLods1  (log2(cubeUV_textureSize*0.25) - 1.0)\n#define cubeUV_rangeClamp (exp2((6.0 - 1.0) * 2.0))\nvec2 MipLevelInfo( vec3 vec, float roughnessLevel, float roughness ) {\n\tfloat scale = exp2(cubeUV_maxLods1 - roughnessLevel);\n\tfloat dxRoughness = dFdx(roughness);\n\tfloat dyRoughness = dFdy(roughness);\n\tvec3 dx = dFdx( vec * scale * dxRoughness );\n\tvec3 dy = dFdy( vec * scale * dyRoughness );\n\tfloat d = max( dot( dx, dx ), dot( dy, dy ) );\n\td = clamp(d, 1.0, cubeUV_rangeClamp);\n\tfloat mipLevel = 0.5 * log2(d);\n\treturn vec2(floor(mipLevel), fract(mipLevel));\n}\n#define cubeUV_maxLods2 (log2(cubeUV_textureSize*0.25) - 2.0)\n#define cubeUV_rcpTextureSize (1.0 / cubeUV_textureSize)\nvec2 getCubeUV(vec3 direction, float roughnessLevel, float mipLevel) {\n\tmipLevel = roughnessLevel > cubeUV_maxLods2 - 3.0 ? 0.0 : mipLevel;\n\tfloat a = 16.0 * cubeUV_rcpTextureSize;\n\tvec2 exp2_packed = exp2( vec2( roughnessLevel, mipLevel ) );\n\tvec2 rcp_exp2_packed = vec2( 1.0 ) / exp2_packed;\n\tfloat powScale = exp2_packed.x * exp2_packed.y;\n\tfloat scale = rcp_exp2_packed.x * rcp_exp2_packed.y * 0.25;\n\tfloat mipOffset = 0.75*(1.0 - rcp_exp2_packed.y) * rcp_exp2_packed.x;\n\tbool bRes = mipLevel == 0.0;\n\tscale =  bRes && (scale < a) ? a : scale;\n\tvec3 r;\n\tvec2 offset;\n\tint face = getFaceFromDirection(direction);\n\tfloat rcpPowScale = 1.0 / powScale;\n\tif( face == 0) {\n\t\tr = vec3(direction.x, -direction.z, direction.y);\n\t\toffset = vec2(0.0+mipOffset,0.75 * rcpPowScale);\n\t\toffset.y = bRes && (offset.y < 2.0*a) ? a : offset.y;\n\t}\n\telse if( face == 1) {\n\t\tr = vec3(direction.y, direction.x, direction.z);\n\t\toffset = vec2(scale+mipOffset, 0.75 * rcpPowScale);\n\t\toffset.y = bRes && (offset.y < 2.0*a) ? a : offset.y;\n\t}\n\telse if( face == 2) {\n\t\tr = vec3(direction.z, direction.x, direction.y);\n\t\toffset = vec2(2.0*scale+mipOffset, 0.75 * rcpPowScale);\n\t\toffset.y = bRes && (offset.y < 2.0*a) ? a : offset.y;\n\t}\n\telse if( face == 3) {\n\t\tr = vec3(direction.x, direction.z, direction.y);\n\t\toffset = vec2(0.0+mipOffset,0.5 * rcpPowScale);\n\t\toffset.y = bRes && (offset.y < 2.0*a) ? 0.0 : offset.y;\n\t}\n\telse if( face == 4) {\n\t\tr = vec3(direction.y, direction.x, -direction.z);\n\t\toffset = vec2(scale+mipOffset, 0.5 * rcpPowScale);\n\t\toffset.y = bRes && (offset.y < 2.0*a) ? 0.0 : offset.y;\n\t}\n\telse {\n\t\tr = vec3(direction.z, -direction.x, direction.y);\n\t\toffset = vec2(2.0*scale+mipOffset, 0.5 * rcpPowScale);\n\t\toffset.y = bRes && (offset.y < 2.0*a) ? 0.0 : offset.y;\n\t}\n\tr = normalize(r);\n\tfloat texelOffset = 0.5 * cubeUV_rcpTextureSize;\n\tvec2 s = ( r.yz / abs( r.x ) + vec2( 1.0 ) ) * 0.5;\n\tvec2 base = offset + vec2( texelOffset );\n\treturn base + s * ( scale - 2.0 * texelOffset );\n}\n#define cubeUV_maxLods3 (log2(cubeUV_textureSize*0.25) - 3.0)\nvec4 textureCubeUV( sampler2D envMap, vec3 reflectedDirection, float roughness ) {\n\tfloat roughnessVal = roughness* cubeUV_maxLods3;\n\tfloat r1 = floor(roughnessVal);\n\tfloat r2 = r1 + 1.0;\n\tfloat t = fract(roughnessVal);\n\tvec2 mipInfo = MipLevelInfo(reflectedDirection, r1, roughness);\n\tfloat s = mipInfo.y;\n\tfloat level0 = mipInfo.x;\n\tfloat level1 = level0 + 1.0;\n\tlevel1 = level1 > 5.0 ? 5.0 : level1;\n\tlevel0 += min( floor( s + 0.5 ), 5.0 );\n\tvec2 uv_10 = getCubeUV(reflectedDirection, r1, level0);\n\tvec4 color10 = envMapTexelToLinear(texture2D(envMap, uv_10));\n\tvec2 uv_20 = getCubeUV(reflectedDirection, r2, level0);\n\tvec4 color20 = envMapTexelToLinear(texture2D(envMap, uv_20));\n\tvec4 result = mix(color10, color20, t);\n\treturn vec4(result.rgb, 1.0);\n}\n#endif\n";
    const defaultnormal_vertex = "vec3 transformedNormal = normalMatrix * objectNormal;\n#ifdef FLIP_SIDED\n\ttransformedNormal = - transformedNormal;\n#endif\n";
    const displacementmap_pars_vertex = "#ifdef USE_DISPLACEMENTMAP\n\tuniform sampler2D displacementMap;\n\tuniform float displacementScale;\n\tuniform float displacementBias;\n#endif\n";
    const displacementmap_vertex = "#ifdef USE_DISPLACEMENTMAP\n\ttransformed += normalize( objectNormal ) * ( texture2D( displacementMap, uv ).x * displacementScale + displacementBias );\n#endif\n";
    const dithering_fragment = "#if defined( DITHERING )\n  gl_FragColor.rgb = dithering( gl_FragColor.rgb );\n#endif\n";
    const dithering_pars_fragment = "#if defined( DITHERING )\n\tvec3 dithering( vec3 color ) {\n\t\tfloat grid_position = rand( gl_FragCoord.xy );\n\t\tvec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );\n\t\tdither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );\n\t\treturn color + dither_shift_RGB;\n\t}\n#endif\n";
    const emissivemap_fragment = "#ifdef USE_EMISSIVEMAP\n\tvec4 emissiveColor = texture2D( emissiveMap, vUv );\n\temissiveColor.rgb = emissiveMapTexelToLinear( emissiveColor ).rgb;\n\ttotalEmissiveRadiance *= emissiveColor.rgb;\n#endif\n";
    const emissivemap_pars_fragment = "#ifdef USE_EMISSIVEMAP\n\tuniform sampler2D emissiveMap;\n#endif\n";
    const encodings_fragment = "  gl_FragColor = linearToOutputTexel( gl_FragColor );\n";
    const encodings_pars_fragment = "\nvec4 LinearToLinear( in vec4 value ) {\n\treturn value;\n}\nvec4 GammaToLinear( in vec4 value, in float gammaFactor ) {\n\treturn vec4( pow( value.xyz, vec3( gammaFactor ) ), value.w );\n}\nvec4 LinearToGamma( in vec4 value, in float gammaFactor ) {\n\treturn vec4( pow( value.xyz, vec3( 1.0 / gammaFactor ) ), value.w );\n}\nvec4 sRGBToLinear( in vec4 value ) {\n\treturn vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.w );\n}\nvec4 LinearTosRGB( in vec4 value ) {\n\treturn vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.w );\n}\nvec4 RGBEToLinear( in vec4 value ) {\n\treturn vec4( value.rgb * exp2( value.a * 255.0 - 128.0 ), 1.0 );\n}\nvec4 LinearToRGBE( in vec4 value ) {\n\tfloat maxComponent = max( max( value.r, value.g ), value.b );\n\tfloat fExp = clamp( ceil( log2( maxComponent ) ), -128.0, 127.0 );\n\treturn vec4( value.rgb / exp2( fExp ), ( fExp + 128.0 ) / 255.0 );\n}\nvec4 RGBMToLinear( in vec4 value, in float maxRange ) {\n\treturn vec4( value.xyz * value.w * maxRange, 1.0 );\n}\nvec4 LinearToRGBM( in vec4 value, in float maxRange ) {\n\tfloat maxRGB = max( value.x, max( value.g, value.b ) );\n\tfloat M      = clamp( maxRGB / maxRange, 0.0, 1.0 );\n\tM            = ceil( M * 255.0 ) / 255.0;\n\treturn vec4( value.rgb / ( M * maxRange ), M );\n}\nvec4 RGBDToLinear( in vec4 value, in float maxRange ) {\n\treturn vec4( value.rgb * ( ( maxRange / 255.0 ) / value.a ), 1.0 );\n}\nvec4 LinearToRGBD( in vec4 value, in float maxRange ) {\n\tfloat maxRGB = max( value.x, max( value.g, value.b ) );\n\tfloat D      = max( maxRange / maxRGB, 1.0 );\n\tD            = min( floor( D ) / 255.0, 1.0 );\n\treturn vec4( value.rgb * ( D * ( 255.0 / maxRange ) ), D );\n}\nconst mat3 cLogLuvM = mat3( 0.2209, 0.3390, 0.4184, 0.1138, 0.6780, 0.7319, 0.0102, 0.1130, 0.2969 );\nvec4 LinearToLogLuv( in vec4 value )  {\n\tvec3 Xp_Y_XYZp = value.rgb * cLogLuvM;\n\tXp_Y_XYZp = max(Xp_Y_XYZp, vec3(1e-6, 1e-6, 1e-6));\n\tvec4 vResult;\n\tvResult.xy = Xp_Y_XYZp.xy / Xp_Y_XYZp.z;\n\tfloat Le = 2.0 * log2(Xp_Y_XYZp.y) + 127.0;\n\tvResult.w = fract(Le);\n\tvResult.z = (Le - (floor(vResult.w*255.0))/255.0)/255.0;\n\treturn vResult;\n}\nconst mat3 cLogLuvInverseM = mat3( 6.0014, -2.7008, -1.7996, -1.3320, 3.1029, -5.7721, 0.3008, -1.0882, 5.6268 );\nvec4 LogLuvToLinear( in vec4 value ) {\n\tfloat Le = value.z * 255.0 + value.w;\n\tvec3 Xp_Y_XYZp;\n\tXp_Y_XYZp.y = exp2((Le - 127.0) / 2.0);\n\tXp_Y_XYZp.z = Xp_Y_XYZp.y / value.y;\n\tXp_Y_XYZp.x = value.x * Xp_Y_XYZp.z;\n\tvec3 vRGB = Xp_Y_XYZp.rgb * cLogLuvInverseM;\n\treturn vec4( max(vRGB, 0.0), 1.0 );\n}\n";
    const envmap_fragment = "#ifdef USE_ENVMAP\n\t#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG )\n\t\tvec3 cameraToVertex = normalize( vWorldPosition - cameraPosition );\n\t\tvec3 worldNormal = inverseTransformDirection( normal, viewMatrix );\n\t\t#ifndef ENVMAP_MODE_REFRACTION\n\t\t\tvec3 reflectVec = reflect( cameraToVertex, worldNormal );\n\t\t#else\n\t\t\tvec3 reflectVec = refract( cameraToVertex, worldNormal, refractionRatio );\n\t\t#endif\n\t#else\n\t\tvec3 reflectVec = vReflect;\n\t#endif\n\t#ifdef ENVMAP_TYPE_CUBE\n\t\tvec4 envColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );\n\t#elif defined( ENVMAP_TYPE_EQUIREC )\n\t\tvec2 sampleUV;\n\t\treflectVec = normalize( reflectVec );\n\t\tsampleUV.y = asin( clamp( reflectVec.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;\n\t\tsampleUV.y = 1.0 - sampleUV.y;\n\t\tsampleUV.x = atan( reflectVec.z, reflectVec.x ) * RECIPROCAL_PI2 + 0.5;\n\t\tvec4 envColor = texture2D( envMap, sampleUV );\n\t#elif defined( ENVMAP_TYPE_SPHERE )\n\t\treflectVec = normalize( reflectVec );\n\t\t\n\t\tvec3 reflectView = normalize( ( viewMatrix * vec4( reflectVec, 0.0 ) ).xyz + vec3( 0.0, 0.0, -1.0 ) );\n\t\treflectView = vec3(reflectView.x * 0.5 + 0.5, 1.0 - (reflectView.y * 0.5 + 0.5), 0.0);\n\t\tvec4 envColor = texture2D( envMap, reflectView.xy);\n\t#else\n\t\tvec4 envColor = vec4( 0.0 );\n\t#endif\n\tenvColor = envMapTexelToLinear( envColor );\n\t#ifdef ENVMAP_BLENDING_MULTIPLY\n\t\toutgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );\n\t#elif defined( ENVMAP_BLENDING_MIX )\n\t\toutgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );\n\t#elif defined( ENVMAP_BLENDING_ADD )\n\t\toutgoingLight += envColor.xyz * specularStrength * reflectivity;\n\t#endif\n#endif\n";
    const envmap_pars_fragment = "#if defined( USE_ENVMAP ) || defined( PHYSICAL )\n\tuniform float reflectivity;\n\tuniform float envMapIntensity;\n#endif\n#ifdef USE_ENVMAP\n\t#if ! defined( PHYSICAL ) && ( defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) )\n\t\tvarying vec3 vWorldPosition;\n\t#endif\n\t#ifdef ENVMAP_TYPE_CUBE\n\t\tuniform samplerCube envMap;\n\t#else\n\t\tuniform sampler2D envMap;\n\t#endif\n\tuniform float flipEnvMap;\n\tuniform int maxMipLevel;\n\t#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( PHYSICAL )\n\t\tuniform float refractionRatio;\n\t#else\n\t\tvarying vec3 vReflect;\n\t#endif\n#endif\n";
    const envmap_pars_vertex = "#ifdef USE_ENVMAP\n\t#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG )\n\t\tvarying vec3 vWorldPosition;\n\t#else\n\t\tvarying vec3 vReflect;\n\t\tuniform float refractionRatio;\n\t#endif\n#endif\n";
    const envmap_physical_pars_fragment = "#if defined( USE_ENVMAP ) && defined( PHYSICAL )\n\tvec3 getLightProbeIndirectIrradiance(\n const in GeometricContext geometry, const in int maxMIPLevel ) {\n\t\tvec3 worldNormal = inverseTransformDirection( geometry.normal, viewMatrix );\n\t\t#ifdef ENVMAP_TYPE_CUBE\n\t\t\tvec3 queryVec = vec3( flipEnvMap * worldNormal.x, worldNormal.yz );\n\t\t\t#ifdef TEXTURE_LOD_EXT\n\t\t\t\tvec4 envMapColor = textureCubeLodEXT( envMap, queryVec, float( maxMIPLevel ) );\n\t\t\t#else\n\t\t\t\tvec4 envMapColor = textureCube( envMap, queryVec, float( maxMIPLevel ) );\n\t\t\t#endif\n\t\t\tenvMapColor.rgb = envMapTexelToLinear( envMapColor ).rgb;\n\t\t#elif defined( ENVMAP_TYPE_CUBE_UV )\n\t\t\tvec3 queryVec = vec3( flipEnvMap * worldNormal.x, worldNormal.yz );\n\t\t\tvec4 envMapColor = textureCubeUV( envMap, queryVec, 1.0 );\n\t\t#else\n\t\t\tvec4 envMapColor = vec4( 0.0 );\n\t\t#endif\n\t\treturn PI * envMapColor.rgb * envMapIntensity;\n\t}\n\tfloat getSpecularMIPLevel( const in float blinnShininessExponent, const in int maxMIPLevel ) {\n\t\tfloat maxMIPLevelScalar = float( maxMIPLevel );\n\t\tfloat desiredMIPLevel = maxMIPLevelScalar + 0.79248 - 0.5 * log2( pow2( blinnShininessExponent ) + 1.0 );\n\t\treturn clamp( desiredMIPLevel, 0.0, maxMIPLevelScalar );\n\t}\n\tvec3 getLightProbeIndirectRadiance(\n const in GeometricContext geometry, const in float blinnShininessExponent, const in int maxMIPLevel ) {\n\t\t#ifndef ENVMAP_MODE_REFRACTION\n\t\t\tvec3 reflectVec = reflect( -geometry.viewDir, geometry.normal );\n\t\t#else\n\t\t\tvec3 reflectVec = refract( -geometry.viewDir, geometry.normal, refractionRatio );\n\t\t#endif\n\t\treflectVec = inverseTransformDirection( reflectVec, viewMatrix );\n\t\tfloat specularMIPLevel = getSpecularMIPLevel( blinnShininessExponent, maxMIPLevel );\n\t\t#ifdef ENVMAP_TYPE_CUBE\n\t\t\tvec3 queryReflectVec = vec3( flipEnvMap * reflectVec.x, reflectVec.yz );\n\t\t\t#ifdef TEXTURE_LOD_EXT\n\t\t\t\tvec4 envMapColor = textureCubeLodEXT( envMap, queryReflectVec, specularMIPLevel );\n\t\t\t#else\n\t\t\t\tvec4 envMapColor = textureCube( envMap, queryReflectVec, specularMIPLevel );\n\t\t\t#endif\n\t\t\tenvMapColor.rgb = envMapTexelToLinear( envMapColor ).rgb;\n\t\t#elif defined( ENVMAP_TYPE_CUBE_UV )\n\t\t\tvec3 queryReflectVec = vec3( flipEnvMap * reflectVec.x, reflectVec.yz );\n\t\t\tvec4 envMapColor = textureCubeUV( envMap, queryReflectVec, BlinnExponentToGGXRoughness(blinnShininessExponent ));\n\t\t#elif defined( ENVMAP_TYPE_EQUIREC )\n\t\t\tvec2 sampleUV;\n\t\t\tsampleUV.y = asin( clamp( reflectVec.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;\n\t\t\tsampleUV.x = atan( reflectVec.z, reflectVec.x ) * RECIPROCAL_PI2 + 0.5;\n\t\t\t#ifdef TEXTURE_LOD_EXT\n\t\t\t\tvec4 envMapColor = texture2DLodEXT( envMap, sampleUV, specularMIPLevel );\n\t\t\t#else\n\t\t\t\tvec4 envMapColor = texture2D( envMap, sampleUV, specularMIPLevel );\n\t\t\t#endif\n\t\t\tenvMapColor.rgb = envMapTexelToLinear( envMapColor ).rgb;\n\t\t#elif defined( ENVMAP_TYPE_SPHERE )\n\t\t\t\n\t\t\tvec3 reflectView = normalize( ( viewMatrix * vec4( reflectVec, 0.0 ) ).xyz + vec3( 0.0, 0.0, -1.0 ) );\n\t\t\treflectView = vec3(reflectView.x * 0.5 + 0.5, 1.0 - (reflectView.y * 0.5 + 0.5), 0.0);\n\t\t\t#ifdef TEXTURE_LOD_EXT\n\t\t\t\tvec4 envMapColor = texture2DLodEXT( envMap, reflectView.xy, specularMIPLevel );\n\t\t\t#else\n\t\t\t\tvec4 envMapColor = texture2D( envMap, reflectView.xy, specularMIPLevel );\n\t\t\t#endif\n\t\t\tenvMapColor.rgb = envMapTexelToLinear( envMapColor ).rgb;\n\t\t#endif\n\t\treturn envMapColor.rgb * envMapIntensity;\n\t}\n#endif\n";
    const envmap_vertex = "#ifdef USE_ENVMAP\n\t#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG )\n\t\tvWorldPosition = worldPosition.xyz;\n\t#else\n\t\tvec3 cameraToVertex = normalize( worldPosition.xyz - cameraPosition );\n\t\tvec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );\n\t\t#ifndef ENVMAP_MODE_REFRACTION\n\t\t\tvReflect = reflect( cameraToVertex, worldNormal );\n\t\t#else\n\t\t\tvReflect = refract( cameraToVertex, worldNormal, refractionRatio );\n\t\t#endif\n\t#endif\n#endif\n";
    const fog_fragment = "#ifdef USE_FOG\n\tfloat fogDepth = length( vFogPosition );\n\t#ifdef FOG_EXP2\n\t\tfloat fogFactor = whiteCompliment( exp2( - fogDensity * fogDensity * fogDepth * fogDepth * LOG2 ) );\n\t#else\n\t\tfloat fogFactor = smoothstep( fogNear, fogFar, fogDepth );\n\t#endif\n\tgl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );\n#endif\n";
    const fog_pars_fragment = "#ifdef USE_FOG\n\tuniform vec3 fogColor;\n\tvarying vec3 vFogPosition;\n\t#ifdef FOG_EXP2\n\t\tuniform float fogDensity;\n\t#else\n\t\tuniform float fogNear;\n\t\tuniform float fogFar;\n\t#endif\n#endif\n";
    const fog_pars_vertex = "#ifdef USE_FOG\n\tvarying vec3 vFogPosition;\n#endif\n";
    const fog_vertex = "#ifdef USE_FOG\n\tvFogPosition = mvPosition.xyz;\n#endif\n";
    const gradientmap_pars_fragment = "#ifdef TOON\n\tuniform sampler2D gradientMap;\n\tvec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {\n\t\tfloat dotNL = dot( normal, lightDirection );\n\t\tvec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );\n\t\t#ifdef USE_GRADIENTMAP\n\t\t\treturn texture2D( gradientMap, coord ).rgb;\n\t\t#else\n\t\t\treturn ( coord.x < 0.7 ) ? vec3( 0.7 ) : vec3( 1.0 );\n\t\t#endif\n\t}\n#endif\n";
    const lightmap_fragment = "#ifdef USE_LIGHTMAP\n\treflectedLight.indirectDiffuse += PI * texture2D( lightMap, vUv2 ).xyz * lightMapIntensity;\n#endif\n";
    const lightmap_pars_fragment = "#ifdef USE_LIGHTMAP\n\tuniform sampler2D lightMap;\n\tuniform float lightMapIntensity;\n#endif";
    const lights_fragment_begin = "\nGeometricContext geometry;\ngeometry.position = - vViewPosition;\ngeometry.normal = normal;\ngeometry.viewDir = normalize( vViewPosition );\nIncidentLight directLight;\n#if (NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )\n\tPointLight pointLight;\n\t#pragma unroll_loop\n\tfor ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {\n\t\tpointLight.position = vec3(pointLights[ i  * 15 + 0], pointLights[ i  * 15 + 1], pointLights[ i  * 15 + 2]);\n\t\tpointLight.color = vec3(pointLights[ i  * 15 + 3], pointLights[ i  * 15 + 4], pointLights[ i  * 15 + 5]);\n\t\tpointLight.distance = pointLights[ i  * 15 + 6];\n\t\tpointLight.decay = pointLights[ i  * 15 + 7];\n\t\tgetPointDirectLightIrradiance( pointLight, geometry, directLight );\n\t\t#ifdef USE_SHADOWMAP\n\t\tpointLight.shadow = int(pointLights[ i  * 15 + 8]);\n\t\tpointLight.shadowBias = pointLights[ i  * 15 + 9];\n\t\tpointLight.shadowRadius = pointLights[ i  * 15 + 10];\n\t\tpointLight.shadowMapSize = vec2(pointLights[ i  * 15 + 11], pointLights[ i  * 15 + 12]);\n\t\tpointLight.shadowCameraNear = pointLights[ i  * 15 + 13];\n\t\tpointLight.shadowCameraFar = pointLights[ i  * 15 + 14];\n\t\tdirectLight.color *= all( bvec2( pointLight.shadow, directLight.visible ) ) ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;\n\t\t#endif\n\t\tRE_Direct( directLight, geometry, material, reflectedLight );\n\t}\n#endif\n#if (NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )\n\tSpotLight spotLight;\n\t#pragma unroll_loop\n\tfor ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {\n\t\tspotLight.position = vec3(spotLights[ i  * 18 + 0], spotLights[ i  * 18 + 1], spotLights[ i  * 18 + 2]);\n\t\tspotLight.direction = vec3(spotLights[ i  * 18 + 3], spotLights[ i  * 18 + 4], spotLights[ i  * 18 + 5]);\n\t\tspotLight.color = vec3(spotLights[ i  * 18 + 6], spotLights[ i  * 18 + 7], spotLights[ i  * 18 + 8]);\n\t\tspotLight.distance = spotLights[ i  * 18 + 9];\n\t\tspotLight.decay = spotLights[ i  * 18 + 10];\n\t\tspotLight.coneCos = spotLights[ i  * 18 + 11];\n\t\tspotLight.penumbraCos = spotLights[ i  * 18 + 12];\n\t\tgetSpotDirectLightIrradiance( spotLight, geometry, directLight );\n\t\t#ifdef USE_SHADOWMAP\n\t\t\n\t\tspotLight.shadow = int(spotLights[ i  * 18 + 13]);\n\t\tspotLight.shadowBias = spotLights[ i  * 18 + 14];\n\t\tspotLight.shadowRadius = spotLights[ i  * 18 + 15];\n\t\tspotLight.shadowMapSize = vec2(spotLights[ i  * 18 + 16], spotLights[ i  * 18 + 17]);\n\t\tdirectLight.color *= all( bvec2( spotLight.shadow, directLight.visible ) ) ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotShadowCoord[ i ] ) : 1.0;\n\t\t#endif\n\t\tRE_Direct( directLight, geometry, material, reflectedLight );\n\t}\n#endif\n#if (NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )\n\tDirectionalLight directionalLight;\n\t#pragma unroll_loop\n\tfor ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {\n\t\tdirectionalLight.direction = vec3(directionalLights[ i  * 11 + 0], directionalLights[ i  * 11 + 1], directionalLights[ i  * 11 + 2]);\n\t\tdirectionalLight.color = vec3(directionalLights[ i  * 11 + 3], directionalLights[ i  * 11 + 4], directionalLights[ i  * 11 + 5]);\n\t\tgetDirectionalDirectLightIrradiance( directionalLight, geometry, directLight );\n\t\t#ifdef USE_SHADOWMAP\n\t\tdirectionalLight.shadow = int(directionalLights[ i  * 11 + 6]);\n\t\tdirectionalLight.shadowBias = directionalLights[ i  * 11 + 7];\n\t\tdirectionalLight.shadowRadius = directionalLights[ i  * 11 + 8];\n\t\tdirectionalLight.shadowMapSize = vec2(directionalLights[ i  * 11 + 9], directionalLights[ i  * 11 + 10]);\n\t\tdirectLight.color *= all( bvec2( directionalLight.shadow, directLight.visible ) ) ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;\n\t\t#endif\n\t\tRE_Direct( directLight, geometry, material, reflectedLight );\n\t}\n#endif\n#if (NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )\n\tRectAreaLight rectAreaLight;\n\t#pragma unroll_loop\n\tfor ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {\n\t\trectAreaLight.position = vec3(rectAreaLights[ i  * 12 + 0], rectAreaLights[ i  * 12 + 1], rectAreaLights[ i  * 12 + 2]);\n\t\trectAreaLight.color = vec3(rectAreaLights[ i  * 12 + 3], rectAreaLights[ i  * 12 + 4], rectAreaLights[ i  * 12 + 5]);\n\t\trectAreaLight.halfWidth = vec3(rectAreaLights[ i  * 12 + 6], rectAreaLights[ i  * 12 + 7], rectAreaLights[ i  * 12 + 8]);\n\t\trectAreaLight.halfHeight = vec3(rectAreaLights[ i  * 12 + 9], rectAreaLights[ i  * 12 + 10], rectAreaLights[ i  * 12 + 11]);\n\t\tRE_Direct_RectArea( rectAreaLight, geometry, material, reflectedLight );\n\t}\n#endif\n#if defined( RE_IndirectDiffuse )\n\tvec3 irradiance = getAmbientLightIrradiance( ambientLightColor );\n\t#if (NUM_HEMI_LIGHTS > 0 )\n\t\t\n\t\tHemisphereLight hemisphereLight;\n\t\t#pragma unroll_loop\n\t\tfor ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {\n\t\t\themisphereLight.direction = vec3(hemisphereLights[ i  * 9 + 0], hemisphereLights[ i  * 9 + 1], hemisphereLights[ i  * 9 + 2]);\n\t\t\themisphereLight.skyColor = vec3(hemisphereLights[ i  * 9 + 3], hemisphereLights[ i  * 9 + 4], hemisphereLights[ i  * 9 + 5]);\n\t\t\themisphereLight.groundColor = vec3(hemisphereLights[ i  * 9 + 6], hemisphereLights[ i  * 9 + 7], hemisphereLights[ i  * 9 + 8]);\n\t\t\tirradiance += getHemisphereLightIrradiance( hemisphereLight, geometry );\n\t\t}\n\t#endif\n#endif\n#if defined( RE_IndirectSpecular )\n\tvec3 radiance = vec3( 0.0 );\n\tvec3 clearCoatRadiance = vec3( 0.0 );\n#endif\n";
    const lights_fragment_end = "#if defined( RE_IndirectDiffuse )\n\tRE_IndirectDiffuse( irradiance, geometry, material, reflectedLight );\n#endif\n#if defined( RE_IndirectSpecular )\n\tRE_IndirectSpecular( radiance, clearCoatRadiance, geometry, material, reflectedLight );\n#endif\n";
    const lights_fragment_maps = "#if defined( RE_IndirectDiffuse )\n\t#ifdef USE_LIGHTMAP\n\t\tvec3 lightMapIrradiance = texture2D( lightMap, vUv2 ).xyz * lightMapIntensity;\n\t\t#ifndef PHYSICALLY_CORRECT_LIGHTS\n\t\t\tlightMapIrradiance *= PI;\n\t\t#endif\n\t\tirradiance += lightMapIrradiance;\n\t#endif\n\t#if defined( USE_ENVMAP ) && defined( PHYSICAL ) && defined( ENVMAP_TYPE_CUBE_UV )\n\t\tirradiance += getLightProbeIndirectIrradiance(\n geometry, maxMipLevel );\n\t#endif\n#endif\n#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )\n\tradiance += getLightProbeIndirectRadiance(\n geometry, Material_BlinnShininessExponent( material ), maxMipLevel );\n\t#ifndef STANDARD\n\t\tclearCoatRadiance += getLightProbeIndirectRadiance(\n geometry, Material_ClearCoat_BlinnShininessExponent( material ), maxMipLevel );\n\t#endif\n#endif\n";
    const lights_lambert_vertex = "vec3 diffuse = vec3( 1.0 );\nGeometricContext geometry;\ngeometry.position = mvPosition.xyz;\ngeometry.normal = normalize( transformedNormal );\ngeometry.viewDir = normalize( -mvPosition.xyz );\nGeometricContext backGeometry;\nbackGeometry.position = geometry.position;\nbackGeometry.normal = -geometry.normal;\nbackGeometry.viewDir = geometry.viewDir;\nvLightFront = vec3( 0.0 );\n#ifdef DOUBLE_SIDED\n\tvLightBack = vec3( 0.0 );\n#endif\nIncidentLight directLight;\nfloat dotNL;\nvec3 directLightColor_Diffuse;\n#if NUM_POINT_LIGHTS > 0\n\tPointLight pointLight;\n\t#pragma unroll_loop\n\tfor ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {\n\t\tpointLight.position = vec3(pointLights[ i  * 15 + 0], pointLights[ i  * 15 + 1], pointLights[ i  * 15 + 2]);\n\t\tpointLight.color = vec3(pointLights[ i  * 15 + 3], pointLights[ i  * 15 + 4], pointLights[ i  * 15 + 5]);\n\t\tpointLight.distance = pointLights[ i  * 15 + 6];\n\t\tpointLight.decay = pointLights[ i  * 15 + 7];\n\t\tgetPointDirectLightIrradiance( pointLight, geometry, directLight );\n\t\tdotNL = dot( geometry.normal, directLight.direction );\n\t\tdirectLightColor_Diffuse = PI * directLight.color;\n\t\tvLightFront += saturate( dotNL ) * directLightColor_Diffuse;\n\t\t#ifdef DOUBLE_SIDED\n\t\t\tvLightBack += saturate( -dotNL ) * directLightColor_Diffuse;\n\t\t#endif\n\t}\n#endif\n#if NUM_SPOT_LIGHTS > 0\n\tSpotLight spotLight;\n\t#pragma unroll_loop\n\tfor ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {\n\t\tspotLight.position = vec3(spotLights[ i  * 18 + 0], spotLights[ i  * 18 + 1], spotLights[ i  * 18 + 2]);\n\t\tspotLight.direction = vec3(spotLights[ i  * 18 + 3], spotLights[ i  * 18 + 4], spotLights[ i  * 18 + 5]);\n\t\tspotLight.color = vec3(spotLights[ i  * 18 + 6], spotLights[ i  * 18 + 7], spotLights[ i  * 18 + 8]);\n\t\tspotLight.distance = spotLights[ i  * 18 + 9];\n\t\tspotLight.decay = spotLights[ i  * 18 + 10];\n\t\tspotLight.coneCos = spotLights[ i  * 18 + 11];\n\t\tspotLight.penumbraCos = spotLights[ i  * 18 + 12];\n\t\tgetSpotDirectLightIrradiance( spotLight, geometry, directLight );\n\t\tdotNL = dot( geometry.normal, directLight.direction );\n\t\tdirectLightColor_Diffuse = PI * directLight.color;\n\t\tvLightFront += saturate( dotNL ) * directLightColor_Diffuse;\n\t\t#ifdef DOUBLE_SIDED\n\t\t\tvLightBack += saturate( -dotNL ) * directLightColor_Diffuse;\n\t\t#endif\n\t}\n#endif\n#if NUM_DIR_LIGHTS > 0\n\tDirectionalLight directionalLight;\n\t#pragma unroll_loop\n\tfor ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {\n\t\tdirectionalLight.direction = vec3(directionalLights[ i  * 11 + 0], directionalLights[ i  * 11 + 1], directionalLights[ i  * 11 + 2]);\n\t\tdirectionalLight.color = vec3(directionalLights[ i  * 11 + 3], directionalLights[ i  * 11 + 4], directionalLights[ i  * 11 + 5]);\n\t\tgetDirectionalDirectLightIrradiance( directionalLight, geometry, directLight );\n\t\tdotNL = dot( geometry.normal, directLight.direction );\n\t\tdirectLightColor_Diffuse = PI * directLight.color;\n\t\tvLightFront += saturate( dotNL ) * directLightColor_Diffuse;\n\t\t#ifdef DOUBLE_SIDED\n\t\t\tvLightBack += saturate( -dotNL ) * directLightColor_Diffuse;\n\t\t#endif\n\t}\n#endif\n#if NUM_HEMI_LIGHTS > 0\n\tHemisphereLight hemisphereLight;\n\t\n\t#pragma unroll_loop\n\tfor ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {\n\t\themisphereLight.direction = vec3(hemisphereLights[ i  * 9 + 0], hemisphereLights[ i  * 9 + 1], hemisphereLights[ i  * 9 + 2]);\n\t\themisphereLight.skyColor = vec3(hemisphereLights[ i  * 9 + 3], hemisphereLights[ i  * 9 + 4], hemisphereLights[ i  * 9 + 5]);\n\t\themisphereLight.groundColor = vec3(hemisphereLights[ i  * 9 + 6], hemisphereLights[ i  * 9 + 7], hemisphereLights[ i  * 9 + 8]);\n\t\tvLightFront += getHemisphereLightIrradiance( hemisphereLight, geometry );\n\t\t#ifdef DOUBLE_SIDED\n\t\t\tvLightBack += getHemisphereLightIrradiance( hemisphereLight, backGeometry );\n\t\t#endif\n\t}\n#endif\n";
    const lights_pars_begin = "uniform vec3 ambientLightColor;\nvec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {\n\tvec3 irradiance = ambientLightColor;\n\t#ifndef PHYSICALLY_CORRECT_LIGHTS\n\t\tirradiance *= PI;\n\t#endif\n\treturn irradiance;\n}\n#if NUM_DIR_LIGHTS > 0\n\tstruct DirectionalLight {\n\t\tvec3 direction;\n\t\tvec3 color;\n\t\tint shadow;\n\t\tfloat shadowBias;\n\t\tfloat shadowRadius;\n\t\tvec2 shadowMapSize;\n\t};\n\tuniform float directionalLights[NUM_DIR_LIGHTS * 11];\n\tvoid getDirectionalDirectLightIrradiance( const in DirectionalLight directionalLight, const in GeometricContext geometry, out IncidentLight directLight ) {\n\t\tdirectLight.direction = directionalLight.direction;\n\t\tdirectLight.color = directionalLight.color;\n\t\tdirectLight.visible = true;\n\t}\n#endif\n#if NUM_POINT_LIGHTS > 0\n\tstruct PointLight {\n\t\tvec3 position;\n\t\tvec3 color;\n\t\tfloat distance;\n\t\tfloat decay;\n\t\tint shadow;\n\t\tfloat shadowBias;\n\t\tfloat shadowRadius;\n\t\tvec2 shadowMapSize;\n\t\tfloat shadowCameraNear;\n\t\tfloat shadowCameraFar;\n\t};\n\tuniform float pointLights[NUM_POINT_LIGHTS * 15 ];\n\tvoid getPointDirectLightIrradiance( const in PointLight pointLight, const in GeometricContext geometry, out IncidentLight directLight ) {\n\t\tvec3 lVector = pointLight.position - geometry.position;\n\t\tdirectLight.direction = normalize( lVector );\n\t\tfloat lightDistance = length( lVector );\n\t\tdirectLight.color = pointLight.color;\n\t\tdirectLight.color *= punctualLightIntensityToIrradianceFactor( lightDistance, pointLight.distance, pointLight.decay );\n\t\tdirectLight.visible = ( directLight.color != vec3( 0.0 ) );\n\t}\n#endif\n#if NUM_SPOT_LIGHTS > 0\n\tstruct SpotLight {\n\t\tvec3 position;\n\t\tvec3 direction;\n\t\tvec3 color;\n\t\tfloat distance;\n\t\tfloat decay;\n\t\tfloat coneCos;\n\t\tfloat penumbraCos;\n\t\tint shadow;\n\t\tfloat shadowBias;\n\t\tfloat shadowRadius;\n\t\tvec2 shadowMapSize;\n\t};\n\tuniform float spotLights[NUM_SPOT_LIGHTS * 18];\n\tvoid getSpotDirectLightIrradiance( const in SpotLight spotLight, const in GeometricContext geometry, out IncidentLight directLight  ) {\n\t\tvec3 lVector = spotLight.position - geometry.position;\n\t\tdirectLight.direction = normalize( lVector );\n\t\tfloat lightDistance = length( lVector );\n\t\tfloat angleCos = dot( directLight.direction, spotLight.direction );\n\t\tif ( angleCos > spotLight.coneCos ) {\n\t\t\tfloat spotEffect = smoothstep( spotLight.coneCos, spotLight.penumbraCos, angleCos );\n\t\t\tdirectLight.color = spotLight.color;\n\t\t\tdirectLight.color *= spotEffect * punctualLightIntensityToIrradianceFactor( lightDistance, spotLight.distance, spotLight.decay );\n\t\t\tdirectLight.visible = true;\n\t\t} else {\n\t\t\tdirectLight.color = vec3( 0.0 );\n\t\t\tdirectLight.visible = false;\n\t\t}\n\t}\n#endif\n#if NUM_RECT_AREA_LIGHTS > 0\n\tstruct RectAreaLight {\n\t\tvec3 color;\n\t\tvec3 position;\n\t\tvec3 halfWidth;\n\t\tvec3 halfHeight;\n\t};\n\tuniform sampler2D ltc_1;\n\tuniform sampler2D ltc_2;\n\tuniform float rectAreaLights[ NUM_RECT_AREA_LIGHTS * 12 ];\n#endif\n#if NUM_HEMI_LIGHTS > 0\n\tstruct HemisphereLight {\n\t\tvec3 direction;\n\t\tvec3 skyColor;\n\t\tvec3 groundColor;\n\t};\n\tuniform float hemisphereLights[ NUM_HEMI_LIGHTS * 9 ];\n\tvec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in GeometricContext geometry ) {\n\t\tfloat dotNL = dot( geometry.normal, hemiLight.direction );\n\t\tfloat hemiDiffuseWeight = 0.5 * dotNL + 0.5;\n\t\tvec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );\n\t\t#ifndef PHYSICALLY_CORRECT_LIGHTS\n\t\t\tirradiance *= PI;\n\t\t#endif\n\t\treturn irradiance;\n\t}\n#endif\n";
    const lights_pars_maps = "#if defined( USE_ENVMAP ) && defined( PHYSICAL )\n\tvec3 getLightProbeIndirectIrradiance(\n const in GeometricContext geometry, const in int maxMIPLevel ) {\n\t\tvec3 worldNormal = inverseTransformDirection( geometry.normal, viewMatrix );\n\t\t#ifdef ENVMAP_TYPE_CUBE\n\t\t\tvec3 queryVec = vec3( flipEnvMap * worldNormal.x, worldNormal.yz );\n\t\t\t#ifdef TEXTURE_LOD_EXT\n\t\t\t\tvec4 envMapColor = textureCubeLodEXT( envMap, queryVec, float( maxMIPLevel ) );\n\t\t\t#else\n\t\t\t\tvec4 envMapColor = textureCube( envMap, queryVec, float( maxMIPLevel ) );\n\t\t\t#endif\n\t\t\tenvMapColor.rgb = envMapTexelToLinear( envMapColor ).rgb;\n\t\t#elif defined( ENVMAP_TYPE_CUBE_UV )\n\t\t\tvec3 queryVec = vec3( flipEnvMap * worldNormal.x, worldNormal.yz );\n\t\t\tvec4 envMapColor = textureCubeUV( queryVec, 1.0 );\n\t\t#else\n\t\t\tvec4 envMapColor = vec4( 0.0 );\n\t\t#endif\n\t\treturn PI * envMapColor.rgb * envMapIntensity;\n\t}\n\tfloat getSpecularMIPLevel( const in float blinnShininessExponent, const in int maxMIPLevel ) {\n\t\tfloat maxMIPLevelScalar = float( maxMIPLevel );\n\t\tfloat desiredMIPLevel = maxMIPLevelScalar + 0.79248 - 0.5 * log2( pow2( blinnShininessExponent ) + 1.0 );\n\t\treturn clamp( desiredMIPLevel, 0.0, maxMIPLevelScalar );\n\t}\n\tvec3 getLightProbeIndirectRadiance(\n const in GeometricContext geometry, const in float blinnShininessExponent, const in int maxMIPLevel ) {\n\t\t#ifndef ENVMAP_MODE_REFRACTION\n\t\t\tvec3 reflectVec = reflect( -geometry.viewDir, geometry.normal );\n\t\t#else\n\t\t\tvec3 reflectVec = refract( -geometry.viewDir, geometry.normal, refractionRatio );\n\t\t#endif\n\t\treflectVec = inverseTransformDirection( reflectVec, viewMatrix );\n\t\tfloat specularMIPLevel = getSpecularMIPLevel( blinnShininessExponent, maxMIPLevel );\n\t\t#ifdef ENVMAP_TYPE_CUBE\n\t\t\tvec3 queryReflectVec = vec3( flipEnvMap * reflectVec.x, reflectVec.yz );\n\t\t\t#ifdef TEXTURE_LOD_EXT\n\t\t\t\tvec4 envMapColor = textureCubeLodEXT( envMap, queryReflectVec, specularMIPLevel );\n\t\t\t#else\n\t\t\t\tvec4 envMapColor = textureCube( envMap, queryReflectVec, specularMIPLevel );\n\t\t\t#endif\n\t\t\tenvMapColor.rgb = envMapTexelToLinear( envMapColor ).rgb;\n\t\t#elif defined( ENVMAP_TYPE_CUBE_UV )\n\t\t\tvec3 queryReflectVec = vec3( flipEnvMap * reflectVec.x, reflectVec.yz );\n\t\t\tvec4 envMapColor = textureCubeUV(queryReflectVec, BlinnExponentToGGXRoughness(blinnShininessExponent));\n\t\t#elif defined( ENVMAP_TYPE_EQUIREC )\n\t\t\tvec2 sampleUV;\n\t\t\tsampleUV.y = asin( clamp( reflectVec.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;\n\t\t\tsampleUV.x = atan( reflectVec.z, reflectVec.x ) * RECIPROCAL_PI2 + 0.5;\n\t\t\t#ifdef TEXTURE_LOD_EXT\n\t\t\t\tvec4 envMapColor = texture2DLodEXT( envMap, sampleUV, specularMIPLevel );\n\t\t\t#else\n\t\t\t\tvec4 envMapColor = texture2D( envMap, sampleUV, specularMIPLevel );\n\t\t\t#endif\n\t\t\tenvMapColor.rgb = envMapTexelToLinear( envMapColor ).rgb;\n\t\t#elif defined( ENVMAP_TYPE_SPHERE )\n\t\t\tvec3 reflectView = normalize( ( viewMatrix * vec4( reflectVec, 0.0 ) ).xyz + vec3( 0.0, 0.0, -1.0 ) );\n\t\t\treflectView = vec3(reflectView.x * 0.5 + 0.5, 1.0 - (reflectView.y * 0.5 + 0.5), 0.0);\n\t\t\t#ifdef TEXTURE_LOD_EXT\n\t\t\t\tvec4 envMapColor = texture2DLodEXT( envMap, reflectView.xy, specularMIPLevel );\n\t\t\t#else\n\t\t\t\tvec4 envMapColor = texture2D( envMap, reflectView.xy, specularMIPLevel );\n\t\t\t#endif\n\t\t\tenvMapColor.rgb = envMapTexelToLinear( envMapColor ).rgb;\n\t\t#endif\n\t\treturn envMapColor.rgb * envMapIntensity;\n\t}\n#endif\n";
    const lights_phong_fragment = "BlinnPhongMaterial material;\nmaterial.diffuseColor = diffuseColor.rgb;\nmaterial.specularColor = specular;\nmaterial.specularShininess = shininess;\nmaterial.specularStrength = specularStrength;\n";
    const lights_phong_pars_fragment = "varying vec3 vViewPosition;\n#ifndef FLAT_SHADED\n\tvarying vec3 vNormal;\n#endif\nstruct BlinnPhongMaterial {\n\tvec3\tdiffuseColor;\n\tvec3\tspecularColor;\n\tfloat\tspecularShininess;\n\tfloat\tspecularStrength;\n};\nvoid RE_Direct_BlinnPhong( const in IncidentLight directLight, const in GeometricContext geometry, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {\n\t#ifdef TOON\n\t\tvec3 irradiance = getGradientIrradiance( geometry.normal, directLight.direction ) * directLight.color;\n\t#else\n\t\tfloat dotNL = saturate( dot( geometry.normal, directLight.direction ) );\n\t\tvec3 irradiance = dotNL * directLight.color;\n\t#endif\n\t#ifndef PHYSICALLY_CORRECT_LIGHTS\n\t\tirradiance *= PI;\n\t#endif\n\treflectedLight.directDiffuse += irradiance * BRDF_Diffuse_Lambert( material.diffuseColor );\n\treflectedLight.directSpecular += irradiance * BRDF_Specular_BlinnPhong( directLight, geometry, material.specularColor, material.specularShininess ) * material.specularStrength;\n}\nvoid RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in GeometricContext geometry, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {\n\treflectedLight.indirectDiffuse += irradiance * BRDF_Diffuse_Lambert( material.diffuseColor );\n}\n#define RE_Direct\t\t\t\tRE_Direct_BlinnPhong\n#define RE_IndirectDiffuse\t\tRE_IndirectDiffuse_BlinnPhong\n#define Material_LightProbeLOD( material )\t(0)\n";
    const lights_physical_fragment = "PhysicalMaterial material;\nmaterial.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );\nmaterial.specularRoughness = clamp( roughnessFactor, 0.04, 1.0 );\n#ifdef STANDARD\n\tmaterial.specularColor = mix( vec3( DEFAULT_SPECULAR_COEFFICIENT ), diffuseColor.rgb, metalnessFactor );\n#else\n\tmaterial.specularColor = mix( vec3( MAXIMUM_SPECULAR_COEFFICIENT * pow2( reflectivity ) ), diffuseColor.rgb, metalnessFactor );\n\tmaterial.clearCoat = saturate( clearCoat );\n\tmaterial.clearCoatRoughness = clamp( clearCoatRoughness, 0.04, 1.0 );\n#endif\n";
    const lights_physical_pars_fragment = "struct PhysicalMaterial {\n\tvec3\tdiffuseColor;\n\tfloat\tspecularRoughness;\n\tvec3\tspecularColor;\n\t#ifndef STANDARD\n\t\tfloat clearCoat;\n\t\tfloat clearCoatRoughness;\n\t#endif\n};\n#define MAXIMUM_SPECULAR_COEFFICIENT 0.16\n#define DEFAULT_SPECULAR_COEFFICIENT 0.04\nfloat clearCoatDHRApprox( const in float roughness, const in float dotNL ) {\n\treturn DEFAULT_SPECULAR_COEFFICIENT + ( 1.0 - DEFAULT_SPECULAR_COEFFICIENT ) * ( pow( 1.0 - dotNL, 5.0 ) * pow( 1.0 - roughness, 2.0 ) );\n}\n#if NUM_RECT_AREA_LIGHTS > 0\n\tvoid RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {\n\t\tvec3 normal = geometry.normal;\n\t\tvec3 viewDir = geometry.viewDir;\n\t\tvec3 position = geometry.position;\n\t\tvec3 lightPos = rectAreaLight.position;\n\t\tvec3 halfWidth = rectAreaLight.halfWidth;\n\t\tvec3 halfHeight = rectAreaLight.halfHeight;\n\t\tvec3 lightColor = rectAreaLight.color;\n\t\tfloat roughness = material.specularRoughness;\n\t\tvec3 rectCoords[ 4 ];\n\t\trectCoords[ 0 ] = lightPos - halfWidth - halfHeight;\n\t\trectCoords[ 1 ] = lightPos + halfWidth - halfHeight;\n\t\trectCoords[ 2 ] = lightPos + halfWidth + halfHeight;\n\t\trectCoords[ 3 ] = lightPos - halfWidth + halfHeight;\n\t\tvec2 uv = LTC_Uv( normal, viewDir, roughness );\n\t\tvec4 t1 = texture2D( ltc_1, uv );\n\t\tvec4 t2 = texture2D( ltc_2, uv );\n\t\tmat3 mInv = mat3(\n\t\t\tvec3( t1.x, 0, t1.y ),\n\t\t\tvec3(    0, 1,    0 ),\n\t\t\tvec3( t1.z, 0, t1.w )\n\t\t);\n\t\tvec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );\n\t\treflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );\n\t\treflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );\n\t}\n#endif\nvoid RE_Direct_Physical( const in IncidentLight directLight, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {\n\tfloat dotNL = saturate( dot( geometry.normal, directLight.direction ) );\n\tvec3 irradiance = dotNL * directLight.color;\n\t#ifndef PHYSICALLY_CORRECT_LIGHTS\n\t\tirradiance *= PI;\n\t#endif\n\t#ifndef STANDARD\n\t\tfloat clearCoatDHR = material.clearCoat * clearCoatDHRApprox( material.clearCoatRoughness, dotNL );\n\t#else\n\t\tfloat clearCoatDHR = 0.0;\n\t#endif\n\treflectedLight.directSpecular += ( 1.0 - clearCoatDHR ) * irradiance * BRDF_Specular_GGX( directLight, geometry, material.specularColor, material.specularRoughness );\n\treflectedLight.directDiffuse += ( 1.0 - clearCoatDHR ) * irradiance * BRDF_Diffuse_Lambert( material.diffuseColor );\n\t#ifndef STANDARD\n\t\treflectedLight.directSpecular += irradiance * material.clearCoat * BRDF_Specular_GGX( directLight, geometry, vec3( DEFAULT_SPECULAR_COEFFICIENT ), material.clearCoatRoughness );\n\t#endif\n}\nvoid RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {\n\treflectedLight.indirectDiffuse += irradiance * BRDF_Diffuse_Lambert( material.diffuseColor );\n}\nvoid RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 clearCoatRadiance, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {\n\t#ifndef STANDARD\n\t\tfloat dotNV = saturate( dot( geometry.normal, geometry.viewDir ) );\n\t\tfloat dotNL = dotNV;\n\t\tfloat clearCoatDHR = material.clearCoat * clearCoatDHRApprox( material.clearCoatRoughness, dotNL );\n\t#else\n\t\tfloat clearCoatDHR = 0.0;\n\t#endif\n\treflectedLight.indirectSpecular += ( 1.0 - clearCoatDHR ) * radiance * BRDF_Specular_GGX_Environment( geometry, material.specularColor, material.specularRoughness );\n\t#ifndef STANDARD\n\t\treflectedLight.indirectSpecular += clearCoatRadiance * material.clearCoat * BRDF_Specular_GGX_Environment( geometry, vec3( DEFAULT_SPECULAR_COEFFICIENT ), material.clearCoatRoughness );\n\t#endif\n}\n#define RE_Direct\t\t\t\tRE_Direct_Physical\n#define RE_Direct_RectArea\t\tRE_Direct_RectArea_Physical\n#define RE_IndirectDiffuse\t\tRE_IndirectDiffuse_Physical\n#define RE_IndirectSpecular\t\tRE_IndirectSpecular_Physical\n#define Material_BlinnShininessExponent( material )   GGXRoughnessToBlinnExponent( material.specularRoughness )\n#define Material_ClearCoat_BlinnShininessExponent( material )   GGXRoughnessToBlinnExponent( material.clearCoatRoughness )\nfloat computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {\n\treturn saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );\n}\n";
    const logdepthbuf_fragment = "#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )\n\tgl_FragDepthEXT = log2( vFragDepth ) * logDepthBufFC * 0.5;\n#endif";
    const logdepthbuf_pars_fragment = "#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )\n\tuniform float logDepthBufFC;\n\tvarying float vFragDepth;\n#endif\n";
    const logdepthbuf_pars_vertex = "#ifdef USE_LOGDEPTHBUF\n\t#ifdef USE_LOGDEPTHBUF_EXT\n\t\tvarying float vFragDepth;\n\t#else\n\t\tuniform float logDepthBufFC;\n\t#endif\n#endif\n";
    const logdepthbuf_vertex = "#ifdef USE_LOGDEPTHBUF\n\t#ifdef USE_LOGDEPTHBUF_EXT\n\t\tvFragDepth = 1.0 + gl_Position.w;\n\t#else\n\t\tgl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;\n\t\tgl_Position.z *= gl_Position.w;\n\t#endif\n#endif\n";
    const map_fragment = "#ifdef USE_MAP\n\tvec4 texelColor = texture2D( map, vUv );\n\ttexelColor = mapTexelToLinear( texelColor );\n\tdiffuseColor *= texelColor;\n#endif\n";
    const map_pars_fragment = "#ifdef USE_MAP\n\tuniform sampler2D map;\n#endif\n";
    const map_particle_fragment = "#ifdef USE_MAP\n\tvec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;\n\tvec4 mapTexel = texture2D( map, uv );\n\tdiffuseColor *= mapTexelToLinear( mapTexel );\n#endif\n";
    const map_particle_pars_fragment = "#ifdef USE_MAP\n\tuniform mat3 uvTransform;\n\tuniform sampler2D map;\n#endif\n";
    const metalnessmap_fragment = "float metalnessFactor = metalness;\n#ifdef USE_METALNESSMAP\n\tvec4 texelMetalness = texture2D( metalnessMap, vUv );\n\tmetalnessFactor *= texelMetalness.b;\n#endif\n";
    const metalnessmap_pars_fragment = "#ifdef USE_METALNESSMAP\n\tuniform sampler2D metalnessMap;\n#endif";
    const morphnormal_vertex = "#ifdef USE_MORPHNORMALS\n\tobjectNormal += ( morphNormal0 - normal ) * morphTargetInfluences[ 0 ];\n\tobjectNormal += ( morphNormal1 - normal ) * morphTargetInfluences[ 1 ];\n\tobjectNormal += ( morphNormal2 - normal ) * morphTargetInfluences[ 2 ];\n\tobjectNormal += ( morphNormal3 - normal ) * morphTargetInfluences[ 3 ];\n#endif\n";
    const morphtarget_pars_vertex = "#ifdef USE_MORPHTARGETS\n\t#ifndef USE_MORPHNORMALS\n\tuniform float morphTargetInfluences[ 8 ];\n\t#else\n\tuniform float morphTargetInfluences[ 4 ];\n\t#endif\n#endif";
    const morphtarget_vertex = "#ifdef USE_MORPHTARGETS\n\ttransformed += ( morphTarget0 - position ) * morphTargetInfluences[ 0 ];\n\ttransformed += ( morphTarget1 - position ) * morphTargetInfluences[ 1 ];\n\ttransformed += ( morphTarget2 - position ) * morphTargetInfluences[ 2 ];\n\ttransformed += ( morphTarget3 - position ) * morphTargetInfluences[ 3 ];\n\t#ifndef USE_MORPHNORMALS\n\ttransformed += ( morphTarget4 - position ) * morphTargetInfluences[ 4 ];\n\ttransformed += ( morphTarget5 - position ) * morphTargetInfluences[ 5 ];\n\ttransformed += ( morphTarget6 - position ) * morphTargetInfluences[ 6 ];\n\ttransformed += ( morphTarget7 - position ) * morphTargetInfluences[ 7 ];\n\t#endif\n#endif\n";
    const normalmap_pars_fragment = "#ifdef USE_NORMALMAP\n\tuniform sampler2D normalMap;\n\tuniform vec2 normalScale;\n\t#ifdef OBJECTSPACE_NORMALMAP\n\t\tuniform mat3 normalMatrix;\n\t#else\n\t\tvec3 perturbNormal2Arb( vec3 eye_pos, vec3 surf_norm ) {\n\t\t\tvec3 q0 = vec3( dFdx( eye_pos.x ), dFdx( eye_pos.y ), dFdx( eye_pos.z ) );\n\t\t\tvec3 q1 = vec3( dFdy( eye_pos.x ), dFdy( eye_pos.y ), dFdy( eye_pos.z ) );\n\t\t\tvec2 st0 = dFdx( vUv.st );\n\t\t\tvec2 st1 = dFdy( vUv.st );\n\t\t\tfloat scale = sign( st1.t * st0.s - st0.t * st1.s );\n\t\t\tvec3 S = normalize( ( q0 * st1.t - q1 * st0.t ) * scale );\n\t\t\tvec3 T = normalize( ( - q0 * st1.s + q1 * st0.s ) * scale );\n\t\t\tvec3 N = normalize( surf_norm );\n\t\t\tmat3 tsn = mat3( S, T, N );\n\t\t\tvec3 mapN = texture2D( normalMap, vUv ).xyz * 2.0 - 1.0;\n\t\t\tmapN.xy *= normalScale;\n\t\t\tmapN.xy *= ( float( gl_FrontFacing ) * 2.0 - 1.0 );\n\t\t\treturn normalize( tsn * mapN );\n\t\t}\n\t#endif\n#endif\n";
    const normal_fragment_begin = "#ifdef FLAT_SHADED\n\tvec3 fdx = vec3( dFdx( vViewPosition.x ), dFdx( vViewPosition.y ), dFdx( vViewPosition.z ) );\n\tvec3 fdy = vec3( dFdy( vViewPosition.x ), dFdy( vViewPosition.y ), dFdy( vViewPosition.z ) );\n\tvec3 normal = normalize( cross( fdx, fdy ) );\n#else\n\tvec3 normal = normalize( vNormal );\n\t#ifdef DOUBLE_SIDED\n\t\tnormal = normal * ( float( gl_FrontFacing ) * 2.0 - 1.0 );\n\t#endif\n#endif\n";
    const normal_fragment_maps = "#ifdef USE_NORMALMAP\n\t#ifdef OBJECTSPACE_NORMALMAP\n\t\tnormal = texture2D( normalMap, vUv ).xyz * 2.0 - 1.0;\n\t\t#ifdef FLIP_SIDED\n\t\t\tnormal = - normal;\n\t\t#endif\n\t\t#ifdef DOUBLE_SIDED\n\t\t\tnormal = normal * ( float( gl_FrontFacing ) * 2.0 - 1.0 );\n\t\t#endif\n\t\tnormal = normalize( normalMatrix * normal );\n\t#else\n\t\tnormal = perturbNormal2Arb( -vViewPosition, normal );\n\t#endif\n#elif defined( USE_BUMPMAP )\n\tnormal = perturbNormalArb( -vViewPosition, normal, dHdxy_fwd() );\n#endif\n";
    const packing = "vec3 packNormalToRGB( const in vec3 normal ) {\n\treturn normalize( normal ) * 0.5 + 0.5;\n}\nvec3 unpackRGBToNormal( const in vec3 rgb ) {\n\treturn 2.0 * rgb.xyz - 1.0;\n}\nconst float PackUpscale = 256. / 255.;\nconst float UnpackDownscale = 255. / 256.;\nconst vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256.,  256. );\nconst vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );\nconst float ShiftRight8 = 1. / 256.;\nvec4 packDepthToRGBA( const in float v ) {\n\tvec4 r = vec4( fract( v * PackFactors ), v );\n\tr.yzw -= r.xyz * ShiftRight8;\n\treturn r * PackUpscale;\n}\nfloat unpackRGBAToDepth( const in vec4 v ) {\n\treturn dot( v, UnpackFactors );\n}\nfloat viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {\n\treturn ( viewZ + near ) / ( near - far );\n}\nfloat orthographicDepthToViewZ( const in float linearClipZ, const in float near, const in float far ) {\n\treturn linearClipZ * ( near - far ) - near;\n}\nfloat viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {\n\treturn (( near + viewZ ) * far ) / (( far - near ) * viewZ );\n}\nfloat perspectiveDepthToViewZ( const in float invClipZ, const in float near, const in float far ) {\n\treturn ( near * far ) / ( ( far - near ) * invClipZ - far );\n}\n";
    const particle_affector = "vec3 lifeVelocity = computeVelocity(t);\nvec4 worldRotation;\nif(u_simulationSpace==1)\n\tworldRotation=startWorldRotation;\nelse\n\tworldRotation=u_worldRotation;\nvec3 gravity=u_gravity*age;\nvec3 center=computePosition(startVelocity, lifeVelocity, age, t,gravity,worldRotation); \n#ifdef SPHERHBILLBOARD\n\t\t  vec2 corner=corner.xy;\n\t     vec3 cameraUpVector =normalize(cameraUp);\n\t     vec3 sideVector = normalize(cross(cameraForward,cameraUpVector));\n\t     vec3 upVector = normalize(cross(sideVector,cameraForward));\n\t   \tcorner*=computeBillbardSize(startSize.xy,t);\n\t\t#if defined(ROTATIONOVERLIFETIME)||defined(ROTATIONSEPERATE)\n\t\t\tif(u_startRotation3D){\n\t\t\t\tvec3 rotation=vec3(startRotation.xy,computeRotation(startRotation.z,age,t));\n\t\t\t\tcenter += u_sizeScale.xzy*rotation_euler(corner.x*sideVector+corner.y*upVector,rotation);\n\t\t\t}\n\t\t\telse{\n\t\t\t\tfloat rot = computeRotation(startRotation.x, age,t);\n\t\t\t\tfloat c = cos(rot);\n\t\t\t\tfloat s = sin(rot);\n\t\t\t\tmat2 rotation= mat2(c, -s, s, c);\n\t\t\t\tcorner=rotation*corner;\n\t\t\t\tcenter += u_sizeScale.xzy*(corner.x*sideVector+corner.y*upVector);\n\t\t\t}\n\t\t#else\n\t\t\tif(u_startRotation3D){\n\t\t\t\tcenter += u_sizeScale.xzy*rotation_euler(corner.x*sideVector+corner.y*upVector,startRotation);\n\t\t\t}\n\t\t\telse{\n\t\t\t\tfloat c = cos(startRotation.x);\n\t\t\t\tfloat s = sin(startRotation.x);\n\t\t\t\tmat2 rotation= mat2(c, -s, s, c);\n\t\t\t\tcorner=rotation*corner;\n\t\t\t\tcenter += u_sizeScale.xzy*(corner.x*sideVector+corner.y*upVector);\n\t\t\t}\n\t\t#endif\n\t#endif\n\t#ifdef STRETCHEDBILLBOARD\n\t\tvec2 corner=corner.xy;\n\t\tvec3 velocity;\n\t\t#if defined(VELOCITYCONSTANT)||defined(VELOCITYCURVE)||defined(VELOCITYTWOCONSTANT)||defined(VELOCITYTWOCURVE)\n\t   \t\tif(u_spaceType==0)\n\t  \t\t\t\tvelocity=rotation_quaternions(u_sizeScale*(startVelocity+lifeVelocity),worldRotation)+gravity;\n\t   \t\telse\n\t  \t\t\t\tvelocity=rotation_quaternions(u_sizeScale*startVelocity,worldRotation)+lifeVelocity+gravity;\n\t \t#else\n\t   \t\tvelocity= rotation_quaternions(u_sizeScale*startVelocity,worldRotation)+gravity;\n\t \t#endif\t\n\t\tvec3 cameraUpVector = normalize(velocity);\n\t\tvec3 direction = normalize(center-cameraPosition);\n\t   vec3 sideVector = normalize(cross(direction,cameraUpVector));\n\t\tsideVector=u_sizeScale.xzy*sideVector;\n\t\tcameraUpVector=length(vec3(u_sizeScale.x,0.0,0.0))*cameraUpVector;\n\t   vec2 size=computeBillbardSize(startSize.xy,t);\n\t   const mat2 rotaionZHalfPI=mat2(0.0, -1.0, 1.0, 0.0);\n\t   corner=rotaionZHalfPI*corner;\n\t   corner.y=corner.y-abs(corner.y);\n\t   float speed=length(velocity);\n\t   center +=sign(u_sizeScale.x)*(sign(u_lengthScale)*size.x*corner.x*sideVector+(speed*u_speeaScale+size.y*u_lengthScale)*corner.y*cameraUpVector);\n\t#endif\n\t#ifdef HORIZONTALBILLBOARD\n\t\tvec2 corner=corner.xy;\n\t   const vec3 cameraUpVector=vec3(0.0,0.0,1.0);\n\t   const vec3 sideVector = vec3(-1.0,0.0,0.0);\n\t\tfloat rot = computeRotation(startRotation.x, age,t);\n\t   float c = cos(rot);\n\t   float s = sin(rot);\n\t   mat2 rotation= mat2(c, -s, s, c);\n\t   corner=rotation*corner;\n\t\tcorner*=computeBillbardSize(startSize.xy,t);\n\t   center +=u_sizeScale.xzy*(corner.x*sideVector+ corner.y*cameraUpVector);\n\t#endif\n\t#ifdef VERTICALBILLBOARD\n\t\tvec2 corner=corner.xy;\n\t   const vec3 cameraUpVector =vec3(0.0,1.0,0.0);\n\t   vec3 sideVector = normalize(cross(cameraForward,cameraUpVector));\n\t\tfloat rot = computeRotation(startRotation.x, age,t);\n\t   float c = cos(rot);\n\t   float s = sin(rot);\n\t   mat2 rotation= mat2(c, -s, s, c);\n\t   corner=rotation*corner;\n\t\tcorner*=computeBillbardSize(startSize.xy,t);\n\t   center +=u_sizeScale.xzy*(corner.x*sideVector+ corner.y*cameraUpVector);\n\t#endif\n\t#ifdef RENDERMESH\n\t   vec3 size=computeMeshSize(startSize,t);\n\t\t#if defined(ROTATIONOVERLIFETIME)||defined(ROTATIONSEPERATE)\n\t\t\t\tif(u_startRotation3D){\n\t\t\t\t\tvec3 rotation=vec3(startRotation.xy,-computeRotation(startRotation.z, age,t));\n\t\t\t\t\tcenter+= rotation_quaternions(u_sizeScale*rotation_euler(position*size,rotation),worldRotation);\n\t\t\t\t}\n\t\t\t\telse{\n\t\t\t\t\t#ifdef ROTATIONOVERLIFETIME\n\t\t\t\t\t\tfloat angle=computeRotation(startRotation.x, age,t);\n\t\t\t\t\t\tif(startPosition.x>0.1 || startPosition.x < -0.1||startPosition.y>0.1 || startPosition.y < -0.1){\n\t\t\t\t\t\t\tcenter+= (rotation_quaternions(rotation_axis(u_sizeScale*position*size,normalize(cross(vec3(0.0,0.0,1.0),vec3(startPosition.xy,0.0))),angle),worldRotation));\n\t\t\t\t\t\t}\n\t\t\t\t\t\telse{\n\t\t\t\t\t\t\t#ifdef SHAPE\n\t\t\t\t\t\t\t\tcenter+= u_sizeScale.xzy*(rotation_quaternions(rotation_axis(position*size,vec3(0.0,-1.0,0.0),angle),worldRotation));\n\t\t\t\t\t\t\t#else\n\t\t\t\t\t\t\t\tif(u_simulationSpace==1)\n\t\t\t\t\t\t\t\t\tcenter+=rotation_axis(u_sizeScale*position*size,vec3(0.0,0.0,-1.0),angle);\n\t\t\t\t\t\t\t\telse if(u_simulationSpace==0)\n\t\t\t\t\t\t\t\t\tcenter+=rotation_quaternions(u_sizeScale*rotation_axis(position*size,vec3(0.0,0.0,-1.0),angle),worldRotation);\n\t\t\t\t\t\t\t#endif\n\t\t\t\t\t\t}\n\t\t\t\t\t#endif\n\t\t\t\t\t#ifdef ROTATIONSEPERATE\n\t\t\t\t\t\tvec3 angle=compute3DRotation(vec3(0.0,0.0,startRotation.z), age,t);\n\t\t\t\t\t\tcenter+= (rotation_quaternions(rotation_euler(u_sizeScale*position*size,vec3(angle.x,angle.y,angle.z)),worldRotation));\n\t\t\t\t\t#endif\t\n\t\t\t\t}\n\t\t#else\n\t\tif(u_startRotation3D){\n\t\t\tcenter+= rotation_quaternions(u_sizeScale*rotation_euler(position*size,startRotation),worldRotation);\n\t\t}\n\t\telse{\n\t\t\tif(startPosition.x>0.1 || startPosition.x < -0.1||startPosition.y>0.1 || startPosition.y < -0.1){\n\t\t\t\tif(u_simulationSpace==1)\n\t\t\t\t\tcenter+= rotation_axis(u_sizeScale*position*size,normalize(cross(vec3(0.0,0.0,1.0),vec3(startPosition.xy,0.0))),startRotation.x);\n\t\t\t\telse if(u_simulationSpace==0)\n\t\t\t\t\tcenter+= (rotation_quaternions(u_sizeScale*rotation_axis(position*size,normalize(cross(vec3(0.0,0.0,1.0),vec3(startPosition.xy,0.0))),startRotation.x),worldRotation));\n\t\t\t}\n\t\t\telse{\n\t\t\t\t#ifdef SHAPE\n\t\t\t\t\tif(u_simulationSpace==1)\n\t\t\t\t\t\tcenter+= u_sizeScale*rotation_axis(position*size,vec3(0.0,-1.0,0.0),startRotation.x);\n\t\t\t\t\telse if(u_simulationSpace==0)\n\t\t\t\t\t\tcenter+= rotation_quaternions(u_sizeScale*rotation_axis(position*size,vec3(0.0,-1.0,0.0),startRotation.x),worldRotation);\t\n\t\t\t\t#else\n\t\t\t\t\tif(u_simulationSpace==1)\n\t\t\t\t\t\tcenter+= rotation_axis(u_sizeScale*position*size,vec3(0.0,0.0,-1.0),startRotation.x);\n\t\t\t\t\telse if(u_simulationSpace==0)\n\t\t\t\t\t\tcenter+= rotation_quaternions(u_sizeScale*rotation_axis(position*size,vec3(0.0,0.0,-1.0),startRotation.x),worldRotation);\n\t\t\t\t#endif\n\t\t\t}\n\t\t}\n\t\t#endif\n\t\tv_mesh_color=vec4(color, 1.0);\n\t #endif";
    const particle_common = "\nuniform float u_currentTime;\nuniform vec3 u_gravity;\nuniform vec3 u_worldPosition;\nuniform vec4 u_worldRotation;\nuniform bool u_startRotation3D;\nuniform int u_scalingMode;\nuniform vec3 u_positionScale;\nuniform vec3 u_sizeScale;\nuniform vec3 cameraForward;\nuniform vec3 cameraUp;\nuniform float u_lengthScale;\nuniform float u_speeaScale;\nuniform int u_simulationSpace;\n#if defined(VELOCITYCONSTANT)||defined(VELOCITYCURVE)||defined(VELOCITYTWOCONSTANT)||defined(VELOCITYTWOCURVE)\n  uniform int u_spaceType;\n#endif\n#if defined(VELOCITYCONSTANT)||defined(VELOCITYTWOCONSTANT)\n  uniform vec3 u_velocityConst;\n#endif\n#if defined(VELOCITYCURVE)||defined(VELOCITYTWOCURVE)\n  uniform vec2 u_velocityCurveX[4];\n  uniform vec2 u_velocityCurveY[4];\n  uniform vec2 u_velocityCurveZ[4];\n#endif\n#ifdef VELOCITYTWOCONSTANT\n  uniform vec3 u_velocityConstMax;\n#endif\n#ifdef VELOCITYTWOCURVE\n  uniform vec2 u_velocityCurveMaxX[4];\n  uniform vec2 u_velocityCurveMaxY[4];\n  uniform vec2 u_velocityCurveMaxZ[4];\n#endif\n#ifdef COLOROGRADIENT\n  uniform vec4 u_colorGradient[4];\n  uniform vec2 u_alphaGradient[4];\n#endif\n#ifdef COLORTWOGRADIENTS\n  uniform vec4 u_colorGradient[4];\n  uniform vec2 u_alphaGradient[4];\n  uniform vec4 u_colorGradientMax[4];\n  uniform vec2 u_alphaGradientMax[4];\n#endif\n#if defined(SIZECURVE)||defined(SIZETWOCURVES)\n  uniform vec2 u_sizeCurve[4];\n#endif\n#ifdef SIZETWOCURVES\n  uniform vec2 u_sizeCurveMax[4];\n#endif\n#if defined(SIZECURVESEPERATE)||defined(SIZETWOCURVESSEPERATE)\n  uniform vec2 u_sizeCurveX[4];\n  uniform vec2 u_sizeCurveY[4];\n  uniform vec2 u_sizeCurveZ[4];\n#endif\n#ifdef SIZETWOCURVESSEPERATE\n  uniform vec2 u_sizeCurveMaxX[4];\n  uniform vec2 u_sizeCurveMaxY[4];\n  uniform vec2 u_sizeCurveMaxZ[4];\n#endif\n#ifdef ROTATIONOVERLIFETIME\n  #if defined(ROTATIONCONSTANT)||defined(ROTATIONTWOCONSTANTS)\n    uniform float u_rotationConst;\n  #endif\n  #ifdef ROTATIONTWOCONSTANTS\n    uniform float u_rotationConstMax;\n  #endif\n  #if defined(ROTATIONCURVE)||defined(ROTATIONTWOCURVES)\n    uniform vec2 u_rotationCurve[4];\n  #endif\n  #ifdef ROTATIONTWOCURVES\n    uniform vec2 u_rotationCurveMax[4];\n  #endif\n#endif\n#ifdef ROTATIONSEPERATE\n  #if defined(ROTATIONCONSTANT)||defined(ROTATIONTWOCONSTANTS)\n    uniform vec3 u_rotationConstSeprarate;\n  #endif\n  #ifdef ROTATIONTWOCONSTANTS\n    uniform vec3 u_rotationConstMaxSeprarate;\n  #endif\n  #if defined(ROTATIONCURVE)||defined(ROTATIONTWOCURVES)\n    uniform vec2 u_rotationCurveX[4];\n    uniform vec2 u_rotationCurveY[4];\n    uniform vec2 u_rotationCurveZ[4];\n\t\tuniform vec2 u_rotationCurveW[4];\n  #endif\n  #ifdef ROTATIONTWOCURVES\n    uniform vec2 u_rotationCurveMaxX[4];\n    uniform vec2 u_rotationCurveMaxY[4];\n    uniform vec2 u_rotationCurveMaxZ[4];\n\t\tuniform vec2 u_rotationCurveMaxW[4];\n  #endif\n#endif\n#if defined(TEXTURESHEETANIMATIONCURVE)||defined(TEXTURESHEETANIMATIONTWOCURVE)\n  uniform float u_cycles;\n  uniform vec4 u_subUV;\n  uniform vec2 u_uvCurve[4];\n#endif\n#ifdef TEXTURESHEETANIMATIONTWOCURVE\n  uniform vec2 u_uvCurveMax[4];\n#endif\nvarying float v_discard;\nvarying vec4 v_color;\nvarying vec2 v_texcoord;\n#ifdef RENDERMESH\n\tvarying vec4 v_mesh_color;\n#endif\nvec3 rotation_euler(in vec3 vector,in vec3 euler)\n{\n  float halfPitch = euler.x * 0.5;\n\tfloat halfYaw = euler.y * 0.5;\n\tfloat halfRoll = euler.z * 0.5;\n\tfloat sinPitch = sin(halfPitch);\n\tfloat cosPitch = cos(halfPitch);\n\tfloat sinYaw = sin(halfYaw);\n\tfloat cosYaw = cos(halfYaw);\n\tfloat sinRoll = sin(halfRoll);\n\tfloat cosRoll = cos(halfRoll);\n\tfloat quaX = (cosYaw * sinPitch * cosRoll) + (sinYaw * cosPitch * sinRoll);\n\tfloat quaY = (sinYaw * cosPitch * cosRoll) - (cosYaw * sinPitch * sinRoll);\n\tfloat quaZ = (cosYaw * cosPitch * sinRoll) - (sinYaw * sinPitch * cosRoll);\n\tfloat quaW = (cosYaw * cosPitch * cosRoll) + (sinYaw * sinPitch * sinRoll);\n\t\n\tfloat x = quaX + quaX;\n  float y = quaY + quaY;\n  float z = quaZ + quaZ;\n  float wx = quaW * x;\n  float wy = quaW * y;\n  float wz = quaW * z;\n\tfloat xx = quaX * x;\n  float xy = quaX * y;\n\tfloat xz = quaX * z;\n  float yy = quaY * y;\n  float yz = quaY * z;\n  float zz = quaZ * z;\n  return vec3(((vector.x * ((1.0 - yy) - zz)) + (vector.y * (xy - wz))) + (vector.z * (xz + wy)),\n              ((vector.x * (xy + wz)) + (vector.y * ((1.0 - xx) - zz))) + (vector.z * (yz - wx)),\n              ((vector.x * (xz - wy)) + (vector.y * (yz + wx))) + (vector.z * ((1.0 - xx) - yy)));\n\t\n}\nvec3 rotation_axis(in vec3 vector,in vec3 axis, in float angle)\n{\n\tfloat halfAngle = angle * 0.5;\n\tfloat sin = sin(halfAngle);\n\t\n\tfloat quaX = axis.x * sin;\n\tfloat quaY = axis.y * sin;\n\tfloat quaZ = axis.z * sin;\n\tfloat quaW = cos(halfAngle);\n\t\n\tfloat x = quaX + quaX;\n  float y = quaY + quaY;\n  float z = quaZ + quaZ;\n  float wx = quaW * x;\n  float wy = quaW * y;\n  float wz = quaW * z;\n\tfloat xx = quaX * x;\n  float xy = quaX * y;\n\tfloat xz = quaX * z;\n  float yy = quaY * y;\n  float yz = quaY * z;\n  float zz = quaZ * z;\n  return vec3(((vector.x * ((1.0 - yy) - zz)) + (vector.y * (xy - wz))) + (vector.z * (xz + wy)),\n              ((vector.x * (xy + wz)) + (vector.y * ((1.0 - xx) - zz))) + (vector.z * (yz - wx)),\n              ((vector.x * (xz - wy)) + (vector.y * (yz + wx))) + (vector.z * ((1.0 - xx) - yy)));\n}\nvec3 rotation_quaternions(in vec3 v,in vec4 q) \n{\n\treturn v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);\n}\n#if defined(VELOCITYCURVE)||defined(VELOCITYTWOCURVE)||defined(SIZECURVE)||defined(SIZECURVESEPERATE)||defined(SIZETWOCURVES)||defined(SIZETWOCURVESSEPERATE)\nfloat evaluate_curve_float(in vec2 curves[4],in float t)\n{\n\tfloat res;\n\tfor(int i=1;i<4;i++)\n\t{\n\t\tvec2 curve=curves[i];\n\t\tfloat curTime=curve.x;\n\t\tif(curTime>=t)\n\t\t{\n\t\t\tvec2 lastCurve=curves[i-1];\n\t\t\tfloat lastTime=lastCurve.x;\n\t\t\tfloat tt=(t-lastTime)/(curTime-lastTime);\n\t\t\tres=mix(lastCurve.y,curve.y,tt);\n\t\t\tbreak;\n\t\t}\n\t}\n\treturn res;\n}\n#endif\n#if defined(VELOCITYCURVE)||defined(VELOCITYTWOCURVE)||defined(ROTATIONCURVE)||defined(ROTATIONTWOCURVES)\nfloat evaluate_curve_total(in vec2 curves[4],in float t)\n{\n\tfloat res=0.0;\n\tfor(int i=1;i<4;i++)\n\t{\n\t\tvec2 curve=curves[i];\n\t\tfloat curTime=curve.x;\n\t\tvec2 lastCurve=curves[i-1];\n\t\tfloat lastValue=lastCurve.y;\n\t\t\n\t\tif(curTime>=t){\n\t\t\tfloat lastTime=lastCurve.x;\n\t\t\tfloat tt=(t-lastTime)/(curTime-lastTime);\n\t\t\tres+=(lastValue+mix(lastValue,curve.y,tt))/2.0*time.x*(t-lastTime);\n\t\t\tbreak;\n\t\t}\n\t\telse{\n\t\t\tres+=(lastValue+curve.y)/2.0*time.x*(curTime-lastCurve.x);\n\t\t}\n\t}\n\treturn res;\n}\n#endif\n#if defined(COLOROGRADIENT)||defined(COLORTWOGRADIENTS)\nvec4 evaluate_curve_color(in vec2 gradientAlphas[4],in vec4 gradientColors[4],in float t)\n{\n\tvec4 overTimeColor;\n\tfor(int i=1;i<4;i++)\n\t{\n\t\tvec2 gradientAlpha=gradientAlphas[i];\n\t\tfloat alphaKey=gradientAlpha.x;\n\t\tif(alphaKey>=t)\n\t\t{\n\t\t\tvec2 lastGradientAlpha=gradientAlphas[i-1];\n\t\t\tfloat lastAlphaKey=lastGradientAlpha.x;\n\t\t\tfloat age=(t-lastAlphaKey)/(alphaKey-lastAlphaKey);\n\t\t\toverTimeColor.a=mix(lastGradientAlpha.y,gradientAlpha.y,age);\n\t\t\tbreak;\n\t\t}\n\t}\n\t\n\tfor(int i=1;i<4;i++)\n\t{\n\t\tvec4 gradientColor=gradientColors[i];\n\t\tfloat colorKey=gradientColor.x;\n\t\tif(colorKey>=t)\n\t\t{\n\t\t\tvec4 lastGradientColor=gradientColors[i-1];\n\t\t\tfloat lastColorKey=lastGradientColor.x;\n\t\t\tfloat age=(t-lastColorKey)/(colorKey-lastColorKey);\n\t\t\toverTimeColor.rgb=mix(gradientColors[i-1].yzw,gradientColor.yzw,age);\n\t\t\tbreak;\n\t\t}\n\t}\n\treturn overTimeColor;\n}\n#endif\n#if defined(TEXTURESHEETANIMATIONCURVE)||defined(TEXTURESHEETANIMATIONTWOCURVE)\nfloat evaluate_curve_frame(in vec2 gradientFrames[4],in float t)\n{\n\tfloat overTimeFrame;\n\tfor(int i=1;i<4;i++)\n\t{\n\t\tvec2 gradientFrame=gradientFrames[i];\n\t\tfloat key=gradientFrame.x;\n\t\tif(key>=t)\n\t\t{\n\t\t\tvec2 lastGradientFrame=gradientFrames[i-1];\n\t\t\tfloat lastKey=lastGradientFrame.x;\n\t\t\tfloat age=(t-lastKey)/(key-lastKey);\n\t\t\toverTimeFrame=mix(lastGradientFrame.y,gradientFrame.y,age);\n\t\t\tbreak;\n\t\t}\n\t}\n\treturn floor(overTimeFrame);\n}\n#endif\nvec3 computeVelocity(in float t)\n{\n  vec3 res;\n  #ifdef VELOCITYCONSTANT\n\t res=u_velocityConst; \n  #endif\n  #ifdef VELOCITYCURVE\n     res= vec3(evaluate_curve_float(u_velocityCurveX,t),evaluate_curve_float(u_velocityCurveY,t),evaluate_curve_float(u_velocityCurveZ,t));\n  #endif\n  #ifdef VELOCITYTWOCONSTANT\n\t res=mix(u_velocityConst,u_velocityConstMax,vec3(random1.y,random1.z,random1.w)); \n  #endif\n  #ifdef VELOCITYTWOCURVE\n     res=vec3(mix(evaluate_curve_float(u_velocityCurveX,t),evaluate_curve_float(u_velocityCurveMaxX,t),random1.y),\n\t            mix(evaluate_curve_float(u_velocityCurveY,t),evaluate_curve_float(u_velocityCurveMaxY,t),random1.z),\n\t\t\t\t\t \t\tmix(evaluate_curve_float(u_velocityCurveZ,t),evaluate_curve_float(u_velocityCurveMaxZ,t),random1.w));\n  #endif\n\t\t\t\t\t\n  return res;\n} \nvec3 computePosition(in vec3 startVelocity, in vec3 lifeVelocity,in float age,in float t,vec3 gravityVelocity,vec4 worldRotation)\n{\n   \tvec3 position;\n   \tvec3 lifePosition;\n\t\t#if defined(VELOCITYCONSTANT)||defined(VELOCITYCURVE)||defined(VELOCITYTWOCONSTANT)||defined(VELOCITYTWOCURVE)\n\t\t\t#ifdef VELOCITYCONSTANT\n\t\t\t\t  position=startVelocity*age;\n\t\t\t\t  lifePosition=lifeVelocity*age;\n\t\t\t#endif\n\t\t\t#ifdef VELOCITYCURVE\n\t\t\t\t  position=startVelocity*age;\n\t\t\t\t  lifePosition=vec3(evaluate_curve_total(u_velocityCurveX,t),evaluate_curve_total(u_velocityCurveY,t),evaluate_curve_total(u_velocityCurveZ,t));\n\t\t\t#endif\n\t\t\t#ifdef VELOCITYTWOCONSTANT\n\t\t\t\t  position=startVelocity*age;\n\t\t\t\t  lifePosition=lifeVelocity*age;\n\t\t\t#endif\n\t\t\t#ifdef VELOCITYTWOCURVE\n\t\t\t\t  position=startVelocity*age;\n\t\t\t\t  lifePosition=vec3(mix(evaluate_curve_total(u_velocityCurveX,t),evaluate_curve_total(u_velocityCurveMaxX,t),random1.y)\n\t\t\t      \t\t\t\t\t\t\t\t,mix(evaluate_curve_total(u_velocityCurveY,t),evaluate_curve_total(u_velocityCurveMaxY,t),random1.z)\n\t\t\t      \t\t\t\t\t\t\t\t,mix(evaluate_curve_total(u_velocityCurveZ,t),evaluate_curve_total(u_velocityCurveMaxZ,t),random1.w));\n\t\t\t#endif\n\t\t\tvec3 finalPosition;\n\t\t\tif(u_spaceType==0){\n\t\t\t  if(u_scalingMode!=2)\n\t\t\t   finalPosition =rotation_quaternions(u_positionScale*(startPosition.xyz+position+lifePosition),worldRotation);\n\t\t\t  else\n\t\t\t   finalPosition =rotation_quaternions(u_positionScale*startPosition.xyz+position+lifePosition,worldRotation);\n\t\t\t}\n\t\t\telse{\n\t\t\t  if(u_scalingMode!=2)\n\t\t\t    finalPosition = rotation_quaternions(u_positionScale*(startPosition.xyz+position),worldRotation)+lifePosition;\n\t\t\t  else\n\t\t\t    finalPosition = rotation_quaternions(u_positionScale*startPosition.xyz+position,worldRotation)+lifePosition;\n\t\t\t}\n\t\t  #else\n\t\t\t position=startVelocity*age;\n\t\t\t vec3 finalPosition;\n\t\t\t if(u_scalingMode!=2)\n\t\t\t   finalPosition = rotation_quaternions(u_positionScale*(startPosition.xyz+position),worldRotation);\n\t\t\t else\n\t\t\t   finalPosition = rotation_quaternions(u_positionScale*startPosition.xyz+position,worldRotation);\n\t\t#endif\n  \n  if(u_simulationSpace==1)\n    finalPosition=finalPosition+startWorldPosition;\n  else if(u_simulationSpace==0) \n    finalPosition=finalPosition+u_worldPosition;\n  \n  finalPosition+=0.5*gravityVelocity*age;\n \n  return finalPosition;\n}\nvec4 computeColor(in vec4 color,in float t)\n{\n\t#ifdef COLOROGRADIENT\n\t  color*=evaluate_curve_color(u_alphaGradient,u_colorGradient,t);\n\t#endif\t\n\t#ifdef COLORTWOGRADIENTS\n\t  color*=mix(evaluate_curve_color(u_alphaGradient,u_colorGradient,t),evaluate_curve_color(u_alphaGradientMax,u_colorGradientMax,t),random0.y);\n\t#endif\n  return color;\n}\nvec2 computeBillbardSize(in vec2 size,in float t)\n{\n\t#ifdef SIZECURVE\n\t\tsize*=evaluate_curve_float(u_sizeCurve,t);\n\t#endif\n\t#ifdef SIZETWOCURVES\n\t  size*=mix(evaluate_curve_float(u_sizeCurve,t),evaluate_curve_float(u_sizeCurveMax,t),random0.z); \n\t#endif\n\t#ifdef SIZECURVESEPERATE\n\t\tsize*=vec2(evaluate_curve_float(u_sizeCurveX,t),evaluate_curve_float(u_sizeCurveY,t));\n\t#endif\n\t#ifdef SIZETWOCURVESSEPERATE\n\t  size*=vec2(mix(evaluate_curve_float(u_sizeCurveX,t),evaluate_curve_float(u_sizeCurveMaxX,t),random0.z)\n\t    \t\t\t\t,mix(evaluate_curve_float(u_sizeCurveY,t),evaluate_curve_float(u_sizeCurveMaxY,t),random0.z));\n\t#endif\n\treturn size;\n}\n#ifdef RENDERMESH\nvec3 computeMeshSize(in vec3 size,in float t)\n{\n\t#ifdef SIZECURVE\n\t\tsize*=evaluate_curve_float(u_sizeCurve,t);\n\t#endif\n\t#ifdef SIZETWOCURVES\n\t  size*=mix(evaluate_curve_float(u_sizeCurve,t),evaluate_curve_float(u_sizeCurveMax,t),random0.z); \n\t#endif\n\t#ifdef SIZECURVESEPERATE\n\t\tsize*=vec3(evaluate_curve_float(u_sizeCurveX,t),evaluate_curve_float(u_sizeCurveY,t),evaluate_curve_float(u_sizeCurveZ,t));\n\t#endif\n\t#ifdef SIZETWOCURVESSEPERATE\n\t  size*=vec3(mix(evaluate_curve_float(u_sizeCurveX,t),evaluate_curve_float(u_sizeCurveMaxX,t),random0.z)\n\t  \t\t\t  \t,mix(evaluate_curve_float(u_sizeCurveY,t),evaluate_curve_float(u_sizeCurveMaxY,t),random0.z)\n\t\t\t\t\t\t\t,mix(evaluate_curve_float(u_sizeCurveZ,t),evaluate_curve_float(u_sizeCurveMaxZ,t),random0.z));\n\t#endif\n\treturn size;\n}\n#endif\nfloat computeRotation(in float rotation,in float age,in float t)\n{ \n\t#ifdef ROTATIONOVERLIFETIME\n\t\t#ifdef ROTATIONCONSTANT\n\t\t\tfloat ageRot=u_rotationConst*age;\n\t        rotation+=ageRot;\n\t\t#endif\n\t\t#ifdef ROTATIONCURVE\n\t\t\trotation+=evaluate_curve_total(u_rotationCurve,t);\n\t\t#endif\n\t\t#ifdef ROTATIONTWOCONSTANTS\n\t\t\tfloat ageRot=mix(u_rotationConst,u_rotationConstMax,random0.w)*age;\n\t    rotation+=ageRot;\n\t  #endif\n\t\t#ifdef ROTATIONTWOCURVES\n\t\t\trotation+=mix(evaluate_curve_total(u_rotationCurve,t),evaluate_curve_total(u_rotationCurveMax,t),random0.w);\n\t\t#endif\n\t#endif\n\t#ifdef ROTATIONSEPERATE\n\t\t#ifdef ROTATIONCONSTANT\n\t\t\tfloat ageRot=u_rotationConstSeprarate.z*age;\n\t        rotation+=ageRot;\n\t\t#endif\n\t\t#ifdef ROTATIONCURVE\n\t\t\trotation+=evaluate_curve_total(u_rotationCurveZ,t);\n\t\t#endif\n\t\t#ifdef ROTATIONTWOCONSTANTS\n\t\t\tfloat ageRot=mix(u_rotationConstSeprarate.z,u_rotationConstMaxSeprarate.z,random0.w)*age;\n\t        rotation+=ageRot;\n\t    #endif\n\t\t#ifdef ROTATIONTWOCURVES\n\t\t\trotation+=mix(evaluate_curve_total(u_rotationCurveZ,t),evaluate_curve_total(u_rotationCurveMaxZ,t),random0.w));\n\t\t#endif\n\t#endif\n\treturn rotation;\n}\n#if defined(RENDERMESH)&&(defined(ROTATIONOVERLIFETIME)||defined(ROTATIONSEPERATE))\nvec3 compute3DRotation(in vec3 rotation,in float age,in float t)\n{ \n\t#ifdef ROTATIONOVERLIFETIME\n\t\t\t#ifdef ROTATIONCONSTANT\n\t\t\t\t\tfloat ageRot=u_rotationConst*age;\n\t\t\t    rotation+=ageRot;\n\t\t\t#endif\n\t\t\t#ifdef ROTATIONCURVE\n\t\t\t\t\trotation+=evaluate_curve_total(u_rotationCurve,t);\n\t\t\t#endif\n\t\t\t#ifdef ROTATIONTWOCONSTANTS\n\t\t\t\t\tfloat ageRot=mix(u_rotationConst,u_rotationConstMax,random0.w)*age;\n\t\t\t    rotation+=ageRot;\n\t\t\t#endif\n\t\t\t#ifdef ROTATIONTWOCURVES\n\t\t\t\t\trotation+=mix(evaluate_curve_total(u_rotationCurve,t),evaluate_curve_total(u_rotationCurveMax,t),random0.w);\n\t\t\t#endif\n\t#endif\n\t#ifdef ROTATIONSEPERATE\n\t\t\t\t#ifdef ROTATIONCONSTANT\n\t\t\t\t\tvec3 ageRot=u_rotationConstSeprarate*age;\n\t\t\t        rotation+=ageRot;\n\t\t\t\t#endif\n\t\t\t\t#ifdef ROTATIONCURVE\n\t\t\t\t\trotation+=vec3(evaluate_curve_total(u_rotationCurveX,t),evaluate_curve_total(u_rotationCurveY,t),evaluate_curve_total(u_rotationCurveZ,t));\n\t\t\t\t#endif\n\t\t\t\t#ifdef ROTATIONTWOCONSTANTS\n\t\t\t\t\tvec3 ageRot=mix(u_rotationConstSeprarate,u_rotationConstMaxSeprarate,random0.w)*age;\n\t\t\t        rotation+=ageRot;\n\t\t\t  #endif\n\t\t\t\t#ifdef ROTATIONTWOCURVES\n\t\t\t\t\trotation+=vec3(mix(evaluate_curve_total(u_rotationCurveX,t),evaluate_curve_total(u_rotationCurveMaxX,t),random0.w)\n\t\t\t        ,mix(evaluate_curve_total(u_rotationCurveY,t),evaluate_curve_total(u_rotationCurveMaxY,t),random0.w)\n\t\t\t        ,mix(evaluate_curve_total(u_rotationCurveZ,t),evaluate_curve_total(u_rotationCurveMaxZ,t),random0.w));\n\t\t\t\t#endif\n\t#endif\n\treturn rotation;\n}\n#endif\nvec2 computeUV(in vec2 uv,in float t)\n{ \n\t#ifdef TEXTURESHEETANIMATIONCURVE\n\t\tfloat cycleNormalizedAge=t*u_cycles;\n\t\tfloat uvNormalizedAge=cycleNormalizedAge-floor(cycleNormalizedAge);\n\t\tfloat frame=evaluate_curve_frame(u_uvCurve,uvNormalizedAge);\n\t\tuv.x *= u_subUV.x + u_subUV.z;\n\t\tuv.y *= u_subUV.y + u_subUV.w;\n\t\tfloat totalULength=frame*u_subUV.x;\n\t\tfloat floorTotalULength=floor(totalULength);\n\t  uv.x+=totalULength-floorTotalULength;\n\t\tuv.y+=floorTotalULength*u_subUV.y;\n    #endif\n\t#ifdef TEXTURESHEETANIMATIONTWOCURVE\n\t\tfloat cycleNormalizedAge=t*u_cycles;\n\t\tfloat uvNormalizedAge=cycleNormalizedAge-floor(cycleNormalizedAge);\n\t  float frame=floor(mix(evaluate_curve_frame(u_uvCurve,uvNormalizedAge),evaluate_curve_frame(u_uvCurveMax,uvNormalizedAge),random1.x));\n\t\tuv.x *= u_subUV.x + u_subUV.z;\n\t\tuv.y *= u_subUV.y + u_subUV.w;\n\t\tfloat totalULength=frame*u_subUV.x;\n\t\tfloat floorTotalULength=floor(totalULength);\n\t  uv.x+=totalULength-floorTotalULength;\n\t\tuv.y+=floorTotalULength*u_subUV.y;\n    #endif\n\treturn uv;\n}";
    const premultiplied_alpha_fragment = "#ifdef PREMULTIPLIED_ALPHA\n\tgl_FragColor.rgb *= gl_FragColor.a;\n#endif\n";
    const project_vertex = "vec4 mvPosition = modelViewMatrix * vec4( transformed, 1.0 );\ngl_Position = projectionMatrix * mvPosition;\n";
    const roughnessmap_fragment = "float roughnessFactor = roughness;\n#ifdef USE_ROUGHNESSMAP\n\tvec4 texelRoughness = texture2D( roughnessMap, vUv );\n\troughnessFactor *= texelRoughness.g;\n#endif\n";
    const roughnessmap_pars_fragment = "#ifdef USE_ROUGHNESSMAP\n\tuniform sampler2D roughnessMap;\n#endif";
    const shadowmap_pars_fragment = "#ifdef USE_SHADOWMAP\n\t#if NUM_DIR_LIGHTS > 0\n\t\tuniform sampler2D directionalShadowMap[ NUM_DIR_LIGHTS ];\n\t\tvarying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHTS ];\n\t#endif\n\t#if NUM_SPOT_LIGHTS > 0\n\t\tuniform sampler2D spotShadowMap[ NUM_SPOT_LIGHTS ];\n\t\tvarying vec4 vSpotShadowCoord[ NUM_SPOT_LIGHTS ];\n\t#endif\n\t#if NUM_POINT_LIGHTS > 0\n\t\tuniform sampler2D pointShadowMap[ NUM_POINT_LIGHTS ];\n\t\tvarying vec4 vPointShadowCoord[ NUM_POINT_LIGHTS ];\n\t#endif\n\tfloat texture2DCompare( sampler2D depths, vec2 uv, float compare ) {\n\t\treturn step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );\n\t}\n\tfloat texture2DShadowLerp( sampler2D depths, vec2 size, vec2 uv, float compare ) {\n\t\tconst vec2 offset = vec2( 0.0, 1.0 );\n\t\tvec2 texelSize = vec2( 1.0 ) / size;\n\t\tvec2 centroidUV = floor( uv * size + 0.5 ) / size;\n\t\tfloat lb = texture2DCompare( depths, centroidUV + texelSize * offset.xx, compare );\n\t\tfloat lt = texture2DCompare( depths, centroidUV + texelSize * offset.xy, compare );\n\t\tfloat rb = texture2DCompare( depths, centroidUV + texelSize * offset.yx, compare );\n\t\tfloat rt = texture2DCompare( depths, centroidUV + texelSize * offset.yy, compare );\n\t\tvec2 f = fract( uv * size + 0.5 );\n\t\tfloat a = mix( lb, lt, f.y );\n\t\tfloat b = mix( rb, rt, f.y );\n\t\tfloat c = mix( a, b, f.x );\n\t\treturn c;\n\t}\n\tfloat getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {\n\t\tfloat shadow = 1.0;\n\t\tshadowCoord.xyz /= shadowCoord.w;\n\t\tshadowCoord.z += shadowBias;\n\t\tbvec4 inFrustumVec = bvec4 ( shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0 );\n\t\tbool inFrustum = all( inFrustumVec );\n\t\tbvec2 frustumTestVec = bvec2( inFrustum, shadowCoord.z <= 1.0 );\n\t\tbool frustumTest = all( frustumTestVec );\n\t\tif ( frustumTest ) {\n\t\t#if defined( SHADOWMAP_TYPE_PCF )\n\t\t\tvec2 texelSize = vec2( 1.0 ) / shadowMapSize;\n\t\t\tfloat dx0 = - texelSize.x * shadowRadius;\n\t\t\tfloat dy0 = - texelSize.y * shadowRadius;\n\t\t\tfloat dx1 = + texelSize.x * shadowRadius;\n\t\t\tfloat dy1 = + texelSize.y * shadowRadius;\n\t\t\tshadow = (\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )\n\t\t\t) * ( 1.0 / 9.0 );\n\t\t#elif defined( SHADOWMAP_TYPE_PCF_SOFT )\n\t\t\tvec2 texelSize = vec2( 1.0 ) / shadowMapSize;\n\t\t\tfloat dx0 = - texelSize.x * shadowRadius;\n\t\t\tfloat dy0 = - texelSize.y * shadowRadius;\n\t\t\tfloat dx1 = + texelSize.x * shadowRadius;\n\t\t\tfloat dy1 = + texelSize.y * shadowRadius;\n\t\t\tshadow = (\n\t\t\t\ttexture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +\n\t\t\t\ttexture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +\n\t\t\t\ttexture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +\n\t\t\t\ttexture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +\n\t\t\t\ttexture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy, shadowCoord.z ) +\n\t\t\t\ttexture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +\n\t\t\t\ttexture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +\n\t\t\t\ttexture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +\n\t\t\t\ttexture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )\n\t\t\t) * ( 1.0 / 9.0 );\n\t\t#else\n\t\t\tshadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );\n\t\t#endif\n\t\t}\n\t\treturn shadow;\n\t}\n\tvec2 cubeToUV( vec3 v, float texelSizeY ) {\n\t\tvec3 absV = abs( v );\n\t\tfloat scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );\n\t\tabsV *= scaleToCube;\n\t\tv *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );\n\t\tvec2 planar = v.xy;\n\t\tfloat almostATexel = 1.5 * texelSizeY;\n\t\tfloat almostOne = 1.0 - almostATexel;\n\t\tif ( absV.z >= almostOne ) {\n\t\t\tif ( v.z > 0.0 )\n\t\t\t\tplanar.x = 4.0 - v.x;\n\t\t} else if ( absV.x >= almostOne ) {\n\t\t\tfloat signX = sign( v.x );\n\t\t\tplanar.x = v.z * signX + 2.0 * signX;\n\t\t} else if ( absV.y >= almostOne ) {\n\t\t\tfloat signY = sign( v.y );\n\t\t\tplanar.x = v.x + 2.0 * signY + 2.0;\n\t\t\tplanar.y = v.z * signY - 2.0;\n\t\t}\n\t\treturn vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );\n\t}\n\tfloat getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {\n\t\tvec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );\n\t\tvec3 lightToPosition = shadowCoord.xyz;\n\t\tfloat dp = ( length( lightToPosition ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );\n\t\tdp += shadowBias;\n\t\tvec3 bd3D = normalize( lightToPosition );\n\t\t#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT )\n\t\t\tvec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;\n\t\t\treturn (\n\t\t\t\ttexture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +\n\t\t\t\ttexture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +\n\t\t\t\ttexture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +\n\t\t\t\ttexture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +\n\t\t\t\ttexture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +\n\t\t\t\ttexture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +\n\t\t\t\ttexture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +\n\t\t\t\ttexture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +\n\t\t\t\ttexture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )\n\t\t\t) * ( 1.0 / 9.0 );\n\t\t#else\n\t\t\treturn texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );\n\t\t#endif\n\t}\n#endif\n";
    const shadowmap_pars_vertex = "#ifdef USE_SHADOWMAP\n\t#if NUM_DIR_LIGHTS > 0\n\t\tuniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHTS ];\n\t\tvarying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHTS ];\n\t#endif\n\t#if NUM_SPOT_LIGHTS > 0\n\t\tuniform mat4 spotShadowMatrix[ NUM_SPOT_LIGHTS ];\n\t\tvarying vec4 vSpotShadowCoord[ NUM_SPOT_LIGHTS ];\n\t#endif\n\t#if NUM_POINT_LIGHTS > 0\n\t\tuniform mat4 pointShadowMatrix[ NUM_POINT_LIGHTS ];\n\t\tvarying vec4 vPointShadowCoord[ NUM_POINT_LIGHTS ];\n\t#endif\n#endif\n";
    const shadowmap_vertex = "#ifdef USE_SHADOWMAP\n\t#if NUM_DIR_LIGHTS > 0\n\t#pragma unroll_loop\n\tfor ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {\n\t\tvDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * worldPosition;\n\t}\n\t#endif\n\t#if NUM_SPOT_LIGHTS > 0\n\t#pragma unroll_loop\n\tfor ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {\n\t\tvSpotShadowCoord[ i ] = spotShadowMatrix[ i ] * worldPosition;\n\t}\n\t#endif\n\t#if NUM_POINT_LIGHTS > 0\n\t#pragma unroll_loop\n\tfor ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {\n\t\tvPointShadowCoord[ i ] = pointShadowMatrix[ i ] * worldPosition;\n\t}\n\t#endif\n#endif\n";
    const shadowmask_pars_fragment = "float getShadowMask() {\n\tfloat shadow = 1.0;\n\t#ifdef USE_SHADOWMAP\n\t#if NUM_DIR_LIGHTS > 0\n\tDirectionalLight directionalLight;\n\t#pragma unroll_loop\n\tfor ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {\n\t\tdirectionalLight.shadow = int(directionalLights[ i  * 11 + 6]);\n\t\tdirectionalLight.shadowBias = directionalLights[ i  * 11 + 7];\n\t\tdirectionalLight.shadowRadius = directionalLights[ i  * 11 + 8];\n\t\tdirectionalLight.shadowMapSize = vec2(directionalLights[ i  * 11 + 9], directionalLights[ i  * 11 + 10]);\n\t\tshadow *= bool( directionalLight.shadow ) ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;\n\t}\n\t#endif\n\t#if NUM_SPOT_LIGHTS > 0\n\tSpotLight spotLight;\n\t#pragma unroll_loop\n\tfor ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {\n\t\tspotLight.shadow = int(spotLights[ i  * 18 + 13]);\n\t\tspotLight.shadowBias = spotLights[ i  * 18 + 14];\n\t\tspotLight.shadowRadius = spotLights[ i  * 18 + 15];\n\t\tspotLight.shadowMapSize = vec2(spotLights[ i  * 18 + 16], spotLights[ i  * 18 + 17]);\n\t\tshadow *= bool(spotLight.shadow) ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotShadowCoord[ i ] ) : 1.0;\n\t}\n\t#endif\n\t#if NUM_POINT_LIGHTS > 0\n\tPointLight pointLight;\n\t#pragma unroll_loop\n\tfor ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {\n\t\tpointLight.shadow = int(pointLights[ i  * 15 + 8]);\n\t\tpointLight.shadowBias = pointLights[ i  * 15 + 9];\n\t\tpointLight.shadowRadius = pointLights[ i  * 15 + 10];\n\t\tpointLight.shadowMapSize = vec2(pointLights[ i  * 15 + 11], pointLights[ i  * 15 + 12]);\n\t\tpointLight.shadowCameraNear = pointLights[ i  * 15 + 13];\n\t\tpointLight.shadowCameraFar = pointLights[ i  * 15 + 14];\n\t\tshadow *= bool(pointLight.shadow) ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;\n\t}\n\t#endif\n\t#endif\n\treturn shadow;\n}\n";
    const skinbase_vertex = "#ifdef USE_SKINNING\n\tmat4 boneMatX = getBoneMatrix( skinIndex.x );\n\tmat4 boneMatY = getBoneMatrix( skinIndex.y );\n\tmat4 boneMatZ = getBoneMatrix( skinIndex.z );\n\tmat4 boneMatW = getBoneMatrix( skinIndex.w );\n#endif";
    const skinning_pars_vertex = "#ifdef USE_SKINNING\n\t#ifdef BONE_TEXTURE\n\t\tuniform sampler2D boneTexture;\n\t\tuniform int boneTextureSize;\n\t\tmat4 getBoneMatrix( const in float i ) {\n\t\t\t\n\t\t\tfloat j = i * 4.0;\n\t\t\tfloat dx = 1.0 / float( boneTextureSize );\n\t\t\tvec4 v1 = texture2D( boneTexture, vec2( dx * ( j + 0.5 ), 0.0 ) );\n\t\t\tvec4 v2 = texture2D( boneTexture, vec2( dx * ( j + 1.5 ), 0.0 ) );\n\t\t\tvec4 v3 = texture2D( boneTexture, vec2( dx * ( j + 2.5 ), 0.0 ) );\n\t\t\tvec4 v4 = texture2D( boneTexture, vec2( dx * ( j + 3.5 ), 0.0 ) );\n\t\t\tmat4 bone = mat4( v1, v2, v3, v4 );\n\t\t\treturn bone;\n\t\t}\n\t#else\n\t\tuniform mat4 boneMatrices[ MAX_BONES ];\n\t\tmat4 getBoneMatrix( const in float i ) {\n\t\t\tmat4 bone = boneMatrices[ int(i) ];\n\t\t\treturn bone;\n\t\t}\n\t#endif\n#endif\n";
    const skinning_vertex = "#ifdef USE_SKINNING\n\tvec4 skinVertex = vec4( transformed, 1.0 );\n\tvec4 skinned = vec4( 0.0 );\n\tskinned += boneMatX * skinVertex * skinWeight.x;\n\tskinned += boneMatY * skinVertex * skinWeight.y;\n\tskinned += boneMatZ * skinVertex * skinWeight.z;\n\tskinned += boneMatW * skinVertex * skinWeight.w;\n\ttransformed = skinned.xyz;\n#endif\n";
    const skinnormal_vertex = "#ifdef USE_SKINNING\n\tmat4 skinMatrix = mat4( 0.0 );\n\tskinMatrix += skinWeight.x * boneMatX;\n\tskinMatrix += skinWeight.y * boneMatY;\n\tskinMatrix += skinWeight.z * boneMatZ;\n\tskinMatrix += skinWeight.w * boneMatW;\n\t\n\tobjectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;\n#endif\n";
    const specularmap_fragment = "float specularStrength;\n#ifdef USE_SPECULARMAP\n\tvec4 texelSpecular = texture2D( specularMap, vUv );\n\tspecularStrength = texelSpecular.r;\n#else\n\tspecularStrength = 1.0;\n#endif";
    const specularmap_pars_fragment = "#ifdef USE_SPECULARMAP\n\tuniform sampler2D specularMap;\n#endif";
    const tonemapping_fragment = "#if defined( TONE_MAPPING )\n  gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );\n#endif\n";
    const tonemapping_pars_fragment = "#ifndef saturate\n\t#define saturate(a) clamp( a, 0.0, 1.0 )\n#endif\nuniform float toneMappingExposure;\nuniform float toneMappingWhitePoint;\nvec3 LinearToneMapping( vec3 color ) {\n\treturn toneMappingExposure * color;\n}\nvec3 ReinhardToneMapping( vec3 color ) {\n\tcolor *= toneMappingExposure;\n\treturn saturate( color / ( vec3( 1.0 ) + color ) );\n}\n#define Uncharted2Helper( x ) max( ( ( x * ( 0.15 * x + 0.10 * 0.50 ) + 0.20 * 0.02 ) / ( x * ( 0.15 * x + 0.50 ) + 0.20 * 0.30 ) ) - 0.02 / 0.30, vec3( 0.0 ) )\nvec3 Uncharted2ToneMapping( vec3 color ) {\n\tcolor *= toneMappingExposure;\n\treturn saturate( Uncharted2Helper( color ) / Uncharted2Helper( vec3( toneMappingWhitePoint ) ) );\n}\nvec3 OptimizedCineonToneMapping( vec3 color ) {\n\tcolor *= toneMappingExposure;\n\tcolor = max( vec3( 0.0 ), color - 0.004 );\n\treturn pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );\n}\n";
    const uv2_pars_fragment = "#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )\n\tvarying vec2 vUv2;\n#endif";
    const uv2_pars_vertex = "#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )\n\tattribute vec2 uv2;\n\tvarying vec2 vUv2;\n\t\n\t#ifdef USE_LIGHTMAP\n\t\tuniform vec4 lightMapScaleOffset;\n\t#endif\n#endif";
    const uv2_vertex = "#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )\n\t#ifdef USE_LIGHTMAP\n\t\tvUv2 = vec2(uv2.x * lightMapScaleOffset.x + lightMapScaleOffset.z, 1.0 - ((1.0 - uv2.y) * lightMapScaleOffset.y + lightMapScaleOffset.w));\n\t#else\t\n\t\tvUv2 = uv2;\n\t#endif\n#endif";
    const uv_pars_fragment = "#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP ) || defined( USE_EMISSIVEMAP ) || defined( USE_ROUGHNESSMAP ) || defined( USE_METALNESSMAP )\n\tvarying vec2 vUv;\n#endif";
    const uv_pars_vertex = "#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP ) || defined( USE_EMISSIVEMAP ) || defined( USE_ROUGHNESSMAP ) || defined( USE_METALNESSMAP )\n\tvarying vec2 vUv;\n\tuniform mat3 uvTransform;\n#endif\n";
    const uv_vertex = "#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP ) || defined( USE_EMISSIVEMAP ) || defined( USE_ROUGHNESSMAP ) || defined( USE_METALNESSMAP )\n\t#if defined FLIP_V\n\t\tvUv = ( uvTransform * vec3( uv.x, 1.0 - uv.y, 1.0 ) ).xy;\n\t#else\n\t\tvUv = ( uvTransform * vec3( uv, 1.0 ) ).xy;\n\t#endif\n#endif";
    const worldpos_vertex = "#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP )\n\tvec4 worldPosition = modelMatrix * vec4( transformed, 1.0 );\n#endif\n";
}
declare namespace egret3d {
    const BitmapDataProcessor: RES.processor.Processor;
    const ShaderProcessor: RES.processor.Processor;
    const ImageProcessor: RES.processor.Processor;
    const TextureProcessor: RES.processor.Processor;
    const MaterialProcessor: RES.processor.Processor;
    const MeshProcessor: RES.processor.Processor;
    const AnimationProcessor: RES.processor.Processor;
    const PrefabProcessor: RES.processor.Processor;
    const SceneProcessor: RES.processor.Processor;
}
declare namespace egret3d {
    /**
     *
     * 正则表达式的工具类，提供一些引擎用到的正则表达式
     */
    class RegexpUtil {
        static textureRegexp: RegExp;
        static vectorRegexp: RegExp;
        static floatRegexp: RegExp;
        static rangeRegexp: RegExp;
        static vector4Regexp: RegExp;
        static vector3FloatOrRangeRegexp: RegExp;
    }
}
declare namespace egret3d.io {
    class BinReader {
        private _data;
        constructor(buf: ArrayBuffer, seek?: number);
        private _seek;
        seek(seek: number): void;
        peek(): number;
        length(): number;
        canread(): number;
        readStringAnsi(): string;
        static utf8ArrayToString(array: Uint8Array | number[]): string;
        readStringUtf8(): string;
        readStringUtf8FixLength(length: number): string;
        readSingle(): number;
        readDouble(): number;
        readInt8(): number;
        readUInt8(): number;
        readInt16(): number;
        readUInt16(): number;
        readInt32(): number;
        readUInt32(): number;
        readUint8Array(target: Uint8Array, offset?: number, length?: number): Uint8Array;
        readUint8ArrayByOffset(target: Uint8Array, offset: number, length?: number): Uint8Array;
        readUint16Array(target: Uint16Array, offset?: number, length?: number): Uint16Array;
        readSingleArray(target: Float32Array, offset?: number, length?: number): Float32Array;
        position: number;
        readBoolean(): boolean;
        readByte(): number;
        readBytes(target: Uint8Array, offset?: number, length?: number): Uint8Array;
        readUnsignedShort(): number;
        readUnsignedInt(): number;
        readFloat(): number;
        readUTFBytes(length: number): string;
        readSymbolByte(): number;
        readShort(): number;
        readInt(): number;
    }
    class BinWriter {
        _buf: Uint8Array;
        private _data;
        private _length;
        private _seek;
        constructor();
        private sureData(addlen);
        getLength(): number;
        getBuffer(): ArrayBuffer;
        seek(seek: number): void;
        peek(): number;
        writeInt8(num: number): void;
        writeUInt8(num: number): void;
        writeInt16(num: number): void;
        writeUInt16(num: number): void;
        writeInt32(num: number): void;
        writeUInt32(num: number): void;
        writeSingle(num: number): void;
        writeDouble(num: number): void;
        writeStringAnsi(str: string): void;
        writeStringUtf8(str: string): void;
        static stringToUtf8Array(str: string): number[];
        writeStringUtf8DataOnly(str: string): void;
        writeUint8Array(array: Uint8Array | number[], offset?: number, length?: number): void;
        readonly length: number;
        writeByte(num: number): void;
        writeBytes(array: Uint8Array | number[], offset?: number, length?: number): void;
        writeUnsignedShort(num: number): void;
        writeUnsignedInt(num: number): void;
        writeFloat(num: number): void;
        writeUTFBytes(str: string): void;
        writeSymbolByte(num: number): void;
        writeShort(num: number): void;
        writeInt(num: number): void;
    }
}
declare namespace egret3d.utils {
    function getRelativePath(targetPath: string, sourcePath: string): string;
}
declare namespace egret3d.webgl {
}
declare namespace egret3d.webgl {
}
declare namespace egret3d.webgl {
}
declare namespace egret3d.webgl {
}
declare namespace egret3d.webgl {
}
declare namespace egret3d.webgl {
}
declare namespace egret3d.webgl {
}
declare namespace egret3d.webgl {
}
declare namespace paper {
    /**
     * 已丢失或不支持的组件数据备份。
     */
    class MissingComponent extends Component {
        /**
         * 丢失的组件类名
         */
        readonly missingClass: string;
        /**
         * 已丢失或不支持的组件数据。
         */
        missingObject: any | null;
    }
}
declare namespace egret3d {
    /**
     * 引擎启动入口。
     * @param options
     */
    function runEgret(options?: RunOptions | null): Promise<void>;
}
interface Window {
    gltf: any;
    paper: any;
    egret3d: any;
    canvas: HTMLCanvasElement;
}
declare namespace egret3d {
    /**
     * 胶囊体碰撞组件。
     * - 与 Y 轴对齐。
     */
    class CapsuleCollider extends paper.BaseComponent implements ICapsuleCollider, IRaycast {
        readonly colliderType: ColliderType;
        readonly capsule: Capsule;
        raycast(ray: Readonly<Ray>, raycastInfo?: RaycastInfo | null): boolean;
    }
}
