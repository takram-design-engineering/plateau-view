import { alpha, styled } from '@mui/material'
import chroma from 'chroma-js'
import { type FC } from 'react'

import { type ColorScheme } from '@takram/plateau-color-schemes'

const Root = styled('div', {
  shouldForwardProp: prop => prop !== 'selected'
})<{
  selected?: boolean
}>(({ theme, selected = false }) => ({
  position: 'relative',
  ...(selected && {
    '&:before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      inset: -8,
      backgroundColor: alpha(
        theme.palette.primary.main,
        theme.palette.action.activatedOpacity
      ),
      border: `solid 2px ${theme.palette.primary.main}`,
      borderRadius: theme.shape.borderRadius,
      zIndex: -1
    }
  })
}))

const Gradient = styled('div', {
  shouldForwardProp: prop => prop !== 'colorScheme' && prop !== 'colorCount'
})<{
  colorScheme: ColorScheme
  colorCount?: number
}>(({ colorScheme, colorCount = 8 }) => {
  const stops = [...Array(colorCount)].map((_, index, { length }) =>
    chroma.gl(...colorScheme.linear(index / length)).hex()
  )
  return {
    width: 16,
    height: 16,
    background: `linear-gradient(90deg, ${stops.join(', ')})`,
    borderRadius: 2
  }
})

export interface ColorSchemeIconProps {
  colorScheme: ColorScheme
  colorCount?: number
  selected?: boolean
}

export const ColorSchemeIcon: FC<ColorSchemeIconProps> = ({
  colorScheme,
  colorCount,
  selected
}) => (
  <Root selected={selected}>
    <Gradient colorScheme={colorScheme} colorCount={colorCount} />
  </Root>
)
