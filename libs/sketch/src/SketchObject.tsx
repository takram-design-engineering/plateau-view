import { Color, Entity } from '@cesium/engine'
import { useTheme } from '@mui/material'
import { type MultiPolygon, type Polygon } from 'geojson'
import { atom, useAtomValue } from 'jotai'
import { useMemo, type FC } from 'react'

import {
  composeIdentifier,
  convertPolygonToHierarchyArray,
  matchIdentifier
} from '@takram/plateau-cesium-helpers'
import {
  screenSpaceSelectionAtom,
  useScreenSpaceSelectionResponder,
  type ScreenSpaceSelectionEntry
} from '@takram/plateau-screen-space-selection'

import { ExtrudedPolygonEntity } from './ExtrudedPolygonEntity'
import { SKETCH_OBJECT } from './types'

export interface SketchObjectProps {
  id: string
  geometry: Polygon | MultiPolygon
  extrudedHeight: number
  disableShadow?: boolean
  color?: Color
}

export const SketchObject: FC<SketchObjectProps> = ({
  id,
  geometry,
  extrudedHeight,
  disableShadow,
  color
}) => {
  useScreenSpaceSelectionResponder({
    type: SKETCH_OBJECT,
    convertToSelection: object => {
      return 'id' in object &&
        object.id instanceof Entity &&
        matchIdentifier(object.id.id, { type: 'Sketch', key: id })
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
        matchIdentifier(value.value, { type: 'Sketch', key: id })
      )
    }
    // TODO:
    // computeBoundingSphere: (value, result = new BoundingSphere()) => {}
  })

  const selected = useAtomValue(
    useMemo(
      () =>
        atom(get =>
          get(screenSpaceSelectionAtom).some(
            ({ type, value }) =>
              type === SKETCH_OBJECT &&
              matchIdentifier(value, { type: 'Sketch', key: id })
          )
        ),
      [id]
    )
  )

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
      id={composeIdentifier({ type: 'Sketch', key: id, index })}
      hierarchy={hierarchy}
      extrudedHeight={extrudedHeight}
      disableShadow={disableShadow}
      color={selected ? primaryColor : color}
    />
  ))
}
