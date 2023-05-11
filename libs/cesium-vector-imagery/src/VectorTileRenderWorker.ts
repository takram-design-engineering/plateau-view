import { type LabelRule, type Rule as PaintRule, type Zxy } from 'protomaps'
import { type TransferDescriptor } from 'threads'
import { Transfer, expose } from 'threads/worker'
import invariant from 'tiny-invariant'

import { VectorTileRenderer } from './VectorTileRenderer'
import { createStyleFromJSON } from './createStyleFromJSON'

export interface TileRendererParams {
  url: string
  styleUrl?: string
  maximumZoom?: number
}

export interface RenderTileParams extends TileRendererParams {
  coords: Zxy
  canvasWidth: number
  canvasHeight: number
}

export interface RenderTileResult {
  image?: ImageBitmap
}

const tileRenderers = new Map<string, VectorTileRenderer<OffscreenCanvas>>()

function createTileRenderKey({
  url,
  styleUrl,
  maximumZoom
}: TileRendererParams): string {
  return `${url}:${styleUrl}:${maximumZoom}`
}

async function getTileRenderer(
  params: TileRendererParams
): Promise<VectorTileRenderer<OffscreenCanvas>> {
  const key = createTileRenderKey(params)
  let tileRenderer = tileRenderers.get(key)
  if (tileRenderer == null) {
    const { url, styleUrl, maximumZoom } = params
    let paintRules: PaintRule[]
    let labelRules: LabelRule[]
    if (styleUrl != null) {
      const style = await (await fetch(styleUrl)).json()
      ;({ paintRules, labelRules } = createStyleFromJSON(style))
    } else {
      paintRules = []
      labelRules = []
    }
    const labelersCanvas = new OffscreenCanvas(1, 1)
    tileRenderer = new VectorTileRenderer({
      url,
      maximumZoom,
      paintRules,
      labelRules,
      labelersCanvas
    })
    tileRenderers.set(key, tileRenderer)
  }
  return tileRenderer
}

expose({
  renderTile: async ({
    coords,
    canvasWidth,
    canvasHeight,
    ...tileRendererParams
  }: RenderTileParams): Promise<TransferDescriptor<RenderTileResult>> => {
    const canvas = new OffscreenCanvas(canvasWidth, canvasHeight)
    const context = canvas.getContext('2d')
    invariant(context != null)
    const tileRenderer = await getTileRenderer(tileRendererParams)
    await tileRenderer.renderTile(coords, canvas)
    const image = canvas.transferToImageBitmap()
    return Transfer({ image }, [image])
  }
})

export type VectorTileRenderWorker = object & {
  renderTile: (params: RenderTileParams) => RenderTileResult
}
