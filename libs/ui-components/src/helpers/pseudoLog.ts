export function pseudoLog(value: number, base: number): number
export function pseudoLog(value: number[], base: number): number[]
export function pseudoLog(
  value: number | number[],
  base: number
): number | number[]
export function pseudoLog(
  value: number | number[],
  base: number
): number | number[] {
  return Array.isArray(value)
    ? value.map(value =>
        value > base
          ? Math.log(value) / Math.log(base)
          : value < -base
          ? -Math.log(-value) / Math.log(base)
          : value / base
      )
    : value > base
    ? Math.log(value) / Math.log(base)
    : value < -base
    ? -Math.log(-value) / Math.log(base)
    : value / base
}

export function inversePseudoLog(value: number, base: number): number
export function inversePseudoLog(value: number[], base: number): number[]
export function inversePseudoLog(
  value: number | number[],
  base: number
): number | number[]
export function inversePseudoLog(
  value: number | number[],
  base: number
): number | number[] {
  return Array.isArray(value)
    ? value.map(value =>
        value > 1
          ? base ** value
          : value < -1
          ? -(base ** -value)
          : value * base
      )
    : value > 1
    ? base ** value
    : value < -1
    ? -(base ** -value)
    : value * base
}
