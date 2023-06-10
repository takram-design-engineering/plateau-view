export interface DMS {
  degrees: number
  minutes?: number
  seconds?: number
  milliseconds?: number
}

export function toDegrees(dms: DMS): number

export function toDegrees(
  degrees: number,
  minutes?: number,
  seconds?: number,
  milliseconds?: number
): number

export function toDegrees(
  arg: DMS | number,
  minutes = 0,
  seconds = 0,
  milliseconds = 0
): number {
  return typeof arg !== 'number'
    ? arg.degrees +
        (arg.minutes ?? 0) / 60 +
        ((arg.seconds ?? 0) + (arg.milliseconds ?? 0) / 1000) / 3600
    : arg + minutes / 60 + (seconds + milliseconds / 1000) / 3600
}

export function fromDegrees(degrees: number): DMS {
  const seconds = degrees * 3600
  return {
    degrees: Math.floor(degrees),
    minutes: Math.floor(degrees * 60) % 60,
    seconds: Math.floor(seconds) % 60,
    milliseconds: Math.floor((seconds - Math.floor(seconds)) * 1000)
  }
}

export function stringify(arg: DMS | number): string {
  const { degrees, minutes, seconds, milliseconds } =
    typeof arg === 'number' ? fromDegrees(arg) : arg
  return `${degrees}°${minutes}′${seconds}.${milliseconds}″`
}
