import { Deserializer } from "../../serialize/Deserializer";
import { DeserializeContext } from "../../serialize/DeserializeContext";
import { SerializeContext } from "../../serialize/SerializeContext";
import { Serializer } from "../../serialize/Serializer";
import { Asset } from "../../asset/Asset";

export { PropertyAssetDeserialize, PropertyAssetSerialize };

// TODO: IAssetReference
type IAssetReference = any;

const KEY_ASSET: keyof IAssetReference = "asset";
const PropertyAssetDeserialize = {
    name: 'asset',
    match: (source: any) => (KEY_ASSET in source),
    deserialize: (source: any, context: DeserializeContext) => {
        const assetIndex = (source as IAssetReference).asset;
        if (assetIndex >= 0) {
            // TODO 资源获取不到时，对应返回的资源方案
            // 材质应返回 MISSING
            // 纹理应返回 MISSING
            // Shader 
            // Mesh
            // ...
            return Asset.find(context.assets[assetIndex]);
        }
        return null;
    },
}

const PropertyAssetSerialize = {
    name: 'asset',
    match: (source: any, _context: SerializeContext) => {
        return (KEY_ASSET in source) && source instanceof Asset;
    },
    serialize: (source: any, _context: SerializeContext) => {
        // 没有名字的 Asset 为非法情况
        if (!source.name) {
            return { asset: -1 };
        }

        const assets = _context.result.assets;
        let index = assets.indexOf(source.name);

        if (index < 0) {
            index = assets.length;
            assets.push(source.name);
        }

        return { asset: index };
    },
}

Deserializer.propertyHandlers[PropertyAssetDeserialize.name] = PropertyAssetDeserialize;
Serializer.propertyHandlers[PropertyAssetSerialize.name] = PropertyAssetSerialize;
