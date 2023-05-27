import { type FC } from 'react'

import { type Platform } from '@takram/plateau-shared-states'

export interface ShortcutTextProps {
  platform?: Platform | null
  shortcutKey: string
  commandKey?: boolean
  ctrlKey?: boolean
  altKey?: boolean
  shiftKey?: boolean
}

export const ShortcutText: FC<ShortcutTextProps> = ({
  platform,
  shortcutKey,
  commandKey = false,
  ctrlKey = false,
  altKey = false,
  shiftKey = false
}) => {
  if (platform === 'mac') {
    return (
      <>
        {(ctrlKey ? '⌃' : '') +
          (altKey ? '⎇' : '') +
          (shiftKey ? '⇧' : '') +
          (commandKey ? '⌘' : '') +
          shortcutKey}
      </>
    )
  }
  return (
    <>
      {(commandKey || ctrlKey ? '⌃' : '') +
        (altKey ? '⎇' : '') +
        (shiftKey ? '⇧' : '') +
        shortcutKey}
    </>
  )
}
