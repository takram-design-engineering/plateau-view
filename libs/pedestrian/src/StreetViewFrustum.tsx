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
import { useMemo, type FC } from 'react'
import invariant from 'tiny-invariant'

import { useCesium, useInstance, usePreRender } from '@takram/plateau-cesium'

import { FrustumAppearance } from './FrustumAppearance'
import { getPosition } from './getPosition'
import { type HeadingPitch, type Location } from './types'

function createQuaternionFromHeadingPitch(
  headingPitch: HeadingPitch,
  position: Cartesian3,
  result = new Quaternion()
): Quaternion {
  const heading = CesiumMath.toRadians(headingPitch.heading)
  const pitch = CesiumMath.toRadians(headingPitch.pitch)
  const headingPitchRoll = new HeadingPitchRoll(
    heading + CesiumMath.PI_OVER_TWO,
    CesiumMath.PI_OVER_TWO - pitch
  )
  return Transforms.headingPitchRollQuaternion(
    position,
    headingPitchRoll,
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

const cartesianScratch = new Cartesian3()
const quaternionScratch = new Quaternion()

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
    const fovX = Math.PI / Math.pow(2, zoom)
    const fovY = 2 * Math.atan(aspectRatio * Math.tan(fovX / 2))
    const geometry = FrustumGeometry.createGeometry(
      new FrustumGeometry({
        frustum: new PerspectiveFrustum({
          fov: aspectRatio > 1 ? fovX : fovY,
          aspectRatio: 1 / aspectRatio,
          near: 0.01,
          far: length
        }),
        origin: Cartesian3.ZERO,
        orientation: Quaternion.IDENTITY,
        vertexFormat: FrustumAppearance.VERTEX_FORMAT
      })
    )
    invariant(geometry != null)
    geometry.attributes.color = new GeometryAttribute({
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
        }),
        depthFailAppearance: new FrustumAppearance({
          color: Color.fromCssColorString(theme.palette.primary.main),
          alpha: 0.2
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

  usePreRender(() => {
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
