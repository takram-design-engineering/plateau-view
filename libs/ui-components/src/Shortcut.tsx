import {
  Chip,
  Typography,
  type ChipProps,
  type TypographyProps
} from '@mui/material'
import { omit } from 'lodash'
import { Suspense, type PropsWithoutRef } from 'react'

import { ShortcutText, type ShortcutTextProps } from './ShortcutText'

export type ShortcutVariant = 'inline' | 'outlined'

export type ShortcutProps<Variant extends ShortcutVariant = ShortcutVariant> =
  (Variant extends 'inline'
    ? Omit<PropsWithoutRef<TypographyProps>, 'variant'>
    : Omit<PropsWithoutRef<ChipProps>, 'variant' | 'label'>) &
    ShortcutTextProps & {
      variant?: ShortcutVariant
    }

export const Shortcut = (({
  variant = 'inline',
  platform,
  shortcutKey,
  commandKey,
  altKey,
  shiftKey,
  ...props
}) => {
  const binding = (
    <Suspense>
      <ShortcutText
        platform={platform}
        shortcutKey={shortcutKey}
        commandKey={commandKey}
        altKey={altKey}
        shiftKey={shiftKey}
      />
    </Suspense>
  )
  return variant === 'inline' ? (
    <Typography color='text.secondary' {...props}>
      {binding}
    </Typography>
  ) : (
    <Chip
      variant='outlined'
      color='secondary'
      size='small'
      {...omit(props, 'children')}
      label={binding}
    />
  )
}) as <Variant extends ShortcutVariant = ShortcutVariant>(
  props: ShortcutProps<Variant>
) => JSX.Element // For generics
