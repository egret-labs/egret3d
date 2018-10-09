function main(allScripts: string[]) {


    const examples = allScripts
        .filter(item => item.indexOf("examples") >= 0)
        .map(item => item.split("/").pop().split(".")[0]);

    const current = getCurrentTest();
    const guiComponent = paper.GameObject.globalGameObject.getOrAddComponent(paper.editor.GUIComponent);
    const gui = guiComponent.hierarchy.addFolder("Examples");
    gui.open();
    const options = {
        example: current,
    };
    gui.add(options, "example", examples).onChange((example: string) => {

        location.href = getNewUrl(example);
    });

    window[current].start();

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