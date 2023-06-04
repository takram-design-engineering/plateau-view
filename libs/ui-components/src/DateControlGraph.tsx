import { styled, useTheme } from '@mui/material'
import { Body, Equator, Horizon, type Observer } from 'astronomy-engine'
import {
  area as createArea,
  line as createLine,
  path as createPath,
  scaleLinear,
  type ScaleLinear
} from 'd3'
import { endOfDay, set, startOfDay } from 'date-fns'
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

import { type DateControlState } from './useDateControlState'

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
  subdivision = 80
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
  sunrise?: Date
  sunset?: Date
  scaleX: ScaleLinear<number, number>
  skirt?: number
  opacity?: number
}> = memo(
  ({ width, height, sunrise, sunset, scaleX, skirt = 20, opacity = 1 }) => {
    const id = useId()
    const rect = useMemo(() => {
      const radius = 5
      const path = createPath()
      path.moveTo(radius, 0)
      path.lineTo(width - radius, 0)
      path.arcTo(width, 0, width, radius, radius)
      path.lineTo(width, height - radius)
      path.arcTo(width, height, width - radius, height, radius)
      path.lineTo(radius, height)
      path.arcTo(0, height, 0, height - radius, radius)
      path.lineTo(0, radius)
      path.arcTo(0, 0, radius, 0, radius)
      path.closePath()
      return path.toString()
    }, [width, height])

    const theme = useTheme()
    if (sunrise == null && sunset == null) {
      return null
    }

    const sunriseX = sunrise != null ? scaleX(+sunrise) : undefined
    const sunsetX = sunset != null ? scaleX(+sunset) : undefined
    const color = theme.palette.text.primary
    return (
      <>
        <defs>
          <linearGradient id={id} x1={0} x2={1} y1={0} y2={0}>
            <stop offset={0} stopColor={color} stopOpacity={opacity} />
            {sunriseX != null && (
              <>
                <stop
                  offset={(sunriseX - skirt / 2) / width}
                  stopColor={color}
                  stopOpacity={opacity}
                />
                <stop
                  offset={(sunriseX + skirt / 2) / width}
                  stopColor={color}
                  stopOpacity={0}
                />
              </>
            )}
            {sunsetX != null && (
              <>
                <stop
                  offset={(sunsetX - skirt / 2) / width}
                  stopColor={color}
                  stopOpacity={0}
                />
                <stop
                  offset={(sunsetX + skirt / 2) / width}
                  stopColor={color}
                  stopOpacity={opacity}
                />
              </>
            )}
            <stop offset={width} stopColor={color} stopOpacity={opacity} />
          </linearGradient>
        </defs>
        <path d={rect} fill={`url(#${id})`} />
      </>
    )
  }
)

const borderRadius = 5

const Graph: FC<
  DateControlState & {
    width: number
    height: number
  }
> = ({
  width,
  height,
  date,
  observer,
  summerSolstice,
  winterSolstice,
  sunrise,
  sunset
}) => {
  const scaleX = useMemo(
    () =>
      scaleLinear()
        .domain([+startOfDay(date), +endOfDay(date)])
        .range([borderRadius, width - borderRadius]),
    [date, width]
  )
  const scaleY = useMemo(
    () =>
      scaleLinear()
        .domain([-90, 90])
        .range([height - borderRadius, borderRadius]),
    [height]
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
  const color = theme.palette.text.primary
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'>
      <RiseSetGradient
        width={width}
        height={height}
        sunrise={sunrise}
        sunset={sunset}
        scaleX={scaleX}
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
