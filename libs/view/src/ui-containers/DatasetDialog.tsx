import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  Divider,
  listItemSecondaryActionClasses,
  styled,
  type DialogProps
} from '@mui/material'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { useCallback, useMemo, type FC } from 'react'

import {
  PlateauDatasetType,
  useDatasetDetailQuery,
  type PlateauDatasetFragment
} from '@takram/plateau-graphql'
import {
  layersAtom,
  removeLayerAtom,
  useAddLayer
} from '@takram/plateau-layers'
import {
  EntityTitle,
  PrefixedAddSmallIcon,
  PrefixedCheckSmallIcon
} from '@takram/plateau-ui-components'
import { BUILDING_LAYER, createViewLayer } from '@takram/plateau-view-layers'

import { datasetTypeIcons } from '../constants/datasetTypeIcons'
import { datasetTypeLayers } from '../constants/datasetTypeLayers'

const StyledEntityTitle = styled(EntityTitle)(({ theme }) => ({
  minHeight: theme.spacing(6),
  [`& .${listItemSecondaryActionClasses.root}`]: {
    right: 4
  }
}))

const StyledDialogContentText = styled(DialogContentText)(({ theme }) => ({
  color: theme.palette.text.primary,
  whiteSpace: 'pre-line'
}))

const StyledButton = styled(Button, {
  shouldForwardProp: prop => prop !== 'checked'
})<{
  checked?: boolean
}>(({ theme, checked = false }) => ({
  fontSize: theme.typography.body2.fontSize,
  ...(checked && {
    color: theme.palette.primary.main
  })
}))

export interface DatasetDialogProps extends Omit<DialogProps, 'children'> {
  municipalityCode: string
  dataset: PlateauDatasetFragment
}

export const DatasetDialog: FC<DatasetDialogProps> = ({
  municipalityCode,
  dataset,
  ...props
}) => {
  const { data } = useDatasetDetailQuery({
    variables: {
      datasetId: dataset.id
    }
  })

  // TODO: Separate into hook
  const layer = useAtomValue(
    useMemo(
      () =>
        atom(get =>
          dataset.type === PlateauDatasetType.Building
            ? get(layersAtom).find(
                layer =>
                  // TODO: Why the type of layer isn't reduced to
                  // BuildingLayerModel?
                  layer.type === BUILDING_LAYER &&
                  'municipalityCode' in layer &&
                  layer.municipalityCode === municipalityCode
              )
            : get(layersAtom).find(
                layer =>
                  'isDatasetLayer' in layer && layer.datasetId === dataset.id
              )
        ),
      [municipalityCode, dataset]
    )
  )

  const layerType = datasetTypeLayers[dataset.type]
  const addLayer = useAddLayer()
  const removeLayer = useSetAtom(removeLayerAtom)
  const handleClick = useCallback(() => {
    if (layerType == null || data?.dataset?.municipality == null) {
      return
    }
    if (layer == null) {
      addLayer(
        createViewLayer({
          type: layerType,
          municipalityCode: data.dataset.municipality.code,
          datasetId: dataset.id,
          datumId: dataset.data[0]?.id
        })
      )
    } else {
      removeLayer(layer.id)
    }
  }, [dataset, data, layer, layerType, addLayer, removeLayer])

  return (
    <Dialog {...props}>
      <StyledEntityTitle
        iconComponent={datasetTypeIcons[dataset.type]}
        title={{
          primary: dataset.typeName,
          secondary: data?.dataset?.municipality?.name
        }}
        secondaryAction={
          <StyledButton
            variant='contained'
            startIcon={
              layer == null ? (
                <PrefixedAddSmallIcon fontSize='small' />
              ) : (
                <PrefixedCheckSmallIcon fontSize='small' />
              )
            }
            checked={layer != null}
            disabled={layerType == null}
            onClick={handleClick}
          >
            {layer == null ? '追加' : '追加済み'}
          </StyledButton>
        }
      />
      <Divider />
      <DialogContent>
        <StyledDialogContentText>
          {data?.dataset?.description}
        </StyledDialogContentText>
      </DialogContent>
    </Dialog>
  )
}
