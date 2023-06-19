import { styled, Typography } from '@mui/material'
import { type FC } from 'react'

import {
  FloatingPanel,
  ParameterList,
  SegmentParameterItem,
  SwitchParameterItem
} from '@takram/plateau-ui-components'

import {
  graphicsQualityAtom,
  nativeResolutionEnabledAtom
} from '../states/graphics'

const Root = styled(FloatingPanel)(({ theme }) => ({
  width: 360,
  padding: theme.spacing(2)
}))

export const SettingsPanel: FC = () => {
  return (
    <Root>
      <Typography variant='h5' gutterBottom>
        設定
      </Typography>
      <ParameterList>
        <SegmentParameterItem
          label='グラフィック品質'
          exclusive
          atom={graphicsQualityAtom}
          items={[
            ['low', '低'],
            ['medium', '中'],
            ['high', '高'],
            ['ultra', '最高']
          ]}
        />
        {window.devicePixelRatio > 1 && (
          <SwitchParameterItem
            label='ネイティブ解像度'
            description='画面の精細さが向上しますが、デバイスの性能によっては、レスポンスが低下することがあります'
            atom={nativeResolutionEnabledAtom}
          />
        )}
      </ParameterList>
    </Root>
  )
}
