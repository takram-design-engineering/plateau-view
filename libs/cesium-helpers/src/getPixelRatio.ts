import { type Scene } from '@cesium/engine'

// Just a shortcut to the private property.
export function getPixelRatio(scene: Scene): number {
  return (
    scene as Scene & {
      pixelRatio: number
    }
  ).pixelRatio
}
