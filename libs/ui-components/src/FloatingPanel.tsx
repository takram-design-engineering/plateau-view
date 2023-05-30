import { Paper, styled, type PaperProps } from '@mui/material'
import { forwardRef } from 'react'

import { Scrollable } from './Scrollable'

const StyledPaper = styled(Paper)(({ theme, elevation = 4 }) => ({
  position: 'relative',
  maxHeight: '100%',
  boxShadow: 'none',
  pointerEvents: 'auto',
  // Shadow which doesn't overlap each other.
  '&:before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[elevation],
    zIndex: -1
  }
}))

const RoundedBox = styled('div')(({ theme }) => ({
  overflow: 'hidden',
  maxHeight: '100%',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  minHeight: 0,
  borderRadius: theme.shape.borderRadius
}))

const ScrollableRoundedBox = styled(Scrollable)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius
}))

export interface FloatingPanelProps extends PaperProps {
  scrollable?: boolean
}

export const FloatingPanel = forwardRef<HTMLDivElement, FloatingPanelProps>(
  ({ scrollable = false, children, ...props }, ref) => (
    <StyledPaper ref={ref} {...props}>
      {scrollable ? (
        <ScrollableRoundedBox>{children}</ScrollableRoundedBox>
      ) : (
        <RoundedBox>{children}</RoundedBox>
      )}
    </StyledPaper>
  )
)
