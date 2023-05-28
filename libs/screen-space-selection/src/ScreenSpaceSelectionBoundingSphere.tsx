import { Cartesian3, Color } from '@cesium/engine'
import { useAtomValue } from 'jotai'
import { useMemo, type FC } from 'react'

import { Entity, type EntityProps } from '@takram/plateau-cesium'

import { boundingSphereAtom } from './states'

export interface ScreenSpaceSelectionBoundingSphereProps {
  color?: Color
}

export const ScreenSpaceSelectionBoundingSphere: FC<
  ScreenSpaceSelectionBoundingSphereProps
> = ({ color = Color.GRAY }) => {
  const boundingSphere = useAtomValue(boundingSphereAtom)

  const options = useMemo(
    (): EntityProps | undefined =>
      boundingSphere != null
        ? {
            position: boundingSphere.center,
            ellipsoid: {
              radii: new Cartesian3(
                boundingSphere.radius,
                boundingSphere.radius,
                boundingSphere.radius
              ),
              fill: false,
              outline: true,
              outlineColor: color
            }
          }
        : undefined,
    [color, boundingSphere]
  )

  return options != null ? <Entity {...options} /> : null
}
