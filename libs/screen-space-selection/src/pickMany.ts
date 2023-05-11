import {
  BoundingRectangle,
  Cartesian2,
  Color,
  PerspectiveFrustum,
  PerspectiveOffCenterFrustum,
  SceneTransforms,
  type CullingVolume,
  type Scene
} from '@cesium/engine'
import Cesium3DTilePass from '@cesium/engine/Source/Scene/Cesium3DTilePass'
import Cesium3DTilePassState from '@cesium/engine/Source/Scene/Cesium3DTilePassState'
import { uniq } from 'lodash'
import invariant from 'tiny-invariant'

import { getPixelRatio } from '@plateau/cesium-helpers'

declare module '@cesium/engine' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace SceneTransforms {
    function transformWindowToDrawingBuffer(
      scene: Scene,
      windowPosition: Cartesian2,
      result?: Cartesian2
    ): Cartesian2
  }
}

interface ReadState {
  x: number
  y: number
  width: number
  height: number
  framebuffer: unknown
}

interface PickFramebuffer {
  _fb: {
    framebuffer: unknown
  }
  _context: {
    readPixels: (readState: ReadState) => Uint8Array
    getObjectByPickColor: (color: Color) => unknown | undefined
  }
  begin: (
    screenSpaceRectangle: BoundingRectangle,
    viewport: BoundingRectangle
  ) => PassState
  end: (screenSpaceRectangle: BoundingRectangle) => unknown | undefined
}

interface PassState {
  viewport: BoundingRectangle
}

interface FrameState {
  passes: {
    pick: boolean
  }
  cullingVolume?: CullingVolume
  invertClassification: boolean
  tilesetPassState?: PassState
}

interface UniformState {
  update: (frameState: FrameState) => void
}

interface Context {
  uniformState: UniformState
  drawingBufferWidth: number
  drawingBufferHeight: number
  endFrame: () => void
}

interface JobScheduler {
  disableThisFrame: () => void
}

interface View {
  viewport: BoundingRectangle
  passState: PassState
  pickFramebuffer: PickFramebuffer
}

interface PrivateScene extends Scene {
  view: View
  defaultView: View
  jobScheduler: JobScheduler
  frameState: FrameState
  context: Context
  updateFrameState: () => void
  updateEnvironment: () => void
  updateAndExecuteCommands: (
    passState: PassState,
    backgroundColor: Color
  ) => void
  resolveFramebuffers: (passState: PassState) => void
}

const colorScratch = new Color()

// Derived from: https://github.com/CesiumGS/cesium/blob/1.105/packages/engine/Source/Scene/PickFramebuffer.js#L54
// Picks multiple objects in the given rectangle.
function pickFramebufferEnd(
  this: PickFramebuffer,
  screenSpaceRectangle: BoundingRectangle
): object[] {
  const width = screenSpaceRectangle.width ?? 1
  const height = screenSpaceRectangle.height ?? 1
  const context = this._context
  const pixels = context.readPixels({
    x: screenSpaceRectangle.x,
    y: screenSpaceRectangle.y,
    width,
    height,
    framebuffer: this._fb.framebuffer
  })

  // TODO: Why this assertion fails, even if the format is RGBA and data type
  // is unsigned bytes?
  // invariant(pixels.length % 4 === 0)

  // I don't know why Cesium doesn't provide this functionality but reads pixels
  // in spiral to find only a single object. Precision issue maybe?
  const objects: object[] = []
  for (let index = 0; index < pixels.length; index += 4) {
    colorScratch.red = Color.byteToFloat(pixels[index])
    colorScratch.green = Color.byteToFloat(pixels[index + 1])
    colorScratch.blue = Color.byteToFloat(pixels[index + 2])
    colorScratch.alpha = Color.byteToFloat(pixels[index + 3])
    const object = context.getObjectByPickColor(colorScratch)
    if (object != null) {
      objects.push(object)
    }
  }
  return uniq(objects)
}

const pickingFrustumScratch = new PerspectiveOffCenterFrustum()
const pixelSizeScratch = new Cartesian2()

// Derived from: https://github.com/CesiumGS/cesium/blob/1.105/packages/engine/Source/Scene/Picking.js#L197
// Changes are in the comments below.
function getPickCullingVolume(
  scene: Scene,
  drawingBufferPosition: Cartesian2,
  width: number,
  height: number,
  viewport: BoundingRectangle
): CullingVolume {
  const camera = scene.camera
  const frustum = camera.frustum
  invariant(frustum instanceof PerspectiveFrustum)

  const near = frustum.near
  const tanPhi = Math.tan(frustum.fovy / 2)
  const tanTheta = frustum.aspectRatio * tanPhi

  const bx = drawingBufferPosition.x
  const by = drawingBufferPosition.y
  const x = (2 * (bx - viewport.x)) / viewport.width - 1
  const y = (2 * (viewport.height - by - viewport.y)) / viewport.height - 1
  const xDir = x * near * tanTheta
  const yDir = y * near * tanPhi

  const pixelSize = frustum.getPixelDimensions(
    viewport.width,
    viewport.height,
    near, // Changed from 1
    getPixelRatio(scene), // Changed from 1
    pixelSizeScratch
  )
  const pickWidth = (pixelSize.x * width) / 2
  const pickHeight = (pixelSize.y * height) / 2

  const offCenter = pickingFrustumScratch
  offCenter.top = yDir + pickHeight
  offCenter.bottom = yDir - pickHeight
  offCenter.right = xDir + pickWidth
  offCenter.left = xDir - pickWidth
  offCenter.near = near
  offCenter.far = frustum.far

  return offCenter.computeCullingVolume(
    camera.positionWC,
    camera.directionWC,
    camera.upWC
  )
}

const pickTilesetPassState = new Cesium3DTilePassState({
  pass: Cesium3DTilePass.PICK
})
const zeroColor = new Color(0, 0, 0, 0)
const positionScratch = new Cartesian2()
const rectangleScratch = new BoundingRectangle()

// Derived from: https://github.com/CesiumGS/cesium/blob/1.105/packages/engine/Source/Scene/Picking.js#L239
// Changes are in the comments below.
export function pickMany(
  scene: Scene,
  windowPosition: Cartesian2,
  windowWidth: number,
  windowHeight: number
): object[] {
  invariant(((scene): scene is PrivateScene => true)(scene))
  const context = scene.context
  const view = scene.defaultView
  scene.view = view

  const viewport = view.viewport
  viewport.x = 0
  viewport.y = 0
  viewport.width = context.drawingBufferWidth
  viewport.height = context.drawingBufferHeight
  view.passState.viewport = BoundingRectangle.clone(
    viewport,
    view.passState.viewport
  )

  const drawingBufferPosition = SceneTransforms.transformWindowToDrawingBuffer(
    scene,
    windowPosition,
    positionScratch
  )
  scene.jobScheduler.disableThisFrame()
  scene.updateFrameState()

  // Drawing buffer coordinates are scaled by pixel ratio, so do we scale width
  // and height which are supposed to be window coordinates.
  const pixelRatio = getPixelRatio(scene)
  const width = windowWidth * pixelRatio
  const height = windowHeight * pixelRatio
  const frameState = scene.frameState
  frameState.cullingVolume = getPickCullingVolume(
    scene,
    drawingBufferPosition,
    width,
    height,
    viewport
  )
  frameState.invertClassification = false
  frameState.passes.pick = true
  frameState.tilesetPassState = pickTilesetPassState
  context.uniformState.update(frameState)
  scene.updateEnvironment()

  // In the original code, width and height are offset by one. I don't know why
  // because they are not normalized coordinates.
  rectangleScratch.x = drawingBufferPosition.x - width / 2
  rectangleScratch.y =
    scene.drawingBufferHeight - drawingBufferPosition.y - height / 2
  rectangleScratch.width = width
  rectangleScratch.height = height
  const passState = view.pickFramebuffer.begin(rectangleScratch, view.viewport)

  scene.updateAndExecuteCommands(passState, zeroColor)
  scene.resolveFramebuffers(passState)

  // Use our pickFramebufferEnd instead of PickFramebuffer.pick().
  const objects = pickFramebufferEnd.apply(view.pickFramebuffer, [
    rectangleScratch
  ])
  context.endFrame()

  return objects
}
