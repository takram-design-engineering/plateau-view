import { Inject, Injectable } from '@nestjs/common'
import { minimatch } from 'minimatch'
import urlJoin from 'url-join'

import { PLATEAU_MODULE_OPTIONS, PLATEAU_STORAGE_FILES } from './constants'
import { type PlateauDatasetFormat } from './dto/PlateauDatasetFormat'
import { PlateauModuleOptions } from './interfaces/PlateauModuleOptions'

export type PlateauStorageVersion = '2020' | '2022'

export type PlateauStorageFiles = Record<
  PlateauStorageVersion,
  Record<PlateauDatasetFormat, string[] | undefined>
>

@Injectable()
export class PlateauStorageService {
  constructor(
    @Inject(PLATEAU_MODULE_OPTIONS)
    private readonly options: PlateauModuleOptions,
    @Inject(PLATEAU_STORAGE_FILES)
    private readonly files: PlateauStorageFiles
  ) {}

  match(params: {
    pattern: string
    version: PlateauStorageVersion
    fileType: PlateauDatasetFormat
  }): string[] {
    const { pattern, version, fileType } = params
    const list = this.files[version][fileType]
    if (list == null) {
      return []
    }
    const matches = minimatch.match(list, `*/${pattern}`)
    return matches.map(file => urlJoin(this.options.baseUrl, `plateau/${file}`))
  }
}
