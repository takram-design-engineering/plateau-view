import { styled } from '@mui/material'
import { type FC } from 'react'

const Root = styled('div')({
  flexGrow: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.05)'
})

export interface DateControlGraphProps {}

export const DateControlGraph: FC<DateControlGraphProps> = () => {
  return <Root />
}
