import { Cartesian2, Material, type Rectangle } from '@cesium/engine'

import { colorMapViridis, type ColorMap } from '@takram/plateau-color-maps'

import heatmapMeshMaterial from './shaders/heatmapMeshMaterial.glsl?raw'
import makeContour from './shaders/makeContour.glsl?raw'
import unpackIntBicubic from './shaders/unpackIntBicubic.glsl?raw'

export interface HeatmapMeshMaterialOptions {
  image: string | HTMLCanvasElement
  width: number
  height: number
  minValue?: number
  maxValue?: number
  rectangle?: Rectangle
  cropRectangle?: Rectangle
  colorMap?: ColorMap
  alpha?: number
  contourSpacing?: number
  contourThickness?: number
  contourAlpha?: number
  logarithmic?: boolean
}

export class HeatmapMeshMaterial extends Material {
  constructor({
    image,
    width,
    height,
    minValue = 0,
    maxValue = 1,
    rectangle,
    cropRectangle,
    colorMap = colorMapViridis,
    alpha = 1,
    contourSpacing = 10,
    contourThickness = 2,
    contourAlpha = 0.3,
    logarithmic = false
  }: HeatmapMeshMaterialOptions) {
    const imageScale = new Cartesian2(1, 1)
    const imageOffset = new Cartesian2()
    if (rectangle != null && cropRectangle != null) {
      imageScale.x = cropRectangle.width / rectangle.width
      imageScale.y = cropRectangle.height / rectangle.height
      imageOffset.x = (cropRectangle.west - rectangle.west) / rectangle.width
      imageOffset.y = (cropRectangle.south - rectangle.south) / rectangle.height
    }
    super({
      fabric: {
        type: 'HeatmapMesh',
        uniforms: {
          colorMap: colorMap.createImage(),
          image,
          imageScale,
          imageOffset,
          width,
          height,
          minValue,
          maxValue,
          alpha,
          contourSpacing,
          contourThickness,
          contourAlpha,
          logarithmic
        },
        source: [unpackIntBicubic, makeContour, heatmapMeshMaterial].join('\n')
      }
    })
  }
}
