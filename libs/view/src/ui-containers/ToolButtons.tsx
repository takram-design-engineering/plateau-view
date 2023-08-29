import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useCallback, type FC } from 'react'

import { isSketchGeometryType } from '@takram/plateau-sketch'
import {
  AppToggleButton,
  AppToggleButtonGroup,
  AppToggleButtonSelect,
  HandIcon,
  PedestrianIcon,
  PointerArrowIcon,
  SketchCircleIcon,
  SketchPolygonIcon,
  SketchRectangleIcon
} from '@takram/plateau-ui-components'

import {
  sketchTypeAtom,
  toolAtom,
  toolMachineAtom,
  type ToolType
} from '../states/tool'
import { type EventObject } from '../states/toolMachine'

const eventTypes: Record<ToolType, EventObject['type']> = {
  hand: 'HAND',
  select: 'SELECT',
  sketch: 'SKETCH',
  story: 'STORY',
  pedestrian: 'PEDESTRIAN'
}

const sketchItems = [
  { value: 'rectangle', title: '立方体', icon: <SketchRectangleIcon /> },
  { value: 'circle', title: '円柱', icon: <SketchCircleIcon /> },
  { value: 'polygon', title: '自由形状', icon: <SketchPolygonIcon /> }
]

export const ToolButtons: FC = () => {
  const send = useSetAtom(toolMachineAtom)
  const tool = useAtomValue(toolAtom)

  const handleChange = useCallback(
    (event: unknown, value: ToolType | null) => {
      if (value != null) {
        send({ type: eventTypes[value] })
      }
    },
    [send]
  )

  const [sketchType, setSketchType] = useAtom(sketchTypeAtom)
  const handleSketchTypeChange = useCallback(
    (event: unknown, value: string) => {
      if (isSketchGeometryType(value)) {
        send({ type: 'SKETCH' })
        setSketchType(value)
      }
    },
    [send, setSketchType]
  )

  return (
    <AppToggleButtonGroup value={tool?.type ?? null} onChange={handleChange}>
      <AppToggleButton value='hand' title='移動' shortcutKey='H'>
        <HandIcon />
      </AppToggleButton>
      <AppToggleButton value='select' title='選択' shortcutKey='V'>
        <PointerArrowIcon />
      </AppToggleButton>
      <AppToggleButton value='pedestrian' title='歩行者視点' shortcutKey='P'>
        <PedestrianIcon />
      </AppToggleButton>
      <AppToggleButtonSelect
        value='sketch'
        title='作図'
        shortcutKey='G'
        items={sketchItems}
        selectedValue={sketchType}
        onValueChange={handleSketchTypeChange}
      />
    </AppToggleButtonGroup>
  )
}
