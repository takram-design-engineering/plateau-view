import { type FC } from 'react'

import { Environment, type EnvironmentProps } from '@takram/plateau-cesium'

export const GooglePhotorealisticEnvironment: FC<EnvironmentProps> = props => {
  return <Environment showGlobe={false} shadowDarkness={0.7} {...props} />
}
