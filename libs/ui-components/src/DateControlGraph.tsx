import { styled, useMediaQuery, useTheme } from '@mui/material'
import { Body, Equator, Horizon, type Observer } from 'astronomy-engine'
import {
  area as createArea,
  line as createLine,
  scaleLinear,
  type ScaleLinear
} from 'd3'
import { endOfDay, set, startOfDay } from 'date-fns'
import { useAtomValue, type Atom } from 'jotai'
import {
  memo,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type FC
} from 'react'
import invariant from 'tiny-invariant'

import { createRoundedRectPath } from './helpers/createRoundedRectPath'
import { type DateControlState, type RiseSet } from './useDateControlState'

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
  start: Date | number,
  end: Date | number,
  observer: Observer,
  subdivision = 100
): Altitude[] {
  const interval = (+end - +start) / (subdivision - 1)
  return [...Array(subdivision)].map((_, index) => {
    const date = new Date(+start + interval * index)
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

const RiseSetGradient: FC<{
  width: number
  height: number
  riseSetAtom: Atom<RiseSet>
  scaleX: ScaleLinear<number, number>
  inset?: number
  opacity?: number
}> = ({ width, height, riseSetAtom, scaleX, inset = 0, opacity = 1 }) => {
  const id = useId()
  const rect = useMemo(
    () => createRoundedRectPath({ width, height, radius: 5 }),
    [width, height]
  )

  const theme = useTheme()

  const { rise, set, dawn, dusk } = useAtomValue(riseSetAtom)
  const entries = useMemo(() => {
    if (rise == null || set == null || dawn == null || dusk == null) {
      return // TODO
    }
    const light = theme.palette.mode === 'light'
    const [dayOpacity, nightOpacity] = light ? [0, 1] : [1, 0]
    const entries = [
      { offset: scaleX(+dawn), value: dayOpacity },
      { offset: scaleX(+rise), value: nightOpacity },
      { offset: scaleX(+set), value: nightOpacity },
      { offset: scaleX(+dusk), value: dayOpacity }
    ].sort((a, b) => a.offset - b.offset)

    const [t1, t2, t3, t4] = entries
    if (t1.offset < inset) {
      const skirt = t2.offset - t1.offset
      const value = 1 - (skirt + (t1.offset - inset)) / skirt
      return [
        { offset: inset, value },
        t2,
        t3,
        t4,
        { offset: width - inset + (t1.offset - inset), value: t4.value },
        { offset: width - inset, value }
      ]
    } else if (t4.offset > width - inset) {
      const skirt = t4.offset - t3.offset
      const value = (t4.offset - (width - inset)) / skirt
      return [
        { offset: inset, value },
        { offset: t4.offset - (width - inset), value: t1.value },
        t1,
        t2,
        t3,
        { offset: width - inset, value }
      ]
    }
    return entries
  }, [width, scaleX, inset, theme, rise, set, dawn, dusk])

  if (entries == null) {
    return null
  }

  const color = theme.palette.text.primary
  return (
    <>
      <defs>
        <linearGradient
          id={id}
          x1={inset / width}
          x2={(width - inset) / width}
          y1={0}
          y2={0}
          spreadMethod='repeat'
        >
          {entries.map(({ value, offset }, index) => (
            <stop
              key={index}
              offset={(offset - inset) / (width - inset * 2)}
              stopColor={color}
              stopOpacity={opacity * (1 - value)}
            />
          ))}
        </linearGradient>
      </defs>
      <path d={rect} fill={`url(#${id})`} />
    </>
  )
}

const hours = [...Array(7)].map((_, index) => index * 4)
const altitudes = [90, 45, 0, -45, -90]

const XAxis: FC<{
  height: number
  date: Date
  scale: ScaleLinear<number, number>
}> = memo(({ height, date, scale }) => {
  const theme = useTheme()
  const y = height + parseFloat(theme.spacing(1))
  return (
    <>
      {hours.map(hour => (
        <text
          key={`${hour}`}
          x={scale(+startOfDay(date) + hour * 3600000)}
          y={y}
          textAnchor='middle'
          dominantBaseline='text-before-edge'
          fill={theme.palette.text.secondary}
          fontFamily={theme.typography.caption.fontFamily}
          fontSize={theme.typography.caption.fontSize}
        >
          {`${hour}:00`}
        </text>
      ))}
    </>
  )
})

const YAxis: FC<{
  width: number
  scale: ScaleLinear<number, number>
}> = memo(({ width, scale }) => {
  const theme = useTheme()
  const x = width + parseFloat(theme.spacing(1))
  return (
    <>
      {altitudes.map(altitude => (
        <text
          key={`${altitude}`}
          x={x}
          y={scale(altitude)}
          textAnchor='start'
          dominantBaseline='central'
          fill={theme.palette.text.secondary}
          fontFamily={theme.typography.caption.fontFamily}
          fontSize={theme.typography.caption.fontSize}
        >
          {altitude}°
        </text>
      ))}
    </>
  )
})

const Graph: FC<
  DateControlState & {
    width: number
    height: number
    borderRadius?: number
  }
> = ({
  width,
  height,
  borderRadius = 5,
  dateAtom,
  observerAtom,
  solsticesAtom,
  riseSetAtom
}) => {
  const date = useAtomValue(dateAtom)
  const observer = useAtomValue(observerAtom)
  const { summer: summerSolstice, winter: winterSolstice } =
    useAtomValue(solsticesAtom)

  const scaleX = useMemo(
    () =>
      scaleLinear()
        .domain([+startOfDay(date), +endOfDay(date)])
        .range([borderRadius, width - borderRadius]),
    [width, borderRadius, date]
  )
  const scaleY = useMemo(
    () =>
      scaleLinear()
        .domain([-100, 100])
        .range([height - borderRadius, borderRadius]),
    [height, borderRadius]
  )

  const altitudes = useMemo(
    () => createAltitudeData(scaleX.invert(0), scaleX.invert(width), observer),
    [width, observer, scaleX]
  )

  const solsticeAltitudes = useMemo(() => {
    const referenceDate = startOfDay(date)
    const summer = set(referenceDate, {
      year: summerSolstice.getFullYear(),
      month: summerSolstice.getMonth(),
      date: summerSolstice.getDate()
    })
    const winter = set(referenceDate, {
      year: winterSolstice.getFullYear(),
      month: winterSolstice.getMonth(),
      date: winterSolstice.getDate()
    })
    const start = scaleX.invert(0)
    const end = scaleX.invert(width)
    const summerData = createAltitudeData(
      +summer + (+start - +referenceDate),
      +summer + (+end - +referenceDate),
      observer
    )
    const winterData = createAltitudeData(
      +winter + (+start - +referenceDate),
      +winter + (+end - +referenceDate),
      observer
    )
    invariant(summerData.length > 0 && summerData.length === winterData.length)
    const offset = +start - +summerData[0].date
    return summerData.map(({ date }, index) => ({
      date: new Date(+date + offset),
      summer: summerData[index].altitude,
      winter: winterData[index].altitude
    }))
  }, [width, date, observer, summerSolstice, winterSolstice, scaleX])

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
  const smDown = useMediaQuery(theme.breakpoints.down('sm'))
  const color = theme.palette.text.primary
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'>
      <RiseSetGradient
        width={width}
        height={height}
        riseSetAtom={riseSetAtom}
        scaleX={scaleX}
        inset={borderRadius}
        opacity={0.08}
      />
      <line
        x1={0}
        x2={width}
        y1={height / 2}
        y2={height / 2}
        stroke={color}
        strokeWidth={1}
        strokeOpacity={0.16}
      />
      <path
        d={area(solsticeAltitudes) ?? undefined}
        fill={color}
        fillOpacity={0.08}
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
      <XAxis height={height} date={date} scale={scaleX} />
      {!smDown && <YAxis width={width} scale={scaleY} />}
    </svg>
  )
}

export interface DateControlGraphProps
  extends ComponentPropsWithoutRef<typeof Root>,
    DateControlState {}

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
