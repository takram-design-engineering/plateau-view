import invariant from 'tiny-invariant'

interface AreaCodes {
  prefectures: Record<string, string>
  municipalities: Record<string, string | [string, string] | [string, string[]]>
}

type AreaRadii = Record<string, number>

export type AreaType = 'prefecture' | 'municipality'

export interface Area<R extends boolean = boolean> {
  type: AreaType
  code: string
  name: string
  radius: R extends true ? number : number | undefined
}

export type PrefectureArea<R extends boolean = boolean> = Area<R> & {
  type: 'prefecture'
}

export type MunicipalityArea<R extends boolean = boolean> = Area<R> & {
  type: 'municipality'
}

let areaCodesPromise: Promise<AreaCodes>
let areaRadiiPromise: Promise<AreaRadii>

export function getAreas<R extends boolean = boolean>(
  code: string,
  includeRadii?: R
): Promise<Array<Area<R>> | undefined>

export async function getAreas(
  code: string,
  includeRadii = false
): Promise<Area[] | undefined> {
  const [areaCodes, areaRadii] = await Promise.all([
    areaCodesPromise ??
      (areaCodesPromise = import(
        './assets/areaCodes.json'
      ) as unknown as Promise<AreaCodes>),
    includeRadii
      ? areaRadiiPromise ??
        (areaRadiiPromise = import(
          './assets/areaRadii.json'
        ) as unknown as Promise<AreaRadii>)
      : undefined
  ])

  const prefectureCode = code.slice(0, 2)
  const prefectureName = areaCodes.prefectures[prefectureCode]
  const municipality = areaCodes.municipalities[code]
  if (prefectureName == null || municipality == null) {
    return
  }
  const areas: Area[] = [
    {
      type: 'municipality',
      code,
      name: typeof municipality === 'string' ? municipality : municipality[0],
      radius: areaRadii?.[code] ?? 0
    }
  ]
  if (typeof municipality !== 'string' && typeof municipality[1] === 'string') {
    const parent = areaCodes.municipalities[municipality[1]]
    invariant(parent != null)
    if (parent != null) {
      areas.push({
        type: 'municipality',
        code: municipality[1],
        name: parent[0],
        radius: areaRadii?.[municipality[1]] ?? 0
      })
    }
  }
  areas.push({
    type: 'prefecture',
    code: prefectureCode,
    name: prefectureName,
    radius: areaRadii?.[prefectureCode] ?? 0
  })
  return areas
}
