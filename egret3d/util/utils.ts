namespace egret3d.utils {

    export function getPathByUrl(url: string): string {
        return url.substring(0, url.lastIndexOf("/"));
    }

    export function combinePath(base: string, relative: string): string {
        var stack = base.split("/"),
            parts = relative.split("/");
        stack.pop(); // remove current file name (or empty string)
        // (omit if "base" is the current folder without trailing slash)
        for (var i = 0; i < parts.length; i++) {
            if (parts[i] == ".")
                continue;
            if (parts[i] == "..")
                stack.pop();
            else
                stack.push(parts[i]);
        }
        return stack.join("/");
    }

    export function getRelativePath(targetPath: string, sourcePath: string) {
        let relPath = "";
        targetPath = targetPath.replace("\\", "/");
        sourcePath = sourcePath.replace("\\", "/");
        let targetPathArr = targetPath.split('/');
        const sourcePathArr = sourcePath.split('/');
        const targetPathLen = targetPathArr.length;
        const sourcePathLen = sourcePathArr.length;
        let i = 0;
        while (targetPathArr[i] == sourcePathArr[i] && i < targetPathLen && i < sourcePathLen) {
            i++;
        }
        for (let j = 0; j < sourcePathLen - i - 1; j++) {
            relPath += "../";
        }

        targetPathArr = targetPathArr.slice(i, targetPathArr.length);
        relPath = relPath + targetPathArr.join("/");
        relPath = relPath.replace(" ", "_");

        return relPath;
    }


}