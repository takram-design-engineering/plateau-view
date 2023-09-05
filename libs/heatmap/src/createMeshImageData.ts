import { omit } from 'lodash'
import invariant from 'tiny-invariant'

import { type MeshData } from './createMeshData'

export interface MeshImageData extends Omit<MeshData, 'data'> {
  image: HTMLCanvasElement
}

export function createMeshImageData(meshData: MeshData): MeshImageData {
  const { data, width, height } = meshData
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  invariant(context != null)
  const imageData = new ImageData(data, width, height)
  context.putImageData(imageData, 0, 0)
  return {
    ...omit(meshData, 'data'),
    image: canvas
  }
}
