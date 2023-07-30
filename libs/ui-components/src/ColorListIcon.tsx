import { alpha, styled } from '@mui/material'
import { type FC } from 'react'

import { type QualitativeColor } from '@takram/plateau-color-schemes'

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

const Grid = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  width: 16,
  height: 16
})

const Item = styled('div')({
  flexGrow: 1,
  flexShrink: 1,
  flexBasis: '50%'
})

export interface ColorListIconProps {
  colorList: readonly QualitativeColor[]
  selected?: boolean
}

export const ColorListIcon: FC<ColorListIconProps> = ({
  colorList,
  selected
}) => (
  <Root selected={selected}>
    <Grid>
      {colorList.slice(0, 4).map(({ value, color }) => (
        <Item key={value} style={{ backgroundColor: color }} />
      ))}
    </Grid>
  </Root>
)
