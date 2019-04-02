
async function main() {
    exampleStart();
    // new examples.EUITest().start();
}

namespace examples {

    export interface Example {
        start(): Promise<void>;
    }
}

function exampleStart() {
    const exampleString = getCurrentExampleString();
    createGUI(exampleString);

    let exampleClass: { new(): examples.Example };

    if (exampleString.indexOf(".") > 0) { // Package
        const params = exampleString.split(".");
        exampleClass = (window as any).examples[params[0]][params[1]];
    }
    else {
        exampleClass = (window as any).examples[exampleString];
    }

    const exampleObj: examples.Example = new exampleClass();
    exampleObj.start();

    function createGUI(exampleString: string) {
        const inspectorComponent = paper.Application.sceneManager.globalEntity.getComponent(paper.editor.InspectorComponent);
        if (!inspectorComponent) {
            return;
        }

        const namespaceExamples = (window as any).examples;
        const examples: string[] = [];

        for (const k in namespaceExamples) {
            const element = namespaceExamples[k];
            if (element.constructor === Object) { // Package
                for (const kB in element) {
                    const childElement = element[kB];
                    if (childElement.prototype && childElement.prototype.hasOwnProperty("start")) {
                        examples.push([k, kB].join("."));
                    }
                }
            }
            else if (element.prototype && element.prototype.hasOwnProperty("start")) {
                examples.push(k);
            }
        }

        const gui = inspectorComponent.hierarchy.addFolder("Examples");
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