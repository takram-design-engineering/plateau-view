import { useAtomValue } from 'jotai'
import { type FC } from 'react'

import {
  ScreenSpaceCamera as CesiumScreenSpaceCamera,
  type ScreenSpaceCameraProps as CesiumScreenSpaceCameraProps
} from '@takram/plateau-cesium'

import { toolAtom } from '../states/tool'

export interface ScreenSpaceCameraProps
  extends Omit<CesiumScreenSpaceCameraProps, 'disabled'> {}

export const ScreenSpaceCamera: FC<ScreenSpaceCameraProps> = props => {
  const tool = useAtomValue(toolAtom)
  const isHand = tool === 'hand'
  return (
    <CesiumScreenSpaceCamera
      {...props}
      enableRotate={isHand}
      enableLook={isHand}
    />
  )
}
