import { mapValues, pick } from 'lodash'
import {
  forwardRef,
  memo,
  useDeferredValue,
  type ComponentType,
  type ForwardRefExoticComponent,
  type PropsWithoutRef,
  type RefAttributes
} from 'react'

// TODO: Infer ref type
export function withDeferredProps<T, P>(
  propNames: ReadonlyArray<keyof PropsWithoutRef<P>>,
  Component: ComponentType<P>
): ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<T>> {
  const MemoizedComponent = memo(Component) as ComponentType<P>
  return forwardRef<T, P>((props, forwardedRef) => {
    const deferredProps = mapValues(pick(props, propNames), prop =>
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useDeferredValue(prop)
    )
    return (
      <MemoizedComponent ref={forwardedRef} {...props} {...deferredProps} />
    )
  })
}
