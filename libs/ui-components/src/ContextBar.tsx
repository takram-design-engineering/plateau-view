import { IconButton, alpha, styled } from '@mui/material'
import {
  forwardRef,
  type ComponentPropsWithRef,
  type MouseEvent,
  type ReactNode
} from 'react'

import { FloatingPanel } from './FloatingPanel'
import { ExpandArrowIcon } from './icons'

const Root = styled(FloatingPanel, {
  shouldForwardProp: prop => prop !== 'hidden'
})<{
  hidden?: boolean
}>(({ hidden = false }) => ({
  minWidth: 0,
  ...(hidden && {
    visibility: 'hidden'
  })
}))

const RoundedBox = styled('div')(({ theme }) => ({
  ...theme.typography.body2,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: theme.spacing(0.5),
  minHeight: theme.spacing(6),
  borderRadius: theme.shape.borderRadius
}))

const OverflowButton = styled('div')(({ theme }) => {
  const transparent = alpha(theme.palette.background.default, 0)
  const opaque = theme.palette.background.default
  const gradientWidth = theme.spacing(2)
  return {
    overflow: 'hidden',
    position: 'absolute',
    top: theme.spacing(0.5),
    right: 0,
    display: 'flex',
    alignItems: 'center',
    height: theme.spacing(5),
    paddingRight: theme.spacing(0.5),
    paddingLeft: gradientWidth,
    background: `linear-gradient(90deg, ${transparent}, ${opaque} ${gradientWidth})`,
    borderTopRightRadius: theme.shape.borderRadius,
    borderBottomRightRadius: theme.shape.borderRadius
  }
})

export interface ContextBarProps extends ComponentPropsWithRef<typeof Root> {
  overflow?: boolean
  expanded?: boolean
  onClickOverflow?: (event: MouseEvent<HTMLButtonElement>) => void
  children?: ReactNode
}

export const ContextBar = forwardRef<HTMLDivElement, ContextBarProps>(
  (
    { overflow = false, expanded = false, onClickOverflow, children, ...props },
    ref
  ) => (
    <Root ref={ref} {...props}>
      <RoundedBox>{children}</RoundedBox>
      {overflow && (
        <OverflowButton>
          <IconButton
            aria-label={expanded ? '閉じる' : '開く'}
            onClick={onClickOverflow}
          >
            <ExpandArrowIcon expanded={expanded} />
          </IconButton>
        </OverflowButton>
      )}
    </Root>
  )
)
