import {
  CallbackProperty,
  ClassificationType,
  type Color
} from '@cesium/engine'
import { useMemo, useRef, type FC } from 'react'

import { Entity, useCesium, type EntityProps } from '@takram/plateau-cesium'
import { useConstant } from '@takram/plateau-react-helpers'

export interface PolygonEntityProps
  extends Required<Pick<NonNullable<EntityProps['polygon']>, 'hierarchy'>> {
  dynamic?: boolean
  color?: Color
}

export const PolygonEntity: FC<PolygonEntityProps> = ({
  dynamic = false,
  hierarchy: hierarchyProp,
  color
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
        fill: true,
        material: color?.withAlpha(0.5),
        classificationType: ClassificationType.TERRAIN
      }
    }),
    [color, hierarchy]
  )

  const scene = useCesium(({ scene }) => scene)
  scene.requestRender()

  return <Entity {...options} />
}
