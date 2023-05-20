import Point from '@mapbox/point-geometry'
import {
  Labelers,
  TileCache,
  View,
  ZxySource,
  painter,
  type LabelRule,
  type Rule as PaintRule,
  type Zxy
} from 'protomaps'
import invariant from 'tiny-invariant'

export interface VectorTileRendererOptions<
  Canvas extends HTMLCanvasElement | OffscreenCanvas
> {
  url: string
  paintRules: readonly PaintRule[]
  labelRules: readonly LabelRule[]
  labelersCanvas: Canvas
  maximumZoom?: number
  zoomDifference?: number
}

export class VectorTileRenderer<
  Canvas extends HTMLCanvasElement | OffscreenCanvas
> {
  readonly paintRules: PaintRule[]
  readonly labelRules: LabelRule[]

  private readonly labelers: Labelers
  private readonly view: View
  private readonly internalSize = 256
  private readonly paddingSize = 16

  constructor(options: VectorTileRendererOptions<Canvas>) {
    this.paintRules = [...options.paintRules]
    this.labelRules = [...options.labelRules]

    const source = new ZxySource(options.url, false)
    const cache = new TileCache(source, 1024)
    this.view = new View(
      cache,
      options.maximumZoom ?? 24,
      options.zoomDifference ?? 2
    )

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

  async renderTile(coords: Zxy, canvas: Canvas): Promise<void> {
    const preparedTile = await this.view.getDisplayTile(coords)
    const preparedTileMap = new Map([['', [preparedTile]]])
    this.labelers.add(coords.z, preparedTileMap)
    const labelData = this.labelers.getIndex(preparedTile.z)
    if (labelData == null) {
      return
    }

    const context = canvas.getContext('2d')
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
      // Pretend OffscreenCanvasRenderingContext2D to be
      // CanvasRenderingContext2D.
      context as CanvasRenderingContext2D,
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
