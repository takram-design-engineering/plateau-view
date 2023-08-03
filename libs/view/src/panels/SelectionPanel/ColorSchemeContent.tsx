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

import { useCesium } from '@takram/plateau-cesium'
import { type QualitativeColorSet } from '@takram/plateau-datasets'
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
      propertiesAtom: unknown
      colorPropertyAtom: unknown
      colorRangeAtom: unknown
      colorSchemeAtom: unknown
    }
  >
> {
  return values.every(
    value =>
      'propertiesAtom' in value &&
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

const QualitativeContent: FC<{
  colorSet: QualitativeColorSet
  continuous?: boolean
}> = ({ colorSet, continuous }) => {
  const colors = useAtomValue(
    useMemo(() => atom(get => get(colorSet.colorsAtom)), [colorSet])
  )

  const setSelection = useSetAtom(colorSchemeSelectionAtom)
  const handleClose = useCallback(() => {
    setSelection([])
  }, [setSelection])

  const scene = useCesium(({ scene }) => scene, { indirect: true })
  const handleChange = useCallback(() => {
    scene?.requestRender()
  }, [scene])

  return (
    <List disablePadding>
      <InspectorHeader
        title={colorSet.name}
        icon={<ColorSetIcon colors={colors} />}
        onClose={handleClose}
      />
      <Divider />
      <ListItem>
        <ColorSetList
          colorsAtom={colorSet.colorAtomsAtom}
          continuous={continuous}
          onChange={handleChange}
        />
      </ListItem>
    </List>
  )
}

const DefaultContent: FC<{
  layer: Extract<
    LayerModel,
    {
      propertiesAtom: unknown
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

  const colorSet = useAtomValue(
    useMemo(
      () =>
        atom(get => {
          const properties = get(layer.propertiesAtom)
          const colorProperty = get(layer.colorPropertyAtom)
          const property = properties?.find(
            ({ name }) => name === colorProperty
          )
          return property?.type === 'qualitative'
            ? property.colorSet
            : undefined
        }),
      [layer]
    )
  )

  const setSelection = useSetAtom(colorSchemeSelectionAtom)
  const handleClose = useCallback(() => {
    setSelection([])
  }, [setSelection])

  if (colorSet != null) {
    return <QualitativeContent colorSet={colorSet} continuous />
  }
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

export interface ColorSchemeContentProps {
  values: (SelectionGroup & {
    type: typeof COLOR_SCHEME_SELECTION
  })['values']
}

export const ColorSchemeContent: FC<ColorSchemeContentProps> = ({ values }) => {
  invariant(values.length > 0)
  // TODO: Support multiple layers
  if (hasQualitativeAtoms(values)) {
    return <QualitativeContent colorSet={values[0].colorSet} />
  }
  if (hasQuantitativeAtoms(values)) {
    return <DefaultContent layer={values[0]} />
  }
  return null
}
