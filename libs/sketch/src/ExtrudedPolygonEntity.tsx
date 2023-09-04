import {
  CallbackProperty,
  ClassificationType,
  HeightReference,
  ShadowMode,
  type Color
} from '@cesium/engine'
import { useMemo, useRef, type FC } from 'react'

import { Entity, useCesium, type EntityProps } from '@takram/plateau-cesium'
import { useConstant } from '@takram/plateau-react-helpers'

export interface ExtrudedPolygonEntityProps
  extends Required<
    Pick<NonNullable<EntityProps['polygon']>, 'hierarchy' | 'extrudedHeight'>
  > {
  dynamic?: boolean
  color?: Color
  disableShadow?: boolean
}

export const ExtrudedPolygonEntity: FC<ExtrudedPolygonEntityProps> = ({
  dynamic = false,
  hierarchy: hierarchyProp,
  extrudedHeight,
  color,
  disableShadow = false
}) => {
  const hierarchyRef = useRef(hierarchyProp)
  hierarchyRef.current = hierarchyProp
  const hierarchyProperty = useConstant(
    () => new CallbackProperty(() => hierarchyRef.current, false)
  )
  const hierarchy = dynamic ? hierarchyProperty : hierarchyProp

  const options = useMemo(
    (): EntityProps => ({
      polygon: {
        hierarchy,
        extrudedHeight,
        extrudedHeightReference: HeightReference.RELATIVE_TO_GROUND,
        fill: true,
        material: color,
        classificationType: ClassificationType.TERRAIN,
        shadows: disableShadow ? ShadowMode.DISABLED : ShadowMode.ENABLED
      }
    }),
    [extrudedHeight, color, disableShadow, hierarchy]
  )

  const scene = useCesium(({ scene }) => scene)
  scene.requestRender()

  return <Entity {...options} />
}
