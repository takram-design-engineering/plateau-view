import { Paper, styled, type PaperProps } from '@mui/material'
import {
  useOverlayScrollbars,
  type UseOverlayScrollbarsParams
} from 'overlayscrollbars-react'
import { forwardRef, useEffect, useRef, type ReactNode } from 'react'
import { mergeRefs } from 'react-merge-refs'
import invariant from 'tiny-invariant'

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

const RoundedBlock = styled('div')(({ theme }) => ({
  maxHeight: '100%',
  borderRadius: theme.shape.borderRadius
}))

const ScrollableRoundedBox = forwardRef<
  HTMLDivElement,
  UseOverlayScrollbarsParams & {
    children?: ReactNode
  }
>(({ options, events, defer, ...props }, forwardedRef) => {
  const ref = useRef<HTMLDivElement>(null)
  const [initialize] = useOverlayScrollbars({ options, events, defer })
  useEffect(() => {
    invariant(ref.current != null)
    initialize(ref.current)
  }, [initialize])
  return <RoundedBlock ref={mergeRefs([ref, forwardedRef])} {...props} />
})

export interface FloatingPanelProps extends PaperProps {
  scrollable?: boolean
}

export const FloatingPanel = forwardRef<HTMLDivElement, FloatingPanelProps>(
  ({ scrollable = false, children, ...props }, ref) => (
    <StyledPaper ref={ref} {...props}>
      {scrollable ? (
        <ScrollableRoundedBox>{children}</ScrollableRoundedBox>
      ) : (
        children
      )}
    </StyledPaper>
  )
)
