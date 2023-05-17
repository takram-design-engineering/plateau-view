import { type FC, type ReactNode } from 'react'

import { type CesiumRoot } from './CesiumRoot'
import { useCesium } from './useCesium'

export interface CesiumReferenceProps {
  cesium?: CesiumRoot
  children?: ReactNode
}

export const CesiumReference: FC<CesiumReferenceProps> = ({
  cesium: cesiumProp,
  children
}) => {
  const cesiumContext = useCesium({ indirect: true })
  const cesium = cesiumProp ?? cesiumContext
  return cesium != null ? <>{children}</> : null
}
