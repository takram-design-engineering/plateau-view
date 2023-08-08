export type MeshType =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'half'
  | 'quarter'
  | 'eighth'

export interface MeshPoint {
  longitude: number
  latitude: number
}

export interface MeshBounds {
  north: number
  west: number
  south: number
  east: number
}
