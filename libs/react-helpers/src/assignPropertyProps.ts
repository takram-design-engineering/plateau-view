import { defaults, pick } from 'lodash'

export function assignPropertyProps<
  T extends Properties,
  Properties extends object
>(target: T, props: Partial<Properties>, properties: Properties): void {
  Object.assign(
    target,
    defaults(pick(props, Object.keys(properties)), properties)
  )
}
