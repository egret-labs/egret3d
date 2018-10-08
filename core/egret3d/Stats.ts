namespace Stats {

    let stats:Stats;
    let loop:number;

    /**
     * 显示调试面板 
     */
    export function show(container:HTMLDivElement, refreshTime:number = 500) {
        if (stats == null) {
            stats = new Stats();
            stats.container.style.position = 'absolute';
            stats.container.style.left = '0px';
            stats.container.style.top = '0px';
            container.appendChild(stats.container);
        } else {
            container.appendChild(stats.container);
        }
        if(loop) {
            hide();
        }
        loop = setInterval(() => {
            stats.update();
        }, refreshTime);

        egret3d.Performance.enable = true;
    }

    /**
     * 关闭调试面板
     */
    export function hide() {
        if (loop) {
            clearInterval(loop);
        }
        if (stats != null && stats.container.parentNode) {
            stats.container.parentNode.removeChild(stats.container);
        }

        egret3d.Performance.enable = false;
    }

    /**
     * 
     * @author mrdoob / http://mrdoob.com/
     * @modify egret
     */
    class Stats {

        constructor() {
            this.container = document.createElement('div');
            this.container.style.cssText = 'position:fixed;top:0;left:0;cursor:pointer;opacity:0.7;z-index:1';

            this.container.addEventListener('click', (event) => {
                event.preventDefault();
                this.showPanel(++this.mode % this.container.children.length);
            }, false);

            this.fpsPanel = this.addPanel(new Panel('FPS', '#0ff', '#002'));
            this.msPanel = this.addPanel(new Panel('MS', '#0f0', '#020'));
            this.renderPanel = this.addPanel(new Panel('R%', '#0f0', '#020'));

            if (self.performance && self.performance["memory"]) {
                this.memPanel = this.addPanel(new Panel('MB', '#f08', '#201'));
            }

            this.showPanel(0);
        }

        public update() {
            let fps = egret3d.Performance.getFPS();
            let fpsEntity = egret3d.Performance.getEntity("fps");
            let allEntity = egret3d.Performance.getEntity("all");
            let renderEntity = egret3d.Performance.getEntity("render");

            this.fpsPanel.update(fps, 100);
            this.msPanel.update(allEntity.delta, 200);
            this.renderPanel.update(Math.floor(renderEntity.delta / fpsEntity.delta * 100), 100);
            if (this.memPanel) {
                let memory = performance["memory"];
                this.memPanel.update(memory.usedJSHeapSize / 1048576, memory.jsHeapSizeLimit / 1048576);
            }
        }

        public container: HTMLDivElement;
        private mode = 0;
        private fpsPanel: Panel;
        private msPanel: Panel;
        private memPanel: Panel;
        private renderPanel: Panel;

        private showPanel(id: number) {
            for (var i = 0; i < this.container.children.length; i++) {
                this.container.children[i]["style"].display = i === id ? 'block' : 'none';
            }
            this.mode = id;
        }

        private addPanel(panel: Panel): Panel {
            this.container.appendChild(panel.canvas);
            return panel;
        }

    }
    
    /**
     *  
     */
    class Panel {
        constructor(name: string, fg: string, bg: string) {
            this.name = name;
            this.fg = fg;
            this.bg = bg;

            this.min = Infinity;
            this.max = 0;
            this.PR = Math.round(window.devicePixelRatio || 1);

            this.WIDTH = 80 * this.PR;
            this.HEIGHT = 48 * this.PR;

            this.TEXT_X = 3 * this.PR;
            this.TEXT_Y = 2 * this.PR;
            this.GRAPH_X = 3 * this.PR;
            this.GRAPH_Y = 15 * this.PR;
            this.GRAPH_WIDTH = 74 * this.PR, this.GRAPH_HEIGHT = 30 * this.PR;

            this.canvas = document.createElement('canvas');
            this.canvas.width = this.WIDTH;
            this.canvas.height = this.HEIGHT;
            this.canvas.style.cssText = 'width:80px;height:48px';

            this.context = this.canvas.getContext('2d');
            this.context.font = 'bold ' + (9 * this.PR) + 'px Helvetica,Arial,sans-serif';
            this.context.textBaseline = 'top';

            this.context.fillStyle = bg;
            this.context.fillRect(0, 0, this.WIDTH, this.HEIGHT);

            this.context.fillStyle = fg;
            this.context.fillText(name, this.TEXT_X, this.TEXT_Y);
            this.context.fillRect(this.GRAPH_X, this.GRAPH_Y, this.GRAPH_WIDTH, this.GRAPH_HEIGHT);

            this.context.fillStyle = bg;
            this.context.globalAlpha = 0.9;
            this.context.fillRect(this.GRAPH_X, this.GRAPH_Y, this.GRAPH_WIDTH, this.GRAPH_HEIGHT);
        }
        
        canvas: HTMLCanvasElement;
        context: CanvasRenderingContext2D;
        name: string;
        PR: number;
        fg: string;
        bg: string;
        min: number;
        max: number;
        WIDTH: number;
        HEIGHT: number;
        TEXT_X: number;
        TEXT_Y: number;
        GRAPH_X: number;
        GRAPH_Y: number;
        GRAPH_WIDTH: number;
        GRAPH_HEIGHT: number;

        update(value, maxValue) {

            this.min = Math.min(this.min, value);
            this.max = Math.max(this.max, value);

            this.context.fillStyle = this.bg;
            this.context.globalAlpha = 1;
            this.context.fillRect(0, 0, this.WIDTH, this.GRAPH_Y);
            this.context.fillStyle = this.fg;
            this.context.fillText(Math.round(value) + ' ' + this.name + ' (' + Math.round(this.min) + '-' + Math.round(this.max) + ')', this.TEXT_X, this.TEXT_Y);

            this.context.drawImage(this.canvas, this.GRAPH_X + this.PR, this.GRAPH_Y, this.GRAPH_WIDTH - this.PR, this.GRAPH_HEIGHT, this.GRAPH_X, this.GRAPH_Y, this.GRAPH_WIDTH - this.PR, this.GRAPH_HEIGHT);

            this.context.fillRect(this.GRAPH_X + this.GRAPH_WIDTH - this.PR, this.GRAPH_Y, this.PR, this.GRAPH_HEIGHT);

            this.context.fillStyle = this.bg;
            this.context.globalAlpha = 0.9;
            this.context.fillRect(this.GRAPH_X + this.GRAPH_WIDTH - this.PR, this.GRAPH_Y, this.PR, Math.round((1 - (value / maxValue)) * this.GRAPH_HEIGHT));

        }
    }


}