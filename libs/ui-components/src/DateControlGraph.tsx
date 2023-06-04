import { styled, useTheme } from '@mui/material'
import { Body, Equator, Horizon, type Observer } from 'astronomy-engine'
import { area as createArea, line as createLine, scaleLinear } from 'd3'
import { addMilliseconds, endOfDay, startOfDay } from 'date-fns'
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type FC
} from 'react'
import invariant from 'tiny-invariant'

const Root = styled('div')({
  svg: {
    display: 'block',
    overflow: 'visible'
  }
})

export function getAltitude(date: Date, observer: Observer): number {
  const equator = Equator(Body.Sun, date, observer, true, true)
  const horizon = Horizon(date, observer, equator.ra, equator.dec)
  return horizon.altitude
}

export interface Altitude {
  date: Date
  altitude: number
}

export function createAltitudeData(
  referenceDate: Date,
  observer: Observer,
  subdivision = 80
): Altitude[] {
  return [...Array(subdivision)].map((_, index) => {
    const hours = (24 * index) / (subdivision - 1)
    const date = addMilliseconds(startOfDay(referenceDate), hours * 3600000)
    return {
      date,
      altitude: getAltitude(date, observer)
    }
  })
}

interface SolsticeAltitude {
  date: Date
  summer: number
  winter: number
}

interface GraphProps {
  width: number
  height: number
  date: Date
  observer: Observer
  summerSolstice: Date
  winterSolstice: Date
}

const Graph: FC<GraphProps> = ({
  width,
  height,
  date,
  observer,
  summerSolstice,
  winterSolstice
}) => {
  const altitudes = useMemo(
    () => createAltitudeData(startOfDay(date), observer),
    [date, observer]
  )

  const solsticeAltitudes = useMemo(() => {
    const summer = createAltitudeData(summerSolstice, observer)
    const winter = createAltitudeData(winterSolstice, observer)
    invariant(summer.length > 0 && summer.length === winter.length)
    const offset = +startOfDay(date) - +startOfDay(summer[0].date)
    return summer.map(({ date }, index) => ({
      date: addMilliseconds(date, offset),
      summer: summer[index].altitude,
      winter: winter[index].altitude
    }))
  }, [date, observer, summerSolstice, winterSolstice])

  const scaleX = useMemo(
    () =>
      scaleLinear()
        .domain([+startOfDay(date), +endOfDay(date)])
        .range([0, width])
        .clamp(true),
    [date, width]
  )

  const scaleY = useMemo(
    () => scaleLinear().domain([-100, 100]).range([height, 0]).clamp(true),
    [height]
  )

  const line = useMemo(
    () =>
      createLine<Altitude>()
        .x(({ date }) => scaleX(+date))
        .y(({ altitude }) => scaleY(altitude)),
    [scaleX, scaleY]
  )
  const area = useMemo(
    () =>
      createArea<SolsticeAltitude>()
        .x(({ date }) => scaleX(+date))
        .y0(({ summer }) => scaleY(summer))
        .y1(({ winter }) => scaleY(winter)),
    [scaleX, scaleY]
  )

  const x = scaleX(+date)
  const y = scaleY(getAltitude(date, observer))

  const theme = useTheme()
  const color = theme.palette.text.primary
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'>
      <line
        x1={0}
        x2={width}
        y1={height / 2}
        y2={height / 2}
        stroke={color}
        strokeWidth={1}
        strokeOpacity={0.2}
      />
      <path
        d={area(solsticeAltitudes) ?? undefined}
        fill={color}
        fillOpacity={0.1}
        stroke='none'
      />
      <path
        d={line(altitudes) ?? undefined}
        fill='none'
        stroke={theme.palette.primary.main}
        strokeWidth={1.5}
      />
      <line
        x1={0}
        x2={width}
        y1={y}
        y2={y}
        stroke={theme.palette.primary.main}
        strokeWidth={1}
        strokeOpacity={0.5}
      />
      <circle
        cx={x}
        cy={y}
        r={5}
        fill={theme.palette.primary.main}
        stroke='none'
      />
    </svg>
  )
}

export interface DateControlGraphProps
  extends ComponentPropsWithoutRef<typeof Root>,
    Omit<GraphProps, 'width' | 'height'> {}

export const DateControlGraph: FC<DateControlGraphProps> = props => {
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState<number>()
  const [height, setHeight] = useState<number>()
  useEffect(() => {
    invariant(ref.current != null)
    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width)
      setHeight(entry.contentRect.height)
    })
    observer.observe(ref.current)
    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <Root ref={ref} {...props}>
      {width != null && height != null && (
        <Graph {...props} width={width} height={height} />
      )}
    </Root>
  )
}
