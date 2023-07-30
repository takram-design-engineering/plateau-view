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

import {
  layersAtom,
  useFindLayer,
  type LayerModel
} from '@takram/plateau-layers'
import {
  ColorList,
  ColorListIcon,
  ColorSchemeIcon,
  InspectorHeader,
  QuantitativeColorLegend
} from '@takram/plateau-ui-components'
import {
  colorSchemeSelectionAtom,
  layerTypeNames
} from '@takram/plateau-view-layers'

import {
  type COLOR_SCHEME_SELECTION,
  type SelectionGroup
} from '../../states/selection'

const Content: FC<{ layer: LayerModel }> = ({ layer }) => {
  const colorPropertyAtom =
    'colorPropertyAtom' in layer ? layer.colorPropertyAtom : undefined
  const colorProperty = useAtomValue(
    useMemo(
      () =>
        atom(get =>
          colorPropertyAtom != null ? get(colorPropertyAtom) : null
        ),
      [colorPropertyAtom]
    )
  )

  const colorSchemeAtom =
    'colorSchemeAtom' in layer ? layer.colorSchemeAtom : undefined
  const colorScheme = useAtomValue(
    useMemo(
      () =>
        atom(get => (colorSchemeAtom != null ? get(colorSchemeAtom) : null)),
      [colorSchemeAtom]
    )
  )

  const colorRangeAtom =
    'colorRangeAtom' in layer ? layer.colorRangeAtom : undefined
  const colorRange = useAtomValue(
    useMemo(
      () => atom(get => (colorRangeAtom != null ? get(colorRangeAtom) : null)),
      [colorRangeAtom]
    )
  )

  const colorListAtom =
    'colorListAtom' in layer ? layer.colorListAtom : undefined
  const colorList = useAtomValue(
    useMemo(
      () =>
        atom(get =>
          colorListAtom != null
            ? get(colorListAtom).map(item => get(item))
            : null
        ),
      [colorListAtom]
    )
  )

  const setSelection = useSetAtom(colorSchemeSelectionAtom)
  const handleClose = useCallback(() => {
    setSelection([])
  }, [setSelection])

  return (
    <List disablePadding>
      <InspectorHeader
        title={{
          primary: '色分け',
          secondary: `${layerTypeNames[layer.type]}レイヤー`
        }}
        icon={
          colorScheme != null ? (
            <ColorSchemeIcon colorScheme={colorScheme} />
          ) : colorList != null ? (
            <ColorListIcon colorList={colorList} />
          ) : undefined
        }
        onClose={handleClose}
      />
      <Divider />
      {colorProperty != null && colorScheme != null && colorRange != null && (
        <ListItem>
          <ListItemText>
            <Stack spacing={1}>
              <Typography variant='body2'>
                {colorProperty.replaceAll('_', ' ')}
              </Typography>
              <QuantitativeColorLegend
                colorScheme={colorScheme}
                min={colorRange[0]}
                max={colorRange[1]}
              />
            </Stack>
          </ListItemText>
        </ListItem>
      )}
      {colorListAtom != null && (
        <ListItem>
          <ColorList atom={colorListAtom} />
        </ListItem>
      )}
    </List>
  )
}

export interface ColorSchemeContentProps {
  values: (SelectionGroup & {
    type: typeof COLOR_SCHEME_SELECTION
  })['values']
}

export const ColorSchemeContent: FC<ColorSchemeContentProps> = ({ values }) => {
  const layers = useAtomValue(layersAtom)
  const findLayer = useFindLayer()
  // TODO: Support multiple layers
  const layer =
    typeof values[0] === 'string'
      ? findLayer(layers, {
          id: values[0]
        })
      : values[0]

  if (layer == null) {
    return null
  }
  return <Content layer={layer} />
}
