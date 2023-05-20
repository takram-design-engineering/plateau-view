import { writeFile } from 'fs/promises'
import { glob } from 'glob'
import { fromPairs } from 'lodash'
import path from 'path'

const patterns = {
  '3dtiles': '**/tileset.json',
  csv: '**/*.csv',
  czml: '**/*.czml',
  geojson: '**/*.geojson',
  gltf: '**/*.gltf',
  mvt: '**/metadata.json'
}

async function listFiles(params: {
  pattern: string
  cwd: string
}): Promise<object> {
  const dirs = await glob(params.pattern, { cwd: params.cwd })
  return fromPairs(
    await Promise.all(
      Object.entries(patterns).map(async ([type, pattern]) => [
        type,
        (
          await Promise.all(
            dirs.map(async dir =>
              (
                await glob(pattern, {
                  cwd: path.join(params.cwd, dir),
                  nodir: true
                })
              ).map(file => path.join(dir, file))
            )
          )
        ).flat()
      ])
    )
  )
}

export async function main(): Promise<void> {
  const cwd = path.resolve('./data/plateau')
  const data = {
    '2020': await listFiles({
      pattern: '*_2020_*',
      cwd
    }),
    '2022': await listFiles({
      pattern: '*_2022_*',
      cwd
    })
  }
  await writeFile(path.resolve('./data/plateau.json'), JSON.stringify(data))
  console.log('Done')
}
