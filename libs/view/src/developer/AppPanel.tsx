import { Divider, Stack } from '@mui/material'
import { useAtomValue } from 'jotai'
import { useResetAtom } from 'jotai/utils'
import { type FC } from 'react'

import {
  DeveloperPanel,
  ParameterList,
  SelectParameterItem,
  SwitchParameterItem
} from '@plateau/ui-components'

import {
  colorModeAtom,
  debugSphericalHarmonicsAtom,
  environmentTypeAtom,
  plateauDataSourceAtom,
  showMunicipalityEntitiesAtom,
  terrainTypeAtom
} from '../states/app'
import { atomWithResettableAtoms } from '../states/atomWithResettableAtoms'

const resetAtom = atomWithResettableAtoms([
  colorModeAtom,
  debugSphericalHarmonicsAtom,
  environmentTypeAtom,
  showMunicipalityEntitiesAtom,
  plateauDataSourceAtom,
  terrainTypeAtom
])

export const AppPanel: FC = () => {
  const environmentType = useAtomValue(environmentTypeAtom)

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
      </Stack>
    </DeveloperPanel>
  )
}
