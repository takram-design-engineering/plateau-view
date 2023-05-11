import { type Cartesian3, type Rectangle } from '@cesium/engine'
import { useEffect, useRef, type FC } from 'react'

import { useCesium } from './useCesium'

export interface ViewLocatorProps {
  initialView?: Cartesian3 | Rectangle
}

export const ViewLocator: FC<ViewLocatorProps> = ({ initialView }) => {
  const camera = useCesium(({ camera }) => camera)

  const initialViewRef = useRef(initialView)
  initialViewRef.current = initialView
  useEffect(() => {
    if (initialViewRef.current == null) {
      return
    }
    camera.setView({ destination: initialViewRef.current })
  }, [camera])

  return null
}
