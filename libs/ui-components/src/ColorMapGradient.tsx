import { styled, useTheme } from '@mui/material'
import chroma from 'chroma-js'
import { scaleLinear } from 'd3'
import { useId, useMemo, type FC } from 'react'

import { type ColorMap } from '@takram/plateau-color-maps'

const height = 5
const tickSize = 2

const Root = styled('div')({
  position: 'relative',
  width: '100%'
})

const Svg = styled('svg')({
  display: 'block',
  borderRadius: height / 2
})

const Ticks = styled('div')({
  position: 'absolute',
  top: `calc(50% - ${tickSize / 2}px)`,
  left: (height - tickSize) / 2,
  right: (height + tickSize) / 2
})

const Tick = styled('div')({
  position: 'absolute',
  width: tickSize,
  height: tickSize,
  borderRadius: tickSize / 2,
  opacity: 0.5
})

export interface ColorMapGradientProps {
  colorMap: ColorMap<'sequential' | 'diverging'>
  min?: number
  max?: number
  colorCount?: number
}

export const ColorMapGradient: FC<ColorMapGradientProps> = ({
  colorMap,
  min,
  max,
  colorCount = 24
}) => {
  const id = useId()
  const stops = useMemo(
    () =>
      [...Array(colorCount)].map((_, index, { length }) => {
        const value = index / length
        return (
          <stop
            key={index}
            offset={`${value * 100}%`}
            stopColor={chroma.gl(...colorMap.linear(value)).hex()}
          />
        )
      }),
    [colorMap, colorCount]
  )

  const theme = useTheme()
  const ticks = useMemo(
    () =>
      min != null &&
      max != null &&
      min !== max && (
        <Ticks>
          {scaleLinear()
            .domain([min, max])
            .ticks(4)
            .map((value, index) => {
              const normal = (value - min) / (max - min)
              const color = chroma.gl(...colorMap.linear(normal)).hex()
              return (
                <Tick
                  key={index}
                  style={{
                    left: `${normal * 100}%`,
                    backgroundColor: theme.palette.getContrastText(color)
                  }}
                />
              )
            })}
        </Ticks>
      ),
    [colorMap, min, max, theme]
  )

  return (
    <Root>
      <Svg xmlns='http://www.w3.org/2000/svg' width='100%' height={height}>
        <defs>
          <linearGradient id={id}>{stops}</linearGradient>
        </defs>
        <rect width='100%' height={height} fill={`url(#${id})`} />
      </Svg>
      {ticks}
    </Root>
  )
}
