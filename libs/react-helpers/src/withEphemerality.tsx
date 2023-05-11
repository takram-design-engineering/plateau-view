import { pick } from 'lodash'
import { nanoid } from 'nanoid'
import {
  forwardRef,
  useMemo,
  type ComponentType,
  type ForwardRefExoticComponent,
  type PropsWithoutRef,
  type RefAttributes
} from 'react'

// TODO: Infer ref type
export function withEphemerality<T, P>(
  hook: (() => object) | null,
  propNames: ReadonlyArray<keyof PropsWithoutRef<P>>,
  Component: ComponentType<P>
): ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<T>> {
  return forwardRef<T, P>((props, forwardedRef) => {
    const owner = hook?.() ?? null
    const key = useMemo(
      () => nanoid(),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [owner, ...Object.values(pick(props, propNames))]
    )
    return <Component ref={forwardedRef} key={key} {...props} />
  })
}
