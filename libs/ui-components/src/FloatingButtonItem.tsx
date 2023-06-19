import { Button, styled, type ButtonProps } from '@mui/material'
import { useAtomValue } from 'jotai'
import { forwardRef } from 'react'

import { platformAtom } from '@takram/plateau-shared-states'

import { ShortcutTooltip, type ShortcutTooltipProps } from './ShortcutTooltip'

const TooltipContent = styled('div')({
  display: 'inline-flex',
  height: '100%'
})

const StyledButton = styled(Button)({
  borderRadius: 0
})

export interface FloatingButtonItemProps
  extends ButtonProps,
    Pick<ShortcutTooltipProps, 'shortcutKey'> {
  selected?: boolean
}

export const FloatingButtonItem = forwardRef<
  HTMLButtonElement,
  FloatingButtonItemProps
>(({ title, shortcutKey, selected = false, ...props }, ref) => {
  const platform = useAtomValue(platformAtom)
  return (
    <ShortcutTooltip
      title={title}
      platform={platform}
      shortcutKey={shortcutKey}
    >
      <TooltipContent>
        <StyledButton
          ref={ref}
          aria-label={title}
          variant='text'
          size='small'
          color={selected ? 'primary' : 'inherit'}
          {...props}
        />
      </TooltipContent>
    </ShortcutTooltip>
  )
})
