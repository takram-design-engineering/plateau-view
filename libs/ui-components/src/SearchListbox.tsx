import { ListSubheader, styled, useTheme } from '@mui/material'
import { sum } from 'lodash'
import {
  Children,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useMemo,
  type FC,
  type HTMLAttributes
} from 'react'
import {
  VariableSizeList,
  type ListChildComponentProps,
  type ReactElementType,
  type VariableSizeListProps
} from 'react-window'
import invariant from 'tiny-invariant'

const OuterElementContext = createContext({})

const OuterElement = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  (props, ref) => {
    const outerProps = useContext(OuterElementContext)
    return <div ref={ref} {...props} {...outerProps} />
  }
)

const InnerElement = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1)
}))

const Root = styled('div')({
  height: '100%'
})

const Row: FC<ListChildComponentProps> = ({ data, index, style }) => {
  invariant(typeof style.top === 'number')
  invariant(typeof style.height === 'number')
  const theme = useTheme()
  const listPadding = parseFloat(theme.spacing(1))
  return (
    <div
      style={{
        ...style,
        top: style.top + listPadding
      }}
    >
      {data[index]}
    </div>
  )
}

interface SearchListboxProps extends HTMLAttributes<HTMLElement> {
  itemSize?: number
  maxItemCount?: number
  maxHeight?: number
}

export const SearchListbox = forwardRef<HTMLDivElement, SearchListboxProps>(
  (
    {
      itemSize: itemSizeProp,
      maxItemCount = 10,
      maxHeight,
      children,
      ...props
    },
    forwardedRef
  ) => {
    const theme = useTheme()
    const itemSize = itemSizeProp ?? parseFloat(theme.spacing(5))
    const itemData = Children.toArray(children)
    const itemCount = itemData.length
    const listPadding = parseFloat(theme.spacing(1))

    const getChildSize = useCallback(
      (child: (typeof itemData)[number]) => {
        const type = typeof child === 'object' && 'type' in child && child.type
        return type === ListSubheader ? parseFloat(theme.spacing(6)) : itemSize
      },
      [theme, itemSize]
    )

    const getItemSize = useCallback(
      (index: number) => getChildSize(itemData[index]),
      [itemData, getChildSize]
    )

    const height = useMemo(() => {
      const intrinsicHeight = sum(itemData.map(getChildSize)) + listPadding * 2
      if (maxHeight != null) {
        return Math.min(
          intrinsicHeight,
          maxHeight - parseFloat(theme.spacing(6))
        )
      }
      return itemCount < maxItemCount
        ? intrinsicHeight
        : maxItemCount * itemSize + listPadding * 2
    }, [
      maxItemCount,
      maxHeight,
      theme,
      itemSize,
      itemData,
      itemCount,
      listPadding,
      getChildSize
    ])

    return (
      <Root ref={forwardedRef}>
        <OuterElementContext.Provider value={props}>
          <VariableSizeList
            itemData={itemData}
            itemCount={itemCount}
            itemSize={getItemSize}
            width='auto'
            height={height}
            outerElementType={OuterElement as ReactElementType}
            innerElementType={InnerElement as ReactElementType}
            overscanCount={Math.ceil(itemCount / itemSize)}
          >
            {Row as VariableSizeListProps['children']}
          </VariableSizeList>
        </OuterElementContext.Provider>
      </Root>
    )
  }
)
