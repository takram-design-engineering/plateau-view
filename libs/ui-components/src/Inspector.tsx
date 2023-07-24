import { Paper, styled, type PaperProps } from '@mui/material'
import {
  Resizable,
  type ResizeCallback,
  type ResizeStartCallback
} from 're-resizable'
import { forwardRef } from 'react'

import { AutoHeight } from './AutoHeight'
import { Scrollable } from './Scrollable'

const StyledPaper = styled(Paper)(({ theme, elevation = 4 }) => ({
  position: 'relative',
  maxHeight: '100%',
  boxShadow: theme.shadows[elevation],
  pointerEvents: 'auto'
}))

const ResizableRoot = styled('div')({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  maxHeight: '100%',
  '&&': {
    height: 'auto !important'
  }
})

const ScrollableRoundedBox = styled(Scrollable)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius
}))

export interface InspectorProps extends Omit<PaperProps, 'onResize'> {
  defaultWidth?: number
  onResize?: ResizeCallback
  onResizeStart?: ResizeStartCallback
  onResizeStop?: ResizeCallback
}

export const Inspector = forwardRef<HTMLDivElement, InspectorProps>(
  (
    {
      defaultWidth = 360,
      onResize,
      onResizeStart,
      onResizeStop,
      children,
      ...props
    },
    ref
  ) => (
    <AutoHeight>
      <StyledPaper ref={ref} {...props}>
        <Resizable
          as={ResizableRoot}
          defaultSize={{
            width: defaultWidth,
            height: 'auto'
          }}
          minWidth={320}
          enable={{
            left: true,
            right: true
          }}
          onResize={onResize}
          onResizeStart={onResizeStart}
          onResizeStop={onResizeStop}
        >
          <ScrollableRoundedBox defer>{children}</ScrollableRoundedBox>
        </Resizable>
      </StyledPaper>
    </AutoHeight>
  )
)
