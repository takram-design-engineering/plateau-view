import { Divider, List, ListItem, ListItemText } from '@mui/material'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { useCallback, useMemo, type FC } from 'react'
import invariant from 'tiny-invariant'

import {
  ColorMapIcon,
  ColorMapParameterItem,
  ColorSetIcon,
  ColorSetList,
  InspectorHeader,
  InspectorItem,
  ParameterList,
  QuantitativeColorLegend,
  SliderParameterItem
} from '@takram/plateau-ui-components'
import {
  colorSchemeSelectionAtom,
  type LayerColorScheme
} from '@takram/plateau-view-layers'

import {
  type COLOR_SCHEME_SELECTION,
  type SelectionGroup
} from '../states/selection'

const QuantitativeContent: FC<{
  colorScheme: Extract<LayerColorScheme, { type: 'quantitative' }>
  onClose?: () => void
}> = ({ colorScheme, onClose }) => {
  const colorMap = useAtomValue(colorScheme.colorMapAtom)
  const colorRange = useAtomValue(colorScheme.colorRangeAtom)

  return (
    <List disablePadding>
      <InspectorHeader
        title={colorScheme.name}
        icon={<ColorMapIcon colorMap={colorMap} />}
        onClose={onClose}
      />
      <Divider />
      <QuantitativeColorLegend
        colorMap={colorMap}
        min={colorRange[0]}
        max={colorRange[1]}
        sx={{ margin: 2 }}
      />
      <Divider />
      <InspectorItem>
        <ParameterList>
          <ColorMapParameterItem label='配色' atom={colorScheme.colorMapAtom} />
          <SliderParameterItem
            label='値範囲'
            // @ts-expect-error Safe assertion
            atom={colorScheme.colorRangeAtom}
          />
        </ParameterList>
      </InspectorItem>
    </List>
  )
}

const QualitativeContent: FC<{
  colorScheme: Extract<LayerColorScheme, { type: 'qualitative' }>
  continuous?: boolean
  onClose?: () => void
}> = ({ colorScheme, continuous = false, onClose }) => {
  const colors = useAtomValue(
    useMemo(() => atom(get => get(colorScheme.colorsAtom)), [colorScheme])
  )

  return (
    <List disablePadding>
      <InspectorHeader
        title={colorScheme.name}
        icon={<ColorSetIcon colors={colors} />}
        onClose={onClose}
      />
      <Divider />
      <ListItem>
        <ListItemText>
          <ColorSetList
            colorsAtom={colorScheme.colorAtomsAtom}
            continuous={continuous}
          />
        </ListItemText>
      </ListItem>
    </List>
  )
}

export interface ColorSchemeContentProps {
  values: (SelectionGroup & {
    type: typeof COLOR_SCHEME_SELECTION
  })['values']
}

export const ColorSchemeContent: FC<ColorSchemeContentProps> = ({ values }) => {
  invariant(values.length > 0)

  // TODO: Support multiple layers
  const layer = values[0]

  const setSelection = useSetAtom(colorSchemeSelectionAtom)
  const handleClose = useCallback(() => {
    setSelection([])
  }, [setSelection])

  const colorScheme = useAtomValue(layer.colorSchemeAtom)
  switch (colorScheme?.type) {
    case 'quantitative':
      return (
        <QuantitativeContent colorScheme={colorScheme} onClose={handleClose} />
      )
    case 'qualitative':
      return (
        <QualitativeContent
          colorScheme={colorScheme}
          continuous={
            'isPlateauTilesetLayer' in layer && layer.isPlateauTilesetLayer
          }
          onClose={handleClose}
        />
      )
  }
  return null
}
