namespace examples {
    export class EUITest {
        async start() {
            await RES.loadConfig("default.res.json", "resource/");
            await RES.getResAsync("logo.png");

            // Create camera.
            egret3d.Camera.main;

            { // Create cube.
                const cube = paper.GameObject.create("Cube");
                cube.transform.setLocalEulerAngles(45, 45, 0);
                cube.addComponent(RotateScript);

                const meshFilter = cube.addComponent(egret3d.MeshFilter);
                meshFilter.mesh = egret3d.DefaultMeshes.CUBE;

                const meshRenderer = cube.addComponent(egret3d.MeshRenderer);
                const texture = RES.getRes("logo.png") as egret3d.Texture;
                const material = egret3d.Material.create().setTexture(texture);
                meshRenderer.material = material;
            }

            { // Create UI.
                const gameObject = paper.GameObject.create("GameUI");
                gameObject.addComponent(egret3d.Egret2DRenderer);
                gameObject.addComponent(GameUIScript);
            }
        }
    }

    class RotateScript extends paper.Behaviour {
        private _timer: number = 0;

        public onUpdate(deltaTime: number) {
            this._timer += deltaTime;
            const sin = Math.sin(this._timer * 0.5);
            const cos = -Math.cos(this._timer * 0.5);

            this.gameObject.transform.setLocalEulerAngles(sin * 45, cos * 45, 0);
        }
    }

    class GameUIScript extends paper.Behaviour {
        public onStart() {
            const renderer = this.gameObject.getComponent(egret3d.Egret2DRenderer)!;
            const adapter = new egret3d.MatchWidthOrHeightAdapter();
            adapter.setResolution(egret3d.stage.size.w, egret3d.stage.size.h);
            renderer.screenAdapter = adapter;
            const assetAdapter = new AssetAdapter();
            egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
            egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());

            const theme = new eui.Theme("resource/2d/default.thm.json", renderer.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, onThemeLoadComplete, this);

            function onThemeLoadComplete() {
                const uiLayer = new eui.UILayer();
                uiLayer.touchEnabled = false;
                renderer.root.addChild(uiLayer);

                let button = new eui.Button();
                button.label = "Click!";
                button.horizontalCenter = 0;
                button.verticalCenter = 0;
                uiLayer.addChild(button);

                button.addEventListener(egret.TouchEvent.TOUCH_TAP, onButtonClick, null);

                function onButtonClick(e: egret.TouchEvent) {
                    showPannel("Button Click!");
                }

                function showPannel(title: string) {
                    let panel = new eui.Panel();
                    panel.title = title;
                    panel.horizontalCenter = 0;
                    panel.verticalCenter = 0;
                    uiLayer.addChild(panel);
                }
            }
        }
    }

    class ThemeAdapter implements eui.IThemeAdapter {
        public getTheme(url: string, onSuccess: Function, onError: Function, thisObject: any): void {
            function onResGet(e: string): void {
                onSuccess.call(thisObject, e);
            }

            function onResError(e: RES.ResourceEvent): void {
                if (e.resItem.url === url) {
                    RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, onResError as any, null);
                    onError.call(thisObject);
                }
            }

            if (typeof generateEUI !== 'undefined') {
                egret.callLater(() => {
                    onSuccess.call(thisObject, generateEUI);
                }, this);
            }
            else if (typeof generateEUI2 !== 'undefined') {
                RES.getResByUrl("resource/gameEui.json", (data: any, url: any) => {
                    (window as any)["JSONParseClass"]["setData"](data);
                    onResGet(data);
                    egret.callLater(() => {
                        onSuccess.call(thisObject, generateEUI2);
                    }, this);
                }, this, RES.ResourceItem.TYPE_JSON);
            }
            else {
                RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, onResError as any, null);
                RES.getResByUrl(url, onResGet, this, RES.ResourceItem.TYPE_TEXT);
            }
        }
    }

    declare var generateEUI: { paths: string[], skins: any };
    declare var generateEUI2: { paths: string[], skins: any };

    class AssetAdapter implements eui.IAssetAdapter {
        public getAsset(source: string, compFunc: Function, thisObject: any): void {
            function onGetRes(data: any): void {
                compFunc.call(thisObject, data, source);
            }
            let data = RES.getRes(source);
            if (data) {
                onGetRes(data);
            }
            else {
                RES.getResAsync(source, onGetRes, this);
            }
        }
    }
}