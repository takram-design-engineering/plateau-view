import { SetMetadata, type CustomDecorator } from '@nestjs/common'

import { FIRESTORE_COLLECTION_METADATA } from '../constants'

export function FirestoreCollection(
  collectionPath: string
): CustomDecorator<typeof FIRESTORE_COLLECTION_METADATA> {
  return SetMetadata(FIRESTORE_COLLECTION_METADATA, collectionPath)
}
