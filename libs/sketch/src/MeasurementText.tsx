import { styled } from '@mui/material'

export const MeasurementText = styled('div')(({ theme }) => ({
  ...theme.typography.caption,
  padding: theme.spacing(0.5),
  color: theme.palette.getContrastText(theme.palette.primary.dark),
  backgroundColor: theme.palette.primary.main,
  borderRadius: theme.shape.borderRadius,
  lineHeight: 1
}))
