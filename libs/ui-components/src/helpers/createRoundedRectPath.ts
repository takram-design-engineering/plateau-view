import { path as createPath } from 'd3'

export interface RoundedRectPathParams {
  width: number
  height: number
  radius: number
}

export function createRoundedRectPath({
  width,
  height,
  radius
}: RoundedRectPathParams): string {
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
}
