export function modulo(
  numerator: number,
  denominator: number
): {
  quotient: number
  remainder: number
} {
  return {
    quotient: Math.floor(numerator / denominator),
    remainder: numerator % denominator
  }
}

export function decimal(value: number): {
  integer: number
  fraction: number
} {
  const integer = Math.floor(value)
  return {
    integer,
    fraction: value - integer
  }
}
