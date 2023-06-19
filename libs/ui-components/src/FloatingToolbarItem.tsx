import { styled, ToggleButton, type ToggleButtonProps } from '@mui/material'
import { useAtomValue } from 'jotai'
import { forwardRef } from 'react'

import { platformAtom } from '@takram/plateau-shared-states'

import { ShortcutTooltip, type ShortcutTooltipProps } from './ShortcutTooltip'

const TooltipContent = styled('div')({
  display: 'inline-flex',
  height: '100%'
})

export interface FloatingToolbarItemProps
  extends ToggleButtonProps,
    Pick<ShortcutTooltipProps, 'shortcutKey'> {}

export const FloatingToolbarItem = forwardRef<
  HTMLButtonElement,
  ToggleButtonProps & Omit<ShortcutTooltipProps, 'children'>
>(({ title, shortcutKey, ...props }, ref) => {
  const platform = useAtomValue(platformAtom)
  return (
    <ShortcutTooltip
      title={title}
      platform={platform}
      shortcutKey={shortcutKey}
    >
      <TooltipContent>
        <ToggleButton ref={ref} aria-label={title} {...props} />
      </TooltipContent>
    </ShortcutTooltip>
  )
})
