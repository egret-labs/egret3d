import * as zlib from 'zlib';

export type MergeJSONOption = {
    root: string;
    nameSelector: (p: string) => string;
    mergeJSONSelector: (p: string) => string | null;
};

export class MergeJSONPlugin implements plugins.Command {
    private mergeList: { [filename: string]: { filename: string, content: string }[] } = {};

    constructor(private options: MergeJSONOption) {
    }

    async onFile(file: plugins.File) {
        if (file.origin.indexOf(this.options.root) !== 0) {
            return null;
        }

        const mergeResult = this.options.mergeJSONSelector(file.origin);
        if (mergeResult) {
            if (!this.mergeList[mergeResult]) {
                this.mergeList[mergeResult] = [];
            }

            const filename = this.options.nameSelector(file.origin);
            this.mergeList[mergeResult].push({ filename, content: file.contents.toString() });
        }

        return file;
    }

    async onFinish(commandContext: plugins.CommandContext) {
        for (let mergeFilename in this.mergeList) {
            const mergeItem = this.mergeList[mergeFilename];
            const json = {};

            mergeItem.forEach((item) => {
                json[item.filename] = JSON.parse(item.content);
            });
            const content = JSON.stringify(json, null, '\t');

            const jsonBuffer = await zip(content);
            commandContext.createFile(mergeFilename, jsonBuffer, { type: "zipjson" });
        }
    }
}

export class MergeBinaryPlugin implements plugins.Command {
    private mergeList: { [filename: string]: { filename: string, content: Buffer }[] } = {};
    private mergeSelector: (p: string) => string | null = (p: string) => {
        if (p.indexOf(".mesh.bin") >= 0 || p.indexOf(".ani.bin") >= 0) {
            return "resource/1.bin";
        }
        else {
            return null;
        }
    }

    async onFile(file: plugins.File) {
        const mergeResult = this.mergeSelector(file.origin);
        if (mergeResult) {
            if (!this.mergeList[mergeResult]) {
                this.mergeList[mergeResult] = [];
            }

            this.mergeList[mergeResult].push({ filename: file.origin.replace("resource/", ""), content: file.contents });

            return null;
        }

        return file;
    }

    async onFinish(commandContext: plugins.CommandContext) {
        for (let mergeFilename in this.mergeList) {
            const mergeItem = this.mergeList[mergeFilename];

            let totalLength = 0;
            const json = {};
            mergeItem.forEach((item) => {
                json[item.filename] = { s: totalLength, l: item.content.byteLength };
                totalLength += item.content.byteLength;
            });

            const bufferList = mergeItem.map(item => item.content);
            const b = Buffer.concat(bufferList);

            const indexJson = JSON.stringify(json);
            const indexJsonBuffer = await zip(indexJson);

            const gltfContent = await zip(b);

            commandContext.createFile(mergeFilename + ".zipjson", indexJsonBuffer, { type: "zipjson" });
            commandContext.createFile(mergeFilename, gltfContent, { type: "bin" });
        }
    }
}


export class ModifyDefaultResJSON implements plugins.Command {
    constructor(private _root?: string) {
    }

    async onFile(file: plugins.File) {
        if (this._root && file.origin.indexOf("default.res.json") >= 0) {
            const content = file.contents.toString().replace(new RegExp(this._root, "gi"), "");
            file.contents = new Buffer(content);
        }

        return file;
    }

    async onFinish(commandContext: plugins.CommandContext) {

    }
}

function zip(input: any) {
    return new Promise<Buffer>((resolve, reject) => {
        zlib.deflate(input, (err, buffer) => {
            if (!err) {
                resolve(buffer);
            }
            else {
                reject(err);
            }
        });
    });
}