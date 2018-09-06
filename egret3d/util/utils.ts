namespace egret3d.utils {




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