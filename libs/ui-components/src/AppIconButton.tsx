import { IconButton, styled, type ButtonProps } from '@mui/material'
import { useAtomValue } from 'jotai'
import { forwardRef } from 'react'

import { platformAtom } from '@takram/plateau-shared-states'

import { ShortcutTooltip, type ShortcutTooltipProps } from './ShortcutTooltip'

const TooltipContent = styled('div')({
  display: 'inline-flex',
  height: '100%'
})

export interface AppIconButtonProps
  extends ButtonProps,
    Pick<ShortcutTooltipProps, 'shortcutKey'> {
  selected?: boolean
  disableTooltip?: boolean
}

export const AppIconButton = forwardRef<HTMLButtonElement, AppIconButtonProps>(
  (
    { title, shortcutKey, selected = false, disableTooltip = false, ...props },
    ref
  ) => {
    const platform = useAtomValue(platformAtom)
    return (
      <ShortcutTooltip
        title={!disableTooltip && title}
        platform={platform}
        shortcutKey={shortcutKey}
      >
        <TooltipContent>
          <IconButton
            ref={ref}
            aria-label={title}
            color={selected ? 'primary' : 'inherit'}
            {...props}
          />
        </TooltipContent>
      </ShortcutTooltip>
    )
  }
)
