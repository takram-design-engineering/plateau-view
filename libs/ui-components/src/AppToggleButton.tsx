import {
  darken,
  styled,
  ToggleButton,
  toggleButtonClasses,
  type ToggleButtonProps
} from '@mui/material'
import { useAtomValue } from 'jotai'
import { forwardRef } from 'react'

import { platformAtom } from '@takram/plateau-shared-states'

import { ShortcutTooltip, type ShortcutTooltipProps } from './ShortcutTooltip'

const TooltipContent = styled('div')({
  display: 'inline-flex',
  height: '100%'
})

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  [`&.${toggleButtonClasses.root}`]: {
    minWidth: theme.spacing(6),
    padding: `0 ${theme.spacing(1.5)}`,
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.action.hover,
    borderRadius: 0,
    // Add specificity
    [`&.${toggleButtonClasses.root}`]: {
      margin: 0,
      border: 0
    },
    '&:hover': {
      backgroundColor: theme.palette.background.default,
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        backgroundColor: theme.palette.action.hover
      }
    },
    [`&.${toggleButtonClasses.selected}`]: {
      color: theme.palette.getContrastText(theme.palette.primary.dark),
      backgroundColor: theme.palette.primary.main,
      '&:hover': {
        backgroundColor: darken(
          theme.palette.primary.main,
          theme.palette.action.hoverOpacity
        ),
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: theme.palette.primary.main
        }
      }
    },
    [`&.${toggleButtonClasses.disabled}`]: {
      color: theme.palette.text.disabled
    }
  }
}))

export interface AppToggleButtonProps
  extends ToggleButtonProps,
    Pick<ShortcutTooltipProps, 'shortcutKey'> {}

export const AppToggleButton = forwardRef<
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
        <StyledToggleButton ref={ref} aria-label={title} {...props} />
      </TooltipContent>
    </ShortcutTooltip>
  )
})
