import {
  alpha,
  Collapse,
  IconButton,
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
import { groupBy, max, mean, min, round } from 'lodash'
import {
  forwardRef,
  useCallback,
  type ComponentPropsWithRef,
  type FC
} from 'react'

import { TreeArrowCollapsedIcon } from './icons/TreeArrowCollapsedIcon'
import { TreeArrowExpandedIcon } from './icons/TreeArrowExpandedIcon'
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

const Property: FC<{
  property: PropertySet
  level?: number
}> = ({ property: { name, values }, level = 0 }) => (
  <TableRow>
    <TableCell variant='head' width='50%' sx={{ paddingLeft: level * 2 + 2 }}>
      {name.replaceAll('_', ' ')}
    </TableCell>
    <TableCell width='50%'>
      {typeof values[0] === 'string' ? (
        <StringValue name={name} values={values as string[]} />
      ) : typeof values[0] === 'number' ? (
        <NumberValue name={name} values={values as number[]} />
      ) : null}
    </TableCell>
  </TableRow>
)

const groupExpandedAtomFamily = atomFamily((name: string) => atom(false))

const PropertyGroupCell = styled(TableCell)({
  borderBottomWidth: 0
})

const PropertyGroupName = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginLeft: theme.spacing(-1)
}))

const PropertyGroup: FC<{
  name: string
  properties: readonly PropertySet[]
}> = ({ name, properties }) => {
  const expandedAtom = groupExpandedAtomFamily(name)
  const [expanded, setExpanded] = useAtom(expandedAtom)
  const handleClick = useCallback(() => {
    setExpanded(value => !value)
  }, [setExpanded])
  return (
    <>
      <TableRow>
        <PropertyGroupCell variant='head' colSpan={2}>
          <PropertyGroupName>
            <IconButton size='small' onClick={handleClick}>
              {expanded ? (
                <TreeArrowExpandedIcon />
              ) : (
                <TreeArrowCollapsedIcon />
              )}
            </IconButton>
            {name}
          </PropertyGroupName>
        </PropertyGroupCell>
      </TableRow>
      <TableRow>
        <TableCell variant='head' colSpan={2} padding='none'>
          <Collapse in={expanded} timeout='auto' unmountOnExit>
            <StyledTable size='small'>
              <TableBody>
                {properties.map(property => (
                  <Property
                    key={property.name}
                    property={{
                      ...property,
                      name: property.name.slice(name.length + 1)
                    }}
                    level={1}
                  />
                ))}
              </TableBody>
            </StyledTable>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
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
>(({ properties, labelFontSize = 'small', ...props }, ref) => {
  const groups = Object.entries(
    groupBy(properties, property => property.name.split('_')[0])
  ).map(([name, properties]) => ({ name, properties }))
  return (
    <Root ref={ref} {...props}>
      <StyledTable size='small'>
        <TableBody>
          {groups.map(({ name, properties }) =>
            properties.length === 1 ? (
              <Property key={properties[0].name} property={properties[0]} />
            ) : (
              <PropertyGroup key={name} name={name} properties={properties} />
            )
          )}
        </TableBody>
      </StyledTable>
    </Root>
  )
})
