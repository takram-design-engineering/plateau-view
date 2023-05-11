import { useEffect, type FC, type ReactNode } from 'react'
import { suspend } from 'suspend-react'

import { useCesium } from '@plateau/cesium'

import {
  waitUntilTilesLoaded,
  type WaitUntilTilesLoadedOptions
} from './waitUntilTilesLoaded'

export interface SuspendUntilTilesLoadedProps
  extends WaitUntilTilesLoadedOptions {
  onComplete?: () => void
  children?: ReactNode
}

export const SuspendUntilTilesLoaded: FC<SuspendUntilTilesLoadedProps> = ({
  children,
  onComplete,
  ...props
}) => {
  const scene = useCesium(({ scene }) => scene)
  suspend(async () => {
    await waitUntilTilesLoaded(scene, props)
  }, [SuspendUntilTilesLoaded, scene])

  // Don't use waitUntilTilesLoaded's onComplete for supporting hot reload.
  useEffect(() => {
    onComplete?.()
  }, [onComplete])

  return <>{children}</>
}
