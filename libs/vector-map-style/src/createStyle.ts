import { merge } from 'lodash'
import {
  type AnyLayer,
  type BackgroundLayer,
  type BackgroundLayout,
  type BackgroundPaint,
  type Expression,
  type FillLayer,
  type FillLayout,
  type FillPaint,
  type LineLayer,
  type LineLayout,
  type LinePaint,
  type Style
} from 'mapbox-gl'
import invariant from 'tiny-invariant'

import { isNotNullish } from '@takram/plateau-type-helpers'

import { createStyleBase, type AdditionalLayer } from './createStyleBase'
import { sequence, sequenceKeys } from './helpers'

const layers = {
  background: { type: 'background' },
  行政区画: { type: 'fill' },
  水域: { type: 'fill' },
  地形表記面: { type: 'fill' },
  海岸線: { type: 'line' },
  河川中心線人工水路地下: { type: 'line' },
  河川中心線枯れ川部: { type: 'line' },
  河川中心線: { type: 'line' },
  海岸線堤防等に接する部分破線: { type: 'line' },
  水涯線: { type: 'line' },
  水涯線堤防等に接する部分破線: { type: 'line' },
  水部表記線polygon: { type: 'fill' },
  水部表記線line: { type: 'line' },
  水部表記線point: { type: 'symbol' },
  '行政区画界線25000所属界（所属を明示する境界線）': { type: 'line' },
  行政区画界線25000市区町村界: { type: 'line' },
  '行政区画界線25000都府県界及び北海道総合振興局・振興局界': { type: 'line' },
  行政区画界線地方界: { type: 'line' },
  行政区画界線国の所属界: { type: 'line' },
  等高線: { type: 'line' },
  等高線数値部: { type: 'symbol' },
  等深線: { type: 'line' },
  等深線数値部: { type: 'symbol' },
  地形表記線: { type: 'line' },
  水部構造物面: { type: 'fill' },
  水部構造物線: { type: 'line' },
  '道路中心線ZL4-10国道': { type: 'line' },
  '鉄道中心線ZL4-10': { type: 'line' },
  '道路中心線ZL4-10高速': { type: 'line' },

  ...sequenceKeys(5, {
    建築物: { type: 'fill' },
    建築物の外周線: { type: 'line' },
    道路中心線ククリ: { type: 'line' },
    道路中心線色: { type: 'line' },
    鉄道中心線駅ククリ: { type: 'line' },
    鉄道中心線: { type: 'line' },
    railwayCenterline: { type: 'line' },
    railwayDash: { type: 'line' },
    道路中心線ククリ橋: { type: 'line' },
    道路中心線色橋: { type: 'line' },
    鉄道中心線橋ククリ黒: { type: 'line' },
    鉄道中心線橋ククリ白: { type: 'line' },
    鉄道中心線橋駅ククリ: { type: 'line' },
    鉄道中心線橋: { type: 'line' },
    鉄道中心線旗竿: { type: 'line' },
    鉄道中心線旗竿橋: { type: 'line' }
  } as const),

  軌道の中心線: { type: 'line' },
  railwayTrackCenterlineDash: { type: 'line' },

  道路中心線破線: { type: 'line' },
  道路中心線階段: { type: 'line' },
  鉄道中心線地下トンネルククリ: { type: 'line' },
  鉄道中心線地下トンネル: { type: 'line' },
  軌道の中心線トンネル: { type: 'line' },
  道路縁: { type: 'line' },
  道路構成線トンネル内の道路: { type: 'line' },
  道路構成線分離帯: { type: 'line' },
  特定地区界: { type: 'line' },
  構造物面: { type: 'fill' },
  構造物面の外周線: { type: 'line' },
  構造物線: { type: 'line' },
  送電線: { type: 'line' },
  送電線破線: { type: 'line' },
  注記シンボル付き重なり: { type: 'symbol' },
  注記道路番号: { type: 'symbol' },
  注記シンボル付きソート順100以上: { type: 'symbol' },
  注記シンボルなし縦ソート順100以上: { type: 'symbol' },
  注記シンボルなし横ソート順100以上: { type: 'symbol' },
  注記角度付き線: { type: 'symbol' },
  注記シンボル付きソート順100未満: { type: 'symbol' },
  注記シンボルなし縦ソート順100未満: { type: 'symbol' },
  注記シンボルなし横ソート順100未満: { type: 'symbol' }
} as const

type Layers = typeof layers
export type LayerId = keyof Layers

// prettier-ignore
const layerOrder: readonly LayerId[] = [
  'background',
  '行政区画',
  '水域',
  '地形表記面',
  '海岸線',
  '河川中心線人工水路地下',
  '河川中心線枯れ川部',
  '河川中心線',
  '海岸線堤防等に接する部分破線',
  '水涯線',
  '水涯線堤防等に接する部分破線',
  '水部表記線polygon',
  '水部表記線line',
  '水部表記線point',
  '行政区画界線25000所属界（所属を明示する境界線）',
  '行政区画界線25000市区町村界',
  '行政区画界線25000都府県界及び北海道総合振興局・振興局界',
  '行政区画界線地方界',
  '行政区画界線国の所属界',
  '等高線',
  '等高線数値部',
  '等深線',
  '等深線数値部',
  '地形表記線',
  '水部構造物面',
  '水部構造物線',
  '道路中心線ZL4-10国道',
  '鉄道中心線ZL4-10',
  '道路中心線ZL4-10高速',

  // Render center lines of railway tracks below JR lines.
  ...sequence(5, '建築物'),
  ...sequence(5, '建築物の外周線'),
  ...sequence(5, '道路中心線ククリ'),
  ...sequence(5, '道路中心線色'),
  ...sequence(5, '鉄道中心線駅ククリ'),
  ...sequence(5, '鉄道中心線'),
  ...sequence(5, 'railwayCenterline'),
  ...sequence(5, 'railwayDash'),
  ...sequence(5, '道路中心線ククリ橋'),
  ...sequence(5, '道路中心線色橋'),
  ...sequence(5, '鉄道中心線橋ククリ黒'),
  ...sequence(5, '鉄道中心線橋ククリ白'),
  ...sequence(5, '鉄道中心線橋駅ククリ'),
  ...sequence(5, '鉄道中心線橋'),
  '軌道の中心線',
  'railwayTrackCenterlineDash',
  ...sequence(5, '鉄道中心線旗竿'),
  ...sequence(5, '鉄道中心線旗竿橋'),

  '道路中心線破線',
  '道路中心線階段',
  '鉄道中心線地下トンネルククリ',
  '鉄道中心線地下トンネル',
  '軌道の中心線トンネル',
  '道路縁',
  '道路構成線トンネル内の道路',
  '道路構成線分離帯',
  '特定地区界',
  '構造物面',
  '構造物面の外周線',
  '構造物線',
  '送電線',
  '送電線破線',
  '注記シンボル付き重なり',
  '注記道路番号',
  '注記シンボル付きソート順100以上',
  '注記シンボルなし縦ソート順100以上',
  '注記シンボルなし横ソート順100以上',
  '注記角度付き線',
  '注記シンボル付きソート順100未満',
  '注記シンボルなし縦ソート順100未満',
  '注記シンボルなし横ソート順100未満'
]

const additionalLayers: readonly AdditionalLayer[] = [
  ...[...Array(5)].map(
    (_, index): AdditionalLayer => ({
      source: `鉄道中心線${index}`,
      after: `鉄道中心線${index}`,
      layer: {
        id: `railwayCenterline${index}`
      }
    })
  ),
  ...[...Array(5)].map(
    (_, index): AdditionalLayer => ({
      source: `鉄道中心線橋ククリ白${index}`,
      after: `鉄道中心線橋ククリ白${index}`,
      layer: {
        id: `鉄道中心線橋ククリ白${index}`
      }
    })
  ),
  ...[...Array(5)].map(
    (_, index): AdditionalLayer => ({
      source: `鉄道中心線旗竿${index}`,
      after: `鉄道中心線旗竿${index}`,
      layer: source => {
        invariant(source.type === 'line')
        invariant(source.filter != null)
        return {
          ...source,
          id: `railwayDash${index}`,
          filter: [
            ...source.filter.slice(0, 1),
            ['!=', ['get', 'vt_rtcode'], 'JR'],
            ...source.filter.slice(2)
          ]
        }
      }
    })
  ),
  {
    source: '軌道の中心線',
    after: '軌道の中心線',
    layer: {
      id: 'railwayTrackCenterlineDash'
    }
  }
]

const base = createStyleBase(additionalLayers)

base.layers.forEach(layer => {
  if (layer.id.startsWith('鉄道中心線橋ククリ白')) {
    invariant(layer.type === 'line')
    invariant(layer.filter != null)
    // Exclude JR and railways at the stations.
    layer.filter.push(
      ['!=', ['get', 'vt_rtcode'], 'JR'],
      ['!=', ['get', 'vt_sngldbl'], '駅部分']
    )
  }
  if (layer.id === '道路中心線色0') {
    invariant(layer.type === 'line')
    invariant(layer.filter != null)
    // Always show lines.
    invariant(layer.filter[0] === 'step')
    layer.filter = layer.filter[2]
  }
})

interface LayerStyleBase {
  minZoom?: number | null
  maxZoom?: number | null
}

export interface BackgroundLayerStyle extends LayerStyleBase {
  paint?: BackgroundPaint
  layout?: BackgroundLayout
}

export interface LineLayerStyle extends LayerStyleBase {
  paint?: LinePaint
  layout?: LineLayout
  filter?: Expression
}

export interface FillLayerStyle extends LayerStyleBase {
  paint?: FillPaint
  layout?: FillLayout
  filter?: Expression
}

export type LayerStyles = {
  [K in LayerId]?: Layers[K]['type'] extends 'background'
    ? BackgroundLayerStyle | null
    : Layers[K]['type'] extends 'line'
    ? LineLayerStyle | null
    : Layers[K]['type'] extends 'fill'
    ? FillLayerStyle | null
    : never
}

export function createStyle(layerStyles: LayerStyles): Style {
  return {
    ...base,
    layers: layerOrder
      .map(layerId => {
        const layer = base.layers.find(({ id }) => id === layerId)
        if (layer == null) {
          throw new Error(`Layer not found: ${layerId}`)
        }
        const layerStyle = layerStyles[layerId]
        if (layerStyle == null) {
          return undefined
        }
        // @ts-expect-error No intersection
        const result: BackgroundLayer | LineLayer | FillLayer = {
          ...layer,
          paint: layerStyle?.paint ?? {},
          ...('filter' in layerStyle &&
            layerStyle?.filter != null && {
              filter: layerStyle?.filter
            }),
          ...('layout' in layer &&
            layerStyle?.layout != null && {
              layout: merge({}, layer.layout, layerStyle?.layout)
            })
        }
        if ('minZoom' in layerStyle) {
          if (layerStyle.minZoom == null) {
            delete result.minzoom
          } else {
            result.minzoom = layerStyle.minZoom
          }
        }
        if ('maxZoom' in layerStyle) {
          if (layerStyle.maxZoom == null) {
            delete result.maxzoom
          } else {
            result.maxzoom = layerStyle.maxZoom
          }
        }
        return result
      })
      .filter(isNotNullish) as AnyLayer[]
  }
}
