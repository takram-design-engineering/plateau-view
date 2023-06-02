import { type Cesium } from './Cesium'

export async function importESM<T = unknown>(path: string): Promise<T> {
  // eslint-disable-next-line no-eval
  return await (eval(`import('${path}')`) as Promise<T>)
}

export async function importCesium(): Promise<Cesium> {
  return await importESM<Cesium>('@cesium/engine')
}
