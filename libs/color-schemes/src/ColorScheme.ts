import { interpolate, quantize, rgb, scaleLinear, type ScaleLinear } from 'd3'
import invariant from 'tiny-invariant'

import { type ColorTuple, type LUT } from './types'

export type ColorSchemeType = 'sequential' | 'diverging'

export class ColorScheme {
  constructor(readonly type: ColorSchemeType, readonly lut: LUT) {
    invariant(lut.length > 1)
  }

  #linear?: ScaleLinear<ColorTuple, ColorTuple> | undefined
  get linear(): ScaleLinear<ColorTuple, ColorTuple> {
    return (
      this.#linear ??
      (this.#linear = scaleLinear<ColorTuple>()
        .domain(quantize(interpolate(0, 1), this.lut.length))
        .range(this.lut)
        .clamp(true))
    )
  }

  quantize(count: number): ColorTuple[] {
    invariant(count > 1)
    return [...Array(count)].map((_, index) => {
      return this.linear(index / (count - 1))
    })
  }

  createImage(): HTMLCanvasElement {
    const canvas = document.createElement('canvas')
    canvas.width = this.lut.length
    canvas.height = 1
    const context = canvas.getContext('2d')
    invariant(context != null)
    this.lut.forEach(([r, g, b], index) => {
      context.fillStyle = rgb(r * 0xff, g * 0xff, b * 0xff).toString()
      context.fillRect(index, 0, 1, 1)
    })
    return canvas
  }
}
