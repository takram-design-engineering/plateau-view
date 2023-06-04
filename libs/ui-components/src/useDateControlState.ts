import {
  Body,
  Observer,
  SearchHourAngle,
  SearchRiseSet,
  Seasons
} from 'astronomy-engine'
import { startOfDay } from 'date-fns'
import { useMemo } from 'react'

function findCulmination(referenceDate: Date, observer: Observer): Date {
  const date = startOfDay(referenceDate)
  const hourAngle = SearchHourAngle(Body.Sun, observer, 0, date)
  return hourAngle.time.date
}

function findRiseSet(
  referenceDate: Date,
  observer: Observer
): {
  rise?: Date
  set?: Date
} {
  const date = startOfDay(referenceDate)
  const rise = SearchRiseSet(Body.Sun, observer, 1, date, 1)
  const set = SearchRiseSet(Body.Sun, observer, -1, date, 1)
  return { rise: rise?.date, set: set?.date }
}

function findSolstices(year: number): {
  summer: Date
  winter: Date
} {
  const seasons = Seasons(year)
  const summer = seasons.jun_solstice.date
  const winter = seasons.dec_solstice.date
  return { summer, winter }
}

export interface DateControlStateParams {
  date: Date
  longitude: number
  latitude: number
  height?: number
}

export interface DateControlState {
  date: Date
  observer: Observer
  summerSolstice: Date
  winterSolstice: Date
  culmination: Date
  sunrise?: Date
  sunset?: Date
}

export function useDateControlState({
  date,
  longitude,
  latitude,
  height = 0
}: DateControlStateParams): DateControlState {
  const observer = useMemo(
    () => new Observer(latitude, longitude, height),
    [longitude, latitude, height]
  )

  const { summer: summerSolstice, winter: winterSolstice } = useMemo(
    () => findSolstices(date.getFullYear()),
    [date]
  )

  const { culmination, sunrise, sunset } = useMemo(() => {
    const culmination = findCulmination(date, observer)
    const { rise, set } = findRiseSet(date, observer)
    return {
      culmination,
      sunrise: rise,
      sunset: set
    }
  }, [date, observer])

  return {
    date,
    observer,
    summerSolstice,
    winterSolstice,
    culmination,
    sunrise,
    sunset
  }
}
