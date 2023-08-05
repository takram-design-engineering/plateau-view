import { alpha, styled } from '@mui/material'
import { forwardRef, type ComponentPropsWithRef } from 'react'

import { type QualitativeColor } from '@takram/plateau-datasets'

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
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  width: 16,
  height: 16,
  borderRadius: 2
})

const Item = styled('div')({
  flexGrow: 1,
  flexShrink: 1,
  flexBasis: '50%'
})

export interface ColorSetIconProps extends ComponentPropsWithRef<typeof Root> {
  colors: readonly QualitativeColor[]
  selected?: boolean
}

export const ColorSetIcon = forwardRef<HTMLDivElement, ColorSetIconProps>(
  ({ colors, selected, ...props }, ref) => (
    <Root ref={ref} {...props} selected={selected}>
      <Grid>
        {colors.slice(0, 4).map(({ value, color }) => (
          <Item key={value} style={{ backgroundColor: color }} />
        ))}
      </Grid>
    </Root>
  )
)
