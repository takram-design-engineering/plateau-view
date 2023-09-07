import { writeFile } from 'fs/promises'
import path from 'path'
import { read as readShapefile } from 'shapefile'

export async function main(): Promise<void> {
  const prefectureCodes = [...Array(47)].map((_, index) =>
    `${index + 1}`.padStart(2, '0')
  )
  for (const prefectureCode of prefectureCodes) {
    // Get the data at:
    // https://www.e-stat.go.jp/gis/statmap-search?page=1&type=2&aggregateUnitForBoundary=A&toukeiCode=00200521&toukeiYear=2020&serveyId=B002005212020&prefCode=01&coordsys=1&format=shape&datum=2000
    const source = path.resolve(
      `./data/estat/B002005212020/A002005212015DDSWC${prefectureCode}-JGD2011/h27ka${prefectureCode}`
    )
    const geojson = await readShapefile(`${source}.shp`, `${source}.dbf`, {
      encoding: 'sjis'
    })
    await writeFile(
      path.resolve(path.dirname(source), `h27ka${prefectureCode}.geojson`),
      JSON.stringify(geojson)
    )
    console.log(`Saved h27ka${prefectureCode}.geojson`)
  }

  console.log('Done')
}
