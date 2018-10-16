declare class Examples {

    start(): Promise<void>
}

function main() {
    const exampleString = getCurrentExampleString();
    let exampleClass: any;

    if (exampleString.indexOf(".") > 0) { // Package
        const params = exampleString.split(".");
        exampleClass = (window as any).examples[params[0]][params[1]];
    }
    else {
        exampleClass = (window as any).examples[exampleString];
    }

    const exampleObj: Examples = new exampleClass();
    exampleObj.start();

    createGUI(exampleString);

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
        var appFile = "Test";

        var str = location.search;
        str = str.slice(1, str.length);
        var totalArray = str.split("&");
        for (var i = 0; i < totalArray.length; i++) {
            var itemArray = totalArray[i].split("=");
            if (itemArray.length === 2) {
                var key = itemArray[0];
                var value = itemArray[1];
                if (key === "example") {
                    appFile = value;
                    break;
                }
            }
        }
        return appFile;
    }
}