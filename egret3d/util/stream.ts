// 0.04 处理utf8 string 不能用encode decode

namespace egret3d.io {

    export class BinReader {
        private _data: DataView;

        constructor(buf: ArrayBuffer, seek: number = 0) {
            this._seek = seek;
            this._data = new DataView(buf, seek);
        }

        private _seek: number;

        seek(seek: number) {
            this._seek = seek;
        }

        peek(): number {
            return this._seek;
        }

        length(): number {
            return this._data.byteLength;
        }

        canread(): number {
            return this._data.byteLength - this._seek;
        }

        readStringAnsi(): string {
            let slen = this._data.getUint8(this._seek);
            this._seek++;
            let bs: string = "";
            for (let i = 0; i < slen; i++) {
                bs += String.fromCharCode(this._data.getUint8(this._seek));
                this._seek++;
            }
            return bs;
        }

        static utf8ArrayToString(array: Uint8Array | number[]): string {
            let ret: string[] = [];
            for (let i = 0; i < array.length; i++) {
                let cc = array[i];
                if (cc == 0)
                    break;
                let ct = 0;
                if (cc > 0xE0) {
                    ct = (cc & 0x0F) << 12;
                    cc = array[++i];
                    ct |= (cc & 0x3F) << 6;
                    cc = array[++i];
                    ct |= cc & 0x3F;
                    ret.push(String.fromCharCode(ct));
                } else if (cc > 0xC0) {
                    ct = (cc & 0x1F) << 6;
                    cc = array[++i];
                    ct |= (cc & 0x3F) << 6;
                    ret.push(String.fromCharCode(ct));
                } else if (cc > 0x80) {
                    throw new Error("InvalidCharacterError");
                } else {
                    ret.push(String.fromCharCode(array[i]));
                }
            }
            return ret.join('');
        }

        readStringUtf8(): string {
            let length = this._data.getInt8(this._seek);
            this._seek++;
            let arr = new Uint8Array(length);
            this.readUint8Array(arr);
            return BinReader.utf8ArrayToString(arr);
        }

        readStringUtf8FixLength(length: number): string {
            let arr = new Uint8Array(length);
            this.readUint8Array(arr);
            return BinReader.utf8ArrayToString(arr);
        }

        readSingle(): number {
            let num = this._data.getFloat32(this._seek, true);
            this._seek += 4;
            return num;
        }

        readDouble(): number {
            let num = this._data.getFloat64(this._seek, true);
            this._seek += 8;
            return num;
        }

        readInt8(): number {
            let num = this._data.getInt8(this._seek);
            this._seek += 1;
            return num;
        }

        readUInt8(): number {
            let num = this._data.getUint8(this._seek);
            this._seek += 1;
            return num;
        }

        readInt16(): number {
            let num = this._data.getInt16(this._seek, true);
            this._seek += 2;
            return num;
        }

        readUInt16(): number {
            let num = this._data.getUint16(this._seek, true);
            this._seek += 2;
            return num;
        }

        readInt32(): number {
            let num = this._data.getInt32(this._seek, true);
            this._seek += 4;
            return num;
        }

        readUInt32(): number {
            let num = this._data.getUint32(this._seek, true);
            this._seek += 4;
            return num;
        }

        readUint8Array(target: Uint8Array = null, offset: number = 0, length: number = -1): Uint8Array {
            if (length < 0) length = target.length;
            for (let i = 0; i < length; i++) {
                target[i] = this._data.getUint8(this._seek);
                this._seek++;
            }
            return target;
        }

        readUint8ArrayByOffset(target: Uint8Array, offset: number, length: number = 0): Uint8Array {
            if (length < 0) length = target.length;
            for (let i = 0; i < length; i++) {
                target[i] = this._data.getUint8(offset);
                offset++;
            }
            return target;
        }

        readUint16Array(target: Uint16Array = null, offset: number = 0, length: number = -1): Uint16Array {
            if (length < 0) length = target.length;
            for (let i = 0; i < length; i++) {
                target[i] = this.readUInt16();
            }
            return target;
        }

        readSingleArray(target: Float32Array = null, offset: number = 0, length: number = -1): Float32Array {
            if (length < 0) length = target.length;
            // console.log(this._data.byteLength, this._data.byteOffset);
            for (let i = 0; i < length; i++) {
                // target[i] = this._data.getFloat32(this._seek, true);
                // this._seek += 4;
                target[i] = this.readSingle();
            }
            return target;
        }

        public set position(value: number) {
            this.seek(value);
        }

        public get position(): number {
            return this.peek();
        }

        readBoolean(): boolean {
            return this.readUInt8() > 0;
        }

        readByte(): number {
            return this.readUInt8();
        }

        readBytes(target: Uint8Array = null, offset: number = 0, length: number = -1): Uint8Array {
            return this.readUint8Array(target, offset, length);
        }

        readUnsignedShort(): number {
            return this.readUInt16();
        }

        readUnsignedInt(): number {
            return this.readUInt32();
        }

        readFloat(): number {
            return this.readSingle();
        }

        readUTFBytes(length: number): string {
            let arry = new Uint8Array(length);
            return BinReader.utf8ArrayToString(this.readUint8Array(arry));
        }

        readSymbolByte(): number {
            return this.readInt8();
        }

        readShort(): number {
            return this.readInt16();
        }

        readInt(): number {
            return this.readInt32();
        }
    }

    export class BinWriter {
        _buf: Uint8Array;

        private _data: DataView;

        private _length: number;

        private _seek: number;

        constructor() {
            let buf = new ArrayBuffer(1024);
            this._length = 0;

            this._buf = new Uint8Array(buf);
            this._data = new DataView(this._buf.buffer);
            this._seek = 0;
        }

        private sureData(addlen: number): void {
            let nextlen = this._buf.byteLength;
            while (nextlen < (this._length + addlen)) {
                nextlen += 1024;
            }
            if (nextlen != this._buf.byteLength) {
                let newbuf = new Uint8Array(nextlen);
                for (let i = 0; i < this._length; i++) {
                    newbuf[i] = this._buf[i];
                }
                this._buf = newbuf;
                this._data = new DataView(this._buf.buffer);
            }
            this._length += addlen;
        }

        getLength(): number {
            return length;
        }

        getBuffer(): ArrayBuffer {
            return this._buf.buffer.slice(0, this._length);
        }

        seek(seek: number) {
            this._seek = seek;
        }

        peek(): number {
            return this._seek;
        }

        writeInt8(num: number): void {
            this.sureData(1);
            this._data.setInt8(this._seek, num);
            this._seek++;
        }

        writeUInt8(num: number): void {
            this.sureData(1);
            this._data.setUint8(this._seek, num);
            this._seek++;
        }

        writeInt16(num: number): void {
            this.sureData(2);
            this._data.setInt16(this._seek, num, true);
            this._seek += 2;
        }

        writeUInt16(num: number): void {
            this.sureData(2);
            this._data.setUint16(this._seek, num, true);
            this._seek += 2;
        }

        writeInt32(num: number): void {
            this.sureData(4);
            this._data.setInt32(this._seek, num, true);
            this._seek += 4;
        }

        writeUInt32(num: number): void {
            this.sureData(4);
            this._data.setUint32(this._seek, num, true);
            this._seek += 4;
        }

        writeSingle(num: number): void {
            this.sureData(4);
            this._data.setFloat32(this._seek, num, true);
            this._seek += 4;
        }

        writeDouble(num: number): void {
            this.sureData(8);
            this._data.setFloat64(this._seek, num, true);
            this._seek += 8;
        }

        writeStringAnsi(str: string): void {
            let slen = str.length;
            this.sureData(slen + 1);
            this._data.setUint8(this._seek, slen);
            this._seek++;
            for (let i = 0; i < slen; i++) {
                this._data.setUint8(this._seek, str.charCodeAt(i));
                this._seek++;
            }
        }

        writeStringUtf8(str: string) {
            let bstr = BinWriter.stringToUtf8Array(str);
            this.writeUInt8(bstr.length);
            this.writeUint8Array(bstr);
        }

        static stringToUtf8Array(str: string): number[] {
            let bstr: number[] = [];
            for (let i = 0; i < str.length; i++) {
                let c = str.charAt(i);
                let cc = c.charCodeAt(0);
                if (cc > 0xFFFF) {
                    throw new Error("InvalidCharacterError");
                }
                if (cc > 0x80) {
                    if (cc < 0x07FF) {
                        let c1 = (cc >>> 6) | 0xC0;
                        let c2 = (cc & 0x3F) | 0x80;
                        bstr.push(c1, c2);
                    } else {
                        let c1 = (cc >>> 12) | 0xE0;
                        let c2 = ((cc >>> 6) & 0x3F) | 0x80;
                        let c3 = (cc & 0x3F) | 0x80;
                        bstr.push(c1, c2, c3);
                    }
                } else {
                    bstr.push(cc);
                }
            }
            return bstr;
        }

        writeStringUtf8DataOnly(str: string) {
            let bstr = BinWriter.stringToUtf8Array(str);
            this.writeUint8Array(bstr);
        }

        writeUint8Array(array: Uint8Array | number[], offset: number = 0, length: number = -1) {
            if (length < 0) length = array.length;
            this.sureData(length);
            for (let i = offset; i < offset + length; i++) {
                this._data.setUint8(this._seek, array[i]);
                this._seek++;
            }
        }

        public get length(): number {
            return this._seek;
        }

        writeByte(num: number): void {
            this.writeUInt8(num);
        }

        writeBytes(array: Uint8Array | number[], offset: number = 0, length: number = 0) {
            this.writeUint8Array(array, offset, length);
        }

        writeUnsignedShort(num: number): void {
            this.writeUInt16(num);
        }

        writeUnsignedInt(num: number): void {
            this.writeUInt32(num);
        }

        writeFloat(num: number): void {
            this.writeSingle(num);
        }

        writeUTFBytes(str: string): void {
            let strArray = BinWriter.stringToUtf8Array(str);
            this.writeUint8Array(strArray);
        }

        writeSymbolByte(num: number): void {
            this.writeInt8(num);
        }

        writeShort(num: number): void {
            this.writeInt16(num);
        }

        writeInt(num: number): void {
            this.writeInt32(num);
        }
    }
}