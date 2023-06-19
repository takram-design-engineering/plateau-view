import Point from '@mapbox/point-geometry'
import {
  Labelers,
  painter,
  TileCache,
  View,
  ZxySource,
  type Index,
  type LabelRule,
  type Rule as PaintRule,
  type PreparedTile,
  type Zxy
} from 'protomaps'
import invariant from 'tiny-invariant'

// WORKAROUND: The PLATEAU's MVTs don't use standard key-value structure but
// JSON encoded string in "attributes" field, which makes it impossible to
// filter features using standard MVT filters. I don't know why they did this,
// and whether all of their MVTs are created like this.
// Parse and expand it into the props here.
function correctAttributesProp(preparedTile: PreparedTile): void {
  for (const features of preparedTile.data.values()) {
    for (const feature of features) {
      if (
        'attributes' in feature.props &&
        // eslint-disable-next-line @typescript-eslint/dot-notation
        typeof feature.props['attributes'] === 'string'
      ) {
        // eslint-disable-next-line @typescript-eslint/dot-notation
        Object.assign(feature.props, JSON.parse(feature.props['attributes']))
        // eslint-disable-next-line @typescript-eslint/dot-notation, @typescript-eslint/no-dynamic-delete
        delete feature.props['attributes']
      }
    }
  }
}

export interface VectorTileRendererOptions<
  Canvas extends HTMLCanvasElement | OffscreenCanvas
> {
  url: string
  paintRules: readonly PaintRule[]
  labelRules?: readonly LabelRule[]
  labelersCanvas?: Canvas
  maximumZoom?: number
  zoomDifference?: number
}

export class VectorTileRenderer<
  Canvas extends HTMLCanvasElement | OffscreenCanvas
> {
  readonly paintRules: PaintRule[]
  readonly labelRules: LabelRule[] | undefined

  private readonly labelers: Labelers | undefined
  private readonly view: View
  private readonly internalSize = 256
  private readonly paddingSize = 16

  constructor(options: VectorTileRendererOptions<Canvas>) {
    this.paintRules = [...options.paintRules]
    if (options.labelRules != null && options.labelRules.length > 0) {
      this.labelRules = [...options.labelRules]
    }

    const source = new ZxySource(options.url, false)
    const cache = new TileCache(source, 1024)
    this.view = new View(
      cache,
      options.maximumZoom ?? 24,
      options.zoomDifference ?? 2
    )

    if (this.labelRules != null) {
      invariant(options.labelersCanvas != null)
      const labelersCanvasContext = options.labelersCanvas.getContext('2d')
      invariant(labelersCanvasContext != null)
      this.labelers = new Labelers(
        // Pretend OffscreenCanvasRenderingContext2D to be
        // CanvasRenderingContext2D.
        labelersCanvasContext as CanvasRenderingContext2D,
        this.labelRules,
        16, // maxLabeledTiles
        () => {}
      )
    }
  }

  clearCache(): void {
    this.view.tileCache.cache.clear()
  }

  async renderTile(coords: Zxy, canvas: Canvas): Promise<void> {
    const preparedTile = await this.view.getDisplayTile(coords)
    // See the discussion above.
    correctAttributesProp(preparedTile)
    const preparedTileMap = new Map([['', [preparedTile]]])

    let labelData: Index | null = null
    if (this.labelers != null) {
      this.labelers.add(coords.z, preparedTileMap)
      labelData = this.labelers.getIndex(preparedTile.z) ?? null
    }

    // Pretend OffscreenCanvasRenderingContext2D to be CanvasRenderingContext2D.
    const context = canvas.getContext('2d') as CanvasRenderingContext2D
    invariant(context != null)
    context.scale(
      canvas.width / this.internalSize,
      canvas.height / this.internalSize
    )

    const bbox = {
      minX: this.internalSize * coords.x - this.paddingSize,
      minY: this.internalSize * coords.y - this.paddingSize,
      maxX: this.internalSize * (coords.x + 1) + this.paddingSize,
      maxY: this.internalSize * (coords.y + 1) + this.paddingSize
    }
    const origin = new Point(
      this.internalSize * coords.x,
      this.internalSize * coords.y
    )
    painter(
      context,
      coords.z,
      preparedTileMap,
      labelData,
      this.paintRules,
      bbox,
      origin,
      false
    )
  }
}
