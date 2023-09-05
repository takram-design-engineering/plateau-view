import { Divider, IconButton, List, Tooltip } from '@mui/material'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { uniq } from 'lodash'
import { useCallback, useMemo, type FC } from 'react'

import { parse } from '@takram/plateau-cesium-helpers'
import { layerSelectionAtom } from '@takram/plateau-layers'
import { screenSpaceSelectionAtom } from '@takram/plateau-screen-space-selection'
import { type SKETCH_OBJECT } from '@takram/plateau-sketch'
import { isNotNullish } from '@takram/plateau-type-helpers'
import {
  InspectorHeader,
  LayerIcon,
  SketchIcon,
  TrashIcon
} from '@takram/plateau-ui-components'
import { highlightedSketchLayersAtom } from '@takram/plateau-view-layers'

import {
  type SCREEN_SPACE_SELECTION,
  type SelectionGroup
} from '../states/selection'

export interface SketchObjectContentProps {
  values: (SelectionGroup & {
    type: typeof SCREEN_SPACE_SELECTION
    subtype: typeof SKETCH_OBJECT
  })['values']
}

export const SketchObjectContent: FC<SketchObjectContentProps> = ({
  values
}) => {
  const setSelection = useSetAtom(screenSpaceSelectionAtom)
  const handleClose = useCallback(() => {
    setSelection([])
  }, [setSelection])

  const sketchLayers = useAtomValue(highlightedSketchLayersAtom)
  const setLayerSelection = useSetAtom(layerSelectionAtom)
  const handleSelectLayers = useCallback(() => {
    setLayerSelection(sketchLayers.map(layer => layer.id))
  }, [sketchLayers, setLayerSelection])

  const removeFeatures = useSetAtom(
    useMemo(
      () =>
        atom(null, (get, set, featureIds: readonly string[]) => {
          sketchLayers.forEach(sketchLayer => {
            const featureAtoms = get(sketchLayer.featureAtomsAtom)
            featureIds.forEach(featureId => {
              const featureAtom = featureAtoms.find(
                featureAtom => get(featureAtom).properties.id === featureId
              )
              if (featureAtom != null) {
                set(sketchLayer.featureAtomsAtom, {
                  type: 'remove',
                  atom: featureAtom
                })
              }
            })
          })
        }),
      [sketchLayers]
    )
  )
  const handleRemove = useCallback(() => {
    const featureIds = uniq(
      values.map(value => parse(value).key).filter(isNotNullish)
    )
    removeFeatures(featureIds)
  }, [values, removeFeatures])

  return (
    <List disablePadding>
      <InspectorHeader
        title={`${values.length}個の作図`}
        iconComponent={SketchIcon}
        actions={
          <>
            <Tooltip title='レイヤーを選択'>
              <IconButton
                aria-label='レイヤーを選択'
                onClick={handleSelectLayers}
              >
                <LayerIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title='削除'>
              <IconButton aria-label='削除' onClick={handleRemove}>
                <TrashIcon />
              </IconButton>
            </Tooltip>
          </>
        }
        onClose={handleClose}
      />
      <Divider />
    </List>
  )
}
