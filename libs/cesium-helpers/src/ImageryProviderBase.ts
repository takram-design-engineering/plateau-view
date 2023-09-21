import {
  Event as CesiumEvent,
  WebMercatorTilingScheme,
  type Credit,
  type ImageryLayerFeatureInfo,
  type ImageryProvider,
  type ImageryTypes,
  type Proxy,
  type Request,
  type TileDiscardPolicy,
  type TilingScheme
} from '@cesium/engine'

// Type assertions to "any" are necessary due to Cesium's poor type definitions.

export interface ImageryProviderBaseOptions {
  tilingScheme?: TilingScheme
  tileWidth?: number
  tileHeight?: number
}

export abstract class ImageryProviderBase implements ImageryProvider {
  // Deprecated fields
  readonly defaultAlpha = undefined
  readonly defaultNightAlpha = undefined
  readonly defaultDayAlpha = undefined
  readonly defaultBrightness = undefined
  readonly defaultContrast = undefined
  readonly defaultHue = undefined
  readonly defaultSaturation = undefined
  readonly defaultGamma = undefined
  readonly defaultMinificationFilter = undefined as any
  readonly defaultMagnificationFilter = undefined as any
  readonly ready: boolean = true
  readonly readyPromise: Promise<boolean> = Promise.resolve(true)

  tileWidth = 256
  tileHeight = 256
  maximumLevel: number | undefined = undefined
  minimumLevel = 0
  tilingScheme: TilingScheme = new WebMercatorTilingScheme()
  rectangle = this.tilingScheme.rectangle
  tileDiscardPolicy: TileDiscardPolicy = undefined as any
  errorEvent: CesiumEvent = new CesiumEvent()
  credit: Credit = undefined as any
  proxy: Proxy = undefined as any
  hasAlphaChannel = true

  constructor(options?: ImageryProviderBaseOptions) {
    if (options?.tilingScheme != null) {
      this.tilingScheme = options.tilingScheme
    }
    if (options?.tileWidth != null) {
      this.tileWidth = options.tileWidth
    }
    if (options?.tileHeight != null) {
      this.tileHeight = options.tileHeight
    }
  }

  getTileCredits(x: number, y: number, level: number): Credit[] {
    return undefined as any
  }

  requestImage(
    x: number,
    y: number,
    level: number,
    request?: Request | undefined
  ): Promise<ImageryTypes> | undefined {
    return undefined
  }

  pickFeatures(
    x: number,
    y: number,
    level: number,
    longitude: number,
    latitude: number
  ): Promise<ImageryLayerFeatureInfo[]> | undefined {
    return undefined
  }

  // For backward compatibility. Remove this when targeting cesium 1.107.
  get _ready(): boolean {
    return this.ready
  }

  get _readyPromise(): Promise<boolean> {
    return this.readyPromise
  }
}
