import { styled } from '@mui/material'
import { type ComponentPropsWithoutRef, type FC } from 'react'

const Root = styled('div')({})

export interface InspectorProps extends ComponentPropsWithoutRef<typeof Root> {}

export const Inspector: FC<InspectorProps> = props => <Root {...props} />
