import { atom, type PrimitiveAtom } from 'jotai'
import { type SetOptional } from 'type-fest'

import { colorMapPlateau, type ColorMap } from '@takram/plateau-color-maps'
import {
  type QualitativeColorSet,
  type TileFeatureIndex
} from '@takram/plateau-datasets'

import {
  createDatasetLayerBase,
  type DatasetLayerModel,
  type DatasetLayerModelParams
} from './createDatasetLayerBase'

export interface PlateauTilesetLayerModelParams
  extends DatasetLayerModelParams {
  hiddenFeatures?: readonly string[]
}

export interface PlateauTilesetLayerModel extends DatasetLayerModel {
  isPlateauTilesetLayer: true
  featureIndexAtom: PrimitiveAtom<TileFeatureIndex | null>
  hiddenFeaturesAtom: PrimitiveAtom<readonly string[] | null>
  propertiesAtom: PrimitiveAtom<readonly PlateauTilesetProperty[] | null>
  colorPropertyAtom: PrimitiveAtom<string | null>
  colorMapAtom: PrimitiveAtom<ColorMap>
  colorRangeAtom: PrimitiveAtom<number[]>
  opacityAtom: PrimitiveAtom<number>
}

export type PlateauTilesetProperty = { name: string } & (
  | { type: 'unknown' }
  | {
      type: 'number'
      minimum: number
      maximum: number
    }
  | {
      type: 'qualitative'
      colorSet: QualitativeColorSet
    }
)

export function createPlateauTilesetLayerBase(
  params: PlateauTilesetLayerModelParams
): Omit<SetOptional<PlateauTilesetLayerModel, 'id'>, 'type'> {
  return {
    ...createDatasetLayerBase(params),
    isPlateauTilesetLayer: true,
    featureIndexAtom: atom<TileFeatureIndex | null>(null),
    hiddenFeaturesAtom: atom<readonly string[] | null>(null),
    propertiesAtom: atom<readonly PlateauTilesetProperty[] | null>(null),
    colorPropertyAtom: atom<string | null>(null),
    colorMapAtom: atom<ColorMap>(colorMapPlateau),
    colorRangeAtom: atom([0, 100]),
    opacityAtom: atom(1)
  }
}
