function main() {
    // if ((window || global).dat) {
    //     // fps TODO
    //     const div = <HTMLDivElement>document.getElementsByClassName("egret-player")[0];
    //     Stats.show(div);
    // }

    startExamples();
    // Or your progject start.
}

function startExamples() {
    const guiComponent = paper.GameObject.globalGameObject.getOrAddComponent(paper.editor.GUIComponent);
    const allScripts = window["allScripts"] as string[];
    const examples = [] as string[];

    for (const example of allScripts) {
        const index = example.indexOf("examples");
        if (index > 0) {
            examples.push(example.substr(index + "examples/".length).split(".")[0]);
        }
    }

    const current = getCurrentTest();
    const options = {
        example: current,
    };
    const gui = guiComponent.hierarchy.addFolder("Examples");
    gui.open();
    gui.add(options, "example", examples).onChange((v: string) => {
        let url = location.href;
        const index = url.indexOf("?");
        if (index !== -1) {
            url = url.slice(0, index);
        }
        if (url.indexOf(".html") === -1) {
            url += "index.html";
        }
        url += "?example=" + v;
        location.href = url;
    });

    window[current].start();

    function getCurrentTest() {
        var appFile;
        var hasTest = false;
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
                    hasTest = true;
                    break;
                }
            }
        }

        if (!hasTest) {
            appFile = examples.indexOf("Test") >= 0 ? "Test" : examples[0];
        }

        return appFile;
    }
}