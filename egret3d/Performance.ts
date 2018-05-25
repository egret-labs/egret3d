namespace egret3d {
    /**
     * 
     */
    export const enum PerformanceType {
        All = "all",
    }

    export type PerformanceEntity = {
        start: number,
        end: number,
        delta: number,
        _cache: number[],
        averageRange: number,
        averageDelta: number
    };

    /**
     * Performance
     * 数据收集
     */
    export class Performance {
        private static _entities: { [key: string]: PerformanceEntity } = {};
        public static enable: boolean = false;
        public static getEntity(key: string): PerformanceEntity {
            return this._entities[key];
        }
        public static getFPS(): number {
            let entity = this.getEntity("fps");
            return (entity && entity.averageDelta) ? Math.floor(1000 / entity.averageDelta) : 0;
        }
        public static updateFPS() {
            if (!this.enable) {
                return;
            }
            this.endCounter("fps");
            this.startCounter("fps", 60);
        }
        private static _getNow(): number {
            if (window.performance) {
                return window.performance.now();
            }
            return new Date().getTime();
        }
        public static startCounter(key: string, averageRange: number = 1) {
            if (!this.enable) {
                return;
            }

            var entity = this._entities[key];
            if (!entity) {
                entity = {
                    start: 0,
                    end: 0,
                    delta: 0,
                    _cache: [],
                    averageRange: 1,
                    averageDelta: 0
                };
                this._entities[key] = entity;
            }
            entity.start = this._getNow();
            entity.averageRange = averageRange;
        }

        public static endCounter(key: string) {
            if (!this.enable) {
                return;
            }

            var entity = this._entities[key];
            if (entity) {
                entity.end = this._getNow();
                entity.delta = entity.end - entity.start;

                if (entity.averageRange > 1) {
                    entity._cache.push(entity.delta);
                    var length = entity._cache.length;
                    if (length >= entity.averageRange) {
                        if (length > entity.averageRange) {
                            entity._cache.shift();
                            length--;
                        }
                        var sum = 0;
                        for (var i = 0; i < length; i++) {
                            sum += entity._cache[i];
                        }
                        entity.averageDelta = sum / length;
                    }
                }
            }
        }
    }
}