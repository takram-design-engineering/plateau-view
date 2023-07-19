import { darken, lighten } from '@mui/system'

import { createLayerStyles } from './createLayerStyles'
import { createStyle } from './createStyle'

const primaryColor = '#00bebe'
const accentColor = '#ebf000'
const subColor = '#463c64'

function gray(value: number): string {
  const component = Math.min(Math.max(Math.round(0xff * value), 0), 0xff)
  return `rgb(${component}, ${component}, ${component})`
}

export const standardStyle = createStyle({
  layerStyles: createLayerStyles({
    landColor: '#f4f4f4',
    waterColor: lighten(primaryColor, 0.4),
    seaRouteColor: lighten(primaryColor, 0.2),
    boundaryColor: subColor,
    roadColor: '#ffffff',
    majorRoadColor: '#dfdfdf',
    highwayColor: '#acacac',
    roadOutlineColor: '#dfdfdf',
    majorRoadOutlineColor: '#cccccc',
    highwayOutlineColor: '#999999',
    railwayColor: darken(accentColor, 0.4),
    railwayPhysicalWidthColor: lighten(accentColor, 0.4),
    railwayJRDashColor: darken(accentColor, 0.1)
  })
})

export const lightStyle = createStyle({
  layerStyles: createLayerStyles({
    landColor: gray(1),
    waterColor: gray(0.75),
    seaRouteColor: gray(0.675),
    boundaryColor: gray(0.33),
    roadColor: gray(0.9),
    majorRoadColor: gray(0.9),
    highwayColor: gray(0.66),
    roadOutlineColor: gray(0.85),
    majorRoadOutlineColor: gray(0.85),
    highwayOutlineColor: gray(0.6),
    railwayColor: gray(0.8),
    railwayPhysicalWidthColor: gray(0.92),
    railwayJRDashColor: gray(0.9)
  })
})

export const darkStyle = createStyle({
  layerStyles: createLayerStyles({
    landColor: gray(0.1),
    waterColor: gray(0),
    seaRouteColor: gray(0.05),
    boundaryColor: gray(0.66),
    roadColor: gray(0.2),
    majorRoadColor: gray(0.2),
    highwayColor: gray(0.4),
    roadOutlineColor: gray(0.3),
    majorRoadOutlineColor: gray(0.3),
    highwayOutlineColor: gray(0.5),
    railwayColor: gray(0.4),
    railwayPhysicalWidthColor: gray(0.15),
    railwayJRDashColor: gray(0.2)
  })
})
