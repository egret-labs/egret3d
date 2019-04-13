import { IReleasable } from "./types";
/**
 * 
 */
export abstract class Releasable implements IReleasable {

    public static readonly releases: ReadonlyArray<IReleasable> = [];

    private _released: boolean = false;

    public initialize(): void {
        this._released = false;
    }

    public uninitialize(): void {
    }

    public release(): this {
        if (this._released) {
            if (DEBUG) {
                console.warn("The object has been released.");
            }

            return this;
        }

        const { releases } = Releasable;
        (releases as IReleasable[])[releases.length] = this;
        (this._released as boolean) = true;

        return this;
    }
}
