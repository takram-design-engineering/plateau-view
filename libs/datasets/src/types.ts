import { type Cesium3DTileset } from '@cesium/engine'
import { type Primitive } from 'type-fest'

export type TilesetPrimitiveConstructorOptions = {
  [K in keyof Cesium3DTileset.ConstructorOptions]: Cesium3DTileset.ConstructorOptions[K] extends Primitive
    ? Cesium3DTileset.ConstructorOptions[K]
    : never
}
