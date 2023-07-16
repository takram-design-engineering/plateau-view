import { merge } from 'lodash'
import {
  type AnyLayer,
  type BackgroundLayer,
  type BackgroundLayout,
  type BackgroundPaint,
  type FillLayer,
  type FillLayout,
  type FillPaint,
  type LineLayer,
  type LineLayout,
  type LinePaint,
  type Style
} from 'mapbox-gl'

import { isNotNullish } from '@takram/plateau-type-helpers'

import baseStyle from './assets/std.json'

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
  鉄道中心線旗竿0: { type: 'line' },
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
  鉄道中心線旗竿1: { type: 'line' },
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
  鉄道中心線旗竿2: { type: 'line' },
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
  鉄道中心線旗竿3: { type: 'line' },
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
  鉄道中心線旗竿4: { type: 'line' },
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
type LayerId = keyof Layers

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
}

export interface FillLayerStyle extends LayerStyleBase {
  paint?: FillPaint
  layout?: FillLayout
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

export interface StyleOptions {
  layerStyles: LayerStyles
}

export function createStyle({ layerStyles }: StyleOptions): Style {
  return {
    ...(baseStyle as Style),
    layers: (baseStyle as Style).layers
      .filter(layer => layerStyles[layer.id as LayerId] != null)
      .map(layer => {
        const layerStyle = layerStyles[layer.id as LayerId]
        if (layerStyle == null) {
          return undefined
        }
        // @ts-expect-error No intersection
        const result: BackgroundLayer | LineLayer | FillLayer = {
          ...layer,
          paint: layerStyle?.paint ?? {},
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
