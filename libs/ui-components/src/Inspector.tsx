import {
  Paper,
  styled,
  useMediaQuery,
  useTheme,
  type PaperProps
} from '@mui/material'
import { Resizable, type ResizableProps } from 're-resizable'
import { forwardRef } from 'react'

import { AutoHeight } from './AutoHeight'
import { Scrollable } from './Scrollable'

const StyledPaper = styled(Paper)(({ theme, elevation = 4 }) => ({
  position: 'relative',
  maxHeight: '100%',
  boxShadow: theme.shadows[elevation],
  pointerEvents: 'auto',
  [theme.breakpoints.down('sm')]: {
    width: `calc(100vw - ${theme.spacing(2)})`
  }
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

export interface InspectorProps
  extends Omit<PaperProps, 'onResize'>,
    Pick<
      ResizableProps,
      'maxWidth' | 'onResize' | 'onResizeStart' | 'onResizeStop'
    > {
  defaultWidth?: number
}

export const Inspector = forwardRef<HTMLDivElement, InspectorProps>(
  (
    {
      defaultWidth = 360,
      maxWidth,
      onResize,
      onResizeStart,
      onResizeStop,
      children,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const smDown = useMediaQuery(theme.breakpoints.down('sm'))
    return (
      <AutoHeight>
        <StyledPaper ref={ref} {...props}>
          {smDown ? (
            <ScrollableRoundedBox defer>{children}</ScrollableRoundedBox>
          ) : (
            <Resizable
              as={ResizableRoot}
              defaultSize={{
                width: defaultWidth,
                height: 'auto'
              }}
              minWidth={320}
              maxWidth={maxWidth}
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
          )}
        </StyledPaper>
      </AutoHeight>
    )
  }
)
