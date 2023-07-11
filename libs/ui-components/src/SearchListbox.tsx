import { styled, useTheme } from '@mui/material'
import { sum } from 'lodash'
import {
  Children,
  cloneElement,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes
} from 'react'
import { mergeRefs } from 'react-merge-refs'
import { VariableSizeList, type ListChildComponentProps } from 'react-window'
import invariant from 'tiny-invariant'

interface ListboxState {
  itemSize?: number
  maxItemCount?: number
  listPadding?: number
}

const OuterElementContext = createContext<ListboxState>({})

const OuterElement = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  (props, ref) => {
    const outerProps = useContext(OuterElementContext)
    return <div ref={ref} {...props} {...outerProps} />
  }
)

const InnerElement = styled('div')({})

const Root = styled('div')({
  height: '100%',
  minHeight: '50vh'
})

export const ListboxContext = createContext<ListboxState>({})

interface SearchListboxProps
  extends HTMLAttributes<HTMLElement>,
    ListboxState {}

export const SearchListbox = forwardRef<HTMLDivElement, SearchListboxProps>(
  ({ children, ...props }, forwardedRef) => {
    const theme = useTheme()
    const {
      itemSize = parseFloat(theme.spacing(5)),
      maxItemCount = 10,
      listPadding = 0
    } = useContext(ListboxContext)

    const itemData = Children.toArray(children)
    const itemCount = itemData.length

    const getChildSize = useCallback(
      (child: (typeof itemData)[number]) => itemSize,
      [itemSize]
    )

    const getItemSize = useCallback(
      (index: number) => getChildSize(itemData[index]),
      [itemData, getChildSize]
    )

    const getHeight = useCallback(() => {
      if (itemCount > maxItemCount) {
        return maxItemCount * itemSize
      }
      return sum(itemData.map(getChildSize))
    }, [itemSize, itemCount, maxItemCount, itemData, getChildSize])

    const renderRow = useCallback(
      ({ data, index, style }: ListChildComponentProps) => {
        invariant(typeof style.top === 'number')
        return cloneElement(data[index], {
          style: {
            ...style,
            top: +style.top + listPadding
          }
        })
      },
      [listPadding]
    )

    const ref = useRef<HTMLDivElement>(null)
    const [height, setHeight] = useState<number>()
    useEffect(() => {
      invariant(ref.current != null)
      setHeight(ref.current.getBoundingClientRect().height)
      const observer = new ResizeObserver(([entry]) => {
        setHeight(entry.contentRect.height)
      })
      observer.observe(ref.current)
      return () => {
        observer.disconnect()
      }
    }, [])

    return (
      <Root ref={mergeRefs([ref, forwardedRef])}>
        <OuterElementContext.Provider value={props}>
          {height != null && (
            <VariableSizeList
              itemData={itemData}
              itemCount={itemCount}
              itemSize={getItemSize}
              width='auto'
              height={height}
              outerElementType={OuterElement}
              innerElementType={InnerElement}
            >
              {renderRow}
            </VariableSizeList>
          )}
        </OuterElementContext.Provider>
      </Root>
    )
  }
)
