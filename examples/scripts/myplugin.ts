import * as path from 'path';

export class BakeInfo {
    currentRoot = "";
    readonly defaultRoot = "resource/";

    get root() {
        return this.currentRoot || this.defaultRoot;
    }
}

export const bakeInfo = new BakeInfo();

export const nameSelector = (p: string) => {
    if (p.indexOf("2d/") > 0) {
        return path.basename(p).replace(/\./gi, "_");
    }

    return p.replace(bakeInfo.root, "");
};

export class ModifyDefaultResJSONPlugin implements plugins.Command {
    constructor(public root?: string) {
    }

    async onFile(file: plugins.File) {
        if (this.root && file.origin.indexOf("default.res.json") >= 0) {
            const content = file.contents.toString().replace(new RegExp(this.root, "gi"), "");
            file.contents = new Buffer(content);
        }

        return file;
    }

    async onFinish(commandContext: plugins.CommandContext) {
    }
}

export class InspectorFilterPlugin implements plugins.Command {
    constructor(public enabled: boolean = true) {
    }

    async onFile(file: plugins.File) {
        if (this.enabled && file.origin.indexOf("inspector.js") >= 0 || file.origin.indexOf("inspector.min.js") >= 0) {
            return null;
        }

        return file;
    }

    async onFinish(commandContext: plugins.CommandContext) {
    }
}