import { type ImageryLayer } from '@cesium/engine'

export interface Imagery {
  imageryLayer: ImageryLayer
  x: number
  y: number
  level: number
}

export interface KeyedImagery extends Imagery {
  key: string
  descendants: Imagery[]
}
