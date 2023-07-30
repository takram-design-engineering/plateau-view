import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography
} from '@mui/material'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { useCallback, useMemo, type FC } from 'react'
import invariant from 'tiny-invariant'

import { type LayerModel } from '@takram/plateau-layers'
import {
  ColorSchemeIcon,
  ColorSetIcon,
  ColorSetList,
  InspectorHeader,
  QuantitativeColorLegend
} from '@takram/plateau-ui-components'
import { colorSchemeSelectionAtom } from '@takram/plateau-view-layers'

import {
  type COLOR_SCHEME_SELECTION,
  type SelectionGroup
} from '../../states/selection'

function hasQuantitativeAtoms(
  values: readonly LayerModel[]
): values is ReadonlyArray<
  Extract<
    LayerModel,
    {
      colorPropertyAtom: unknown
      colorRangeAtom: unknown
      colorSchemeAtom: unknown
    }
  >
> {
  return values.every(
    value =>
      'colorPropertyAtom' in value &&
      'colorRangeAtom' in value &&
      'colorSchemeAtom' in value
  )
}

function hasQualitativeAtoms(
  values: readonly LayerModel[]
): values is ReadonlyArray<Extract<LayerModel, { colorSet: unknown }>> {
  return values.every(value => 'colorSet' in value)
}

const QuantitativeContent: FC<{
  layer: Extract<
    LayerModel,
    {
      colorPropertyAtom: unknown
      colorRangeAtom: unknown
      colorSchemeAtom: unknown
    }
  >
}> = ({ layer }) => {
  const title = useAtomValue(layer.titleAtom)
  const colorProperty = useAtomValue(layer.colorPropertyAtom)
  const colorScheme = useAtomValue(layer.colorSchemeAtom)
  const colorRange = useAtomValue(layer.colorRangeAtom)

  const setSelection = useSetAtom(colorSchemeSelectionAtom)
  const handleClose = useCallback(() => {
    setSelection([])
  }, [setSelection])

  return (
    <List disablePadding>
      <InspectorHeader
        title={{
          primary: '色分け',
          secondary: typeof title === 'string' ? title : title?.primary
        }}
        icon={<ColorSchemeIcon colorScheme={colorScheme} />}
        onClose={handleClose}
      />
      <Divider />
      <ListItem>
        <ListItemText>
          <Stack spacing={1}>
            <Typography variant='body2'>
              {colorProperty?.replaceAll('_', ' ')}
            </Typography>
            <QuantitativeColorLegend
              colorScheme={colorScheme}
              min={colorRange[0]}
              max={colorRange[1]}
            />
          </Stack>
        </ListItemText>
      </ListItem>
    </List>
  )
}

const QualitativeContent: FC<{
  layer: Extract<LayerModel, { colorSet: unknown }>
}> = ({ layer }) => {
  const colorSet = layer.colorSet
  const colors = useAtomValue(
    useMemo(() => atom(get => get(colorSet.colorsAtom)), [colorSet])
  )

  const setSelection = useSetAtom(colorSchemeSelectionAtom)
  const handleClose = useCallback(() => {
    setSelection([])
  }, [setSelection])

  return (
    <List disablePadding>
      <InspectorHeader
        title={colorSet.name}
        icon={<ColorSetIcon colors={colors} />}
        onClose={handleClose}
      />
      <Divider />
      <ListItem>
        <ColorSetList colorsAtom={colorSet.colorAtomsAtom} />
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
  if (hasQuantitativeAtoms(values)) {
    return <QuantitativeContent layer={values[0]} />
  }
  if (hasQualitativeAtoms(values)) {
    return <QualitativeContent layer={values[0]} />
  }
  return null
}
