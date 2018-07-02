namespace egret3d {
    /**
     * 
     */
    export class Pool<T> {
        public static readonly drawCall: Pool<DrawCall> = new Pool<DrawCall>();
        public static readonly shadowCaster: Pool<DrawCall> = new Pool<DrawCall>();

        private readonly _instances: T[] = [];

        public clear() {
            this._instances.length = 0;
        }

        public add(instanceOrInstances: T | (T[])) {
            if (Array.isArray(instanceOrInstances)) {
                for (const instance of instanceOrInstances) {
                    if (this._instances.indexOf(instance) < 0) {
                        this._instances.push(instance);
                    }
                }
            }
            else {
                if (this._instances.indexOf(instanceOrInstances) < 0) {
                    this._instances.push(instanceOrInstances);
                }
            }
        }

        public remove(instanceOrInstances: T | (T[])) {
            if (Array.isArray(instanceOrInstances)) {
                for (const instance of instanceOrInstances) {
                    const index = this._instances.indexOf(instance);
                    if (index >= 0) {
                        this._instances.splice(index, 1);
                    }
                }
            }
            else {
                const index = this._instances.indexOf(instanceOrInstances);
                if (index >= 0) {
                    this._instances.splice(index, 1);
                }
            }
        }

        public get() {
            return this._instances.pop() || null;
        }

        public get instances() {
            return this._instances;
        }
    }
}