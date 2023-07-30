import { styled } from '@mui/material'
import chroma from 'chroma-js'
import { type ComponentPropsWithRef } from 'react'

import { type ColorScheme } from '@takram/plateau-color-schemes'

export const ColorSchemeIcon = styled('div', {
  shouldForwardProp: prop => prop !== 'colorScheme' && prop !== 'colorCount'
})<{
  colorScheme: ColorScheme
  colorCount?: number
}>(({ colorScheme, colorCount = 8 }) => {
  const stops = [...Array(colorCount)].map((_, index, { length }) =>
    chroma.gl(...colorScheme.linear(index / length)).hex()
  )
  return {
    display: 'inline-block',
    width: 16,
    height: 16,
    background: `linear-gradient(90deg, ${stops.join(', ')})`,
    borderRadius: 4
  }
})

export type ColorSchemeIconProps = ComponentPropsWithRef<typeof ColorSchemeIcon>
