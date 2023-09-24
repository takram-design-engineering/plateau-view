import { mapKeys } from 'lodash'

type Sequence<
  Name extends string,
  Size extends number,
  Result extends any[] = []
> = Size extends Result['length']
  ? Result[number]
  : Sequence<Name, Size, [...Result, `${Name}${Result['length']}`]>

export function sequence<Name extends string, Size extends number>(
  size: Size,
  name: Name
): Array<Sequence<Name, Size>> {
  return [...Array(size)].map((_, index) => `${name}${index}`) as any
}

type SequenceMap<
  T extends Record<string, any>,
  Size extends number,
  Indices extends any[] = [],
  Result extends object = object
> = keyof T extends string
  ? Size extends Indices['length']
    ? Result
    : SequenceMap<
        T,
        Size,
        [...Indices, Indices['length']],
        Result & { [K in keyof T as `${K}${Indices['length']}`]: T[K] }
      >
  : never

export function sequenceKeys<
  T extends Record<string, any>,
  Size extends number
>(size: Size, map: T): SequenceMap<T, Size> {
  return [...Array(size)].reduce(
    (result, _, index) => ({
      ...result,
      ...mapKeys(map, (_, key) => `${key}${index}`)
    }),
    {}
  )
}
