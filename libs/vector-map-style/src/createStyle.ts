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

import { isNotNullish } from '@takram/plateau-type-helpers'

import { createStyleBase } from './createStyleBase'

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
  道路中心線ククリ0: { type: 'line' },
  道路中心線色0: { type: 'line' },
  鉄道中心線駅ククリ0: { type: 'line' },
  鉄道中心線0: { type: 'line' },
  railwayCenterline0: { type: 'line' },
  鉄道中心線旗竿0: { type: 'line' },
  railwayDash0: { type: 'line' },
  道路中心線ククリ橋0: { type: 'line' },
  道路中心線色橋0: { type: 'line' },
  建築物0: { type: 'fill' },
  建築物の外周線0: { type: 'line' },
  鉄道中心線橋ククリ黒0: { type: 'line' },
  鉄道中心線橋ククリ白0: { type: 'line' },
  鉄道中心線橋駅ククリ0: { type: 'line' },
  鉄道中心線橋0: { type: 'line' },
  鉄道中心線旗竿橋0: { type: 'line' },
  道路中心線ククリ1: { type: 'line' },
  道路中心線色1: { type: 'line' },
  鉄道中心線駅ククリ1: { type: 'line' },
  鉄道中心線1: { type: 'line' },
  railwayCenterline1: { type: 'line' },
  鉄道中心線旗竿1: { type: 'line' },
  railwayDash1: { type: 'line' },
  道路中心線ククリ橋1: { type: 'line' },
  道路中心線色橋1: { type: 'line' },
  鉄道中心線橋ククリ黒1: { type: 'line' },
  鉄道中心線橋ククリ白1: { type: 'line' },
  鉄道中心線橋駅ククリ1: { type: 'line' },
  鉄道中心線橋1: { type: 'line' },
  鉄道中心線旗竿橋1: { type: 'line' },
  建築物1: { type: 'fill' },
  建築物の外周線1: { type: 'line' },
  道路中心線ククリ2: { type: 'line' },
  道路中心線色2: { type: 'line' },
  鉄道中心線駅ククリ2: { type: 'line' },
  鉄道中心線2: { type: 'line' },
  railwayCenterline2: { type: 'line' },
  鉄道中心線旗竿2: { type: 'line' },
  railwayDash2: { type: 'line' },
  道路中心線ククリ橋2: { type: 'line' },
  道路中心線色橋2: { type: 'line' },
  鉄道中心線橋ククリ黒2: { type: 'line' },
  鉄道中心線橋ククリ白2: { type: 'line' },
  鉄道中心線橋駅ククリ2: { type: 'line' },
  鉄道中心線橋2: { type: 'line' },
  鉄道中心線旗竿橋2: { type: 'line' },
  建築物2: { type: 'fill' },
  建築物の外周線2: { type: 'line' },
  道路中心線ククリ3: { type: 'line' },
  道路中心線色3: { type: 'line' },
  鉄道中心線駅ククリ3: { type: 'line' },
  鉄道中心線3: { type: 'line' },
  railwayCenterline3: { type: 'line' },
  鉄道中心線旗竿3: { type: 'line' },
  railwayDash3: { type: 'line' },
  道路中心線ククリ橋3: { type: 'line' },
  道路中心線色橋3: { type: 'line' },
  鉄道中心線橋ククリ黒3: { type: 'line' },
  鉄道中心線橋ククリ白3: { type: 'line' },
  鉄道中心線橋駅ククリ3: { type: 'line' },
  鉄道中心線橋3: { type: 'line' },
  鉄道中心線旗竿橋3: { type: 'line' },
  建築物3: { type: 'fill' },
  建築物の外周線3: { type: 'line' },
  道路中心線ククリ4: { type: 'line' },
  道路中心線色4: { type: 'line' },
  鉄道中心線駅ククリ4: { type: 'line' },
  鉄道中心線4: { type: 'line' },
  railwayCenterline4: { type: 'line' },
  鉄道中心線旗竿4: { type: 'line' },
  railwayDash4: { type: 'line' },
  道路中心線ククリ橋4: { type: 'line' },
  道路中心線色橋4: { type: 'line' },
  鉄道中心線橋ククリ黒4: { type: 'line' },
  鉄道中心線橋ククリ白4: { type: 'line' },
  鉄道中心線橋駅ククリ4: { type: 'line' },
  鉄道中心線橋4: { type: 'line' },
  鉄道中心線旗竿橋4: { type: 'line' },
  建築物4: { type: 'fill' },
  建築物の外周線4: { type: 'line' },
  道路中心線破線: { type: 'line' },
  道路中心線階段: { type: 'line' },
  鉄道中心線地下トンネルククリ: { type: 'line' },
  鉄道中心線地下トンネル: { type: 'line' },
  軌道の中心線トンネル: { type: 'line' },
  道路縁: { type: 'line' },
  道路構成線トンネル内の道路: { type: 'line' },
  道路構成線分離帯: { type: 'line' },
  軌道の中心線: { type: 'line' },
  railwayTrackCenterlineDash: { type: 'line' },
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
  '建築物0', '建築物1', '建築物2', '建築物3', '建築物4',
  '建築物の外周線0', '建築物の外周線1', '建築物の外周線2', '建築物の外周線3', '建築物の外周線4',
  '道路中心線ククリ0', '道路中心線ククリ1', '道路中心線ククリ2', '道路中心線ククリ3', '道路中心線ククリ4',
  '道路中心線色0', '道路中心線色1', '道路中心線色2', '道路中心線色3', '道路中心線色4',
  '鉄道中心線駅ククリ0', '鉄道中心線駅ククリ1', '鉄道中心線駅ククリ2', '鉄道中心線駅ククリ3', '鉄道中心線駅ククリ4',
  '鉄道中心線0', '鉄道中心線1', '鉄道中心線2', '鉄道中心線3', '鉄道中心線4',
  'railwayCenterline0', 'railwayCenterline1', 'railwayCenterline2', 'railwayCenterline3', 'railwayCenterline4',
  'railwayDash0', 'railwayDash1', 'railwayDash2', 'railwayDash3', 'railwayDash4',
  '道路中心線ククリ橋0', '道路中心線ククリ橋1', '道路中心線ククリ橋2', '道路中心線ククリ橋3', '道路中心線ククリ橋4',
  '道路中心線色橋0', '道路中心線色橋1', '道路中心線色橋2', '道路中心線色橋3', '道路中心線色橋4',
  '鉄道中心線橋ククリ黒0', '鉄道中心線橋ククリ黒1', '鉄道中心線橋ククリ黒2', '鉄道中心線橋ククリ黒3', '鉄道中心線橋ククリ黒4',
  '鉄道中心線橋ククリ白0', '鉄道中心線橋ククリ白1', '鉄道中心線橋ククリ白2', '鉄道中心線橋ククリ白3', '鉄道中心線橋ククリ白4',
  '鉄道中心線橋駅ククリ0', '鉄道中心線橋駅ククリ1', '鉄道中心線橋駅ククリ2', '鉄道中心線橋駅ククリ3', '鉄道中心線橋駅ククリ4',
  '鉄道中心線橋0', '鉄道中心線橋1', '鉄道中心線橋2', '鉄道中心線橋3', '鉄道中心線橋4',
  '軌道の中心線',
  'railwayTrackCenterlineDash',
  '鉄道中心線旗竿0', '鉄道中心線旗竿1', '鉄道中心線旗竿2', '鉄道中心線旗竿3', '鉄道中心線旗竿4',
  '鉄道中心線旗竿橋0', '鉄道中心線旗竿橋1', '鉄道中心線旗竿橋2', '鉄道中心線旗竿橋3', '鉄道中心線旗竿橋4',

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

const base = createStyleBase()

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
