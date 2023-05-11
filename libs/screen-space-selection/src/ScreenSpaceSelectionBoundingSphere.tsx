import { Cartesian3, Color } from '@cesium/engine'
import { useAtomValue } from 'jotai'
import { useContext, useMemo, type FC } from 'react'

import { Entity, type EntityProps } from '@plateau/cesium'

import { ScreenSpaceSelectionContext } from './ScreenSpaceSelectionContext'

export const ScreenSpaceSelectionBoundingSphere: FC = () => {
  const { boundingSphereAtom } = useContext(ScreenSpaceSelectionContext)
  const boundingSphere = useAtomValue(boundingSphereAtom)

  const options = useMemo(
    (): EntityProps =>
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
              outlineColor: Color.GREY
            }
          }
        : {},
    [boundingSphere]
  )

  return options != null ? <Entity {...options} /> : null
}
