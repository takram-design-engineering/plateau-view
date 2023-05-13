import { validateSync, type ValidatorOptions } from 'class-validator'

export function validateSyncOrThrow<T extends object>(
  object: T,
  options?: ValidatorOptions
): T {
  const errors = validateSync(object, options)
  if (errors.length > 0) {
    throw new Error(
      `Error during validation: ${errors
        .map(error => error.toString())
        .join('\n')}`
    )
  }
  return object
}
