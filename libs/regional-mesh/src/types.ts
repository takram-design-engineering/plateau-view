export type MeshPoint = [number, number]
export type MeshBounds = [number, number, number, number] // west, south, east, north

export type ConvertPointToCode = (point: Readonly<MeshPoint>) => number
export type ConvertCodeToPoint = (code: number) => MeshPoint
