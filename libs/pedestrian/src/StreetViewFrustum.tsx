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
import { animate, useSpring, useTransform } from 'framer-motion'
import { useEffect, useMemo, type FC } from 'react'
import invariant from 'tiny-invariant'

import { useCesium, useInstance, usePreRender } from '@takram/plateau-cesium'

import { FrustumAppearance } from './FrustumAppearance'
import { getPosition } from './getPosition'
import { type HeadingPitch, type Location } from './types'

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

const cartesianScratch = new Cartesian3()
const quaternionScratch = new Quaternion()

const colorGeometryAttribute = new GeometryAttribute({
  componentDatatype: ComponentDatatype.UNSIGNED_BYTE,
  componentsPerAttribute: 3,
  normalize: true,
  values: new Uint8Array(
    [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0xff, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0xff, 0, 0],
      [0, 0, 0],
      [0xff, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0xff, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
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

  const motionLongitude = useSpring(location.longitude)
  const motionLatitude = useSpring(location.latitude)
  const motionHeight = useSpring(location.height ?? 0)

  useEffect(() => {
    return animate(motionLongitude, location.longitude, {
      type: 'tween',
      ease: 'easeOut',
      duration: 0.2
    }).stop
  }, [location.longitude, motionLongitude])
  useEffect(() => {
    return animate(motionLatitude, location.latitude, {
      type: 'tween',
      ease: 'easeOut',
      duration: 0.2
    }).stop
  }, [location.latitude, motionLatitude])
  useEffect(() => {
    return animate(motionHeight, location.height ?? 0, {
      type: 'tween',
      ease: 'easeOut',
      duration: 0.2
    }).stop
  }, [location.height, motionHeight])

  const motionLocation = useTransform(
    [motionLongitude, motionLatitude, motionHeight],
    (values: number[]) => ({
      longitude: values[0],
      latitude: values[1],
      height: values[2]
    })
  )

  useEffect(() => {
    return motionLocation.on('change', () => {
      scene.requestRender()
    })
  }, [scene, motionLocation])

  usePreRender(() => {
    const location = motionLocation.get()
    const position = getPosition(location, scene, cartesianScratch)
    const rotation = createQuaternionFromHeadingPitch(
      headingPitch,
      position,
      quaternionScratch
    )
    Matrix4.fromTranslationQuaternionRotationScale(
      position,
      rotation,
      Cartesian3.ONE,
      primitive.modelMatrix
    )
  })

  return null
}
