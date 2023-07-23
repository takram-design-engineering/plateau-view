import {
  alpha,
  Select,
  selectClasses,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableRow,
  tableRowClasses,
  Typography,
  type SelectChangeEvent
} from '@mui/material'
import { median } from 'd3'
import { atom, useAtom } from 'jotai'
import { atomFamily } from 'jotai/utils'
import { max, mean, min, round } from 'lodash'
import {
  forwardRef,
  useCallback,
  type ComponentPropsWithRef,
  type FC
} from 'react'

import { SelectItem } from './SelectItem'

const Root = styled('div', {
  shouldForwardProp: prop => prop !== 'gutterBottom'
})<{ gutterBottom?: boolean }>(({ theme, gutterBottom = false }) => ({
  ...(gutterBottom && {
    marginBottom: theme.spacing(1)
  })
}))

const StyledTable = styled(Table)(({ theme }) => ({
  [`& .${tableCellClasses.head}`]: {
    color: theme.palette.text.secondary
  },
  [`& .${tableCellClasses.root}`]: {
    // Match the light style of divider.
    // https://github.com/mui/material-ui/blob/v5.13.1/packages/mui-material/src/Divider/Divider.js#L71
    borderBottomColor: alpha(theme.palette.divider, 0.08)
  },
  [`& .${tableRowClasses.root}:last-of-type .${tableCellClasses.root}`]: {
    borderBottomWidth: 0
  }
}))

export interface PropertySet {
  name: string
  values: string[] | number[] | object[]
}

const StringValue: FC<{
  name: string
  values: string[]
}> = ({ values }) => (
  <>
    {values.every(value => value === values[0]) ? (
      values[0]
    ) : (
      <Typography variant='body2' color='text.secondary'>
        混在
      </Typography>
    )}
  </>
)

const numberFormatAtomFamily = atomFamily((name: string) => atom('mean'))

const NumberValueRoot = styled('div')({
  position: 'relative'
})

const StyledSelect = styled(Select)({
  position: 'absolute',
  top: '50%',
  right: 0,
  transform: 'translateY(-50%)',
  // Increased specificity
  [`& .${selectClasses.select}.${selectClasses.select}`]: {
    paddingTop: 4,
    paddingBottom: 4
  }
}) as unknown as typeof Select

const NumberValue: FC<{
  name: string
  values: number[]
}> = ({ name, values }) => {
  const formatAtom = numberFormatAtomFamily(name)
  const [format, setFormat] = useAtom(formatAtom)
  const handleChange = useCallback(
    (event: SelectChangeEvent) => {
      setFormat(event.target.value)
    },
    [setFormat]
  )

  if (
    values.length === 1 ||
    values.slice(1).every(value => value === values[0])
  ) {
    return <>{values[0]}</>
  }
  return (
    <NumberValueRoot>
      {format === 'mean'
        ? round(mean(values), 1)
        : format === 'median'
        ? round(median(values) ?? 0, 1)
        : format === 'max'
        ? round(max(values) ?? 0, 1)
        : format === 'min'
        ? round(min(values) ?? 0, 1)
        : null}
      <StyledSelect
        variant='filled'
        size='small'
        value={format}
        onChange={handleChange}
      >
        <SelectItem value='mean'>
          <Typography variant='body2'>平均</Typography>
        </SelectItem>
        <SelectItem value='median'>
          <Typography variant='body2'>中央</Typography>
        </SelectItem>
        <SelectItem value='min'>
          <Typography variant='body2'>最小</Typography>
        </SelectItem>
        <SelectItem value='max'>
          <Typography variant='body2'>最大</Typography>
        </SelectItem>
      </StyledSelect>
    </NumberValueRoot>
  )
}

export interface PropertyParameterItemProps
  extends Omit<ComponentPropsWithRef<typeof Root>, 'children'> {
  properties: readonly PropertySet[]
  labelFontSize?: 'small' | 'medium'
}

export const PropertyParameterItem = forwardRef<
  HTMLDivElement,
  PropertyParameterItemProps
>(({ properties, labelFontSize = 'small', ...props }, ref) => (
  <Root ref={ref} {...props}>
    <StyledTable size='small'>
      <TableBody>
        {properties
          .filter(({ values }) => typeof values[0] !== 'object')
          .map(({ name, values }) => (
            <TableRow key={name}>
              <TableCell variant='head' width='60%'>
                {name.replaceAll('_', ' ')}
              </TableCell>
              <TableCell width='40%'>
                {typeof values[0] === 'string' ? (
                  <StringValue name={name} values={values as string[]} />
                ) : typeof values[0] === 'number' ? (
                  <NumberValue name={name} values={values as number[]} />
                ) : null}
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </StyledTable>
  </Root>
))
