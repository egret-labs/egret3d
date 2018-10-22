declare class Examples {
    start(): Promise<void>;
}

async function main() {
    if (RELEASE) {
        RES.processor.map("json", new JSONProcessor());
    }

    exampleStart();
    // new examples.SceneTest().start();
    // new examples.EUITest().start();
}

class JSONProcessor implements RES.processor.Processor {
    private _mergedCache?: { [index: string]: any };

    async onLoadStart(host: RES.ProcessHost, resource: RES.ResourceInfo): Promise<any> {
        const { type } = resource;
        if (type === 'legacyResourceConfig') {
            const data = host.load(resource, RES.processor.JsonProcessor);
            return data;
        }
        else {
            if (!this._mergedCache) {
                const r = (host as any).resourceConfig['getResource']("1.jsonbin");
                const data = await host.load(r, "bin");

                if (!this._mergedCache) {
                    const uint8 = new Uint8Array(data);
                    const result = pako.inflate(uint8, { to: 'string' });
                    this._mergedCache = JSON.parse(result);
                }
            }

            const result = this._mergedCache![resource.name];
            if (!result) {
                throw `missing resource ${resource.name}`;
            }

            return result;
        }
    }

    onRemoveStart(host: RES.ProcessHost, resource: RES.ResourceInfo): void {
    }

    getData?(host: RES.ProcessHost, resource: RES.ResourceInfo, key: string, subkey: string) {
        throw new Error("Method not implemented.");
    }
}

function exampleStart() {
    const exampleString = getCurrentExampleString();
    let exampleClass: any;

    if (exampleString.indexOf(".") > 0) { // Package
        const params = exampleString.split(".");
        exampleClass = (window as any).examples[params[0]][params[1]];
    }
    else {
        exampleClass = (window as any).examples[exampleString];
    }

    createGUI(exampleString);

    const exampleObj: Examples = new exampleClass();
    exampleObj.start();

    function createGUI(exampleString: string) {
        const namespaceExamples = (window as any).examples;
        const examples: string[] = [];

        for (const k in namespaceExamples) {
            const element = namespaceExamples[k];
            if (element.constructor === Object) { // Package
                for (const kB in element) {
                    examples.push([k, kB].join("."));
                }
            }
            else {
                examples.push(k);
            }
        }

        const guiComponent = paper.GameObject.globalGameObject.getOrAddComponent(paper.editor.GUIComponent);
        const gui = guiComponent.hierarchy.addFolder("Examples");
        const options = {
            example: exampleString
        };
        gui.add(options, "example", examples).onChange((example: string) => {
            location.href = getNewUrl(example);
        });
        gui.open();
    }

    function getNewUrl(exampleString: string[] | string) {
        let url = location.href;
        const index = url.indexOf("?");
        if (index !== -1) {
            url = url.slice(0, index);
        }
        if (url.indexOf(".html") === -1) {
            url += "index.html";
        }
        url += "?example=" + exampleString;
        return url;
    }

    function getCurrentExampleString() {
        let appFile = "Test";

        let str = location.search;
        str = str.slice(1, str.length);
        const totalArray = str.split("&");
        for (let i = 0; i < totalArray.length; i++) {
            const itemArray = totalArray[i].split("=");
            if (itemArray.length === 2) {
                const key = itemArray[0];
                const value = itemArray[1];
                if (key === "example") {
                    appFile = value;
                    break;
                }
            }
        }
        
        return appFile;
    }
}