import { alpha, styled } from '@mui/material'
import chroma from 'chroma-js'
import { type FC } from 'react'

import { type ColorMap } from '@takram/plateau-color-maps'

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
  shouldForwardProp: prop => prop !== 'colorMap' && prop !== 'colorCount'
})<{
  colorMap: ColorMap
  colorCount?: number
}>(({ colorMap, colorCount = 8 }) => {
  const stops = [...Array(colorCount)].map((_, index, { length }) =>
    chroma.gl(...colorMap.linear(index / length)).hex()
  )
  return {
    width: 16,
    height: 16,
    background: `linear-gradient(90deg, ${stops.join(', ')})`,
    borderRadius: 2
  }
})

export interface ColorMapIconProps {
  colorMap: ColorMap
  colorCount?: number
  selected?: boolean
}

export const ColorMapIcon: FC<ColorMapIconProps> = ({
  colorMap,
  colorCount,
  selected
}) => (
  <Root selected={selected}>
    <Gradient colorMap={colorMap} colorCount={colorCount} />
  </Root>
)
