import { type FC } from 'react'

import { type Platform } from '@takram/plateau-shared-states'
import { isNotFalse } from '@takram/plateau-type-helpers'

export interface ShortcutTextProps {
  platform?: Platform | null
  shortcutKey: string
  commandKey?: boolean
  altKey?: boolean
  shiftKey?: boolean
}

export const ShortcutText: FC<ShortcutTextProps> = ({
  platform,
  shortcutKey,
  commandKey = false,
  altKey = false,
  shiftKey = false
}) => {
  if (platform === 'mac') {
    return (
      <>
        {(altKey ? '⎇' : '') +
          (shiftKey ? '⇧' : '') +
          (commandKey ? '⌘' : '') +
          shortcutKey}
      </>
    )
  }
  return (
    <>
      {[commandKey && 'Ctrl', altKey && 'Alt', shiftKey && 'Shift', shortcutKey]
        .filter(isNotFalse)
        .join(' + ')}
    </>
  )
}
