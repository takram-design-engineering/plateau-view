import {
  ListItem,
  ListItemText,
  listItemTextClasses,
  styled,
  type SvgIconProps
} from '@mui/material'
import { useAtomValue } from 'jotai'
import { type ComponentType, type FC } from 'react'

import { type LayerProps, type LayerType } from '@plateau/layers'
import { BUILDING_LAYER } from '@plateau/view-layers'

import { BuildingIcon } from './icons'

const StyledListItem = styled(ListItem)(({ theme }) => ({
  height: theme.spacing(7),
  cursor: 'default'
})) as unknown as typeof ListItem // For generics

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

// TODO: Separate file
const layerIcons: Record<LayerType, ComponentType<SvgIconProps>> = {
  // [BORDER_LAYER]: BorderIcon,
  // [BRIDGE_LAYER]: BridgeIcon,
  [BUILDING_LAYER]: BuildingIcon
  // [EMERGENCY_ROUTE_LAYER]: EmergencyRouteIcon,
  // [FACILITY_LAYER]: FacilityIcon,
  // [FLOOD_LAYER]: FloodIcon,
  // [FURNITURE_LAYER]: FurnitureIcon,
  // [GENERIC_LAYER]: GenericIcon,
  // [HIGHTIDE_LAYER]: HightideIcon,
  // [INLAND_FLOOD_LAYER]: InlandFloodIcon,
  // [LANDMARK_LAYER]: LandmarkIcon,
  // [LANDSLIDE_LAYER]: LandslideIcon,
  // [LANDUSE_LAYER]: LanduseIcon,
  // [PARK_LAYER]: ParkIcon,
  // [RAILWAY_LAYER]: RailwayIcon,
  // [ROAD_LAYER]: RoadIcon,
  // [SHELTER_LAYER]: ShelterIcon,
  // [STATION_LAYER]: StationIcon,
  // [TSUNAMI_LAYER]: TsunamiIcon,
  // [USE_CASE_LAYER]: UseCaseIcon,
  // [VEGETATION_LAYER]: VegetationIcon
}

export const LayerListItem: FC<LayerProps> = ({ layerAtom }) => {
  const layer = useAtomValue(layerAtom)
  const Icon = layerIcons[layer.type]
  return (
    <StyledListItem component='div'>
      <ListItemIcon>
        <Icon fontSize='large' />
      </ListItemIcon>
      <StyledListItemText
        primary={layer.title}
        secondary={layerTypeNames[layer.type]}
        primaryTypographyProps={{
          variant: 'body1'
        }}
        secondaryTypographyProps={{
          variant: 'caption'
        }}
      />
    </StyledListItem>
  )
}
