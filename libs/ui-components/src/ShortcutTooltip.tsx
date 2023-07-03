import { Stack, styled, Tooltip, type TooltipProps } from '@mui/material'
import { Suspense, type FC } from 'react'

import { ShortcutText, type ShortcutTextProps } from './ShortcutText'

const Shortcut = styled('span')({
  opacity: 2 / 3
})

export interface ShortcutTooltipProps
  extends TooltipProps,
    Partial<ShortcutTextProps> {}

export const ShortcutTooltip: FC<ShortcutTooltipProps> = ({
  title,
  platform,
  shortcutKey,
  commandKey,
  ctrlKey,
  altKey,
  shiftKey,
  ...props
}) => (
  <Tooltip
    {...props}
    title={
      title != null &&
      title !== false && (
        <Stack direction='row' spacing={1}>
          <span>{title}</span>
          {shortcutKey != null && (
            <Shortcut>
              <Suspense>
                <ShortcutText
                  platform={platform}
                  shortcutKey={shortcutKey}
                  commandKey={commandKey}
                  ctrlKey={ctrlKey}
                  altKey={altKey}
                  shiftKey={shiftKey}
                />
              </Suspense>
            </Shortcut>
          )}
        </Stack>
      )
    }
  />
)
