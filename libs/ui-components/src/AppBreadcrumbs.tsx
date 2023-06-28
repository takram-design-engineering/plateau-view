import {
  Breadcrumbs,
  breadcrumbsClasses,
  buttonClasses,
  styled,
  type BreadcrumbsProps
} from '@mui/material'
import { forwardRef } from 'react'

const Root = styled(Breadcrumbs)(({ theme }) => ({
  ...theme.typography.body2,
  display: 'flex',
  alignItems: 'center',
  height: theme.spacing(5),
  margin: `0 ${theme.spacing(1)}`,
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: 'baseline',
    flexWrap: 'nowrap'
  },
  [`& .${breadcrumbsClasses.separator}`]: {
    ...theme.typography.body1,
    margin: `0 ${theme.spacing(0.5)}`
  },
  [`& .${buttonClasses.text}`]: {
    minWidth: 0
  }
}))

export interface AppBreadcrumbsProps extends BreadcrumbsProps {}

export const AppBreadcrumbs = forwardRef<HTMLDivElement, AppBreadcrumbsProps>(
  (props, ref) => <Root ref={ref} separator='/' {...props} />
)
