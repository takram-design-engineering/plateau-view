import { styled } from '@mui/material'
import { type ComponentPropsWithRef } from 'react'

export const AutoHeight = styled('div', {
  shouldForwardProp: prop => prop !== 'width'
})<{ width?: number }>(({ width }) => ({
  display: 'flex',
  flexDirection: 'column',
  width,
  height: '100%',
  minHeight: 0
}))

export interface AutoHeightProps
  extends ComponentPropsWithRef<typeof AutoHeight> {}
