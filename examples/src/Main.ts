declare class Examples {

    start(): Promise<void>
}


function main() {

    const example = getCurrentTest();
    createGUI();
    const exampleClass = (window as any).examples[example];
    const exampleObj: Examples = new exampleClass();
    exampleObj.start();

    function createGUI() {

        const namespaceExamples = (window as any).examples;
        const examples: string[] = [];
        for (let exampleClassname in namespaceExamples) {
            examples.push(exampleClassname);
        }
        const guiComponent = paper.GameObject.globalGameObject.getOrAddComponent(paper.editor.GUIComponent);
        const gui = guiComponent.hierarchy.addFolder("Examples");
        gui.open();
        const options = {
            example,
        };
        gui.add(options, "example", examples).onChange((example: string) => {
            location.href = getNewUrl(example);
        });
    }

    function getNewUrl(example: string) {
        let url = location.href;
        const index = url.indexOf("?");
        if (index !== -1) {
            url = url.slice(0, index);
        }
        if (url.indexOf(".html") === -1) {
            url += "index.html";
        }
        url += "?example=" + example;
        return url;
    }

    function getCurrentTest() {
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