import {
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  styled,
  toggleButtonGroupClasses
} from '@mui/material'
import { useAtom } from 'jotai'
import {
  forwardRef,
  useCallback,
  useContext,
  type ComponentPropsWithRef
} from 'react'
import invariant from 'tiny-invariant'

import { SketchContext } from './SketchProvider'
import { DRAWING, HAND, SELECT } from './sketchStateMachine'

const Root = styled('div')(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(2),
  left: '50%',
  transform: 'translate(-50%, 0)'
}))

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  margin: theme.spacing(1),
  [`& .${toggleButtonGroupClasses.grouped}`]: {
    border: 0,
    [`&.${toggleButtonGroupClasses.disabled}`]: {
      border: 0
    },
    '&:not(:first-of-type)': {
      marginLeft: theme.spacing(1),
      borderRadius: theme.shape.borderRadius
    },
    '&:first-of-type': {
      borderRadius: theme.shape.borderRadius
    }
  }
}))

export interface SketchToolbarProps
  extends ComponentPropsWithRef<typeof Root> {}

export const SketchToolbar = forwardRef<HTMLDivElement, SketchToolbarProps>(
  (props, ref) => {
    const { stateAtom } = useContext(SketchContext)
    const [state, send] = useAtom(stateAtom)
    invariant(typeof state.value !== 'string')

    const handleChange = useCallback(
      (event: unknown, value: unknown) => {
        if (value === SELECT || value === HAND || value === DRAWING) {
          send({ type: value })
        }
      },
      [send]
    )

    return (
      <Root ref={ref} {...props}>
        <Paper elevation={5}>
          <StyledToggleButtonGroup
            exclusive
            value={
              state.matches('selectedTool.modal.select') ||
              state.matches('activeTool.modal.select')
                ? SELECT
                : state.matches('selectedTool.modal.hand') ||
                  state.matches('selectedTool.momentary.hand') ||
                  state.matches('activeTool.modal.hand') ||
                  state.matches('activeTool.momentary.hand')
                ? HAND
                : state.matches('selectedTool.modal.drawing') ||
                  state.matches('activeTool.modal.drawing')
                ? DRAWING
                : ''
            }
            onChange={handleChange}
          >
            <ToggleButton value={SELECT}>Select</ToggleButton>
            <ToggleButton value={HAND}>Hand</ToggleButton>
            <ToggleButton value={DRAWING}>Drawing</ToggleButton>
          </StyledToggleButtonGroup>
        </Paper>
      </Root>
    )
  }
)
