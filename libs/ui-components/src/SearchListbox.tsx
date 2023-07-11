import { styled, useTheme } from '@mui/material'
import { sum } from 'lodash'
import {
  Children,
  cloneElement,
  forwardRef,
  useCallback,
  useMemo,
  type FC,
  type HTMLAttributes
} from 'react'
import { VariableSizeList, type ListChildComponentProps } from 'react-window'
import invariant from 'tiny-invariant'

const OuterElement = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1)
}))

const InnerElement = styled('div')({})

const Root = styled('div')({
  height: '100%'
})

const Row: FC<ListChildComponentProps> = ({ data, index, style }) => {
  invariant(typeof style.top === 'number')
  const theme = useTheme()
  const listPadding = parseFloat(theme.spacing(1))
  return cloneElement(data[index], {
    style: {
      ...style,
      top: +style.top + listPadding
    }
  })
}

interface SearchListboxProps extends HTMLAttributes<HTMLElement> {
  itemSize?: number
  maxItemCount?: number
  maxHeight?: number
}

export const SearchListbox = forwardRef<HTMLDivElement, SearchListboxProps>(
  (
    { itemSize: itemSizeProp, maxItemCount = 10, maxHeight, children },
    forwardedRef
  ) => {
    const theme = useTheme()
    const itemSize = itemSizeProp ?? parseFloat(theme.spacing(5))
    const itemData = Children.toArray(children)
    const itemCount = itemData.length
    const listPadding = parseFloat(theme.spacing(1))

    const getChildSize = useCallback(
      (child: (typeof itemData)[number]) => itemSize,
      [itemSize]
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
        <VariableSizeList
          itemData={itemData}
          itemCount={itemCount}
          itemSize={getItemSize}
          width='auto'
          height={height}
          outerElementType={OuterElement}
          innerElementType={InnerElement}
        >
          {Row}
        </VariableSizeList>
      </Root>
    )
  }
)
