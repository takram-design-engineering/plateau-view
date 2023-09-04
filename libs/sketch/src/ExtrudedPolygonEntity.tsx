import {
  CallbackProperty,
  ClassificationType,
  ColorMaterialProperty,
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
  id?: string
  color?: Color
  disableShadow?: boolean
}

export const ExtrudedPolygonEntity: FC<ExtrudedPolygonEntityProps> = ({
  dynamic = false,
  id,
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

  // Non-constant callback property in color doesn't request render in every
  // frame; prevents it from flashing when the color changes instead.
  const colorRef = useRef(color)
  colorRef.current = color
  const colorProperty = useConstant(
    () => new CallbackProperty(() => colorRef.current, false)
  )

  const options = useMemo(
    (): EntityProps => ({
      polygon: {
        hierarchy,
        extrudedHeight,
        extrudedHeightReference: HeightReference.RELATIVE_TO_GROUND,
        fill: true,
        material: new ColorMaterialProperty(colorProperty),
        classificationType: ClassificationType.TERRAIN,
        shadows: disableShadow ? ShadowMode.DISABLED : ShadowMode.ENABLED
      }
    }),
    [extrudedHeight, disableShadow, hierarchy, colorProperty]
  )

  const scene = useCesium(({ scene }) => scene)
  scene.requestRender()

  return <Entity id={id} {...options} />
}
