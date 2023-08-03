import { Stack, styled, type StackProps } from '@mui/material'
import { scaleLinear } from 'd3'
import { useMemo, type FC, type ReactNode } from 'react'

import { type ColorScheme } from '@takram/plateau-color-maps'

import { ColorSchemeGradient } from './ColorSchemeGradient'
import { formatValue } from './helpers/formatValue'

const Values = styled('div')(({ theme }) => ({
  ...theme.typography.small,
  position: 'relative',
  height: `calc(${theme.typography.caption.fontSize} * ${
    1 + (+(theme.typography.small.lineHeight ?? 1) - 1) / 2
  })`,
  color: theme.palette.text.secondary,
  lineHeight: 1
}))

const Value = styled('div')({
  position: 'absolute',
  bottom: 0,
  whiteSpace: 'nowrap'
})

export interface QuantitativeColorLegendProps extends StackProps {
  min: number
  max: number
  colorScheme: ColorScheme<'sequential' | 'diverging'>
  unit?: ReactNode
}

export const QuantitativeColorLegend: FC<QuantitativeColorLegendProps> = ({
  min,
  max,
  colorScheme,
  unit,
  ...props
}) => {
  const percents = useMemo(
    () =>
      min !== max &&
      scaleLinear()
        .domain([min, max])
        .ticks(4)
        .map(value => ({
          value,
          percent: ((value - min) / (max - min)) * 100
        })),
    [min, max]
  )
  return (
    <Stack {...props} spacing={0.25}>
      <ColorSchemeGradient colorScheme={colorScheme} min={min} max={max} />
      {percents !== false && (
        <Values>
          {percents.map(({ value, percent }, index, { length }) => (
            <Value
              key={index}
              style={{
                left: `${percent}%`,
                transform: `translateX(${-percent}%)`
              }}
            >
              {formatValue(value)}
              {index === length - 1 && <> {unit}</>}
            </Value>
          ))}
        </Values>
      )}
    </Stack>
  )
}
