import { styled } from '@mui/material'
import {
  useOverlayScrollbars,
  type UseOverlayScrollbarsParams
} from 'overlayscrollbars-react'
import {
  forwardRef,
  useEffect,
  useRef,
  type ComponentPropsWithRef,
  type ReactNode
} from 'react'
import { mergeRefs } from 'react-merge-refs'
import invariant from 'tiny-invariant'

const Root = styled('div')({
  maxHeight: '100%'
})

export interface ScrollableProps
  extends ComponentPropsWithRef<typeof Root>,
    UseOverlayScrollbarsParams {
  children?: ReactNode
}

export const Scrollable = forwardRef<HTMLDivElement, ScrollableProps>(
  ({ options, events, defer, children, ...props }, forwardedRef) => {
    const ref = useRef<HTMLDivElement>(null)
    const [initialize] = useOverlayScrollbars({ options, events, defer })
    useEffect(() => {
      invariant(ref.current != null)
      initialize(ref.current)
    }, [initialize])
    return (
      <Root ref={mergeRefs([ref, forwardedRef])} {...props}>
        <div>{children}</div>
      </Root>
    )
  }
)
