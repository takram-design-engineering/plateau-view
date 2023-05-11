import { Divider, Stack } from '@mui/material'
import { useAtomValue } from 'jotai'
import { useResetAtom } from 'jotai/utils'
import { useContext, type FC } from 'react'

import { ScreenSpaceSelectionContext } from '@plateau/screen-space-selection'
import {
  DeveloperPanel,
  ParameterList,
  SelectParameterItem,
  SwitchParameterItem,
  ValueParameterItem
} from '@plateau/ui-components'

import {
  colorModeAtom,
  debugSphericalHarmonicsAtom,
  environmentTypeAtom,
  plateauDataSourceAtom,
  showMunicipalityEntitiesAtom,
  showSelectionBoundingSphereAtom,
  terrainTypeAtom
} from '../states/app'
import { atomWithResettableAtoms } from '../states/atomWithResettableAtoms'

const resetAtom = atomWithResettableAtoms([
  colorModeAtom,
  debugSphericalHarmonicsAtom,
  environmentTypeAtom,
  plateauDataSourceAtom,
  showMunicipalityEntitiesAtom,
  showSelectionBoundingSphereAtom,
  terrainTypeAtom
])

export const AppPanel: FC = () => {
  const environmentType = useAtomValue(environmentTypeAtom)
  const { selectionAtom } = useContext(ScreenSpaceSelectionContext)
  const selection = useAtomValue(selectionAtom)

  const handleReset = useResetAtom(resetAtom)

  return (
    <DeveloperPanel title='App' onReset={handleReset}>
      <Stack spacing={1}>
        <ParameterList>
          <SelectParameterItem
            label='Environment Type'
            atom={environmentTypeAtom}
            items={[
              ['map', 'Map'],
              ['satellite', 'Satellite']
            ]}
          />
          <SelectParameterItem
            label='Terrain Type'
            atom={terrainTypeAtom}
            items={[
              ['ellipsoid', 'Ellipsoid'],
              ['plateau', 'Plateau']
            ]}
          />
          <SelectParameterItem
            label='Color Mode'
            atom={colorModeAtom}
            disabled={environmentType === 'satellite'}
            items={[
              ['light', 'Light'],
              ['dark', 'Dark']
            ]}
          />
          <SwitchParameterItem
            label='Debug Spherical Harmonics'
            atom={debugSphericalHarmonicsAtom}
          />
        </ParameterList>
        <Divider />
        <ParameterList>
          <SelectParameterItem
            label='Plateau Data Source'
            atom={plateauDataSourceAtom}
            items={[
              ['2020', 'Hosted 2020'],
              ['2022', 'Hosted 2022'],
              ['cms', 'CMS Assets']
            ]}
          />
          <SwitchParameterItem
            label='Show Municipality Entities'
            atom={showMunicipalityEntitiesAtom}
          />
        </ParameterList>
        <Divider />
        <ParameterList>
          <ValueParameterItem
            label='Selection Count'
            value={selection.length.toLocaleString()}
          />
          <SwitchParameterItem
            label='Show Selection Bounding Sphere'
            atom={showSelectionBoundingSphereAtom}
          />
        </ParameterList>
      </Stack>
    </DeveloperPanel>
  )
}
