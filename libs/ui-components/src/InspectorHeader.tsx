import {
  Divider,
  IconButton,
  listItemSecondaryActionClasses,
  Stack,
  styled,
  Tooltip
} from '@mui/material'
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type FC,
  type MouseEvent,
  type ReactNode
} from 'react'
import invariant from 'tiny-invariant'

import { EntityTitle, type EntityTitleProps } from './EntityTitle'
import { CloseIcon } from './icons/CloseIcon'
import { InspectorActions } from './InspectorActions'

const Root = styled('div')({})

const StyledEntityTitle = styled(EntityTitle)(({ theme }) => ({
  minHeight: theme.spacing(6),
  [`& .${listItemSecondaryActionClasses.root}`]: {
    right: 4
  }
}))

export interface InspectorHeaderProps extends EntityTitleProps {
  actions?: ReactNode
  minInlineWidth?: number
  onClose?: (event: MouseEvent<HTMLButtonElement>) => void
}

export const InspectorHeader: FC<InspectorHeaderProps> = ({
  actions,
  minInlineWidth = 540,
  onClose,
  ...props
}) => {
  const [inline, setInline] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    invariant(ref.current != null)
    setInline(ref.current.getBoundingClientRect().width >= minInlineWidth)
  }, [minInlineWidth])

  useEffect(() => {
    invariant(ref.current != null)
    const observer = new ResizeObserver(([entry]) => {
      setInline(entry.contentRect.width >= minInlineWidth)
    })
    observer.observe(ref.current)
    return () => {
      observer.disconnect()
    }
  }, [minInlineWidth])

  return (
    <Root ref={ref}>
      <StyledEntityTitle
        {...props}
        secondaryAction={
          <Stack direction='row' spacing={1}>
            {inline && actions}
            {onClose != null && (
              <Tooltip title='閉じる'>
                <IconButton aria-label='閉じる' onClick={onClose}>
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        }
      />
      {actions != null && !inline && (
        <>
          <Divider />
          <InspectorActions>{actions}</InspectorActions>
        </>
      )}
    </Root>
  )
}
