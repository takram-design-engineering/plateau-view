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

const roll = Quaternion.fromHeadingPitchRoll(
  new HeadingPitchRoll(0, 0, CesiumMath.PI_OVER_TWO)
)
const headingPitchRollScratch = new HeadingPitchRoll()

function createQuaternionFromHeadingPitch(
  headingPitch: HeadingPitch,
  position: Cartesian3,
  result = new Quaternion()
): Quaternion {
  const heading = CesiumMath.toRadians(headingPitch.heading)
  const pitch = CesiumMath.toRadians(headingPitch.pitch)
  headingPitchRollScratch.heading = heading + Math.PI
  headingPitchRollScratch.pitch = 0
  headingPitchRollScratch.roll = -pitch
  return Quaternion.multiply(
    Transforms.headingPitchRollQuaternion(
      position,
      headingPitchRollScratch,
      undefined,
      undefined,
      result
    ),
    roll,
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
    // TODO: Zoom to FOV translation doesn't look correct especially when
    // it's zoomed in.
    // TODO: Change FOV by scale of model matrix.
    const fovX = Math.PI / Math.pow(2, zoom)
    const fovY = 2 * Math.atan(aspectRatio * Math.tan(fovX / 2))
    const geometry = FrustumGeometry.createGeometry(
      new FrustumGeometry({
        frustum: new PerspectiveFrustum({
          fov: aspectRatio > 1 ? fovX : fovY,
          aspectRatio,
          near: 0.01,
          far: length
        }),
        origin: Cartesian3.ZERO,
        orientation: Quaternion.IDENTITY,
        vertexFormat: FrustumAppearance.VERTEX_FORMAT
      })
    )
    invariant(geometry != null)
    geometry.attributes.color = colorGeometryAttribute
    return new GeometryInstance({ geometry })
  }, [zoom, aspectRatio, length])

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
    scaleScratch.x = visibility
    scaleScratch.y = visibility
    scaleScratch.z = visibility
    Matrix4.fromTranslationQuaternionRotationScale(
      position,
      rotation,
      scaleScratch,
      primitive.modelMatrix
    )
  })

  return null
}
