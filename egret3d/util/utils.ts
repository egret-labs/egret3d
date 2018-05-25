namespace egret3d.utils {
    /**
     * Get path by url
     * @param content text
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 获取RUL的PATH。
     * @param content 文本
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    export function getPathByUrl(url:string): string {
        return url.substring(0, url.lastIndexOf("/"));
    }

    export function combinePath(base:string, relative:string):string {
        var stack = base.split("/"),
            parts = relative.split("/");
        stack.pop(); // remove current file name (or empty string)
                    // (omit if "base" is the current folder without trailing slash)
        for (var i=0; i<parts.length; i++) {
            if (parts[i] == ".")
                continue;
            if (parts[i] == "..")
                stack.pop();
            else
                stack.push(parts[i]);
        }
        return stack.join("/");
    }

    export function getRelativePath(targetPath : string, sourcePath : string){
            let relPath = "";
			targetPath = targetPath.replace ("\\", "/");
			sourcePath = sourcePath.replace ("\\", "/");
			let targetPathArr = targetPath.split ('/');
			const sourcePathArr = sourcePath.split ('/');
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
			relPath = relPath.replace (" ", "_");

			return relPath;
    }

    /**
     * first char to lower case
     * @param str source string
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 将一个字符串中的第一个字符转为小写
     * @param str 要处理的字符串
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    export function firstCharToLowerCase(str: string):string {
        let firstChar = str.substr(0, 1).toLowerCase();
        let other = str.substr(1);
        return firstChar + other;
    }

    /**
     * replace all
     * @param srcStr source string
     * @param fromStr from string
     * @param toStr to string
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 将一个字符串中的所有指定字符替换为指定字符
     * @param srcStr 要处理的字符串
     * @param fromStr 原字符串中的指定字符串
     * @param toStr 将被替换为的字符串
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    export function replaceAll(srcStr: string, fromStr: string, toStr: string) {
        return srcStr.replace(new RegExp(fromStr, 'gm'), toStr);
    }

    /**
     * remove all space
     * @param str source string
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 剔除掉字符串中所有的空格
     * @param str 要处理的字符串
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    export function trimAll(str: string):string {
        str += ""; // number to string
        var result = str.replace(/(^\s+)|(\s+$)/g, "");
        result = result.replace(/\s/g, "");
        return result;
    }

    /**
     * Convert string to blob
     * @param content text
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * string转换为blob。
     * @param content 文本
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    export function stringToBlob(content: string) {
        var u8 = new Uint8Array(stringToUtf8Array(content));
        var blob = new Blob([u8]);
        return blob;
    }

    /**
     * Convert string to utf8 array
     * @param str text
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * string转换为utf8数组。
     * @param str 文本
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    export function stringToUtf8Array(str: string): number[] {
        var bstr: number[] = [];
        for (var i = 0; i < str.length; i++) {
            var c = str.charAt(i);
            var cc = c.charCodeAt(0);
            if (cc > 0xFFFF) {
                throw new Error("InvalidCharacterError");
            }
            if (cc > 0x80) {
                if (cc < 0x07FF) {
                    var c1 = (cc >>> 6) | 0xC0;
                    var c2 = (cc & 0x3F) | 0x80;
                    bstr.push(c1, c2);
                } else {
                    var c1 = (cc >>> 12) | 0xE0;
                    var c2 = ((cc >>> 6) & 0x3F) | 0x80;
                    var c3 = (cc & 0x3F) | 0x80;
                    bstr.push(c1, c2, c3);
                }
            } else {
                bstr.push(cc);
            }
        }
        return bstr;
    }

    export function caclStringByteLength(value: string): number {
        let total = 0;
        for (let i = 0; i < value.length; i++) {
            let charCode = value.charCodeAt(i);
            if (charCode <= 0x007f) {
                total += 1;
            } else if (charCode <= 0x07ff) {
                total += 2;
            } else if (charCode <= 0xffff) {
                total += 3;
            } else {
                total += 4;
            }
        }
        return total;
    }

    export function getKeyCodeByAscii(ev: KeyboardEvent) {
        if (ev.shiftKey) {
            return ev.keyCode - 32;
        } else {
            return ev.keyCode;
        }
    }
}