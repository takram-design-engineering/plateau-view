import {
  Body,
  Observer,
  SearchHourAngle,
  SearchRiseSet,
  Seasons
} from 'astronomy-engine'
import { startOfDay, startOfMinute } from 'date-fns'
import { atom, useSetAtom, type Atom, type SetStateAction } from 'jotai'
import { useLayoutEffect, useMemo } from 'react'

import { useConstant } from '@takram/plateau-react-helpers'

function findCulmination(referenceDate: Date, observer: Observer): Date {
  const date = startOfDay(referenceDate)
  const hourAngle = SearchHourAngle(Body.Sun, observer, 0, date)
  return hourAngle.time.date
}

export interface RiseSet {
  rise?: Date
  set?: Date
}

function findRiseSet(referenceDate: Date, observer: Observer): RiseSet {
  const date = startOfDay(referenceDate)
  const rise = SearchRiseSet(Body.Sun, observer, 1, date, 1)
  const set = SearchRiseSet(Body.Sun, observer, -1, date, 1)
  return { rise: rise?.date, set: set?.date }
}

export interface Solstices {
  summer: Date
  winter: Date
}

function findSolstices(year: number): Solstices {
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
  dateAtom: Atom<Date>
  observerAtom: Atom<Observer>
  solsticesAtom: Atom<Solstices>
  culminationAtom: Atom<Date>
  riseSetAtom: Atom<RiseSet>
}

export function useDateControlState({
  date,
  longitude,
  latitude,
  height = 0
}: DateControlStateParams): DateControlState {
  const dateAtom = useConstant(() => {
    const primitiveAtom = atom(date)
    return atom(
      get => get(primitiveAtom),
      (get, set, value: SetStateAction<Date>) => {
        set(primitiveAtom, prevValue => {
          const nextValue = startOfMinute(
            typeof value === 'function' ? value(prevValue) : value
          )
          return +nextValue !== +prevValue ? nextValue : prevValue
        })
      }
    )
  })
  const observerAtom = useConstant(() => {
    const primitiveAtom = atom(new Observer(latitude, longitude, height))
    return atom(
      get => get(primitiveAtom),
      (get, set, longitude: number, latitude: number, height: number) => {
        set(primitiveAtom, prevValue =>
          prevValue.longitude !== longitude ||
          prevValue.latitude !== latitude ||
          prevValue.height !== height
            ? new Observer(latitude, longitude, height)
            : prevValue
        )
      }
    )
  })

  const solsticesAtom = useMemo(() => {
    const yearAtom = atom(get => get(dateAtom).getFullYear())
    return atom(get => findSolstices(get(yearAtom)))
  }, [dateAtom])

  const culminationAtom = useMemo(
    () => atom(get => findCulmination(get(dateAtom), get(observerAtom))),
    [dateAtom, observerAtom]
  )

  const riseSetAtom = useMemo(
    () => atom(get => findRiseSet(get(dateAtom), get(observerAtom))),
    [dateAtom, observerAtom]
  )

  const setDate = useSetAtom(dateAtom)
  useLayoutEffect(() => {
    setDate(date)
  }, [date, setDate])

  const setObserver = useSetAtom(observerAtom)
  useLayoutEffect(() => {
    setObserver(longitude, latitude, height)
  }, [longitude, latitude, height, setObserver])

  return {
    dateAtom,
    observerAtom,
    solsticesAtom,
    culminationAtom,
    riseSetAtom
  }
}
