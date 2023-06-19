import { alpha, Divider, IconButton, Stack, styled } from '@mui/material'
import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type MouseEvent,
  type ReactNode
} from 'react'
import { mergeRefs } from 'react-merge-refs'
import invariant from 'tiny-invariant'

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

const StyledDivider = styled(Divider)(({ theme, orientation }) => ({
  ...(orientation === 'horizontal'
    ? {
        '&&': {
          marginLeft: theme.spacing(-0.5),
          marginRight: theme.spacing(-0.5)
        }
      }
    : {
        height: `calc(100% + ${theme.spacing(1)})`,
        '&&': {
          marginTop: theme.spacing(-0.5)
        }
      })
}))

const OverflowButton = styled('div', {
  shouldForwardProp: prop => prop !== 'orientation'
})<{
  orientation: 'horizontal' | 'vertical'
}>(({ theme, orientation }) => {
  const transparent = alpha(theme.palette.background.default, 0)
  const opaque = theme.palette.background.default
  const gradientWidth = theme.spacing(2)
  return {
    overflow: 'hidden',
    position: 'absolute',
    right: 0,
    display: 'flex',
    alignItems: 'center',
    height: theme.spacing(6),
    paddingRight: theme.spacing(0.5),
    paddingLeft: gradientWidth,
    background: `linear-gradient(90deg, ${transparent}, ${opaque} ${gradientWidth})`,
    borderTopRightRadius: theme.shape.borderRadius,
    borderBottomRightRadius: theme.shape.borderRadius,
    ...(orientation === 'horizontal'
      ? { top: 0 }
      : { top: `calc(${theme.spacing(6)} + 1px)` })
  }
})

export interface ContextBarProps extends ComponentPropsWithRef<typeof Root> {
  orientation?: 'horizontal' | 'vertical'
  expanded?: boolean
  onCollapse?: (event: MouseEvent<HTMLButtonElement>) => void
  onExpand?: (event: MouseEvent<HTMLButtonElement>) => void
  startAdornment?: ReactNode
  children?: ReactNode
}

export const ContextBar = forwardRef<HTMLDivElement, ContextBarProps>(
  (
    {
      orientation = 'horizontal',
      expanded = false,
      onCollapse,
      onExpand,
      startAdornment,
      children,
      ...props
    },
    forwardedRef
  ) => {
    const [overflow, setOverflow] = useState(false)

    const expandedRef = useRef(expanded)
    expandedRef.current = expanded

    const ref = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
      const container = ref.current
      const content = contentRef.current
      invariant(container != null)
      invariant(content != null)

      let containerRect = container.getBoundingClientRect()
      let contentRect = content.getBoundingClientRect()
      const intrinsicHeight = container.getBoundingClientRect().height

      if (!expandedRef.current) {
        setOverflow(containerRect.width < contentRect.width)
      } else {
        setOverflow(contentRect.height > intrinsicHeight)
      }

      const observer = new ResizeObserver(entries => {
        entries.forEach(entry => {
          if (entry.target === container) {
            containerRect = entry.contentRect
          } else if (entry.target === content) {
            contentRect = entry.contentRect
          }
        })
        if (containerRect == null || contentRect == null) {
          return
        }
        if (!expandedRef.current) {
          setOverflow(containerRect.width < contentRect.width)
        } else {
          setOverflow(contentRect.height > intrinsicHeight)
        }
      })

      observer.observe(container)
      observer.observe(content)
      return () => {
        observer.disconnect()
      }
    }, [])

    const handleClick = useCallback(
      (event: MouseEvent<HTMLButtonElement>) => {
        if (expandedRef.current) {
          onCollapse?.(event)
        } else {
          onExpand?.(event)
        }
      },
      [onCollapse, onExpand]
    )

    const hasStartAdornment = startAdornment != null && startAdornment !== false
    const hasChildren = children != null && children !== false
    return (
      <Root ref={mergeRefs([ref, forwardedRef])} {...props}>
        <RoundedBox>
          <Stack
            ref={contentRef}
            direction={orientation === 'horizontal' ? 'row' : 'column'}
            spacing={0.5}
          >
            {hasStartAdornment && (
              <Stack direction='row' spacing={0.5}>
                {startAdornment}
              </Stack>
            )}
            {hasStartAdornment && hasChildren && (
              <div>
                <StyledDivider
                  light
                  orientation={
                    orientation === 'horizontal' ? 'vertical' : 'horizontal'
                  }
                />
              </div>
            )}
            {hasChildren && (
              <div>
                <Stack
                  direction='row'
                  spacing={0.5}
                  useFlexGap
                  rowGap={0.5}
                  {...(expanded && {
                    flexWrap: 'wrap'
                  })}
                >
                  {children}
                </Stack>
              </div>
            )}
          </Stack>
        </RoundedBox>
        {overflow && (
          <OverflowButton orientation={orientation}>
            <IconButton
              aria-label={expanded ? '閉じる' : '開く'}
              onClick={handleClick}
            >
              <ExpandArrowIcon expanded={expanded} />
            </IconButton>
          </OverflowButton>
        )}
      </Root>
    )
  }
)
