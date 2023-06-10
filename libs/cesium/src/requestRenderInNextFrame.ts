import { type Scene } from '@cesium/engine'

export function requestRenderInNextFrame(scene: Scene): void {
  const removeListener = scene.preRender.addEventListener(() => {
    scene.requestRender()
    removeListener()
  })
}
