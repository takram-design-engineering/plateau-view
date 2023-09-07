import { type QueryDocumentSnapshot } from '@google-cloud/firestore'
import { plainToInstance, Type } from 'class-transformer'
import { IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator'
import { type BBox } from 'geojson'

import {
  FirestoreCollection,
  validateSyncOrThrow
} from '@takram/plateau-nest-firestore'

import { type PackedGeometry } from '../helpers/packGeometry'

// https://www.e-stat.go.jp/help/data-definition-information/downloaddata/A002005212015.pdf
// Value types are inferred from GeoJSON via jtd-infer.
export class EstatAreaDocumentProperties {
  @IsNumber()
  AREA!: number

  @IsString()
  @IsOptional()
  AREA_MAX_F?: string | null

  @IsString()
  CITY!: string

  @IsString()
  CITY_NAME!: string

  @IsString()
  @IsOptional()
  CSS_NAME?: string | null

  @IsString()
  @IsOptional()
  GST_NAME?: string | null

  @IsNumber()
  HCODE!: number

  @IsNumber()
  JINKO!: number

  @IsNumber()
  KBSUM!: number

  @IsString()
  KCODE1!: string

  @IsString()
  KEN!: string

  @IsString()
  KEN_NAME!: string

  @IsString()
  KEYCODE1!: string

  @IsString()
  @IsOptional()
  KEYCODE2?: string | null

  @IsString()
  KEY_CODE!: string

  @IsString()
  @IsOptional()
  KIGO_D?: string | null

  @IsString()
  @IsOptional()
  KIGO_E?: string | null

  @IsString()
  @IsOptional()
  KIGO_I?: string | null

  @IsString()
  KIHON1!: string

  @IsString()
  KIHON2!: string

  @IsString()
  @IsOptional()
  MOJI?: string | null

  @IsString()
  @IsOptional()
  N_CITY?: string | null

  @IsString()
  @IsOptional()
  N_KEN?: string | null

  @IsNumber()
  PERIMETER!: number

  @IsString()
  PREF!: string

  @IsString()
  PREF_NAME!: string

  @IsNumber()
  SETAI!: number

  @IsString()
  @IsOptional()
  SITYO_NAME?: string | null

  @IsString()
  S_AREA!: string

  @IsString()
  S_NAME!: string

  @IsNumber()
  X_CODE!: number

  @IsNumber()
  Y_CODE!: number
}

@FirestoreCollection('estat/areas')
export class EstatAreaDocument {
  static fromFirestore(
    snapshot: QueryDocumentSnapshot<EstatAreaDocument>
  ): EstatAreaDocument {
    return validateSyncOrThrow(
      plainToInstance(EstatAreaDocument, snapshot.data())
    )
  }

  @IsString()
  geohash!: string

  @IsNumber()
  longitude!: number

  @IsNumber()
  latitude!: number

  @IsString()
  shortAddress!: string

  @IsString()
  middleAddress!: string

  @IsString()
  fullAddress!: string

  @Type(() => EstatAreaDocumentProperties)
  @ValidateNested()
  properties!: EstatAreaDocumentProperties

  geometry!: PackedGeometry
  bbox!: BBox
}
