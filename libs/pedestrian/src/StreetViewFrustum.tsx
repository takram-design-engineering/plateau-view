import {
  Cartesian2,
  Cartesian3,
  Math as CesiumMath,
  Color,
  ComponentDatatype,
  FrustumGeometry,
  GeometryAttribute,
  GeometryInstance,
  Matrix4,
  PerspectiveFrustum,
  Primitive,
  Quaternion
} from '@cesium/engine'
import { useTheme } from '@mui/material'
import { animate, useMotionValue, usePresence } from 'framer-motion'
import { useEffect, useMemo, type FC } from 'react'
import invariant from 'tiny-invariant'

import { useCesium, useInstance, usePreRender } from '@takram/plateau-cesium'
import { useReady } from '@takram/plateau-cesium-helpers'

import { FrustumAppearance } from './FrustumAppearance'
import { computeCartographicToCartesian } from './computeCartographicToCartesian'
import { createQuaternionFromHeadingPitch } from './createQuaternionFromHeadingPitch'
import { getFieldOfViewSeparate } from './getFieldOfView'
import { type HeadingPitch, type Location } from './types'
import { useMotionPosition } from './useMotionPosition'

interface StreetViewFrustumProps {
  location: Location
  headingPitch: HeadingPitch
  zoom?: number
  aspectRatio?: number
  length?: number
}

const TAN_PI_OVER_FOUR = Math.tan(CesiumMath.PI_OVER_FOUR)

const positionScratch = new Cartesian3()
const scaleScratch = new Cartesian3()
const rotationScratch = new Quaternion()
const fovScratch = new Cartesian2()

const colorGeometryAttribute = new GeometryAttribute({
  componentDatatype: ComponentDatatype.UNSIGNED_BYTE,
  componentsPerAttribute: 3,
  normalize: true,
  values: new Uint8Array(
    // Colors of vertices adjacent to the near plane are 255. 0 otherwise.
    [
      0xff, 0xff, 0xff, 0xff, 0, 0, 0, 0, 0, 0xff, 0xff, 0, 0, 0xff, 0xff, 0,
      0xff, 0, 0, 0xff, 0xff, 0, 0, 0xff
    ].flatMap(value => [value, value, value])
  )
})

export const StreetViewFrustum: FC<StreetViewFrustumProps> = ({
  location,
  headingPitch,
  zoom = 1,
  aspectRatio = 3 / 2,
  length = 200
}) => {
  const geometryInstance = useMemo(() => {
    const geometry = FrustumGeometry.createGeometry(
      new FrustumGeometry({
        frustum: new PerspectiveFrustum({
          fov: CesiumMath.PI_OVER_TWO,
          aspectRatio: 1,
          near: 0.0001,
          far: 1
        }),
        origin: Cartesian3.ZERO,
        orientation: Quaternion.IDENTITY,
        vertexFormat: FrustumAppearance.VERTEX_FORMAT
      })
    )
    invariant(geometry != null)
    geometry.attributes.color = colorGeometryAttribute
    return new GeometryInstance({ geometry })
  }, [])

  const theme = useTheme()

  const primitives = useCesium(({ scene }) => scene.primitives)
  const primitive = useInstance({
    owner: primitives,
    keys: [geometryInstance],
    create: () =>
      new Primitive({
        geometryInstances: geometryInstance,
        asynchronous: false,
        appearance: new FrustumAppearance({
          color: Color.fromCssColorString(theme.palette.primary.main)
        })
      }),
    transferOwnership: (primitive, primitives) => {
      primitives.add(primitive)
      return () => {
        primitives.remove(primitive)
      }
    }
  })

  const scene = useCesium(({ scene }) => scene)
  scene.requestRender()

  const motionVisibility = useMotionValue(0)
  const ready = useReady(primitive)
  const [present, safeToRemove] = usePresence()
  useEffect(() => {
    if (!ready) {
      return
    }
    return animate(motionVisibility, present ? 1 : 0, {
      type: 'tween',
      ease: 'easeOut',
      duration: 0.2,
      onComplete: () => {
        if (!present) {
          safeToRemove()
        }
      }
    }).stop
  }, [primitive, motionVisibility, ready, present, safeToRemove])

  useEffect(() => {
    return motionVisibility.on('change', () => {
      scene.requestRender()
    })
  }, [scene, motionVisibility])

  const position = useMemo(
    () => computeCartographicToCartesian(scene, location),
    [scene, location]
  )
  const motionPosition = useMotionPosition(position)

  useEffect(() => {
    return motionPosition.on('change', () => {
      scene.requestRender()
    })
  }, [scene, motionPosition])

  usePreRender(() => {
    const visibility = motionVisibility.get()
    primitive.appearance.material.uniforms.opacity = visibility
    Object.assign(positionScratch, motionPosition.get())
    const rotation = createQuaternionFromHeadingPitch(
      headingPitch,
      positionScratch,
      rotationScratch
    )
    const fov = getFieldOfViewSeparate(scene.camera, zoom, fovScratch)
    const farWidth = (Math.tan(fov.x / 2) / TAN_PI_OVER_FOUR) * length
    scaleScratch.x = (visibility * farWidth) / aspectRatio
    scaleScratch.y = visibility * farWidth
    scaleScratch.z = visibility * length
    Matrix4.fromTranslationQuaternionRotationScale(
      positionScratch,
      rotation,
      scaleScratch,
      primitive.modelMatrix
    )
  })

  return null
}
