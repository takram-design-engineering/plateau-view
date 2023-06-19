import { type LabelRule, type Rule as PaintRule, type Zxy } from 'protomaps'
import { type TransferDescriptor } from 'threads'
import { expose } from 'threads/worker'
import invariant from 'tiny-invariant'
import { type JsonObject } from 'type-fest'

import { createStyleFromJSON } from './createStyleFromJSON'
import {
  VectorTileRenderer,
  type VectorTileRendererOptions
} from './VectorTileRenderer'

export interface TileRendererParams
  extends Omit<
    VectorTileRendererOptions<OffscreenCanvas>,
    'paintRules' | 'labelRules' | 'labelersCanvas'
  > {
  style?: string | JsonObject // TODO: Refine type
}

export interface RenderTileParams extends TileRendererParams {
  coords: Zxy
  canvas: OffscreenCanvas
}

const tileRenderers = new Map<string, VectorTileRenderer<OffscreenCanvas>>()

function createTileRenderKey({
  url,
  style,
  maximumZoom
}: TileRendererParams): string {
  return `${url}:${
    // TODO: Maybe require style ID in the parameters?
    typeof style === 'string' ? style : JSON.stringify(style)
  }:${maximumZoom}`
}

async function getTileRenderer(
  params: TileRendererParams
): Promise<VectorTileRenderer<OffscreenCanvas>> {
  const key = createTileRenderKey(params)
  let tileRenderer = tileRenderers.get(key)
  if (tileRenderer == null) {
    const { url, style } = params
    let paintRules: PaintRule[]
    let labelRules: LabelRule[]
    if (style != null) {
      ;({ paintRules, labelRules } = createStyleFromJSON(
        typeof style === 'string' ? await (await fetch(style)).json() : style
      ))
    } else {
      paintRules = []
      labelRules = []
    }
    tileRenderer = new VectorTileRenderer({
      ...params,
      url,
      paintRules,
      ...(labelRules.length > 0 && {
        labelRules,
        labelersCanvas: new OffscreenCanvas(1, 1)
      })
    })
    tileRenderers.set(key, tileRenderer)
  }
  return tileRenderer
}

expose({
  renderTile: async ({
    coords,
    canvas,
    ...tileRendererParams
  }: RenderTileParams): Promise<void> => {
    const context = canvas.getContext('2d')
    invariant(context != null)
    const tileRenderer = await getTileRenderer(tileRendererParams)
    await tileRenderer.renderTile(coords, canvas)

    // Clear cache at the end of every rendering because the cache takes too
    // much heap memory.
    // TODO: Add some threshold.
    tileRenderer.clearCache()

    // Although I could not find the documentation, it appears that we have to
    // wait for the next animation frame for the canvas to finish rendering.
    await new Promise(resolve => {
      requestAnimationFrame(resolve)
    })
  }
})

export type VectorTileRenderWorker = object & {
  renderTile: (params: TransferDescriptor<RenderTileParams>) => void
}
