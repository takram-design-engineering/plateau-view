export interface Location {
  longitude: number
  latitude: number
  height?: number
}

export interface Position {
  x: number
  y: number
  z: number
}

export interface HeadingPitch {
  heading: number
  pitch: number
}

export interface HeadingPitchFov {
  heading: number
  pitch: number
  fov: number
}
