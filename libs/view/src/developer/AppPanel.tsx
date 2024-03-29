import { Divider, Stack } from '@mui/material'
import { useAtomValue } from 'jotai'
import { useResetAtom } from 'jotai/utils'
import { type FC } from 'react'

import { showTilesetTextureAtom } from '@takram/plateau-datasets'
import { screenSpaceSelectionAtom } from '@takram/plateau-screen-space-selection'
import {
  atomWithResettableAtoms,
  colorModeAtom
} from '@takram/plateau-shared-states'
import {
  DeveloperPanel,
  ParameterList,
  SelectParameterItem,
  SliderParameterItem,
  SwitchParameterItem,
  ValueParameterItem
} from '@takram/plateau-ui-components'

import {
  debugSphericalHarmonicsAtom,
  enableTerrainLightingAtom,
  environmentTypeAtom,
  logarithmicTerrainElevationAtom,
  showAreaEntitiesAtom,
  showDataFormatsAtom,
  showSelectionBoundingSphereAtom,
  showShadowMapCascadeColorsAtom,
  showShadowMapDepthAtom,
  terrainElevationHeightRangeAtom,
  terrainTypeAtom
} from '../states/app'

const resetAtom = atomWithResettableAtoms([
  colorModeAtom,
  debugSphericalHarmonicsAtom,
  enableTerrainLightingAtom,
  environmentTypeAtom,
  logarithmicTerrainElevationAtom,
  showAreaEntitiesAtom,
  showDataFormatsAtom,
  showSelectionBoundingSphereAtom,
  showShadowMapCascadeColorsAtom,
  showShadowMapDepthAtom,
  showTilesetTextureAtom,
  terrainElevationHeightRangeAtom,
  terrainTypeAtom
])

export const AppPanel: FC = () => {
  const environmentType = useAtomValue(environmentTypeAtom)
  const selection = useAtomValue(screenSpaceSelectionAtom)

  const handleReset = useResetAtom(resetAtom)

  return (
    <DeveloperPanel title='App' onReset={handleReset}>
      <Stack spacing={1}>
        <ParameterList>
          <SelectParameterItem
            labelFontSize='small'
            label='Environment Type'
            atom={environmentTypeAtom}
            items={[
              ['map', 'Map'],
              ['satellite', 'Satellite'],
              ['elevation', 'Elevation'],
              ['google-photorealistic', 'Google Photorealistic']
            ]}
          />
          <SelectParameterItem
            labelFontSize='small'
            label='Terrain Type'
            atom={terrainTypeAtom}
            items={[
              ['ellipsoid', 'Ellipsoid'],
              ['plateau', 'Plateau'],
              ['cesium-world', 'Cesium World']
            ]}
          />
          <SelectParameterItem
            labelFontSize='small'
            label='Color Mode'
            atom={colorModeAtom}
            disabled={environmentType === 'satellite'}
            items={[
              ['light', 'Light'],
              ['dark', 'Dark']
            ]}
          />
          <SwitchParameterItem
            labelFontSize='small'
            label='Terrain Lighting'
            atom={enableTerrainLightingAtom}
          />
          <SliderParameterItem
            labelFontSize='small'
            label='Terrain Elevation Height'
            min={-10}
            max={4000}
            step={1}
            range
            unit='m'
            logarithmic
            atom={terrainElevationHeightRangeAtom}
            disabled={environmentType !== 'elevation'}
          />
          <SwitchParameterItem
            labelFontSize='small'
            label='Logarithmic Terrain Elevation'
            atom={logarithmicTerrainElevationAtom}
          />
          <SwitchParameterItem
            labelFontSize='small'
            label='Tileset Texture'
            atom={showTilesetTextureAtom}
          />
          <SwitchParameterItem
            labelFontSize='small'
            label='Debug Spherical Harmonics'
            atom={debugSphericalHarmonicsAtom}
          />
          <SwitchParameterItem
            labelFontSize='small'
            label='Debug Shadow Map Depth'
            atom={showShadowMapDepthAtom}
          />
          <SwitchParameterItem
            labelFontSize='small'
            label='Debug Shadow Map Cascades'
            atom={showShadowMapCascadeColorsAtom}
          />
        </ParameterList>
        <Divider />
        <ParameterList>
          <SwitchParameterItem
            labelFontSize='small'
            label='Show Data Formats'
            atom={showDataFormatsAtom}
          />
          <SwitchParameterItem
            labelFontSize='small'
            label='Show Area Entities'
            atom={showAreaEntitiesAtom}
          />
        </ParameterList>
        <Divider />
        <ParameterList>
          <ValueParameterItem
            labelFontSize='small'
            label='Selection Count'
            value={selection.length.toLocaleString()}
          />
          <SwitchParameterItem
            labelFontSize='small'
            label='Selection Bounding Sphere'
            atom={showSelectionBoundingSphereAtom}
          />
        </ParameterList>
      </Stack>
    </DeveloperPanel>
  )
}
