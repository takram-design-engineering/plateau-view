import { Color, Entity } from '@cesium/engine'
import { useTheme } from '@mui/material'
import { type MultiPolygon, type Polygon } from 'geojson'
import { useMemo, useState, type FC } from 'react'

import {
  compose,
  convertPolygonToHierarchyArray,
  match
} from '@takram/plateau-cesium-helpers'
import {
  useScreenSpaceSelectionResponder,
  type ScreenSpaceSelectionEntry
} from '@takram/plateau-screen-space-selection'

import {
  ExtrudedPolygonEntity,
  type ExtrudedPolygonEntityProps
} from './ExtrudedPolygonEntity'
import { SKETCH_OBJECT } from './types'

export interface SketchObjectProps {
  id: string
  geometry: Polygon | MultiPolygon
  extrudedHeight: number
  disableShadow?: ExtrudedPolygonEntityProps['disableShadow']
  color?: Color
}

export const SketchObject: FC<SketchObjectProps> = ({
  id,
  geometry,
  extrudedHeight,
  disableShadow,
  color
}) => {
  const [highlighted, setHighlighted] = useState(false)

  useScreenSpaceSelectionResponder({
    type: SKETCH_OBJECT,
    convertToSelection: object => {
      return 'id' in object &&
        object.id instanceof Entity &&
        match(object.id.id, { type: 'Sketch', key: id })
        ? {
            type: SKETCH_OBJECT,
            value: object.id.id
          }
        : undefined
    },
    shouldRespondToSelection: (
      value
    ): value is ScreenSpaceSelectionEntry<typeof SKETCH_OBJECT> => {
      return (
        value.type === SKETCH_OBJECT &&
        match(value.value, { type: 'Sketch', key: id })
      )
    },
    onSelect: () => {
      setHighlighted(true)
    },
    onDeselect: () => {
      setHighlighted(false)
    }
    // computeBoundingSphere: (value, result = new BoundingSphere()) => {}
  })

  const hierarchyArray = useMemo(
    () => convertPolygonToHierarchyArray(geometry),
    [geometry]
  )

  const theme = useTheme()
  const primaryColor = useMemo(
    () => Color.fromCssColorString(theme.palette.primary.main),
    [theme]
  )

  return hierarchyArray?.map((hierarchy, index) => (
    <ExtrudedPolygonEntity
      key={index}
      id={compose({ type: 'Sketch', key: id, index })}
      hierarchy={hierarchy}
      extrudedHeight={extrudedHeight}
      disableShadow={disableShadow}
      color={highlighted ? primaryColor : color}
    />
  ))
}
