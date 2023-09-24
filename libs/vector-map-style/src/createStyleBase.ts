import { merge } from 'lodash'
import { type AnyLayer, type Style } from 'mapbox-gl'
import { type SetRequired } from 'type-fest'

import rawStyle from './assets/std.json'

export type AdditionalLayer =
  | {
      after: string
      layer: AnyLayer
    }
  | {
      source: string
      after: string
      layer:
        | SetRequired<Partial<AnyLayer>, 'id'>
        | ((source: AnyLayer) => AnyLayer)
    }

export function createStyleBase(
  additionalLayers?: readonly AdditionalLayer[]
): Style {
  const style = { ...(rawStyle as Style) }

  // Remove data sources to reduce unused requests.
  delete style.sprite
  delete style.glyphs

  const layers = [...style.layers]
  additionalLayers?.forEach(params => {
    const afterIndex = layers.findIndex(({ id }) => id === params.after)
    if (afterIndex === -1) {
      throw new Error(`Layer not found: ${params.after}`)
    }
    let additionalLayer
    if ('source' in params && params != null) {
      const source = layers.find(({ id }) => id === params.source)
      if (source == null) {
        throw new Error(`Layer not found: ${params.source}`)
      }
      if (typeof params.layer === 'function') {
        additionalLayer = params.layer(source)
        layers.splice(afterIndex + 1, 0, params.layer(source))
      } else {
        additionalLayer = merge({}, source, params.layer)
      }
    } else {
      additionalLayer = params.layer
    }
    layers.splice(afterIndex + 1, 0, additionalLayer)
  })
  return {
    ...style,
    layers
  }
}
