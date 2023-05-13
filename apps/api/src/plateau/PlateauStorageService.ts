import { Inject, Injectable } from '@nestjs/common'
import { minimatch } from 'minimatch'
import urlJoin from 'url-join'

import { PLATEAU_DATASET_FILES, PLATEAU_MODULE_OPTIONS } from './constants'
import {
  PlateauDatasetFiles,
  type PlateauDatasetFileType,
  type PlateauDatasetVersion
} from './interfaces/PlateauDatasetFiles'
import { PlateauModuleOptions } from './interfaces/PlateauModuleOptions'

@Injectable()
export class PlateauStorageService {
  constructor(
    @Inject(PLATEAU_MODULE_OPTIONS)
    private readonly options: PlateauModuleOptions,
    @Inject(PLATEAU_DATASET_FILES)
    private readonly files: PlateauDatasetFiles
  ) {}

  match(params: {
    pattern: string
    version: PlateauDatasetVersion
    fileType: PlateauDatasetFileType
  }): string[] {
    const { pattern, version, fileType } = params
    const files = minimatch.match(this.files[version][fileType], `*/${pattern}`)
    if (this.options.dataRoot.startsWith('gs://')) {
      return files.map(file =>
        urlJoin(this.options.dataRoot, `plateau/${file}`)
      )
    } else {
      return files.map(file => urlJoin(this.options.baseUrl, `plateau/${file}`))
    }
  }
}
