import LayerIcon from '@mui/icons-material/LayersOutlined'
import {
  ListItem,
  ListItemText,
  listItemTextClasses,
  styled
} from '@mui/material'
import { useAtomValue } from 'jotai'
import { type FC } from 'react'

import { type LayerProps, type LayerType } from '@plateau/layers'
import { BUILDING_LAYER } from '@plateau/view-layers'

const StyledListItem = styled(ListItem)(({ theme }) => ({
  height: theme.spacing(7),
  cursor: 'default'
}))

const ListItemIcon = styled('span')(({ theme }) => ({
  marginRight: theme.spacing(1.5)
}))

const StyledListItemText = styled(ListItemText)(({ theme }) => ({
  [`& .${listItemTextClasses.secondary}`]: {
    marginTop: theme.spacing(0.5)
  }
}))

// TODO: Separate file
const layerTypeNames: Record<LayerType, string | undefined> = {
  // [BORDER_LAYER]: '行政界情報',
  // [BRIDGE_LAYER]: '橋梁モデル',
  [BUILDING_LAYER]: '建築物モデル'
  // [EMERGENCY_ROUTE_LAYER]: '緊急輸送道路情報',
  // [FACILITY_LAYER]: '都市計画決定情報モデル',
  // [FLOOD_LAYER]: '洪水浸水想定区域モデル',
  // [FURNITURE_LAYER]: '都市設備モデル',
  // [GENERIC_LAYER]: '汎用都市オブジェクトモデル',
  // [HIGHTIDE_LAYER]: '高潮浸水想定区域モデル',
  // [INLAND_FLOOD_LAYER]: '内水浸水想定区域モデル',
  // [LANDMARK_LAYER]: 'ランドマーク情報',
  // [LANDSLIDE_LAYER]: '土砂災害警戒区域モデル',
  // [LANDUSE_LAYER]: '土地利用モデル',
  // [PARK_LAYER]: '公園情報',
  // [RAILWAY_LAYER]: '鉄道情報',
  // [ROAD_LAYER]: '道路モデル',
  // [SHELTER_LAYER]: '避難施設情報',
  // [STATION_LAYER]: '鉄道駅情報',
  // [TSUNAMI_LAYER]: '津波浸水想定区域モデル',
  // [USE_CASE_LAYER]: 'ユースケース',
  // [VEGETATION_LAYER]: '植生モデル'
}

export const LayerListItem: FC<LayerProps> = ({ layerAtom }) => {
  const layer = useAtomValue(layerAtom)
  return (
    <StyledListItem>
      <ListItemIcon>
        <LayerIcon fontSize='large' />
      </ListItemIcon>
      <StyledListItemText
        primary={layer.title}
        secondary={layerTypeNames[layer.type]}
      />
    </StyledListItem>
  )
}
