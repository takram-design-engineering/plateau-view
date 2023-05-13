import { type Settings } from '@google-cloud/firestore'

export interface FirestoreModuleOptions extends Settings {
  rootPath?: string
}
