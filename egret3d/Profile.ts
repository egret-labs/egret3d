namespace egret3d {
    export type ProfileItem = {
        key: string;
        count: number;
        startTime: number;
        time: number;
        group: number;
    }

    export type ProfileList = { keys: string[], values: ProfileItem[] };

    export class Profile {
        private static debug: boolean = false;
        private static profileList: ProfileList = { keys: [], values: [] };

        private static _getNow(): number {
            // if (window.performance) {
            //     return window.performance.now();
            // }
            // return Date.now() * 0.001;
            return new Date().getTime();
        }

        private static _print(list: ProfileItem[]) {
            let totalTime = 0.0;
            for (const item of list) {
                totalTime += item.time;
            }
            console.log("------------------------");
            for (const item of list) {
                console.log(item.key + ":用时" + item.time + "平均:" + (item.time / item.count) + " 权重:" + (Math.round(item.time / totalTime * 100)) + "%");
            }
        }

        public static clear() {
            this.profileList.keys.length = 0;
            this.profileList.values.length = 0;
        }

        public static startTime(key: string, group: number = 0) {
            if (!this.debug) {
                return;
            }
            let index = this.profileList.keys.indexOf(key);
            if (index < 0) {
                this.profileList.keys.push(key);
                index = this.profileList.values.length;
                this.profileList.values.push({ key, count: 0, startTime: 0, time: 0, group });
            }

            const item = this.profileList.values[index];
            item.count++;
            item.startTime = this._getNow();
        }
        public static endTime(key: string) {
            if (!this.debug) {
                return;
            }
            let index = this.profileList.keys.indexOf(key);
            if (index < 0) {
                console.log("invalid key error.", this);
            } else {
                const item = this.profileList.values[index];
                item.time += this._getNow() - item.startTime;
            }
        }

        public static printAll() {
            if (!this.debug) {
                return;
            }
            let groups: { [key: string]: ProfileItem[] } = {};

            for (let item of this.profileList.values) {
                if (!groups[item.group]) {
                    groups[item.group] = [];
                }

                groups[item.group].push(item);
            }

            for (let key in groups) {
                this._print(groups[key]);
            }
        }

        public static print(group: number = 0) {
            if (!this.debug) {
                return;
            }
            let list: ProfileItem[] = [];
            for (let item of this.profileList.values) {
                if (item.group === group) {
                    list.push(item);
                }
            }

            this._print(list);
        }

        public static test() {
            let list0 = [];
            let map: { [key: string]: number } = {};

            for (let i = 0; i < 1000; i++) {
                list0.push(i);
                map[i] = i;
            }

            var old = this._getNow();

            for (let i of list0) {
                console.log("list:");
            }

            console.log("list of用时:" + (this._getNow() - old));
            old = this._getNow();

            for (let i in list0) {
                console.log("list:");
            }
            console.log("list in用时:" + (this._getNow() - old));
            old = this._getNow();

            for (let key in map) {
                console.log("map:");
            }
            console.log("map用时:" + (this._getNow() - old));
        }
    }
}