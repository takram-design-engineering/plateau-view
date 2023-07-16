import { type Style } from 'mapbox-gl'

export interface VectorTileOptions {
  path: string
  mapStyle: string | JSON | Style
  maximumLevel: number
  nativeMaximumLevel: number
  tileSize?: number
}
