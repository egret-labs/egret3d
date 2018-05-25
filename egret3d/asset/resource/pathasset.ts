namespace egret3d {

    /**
     * path play type
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 路径播放类型
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    export enum pathtype {
        once,
        loop,
        pingpong
    }

    enum epointtype {
        VertexPoint,
        ControlPoint
    }

    type PointItem = { point: egret3d.Vector3, type: epointtype };

    /**
     * path asset
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 路径资源。
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    export class PathAsset extends paper.Asset {

        /**
         * dispose asset
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 释放资源。
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        dispose() {
            this.paths.length = 0;
        }

        /**
         * asset byte length
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 计算资源字节大小。
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        caclByteLength(): number {
            if (this.paths) {
                var length = this.paths.length;
                var value = length * 12;
                return value;
            }
        }

        /**
         * path point data
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 路径节点数据
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        paths: egret3d.Vector3[] = [];

        private type: pathtype;
        private instertPointcount: number;
        private items: PointItem[] = [];

        /**
         * 
         */
        $parse(json: JSON) {
            var type: string = json["type"];
            switch (type) {
                case "once":
                    this.type = pathtype.once;
                    break;
                case "loop":
                    this.type = pathtype.loop;
                    break;
                case "pingpong":
                    this.type = pathtype.pingpong;
            }
            this.instertPointcount = json["insertPointcount"];
            var paths = json["path"];
            for (var key in paths) {
                var item = { type: undefined, point: undefined };
                var pointnode = paths[key];
                var pointtype = pointnode["type"];
                switch (pointtype) {
                    case "VertexPoint":
                        item.type = epointtype.VertexPoint;
                        break;

                    case "ControlPoint":
                        item.type = epointtype.ControlPoint;
                        break;
                }
                var pointlocation: string = pointnode["point"];
                var arr = pointlocation.split(",");
                item.point = new egret3d.Vector3(parseFloat(arr[0]), parseFloat(arr[1]), parseFloat(arr[2]));
                this.items.push(item);
            }
            this.getpaths();

            this.items.length = 0;
            for (var i = 0; i < this.lines.length; i++) {
                this.lines[i].length = 0;
            }
            this.lines.length = 0;
        }

        private lines: Array<egret3d.Vector3>[] = [];

        private getpaths() {
            var line = new Array();

            for (var i = 0; i < this.items.length; i++) {
                var item = this.items[i];
                if (i == 0) {
                    line.push(item.point);
                    this.lines.push(line);
                } else if (i == this.items.length - 1) {
                    if (this.type == pathtype.loop) {
                        if (item.type == epointtype.VertexPoint) {
                            line.push(item.point);
                            line = new Array();
                            line.push(item.point);
                            line.push(this.items[0].point);
                            this.lines.push(line);
                        } else {
                            line.push(item.point);
                            line.push(this.items[0].point);
                        }
                    } else {
                        line.push(item.point);
                    }
                } else {
                    if (item.type == epointtype.VertexPoint) {
                        line.push(item.point);
                        line = new Array();
                        line.push(item.point);
                        this.lines.push(line);
                    } else {
                        line.push(item.point);
                    }
                }
            }

            var linecount = this.lines.length;
            var pathindex = 0;
            for (var i = 0; i < linecount; i++) {
                if (i == linecount - 1) {
                    for (var k = 0; k < this.instertPointcount; k++) {
                        var rate = k / (this.instertPointcount - 1);
                        this.paths[pathindex] = this.getBezierPointAlongCurve(this.lines[i], rate);
                        pathindex++;
                    }
                }
                else {
                    for (var k = 0; k < this.instertPointcount; k++) {
                        var rate = k / this.instertPointcount;
                        this.paths[pathindex] = this.getBezierPointAlongCurve(this.lines[i], rate);
                        pathindex++;
                    }
                }
            }
        }

        private getBezierPointAlongCurve(points: any[], rate: number, clearflag: boolean = false): egret3d.Vector3 {
            var length = points.length;
            if (points.length < 2) {
                console.log("need more than 2 point to calculate bezier!");
                return;
            }

            if (length == 2) {
                var out: egret3d.Vector3 = new egret3d.Vector3();
                this.vec3Lerp(points[0], points[1], rate, out);
                if (clearflag) {
                    points.length = 0;
                }
                return out;
            }

            var temptpoints: egret3d.Vector3[] = [];
            for (var i = 0; i < length - 1; i++) {
                var temp = new Vector3();
                this.vec3Lerp(points[i], points[i + 1], rate, temp);
                temptpoints[i] = temp;
            }
            if (clearflag) {
                points.length = 0;
            }
            return this.getBezierPointAlongCurve(temptpoints, rate, true);
        }

        private vec3Lerp(start: egret3d.Vector3, end: egret3d.Vector3, lerp: number, out: egret3d.Vector3) {
            egret3d.Vector3.subtract(end, start, out);
            egret3d.Vector3.scale(out, lerp);
            egret3d.Vector3.add(start, out, out);
        }
    }
}