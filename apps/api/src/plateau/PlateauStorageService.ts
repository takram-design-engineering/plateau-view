import { Inject, Injectable } from '@nestjs/common'
import { minimatch } from 'minimatch'

import { PLATEAU_DATASET_FILES } from './constants'
import {
  PlateauDatasetFiles,
  type PlateauDatasetFileType,
  type PlateauDatasetVersion
} from './interfaces/PlateauDatasetFiles'

@Injectable()
export class PlateauStorageService {
  constructor(
    @Inject(PLATEAU_DATASET_FILES)
    private readonly files: PlateauDatasetFiles
  ) {}

  match(params: {
    pattern: string
    version: PlateauDatasetVersion
    fileType: PlateauDatasetFileType
  }): string[] {
    const { pattern, version, fileType } = params
    return minimatch.match(this.files[version][fileType], `*/${pattern}`)
  }
}
