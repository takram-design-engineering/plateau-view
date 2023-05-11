import { useAtomValue } from 'jotai'
import { type FC } from 'react'

import {
  ScreenSpaceSelection as PlateauScreenSpaceSelection,
  type ScreenSpaceSelectionProps as PlateauScreenSpaceSelectionProps
} from '@plateau/screen-space-selection'

import { toolAtom } from '../states/tool'

export interface ScreenSpaceSelectionProps
  extends Omit<PlateauScreenSpaceSelectionProps, 'disabled'> {}

export const ScreenSpaceSelection: FC<ScreenSpaceSelectionProps> = props => {
  const tool = useAtomValue(toolAtom)
  return <PlateauScreenSpaceSelection {...props} disabled={tool !== 'select'} />
}
