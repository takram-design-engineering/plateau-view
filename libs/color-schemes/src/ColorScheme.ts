import { interpolate, quantize, rgb, scaleLinear, type ScaleLinear } from 'd3'
import invariant from 'tiny-invariant'

import { type ColorTuple, type LUT } from './types'

export type ColorSchemeType = 'sequential' | 'diverging'

export class ColorScheme<T extends ColorSchemeType = ColorSchemeType> {
  constructor(readonly type: T, readonly lut: LUT) {
    invariant(lut.length > 1)
  }

  #linear?: ScaleLinear<ColorTuple, ColorTuple> | undefined
  linear(value: number): ColorTuple {
    if (this.#linear == null) {
      this.#linear = scaleLinear<ColorTuple>()
        .domain(quantize(interpolate(0, 1), this.lut.length))
        .range(this.lut)
        .clamp(true)
    }
    const result = this.#linear(value)
    invariant(result != null)
    return result
  }

  get count(): number {
    return this.lut.length
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
      context.fillStyle = rgb(r * 255, g * 255, b * 255).toString()
      context.fillRect(index, 0, 1, 1)
    })
    return canvas
  }
}
