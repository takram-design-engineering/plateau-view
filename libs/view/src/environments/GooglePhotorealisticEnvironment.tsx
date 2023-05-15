import { type FC } from 'react'

import { Environment } from '@plateau/cesium'

export const GooglePhotorealisticEnvironment: FC = () => {
  return <Environment showGlobe={false} shadowDarkness={0.7} />
}
