import { type Cartesian3, type HeadingPitchRoll } from '@cesium/engine'
import { useEffect, useRef, type FC } from 'react'

import { useCesium } from './useCesium'

export interface ViewLocatorProps {
  initialDestination?: Cartesian3
  initialOrientation?: HeadingPitchRoll
}

export const ViewLocator: FC<ViewLocatorProps> = ({
  initialDestination,
  initialOrientation
}) => {
  const camera = useCesium(({ camera }) => camera)

  const initialDestinationRef = useRef(initialDestination)
  const initialOrientationRef = useRef(initialOrientation)
  useEffect(() => {
    camera.setView({
      destination: initialDestinationRef.current,
      orientation: initialOrientationRef.current
    })
  }, [camera])

  return null
}
