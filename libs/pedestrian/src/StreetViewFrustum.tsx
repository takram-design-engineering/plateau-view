import {
  Cartesian3,
  Math as CesiumMath,
  Color,
  ComponentDatatype,
  FrustumGeometry,
  GeometryAttribute,
  GeometryInstance,
  HeadingPitchRoll,
  Matrix4,
  PerspectiveFrustum,
  Primitive,
  Quaternion,
  Transforms
} from '@cesium/engine'
import { useTheme } from '@mui/material'
import { animate, useMotionValue } from 'framer-motion'
import { useEffect, useMemo, type FC } from 'react'
import invariant from 'tiny-invariant'

import { useCesium, useInstance, usePreRender } from '@takram/plateau-cesium'

import { FrustumAppearance } from './FrustumAppearance'
import { getPosition } from './getPosition'
import { type HeadingPitch, type Location } from './types'
import { useMotionLocation } from './useMotionLocation'

const headingPitchRollScratch = new HeadingPitchRoll()

function createQuaternionFromHeadingPitch(
  headingPitch: HeadingPitch,
  position: Cartesian3,
  result = new Quaternion()
): Quaternion {
  const heading = CesiumMath.toRadians(headingPitch.heading)
  const pitch = CesiumMath.toRadians(headingPitch.pitch)
  headingPitchRollScratch.heading = heading + CesiumMath.PI_OVER_TWO
  headingPitchRollScratch.pitch = CesiumMath.PI_OVER_TWO - pitch
  return Transforms.headingPitchRollQuaternion(
    position,
    headingPitchRollScratch,
    undefined,
    undefined,
    result
  )
}

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

const colorGeometryAttribute = new GeometryAttribute({
  componentDatatype: ComponentDatatype.UNSIGNED_BYTE,
  componentsPerAttribute: 3,
  normalize: true,
  values: new Uint8Array(
    [
      [0xff, 0, 0],
      [0xff, 0, 0],
      [0xff, 0, 0],
      [0xff, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0xff, 0, 0],
      [0xff, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0xff, 0, 0],
      [0xff, 0, 0],
      [0, 0, 0],
      [0xff, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0xff, 0, 0],
      [0xff, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0xff, 0, 0]
    ].flat()
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
  useEffect(() => {
    let canceled = false
    let stop: (() => void) | undefined
    void primitive.readyPromise.then(() => {
      if (canceled) {
        return
      }
      stop = animate(motionVisibility, 1, {
        type: 'tween',
        ease: 'easeOut',
        duration: 0.2
      }).stop
    })
    return () => {
      canceled = true
      stop?.()
    }
  }, [primitive, motionVisibility])

  useEffect(() => {
    return motionVisibility.on('change', () => {
      scene.requestRender()
    })
  }, [scene, motionVisibility])

  const motionLocation = useMotionLocation(location)

  useEffect(() => {
    return motionLocation.on('change', () => {
      scene.requestRender()
    })
  }, [scene, motionLocation])

  usePreRender(() => {
    const visibility = motionVisibility.get()
    primitive.appearance.material.uniforms.opacity = visibility
    const location = motionLocation.get()
    const position = getPosition(location, scene, positionScratch)
    const rotation = createQuaternionFromHeadingPitch(
      headingPitch,
      position,
      rotationScratch
    )
    const fovX = Math.PI / Math.pow(2, zoom)
    const farWidth = (Math.tan(fovX / 2) / TAN_PI_OVER_FOUR) * length
    scaleScratch.x = (visibility * farWidth) / aspectRatio
    scaleScratch.y = visibility * farWidth
    scaleScratch.z = visibility * length
    Matrix4.fromTranslationQuaternionRotationScale(
      position,
      rotation,
      scaleScratch,
      primitive.modelMatrix
    )
  })

  useEffect(() => {
    return () => {
      scene.requestRender()
    }
  }, [scene])

  return null
}
