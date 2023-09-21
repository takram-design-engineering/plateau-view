import { createLayerStyles } from './createLayerStyles'
import { createStyle } from './createStyle'

function gray(value: number): string {
  const component = Math.min(Math.max(Math.round(0xff * value), 0), 0xff)
  return `rgb(${component}, ${component}, ${component})`
}

export const lightStyle = createStyle(
  createLayerStyles({
    landColor: gray(1),
    waterColor: gray(0.75),
    seaRouteColor: gray(0.675),
    coastlineColor: gray(0.7),
    boundaryColor: gray(0.33),
    roadColor: gray(0.9),
    majorRoadColor: gray(0.9),
    highwayColor: gray(0.66),
    roadOutlineColor: gray(0.85),
    majorRoadOutlineColor: gray(0.85),
    highwayOutlineColor: gray(0.6),
    railwayColor: gray(0.6),
    railwayBackgroundColor: gray(0.92),
    railwayJrDashColor: gray(1),
    stationColor: gray(0.6)
  })
)

export const darkStyle = createStyle(
  createLayerStyles({
    landColor: gray(0.1),
    waterColor: gray(0),
    seaRouteColor: gray(0.05),
    coastlineColor: gray(0.2),
    boundaryColor: gray(0.66),
    roadColor: gray(0.2),
    majorRoadColor: gray(0.2),
    highwayColor: gray(0.4),
    roadOutlineColor: gray(0.3),
    majorRoadOutlineColor: gray(0.3),
    highwayOutlineColor: gray(0.5),
    railwayColor: gray(0.4),
    railwayBackgroundColor: gray(0.15),
    railwayJrDashColor: gray(0.1),
    stationColor: gray(0.4)
  })
)
