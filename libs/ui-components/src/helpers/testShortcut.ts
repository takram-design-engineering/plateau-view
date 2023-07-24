import { type KeyboardEvent as ReactKeyboardEvent } from 'react'
import invariant from 'tiny-invariant'
import { type RequireExactlyOne } from 'type-fest'

import { type Platform } from '@takram/plateau-shared-states'

export type ShortcutBinding = RequireExactlyOne<
  {
    key?: string
    code?: string
    commandKey?: boolean
    altKey?: boolean
    shiftKey?: boolean
  },
  'key' | 'code'
>

export function testShortcut(
  event: ReactKeyboardEvent | KeyboardEvent,
  platform: Platform | null,
  {
    key,
    code,
    commandKey = false,
    altKey = false,
    shiftKey = false
  }: ShortcutBinding
): boolean {
  invariant((key != null && code == null) || (key == null && code != null))
  return (
    ((key != null && event.key.toLowerCase() === key.toLowerCase()) ||
      (code != null && event.code.toLowerCase() === code.toLowerCase())) &&
    ((platform === 'mac' && commandKey === event.metaKey && !event.ctrlKey) ||
      (platform !== 'mac' && commandKey === event.ctrlKey && !event.metaKey)) &&
    event.altKey === altKey &&
    event.shiftKey === shiftKey
  )
}
