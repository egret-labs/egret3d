import { Scene } from "../../application/components/Scene";

export { PropertyScene };

const PropertyScene = {
    name: "Scene",
    match: (source: any) => (source instanceof Scene),
    serialize: ()=> {
        return undefined
    }
}