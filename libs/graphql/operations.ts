import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'

export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T
> = { [_ in K]?: never }
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never
    }
const defaultOptions = {} as const
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any }
}

export type EstatArea = {
  __typename?: 'EstatArea'
  address: Scalars['String']['output']
  addressComponents: Array<Scalars['String']['output']>
  id: Scalars['ID']['output']
  municipalityCode: Scalars['String']['output']
  name: Scalars['String']['output']
  prefectureCode: Scalars['String']['output']
}

export type EstatAreaGeometry = {
  __typename?: 'EstatAreaGeometry'
  bbox: Array<Scalars['Float']['output']>
  geometry: Scalars['JSON']['output']
  id: Scalars['String']['output']
}

export type PlateauArea = {
  code: Scalars['String']['output']
  id: Scalars['ID']['output']
  name: Scalars['String']['output']
  parents: Array<PlateauArea>
  type: PlateauAreaType
}

export enum PlateauAreaType {
  Municipality = 'Municipality',
  Prefecture = 'Prefecture'
}

export type PlateauBuildingDataset = PlateauDataset & {
  __typename?: 'PlateauBuildingDataset'
  data: Array<PlateauBuildingDatasetDatum>
  description?: Maybe<Scalars['String']['output']>
  id: Scalars['ID']['output']
  municipality?: Maybe<PlateauMunicipality>
  name: Scalars['String']['output']
  type: PlateauDatasetType
  typeName: Scalars['String']['output']
}

export type PlateauBuildingDatasetDatum = PlateauDatasetDatum & {
  __typename?: 'PlateauBuildingDatasetDatum'
  format: PlateauDatasetFormat
  id: Scalars['ID']['output']
  lod: Scalars['Float']['output']
  name: Scalars['String']['output']
  textured: Scalars['Boolean']['output']
  url: Scalars['String']['output']
  version: Scalars['String']['output']
}

export type PlateauDataset = {
  data: Array<PlateauDatasetDatum>
  description?: Maybe<Scalars['String']['output']>
  id: Scalars['ID']['output']
  municipality?: Maybe<PlateauMunicipality>
  name: Scalars['String']['output']
  type: PlateauDatasetType
  typeName: Scalars['String']['output']
}

export type PlateauDatasetDatum = {
  format: PlateauDatasetFormat
  id: Scalars['ID']['output']
  name: Scalars['String']['output']
  url: Scalars['String']['output']
}

export enum PlateauDatasetFormat {
  Csv = 'CSV',
  Czml = 'CZML',
  Cesium3DTiles = 'Cesium3DTiles',
  Gltf = 'GLTF',
  Gtfs = 'GTFS',
  GeoJson = 'GeoJson',
  Mvt = 'MVT',
  Tms = 'TMS',
  Tiles = 'Tiles',
  Wms = 'WMS'
}

export enum PlateauDatasetType {
  Border = 'Border',
  Bridge = 'Bridge',
  Building = 'Building',
  CityFurniture = 'CityFurniture',
  EmergencyRoute = 'EmergencyRoute',
  GenericCityObject = 'GenericCityObject',
  HighTideRisk = 'HighTideRisk',
  InlandFloodingRisk = 'InlandFloodingRisk',
  LandSlideRisk = 'LandSlideRisk',
  LandUse = 'LandUse',
  Landmark = 'Landmark',
  Park = 'Park',
  Railway = 'Railway',
  RiverFloodingRisk = 'RiverFloodingRisk',
  Road = 'Road',
  Shelter = 'Shelter',
  Station = 'Station',
  TsunamiRisk = 'TsunamiRisk',
  UrbanPlanning = 'UrbanPlanning',
  UseCase = 'UseCase',
  Vegetation = 'Vegetation'
}

export type PlateauDefaultDataset = PlateauDataset & {
  __typename?: 'PlateauDefaultDataset'
  data: Array<PlateauDefaultDatasetDatum>
  description?: Maybe<Scalars['String']['output']>
  id: Scalars['ID']['output']
  municipality?: Maybe<PlateauMunicipality>
  name: Scalars['String']['output']
  type: PlateauDatasetType
  typeName: Scalars['String']['output']
}

export type PlateauDefaultDatasetDatum = PlateauDatasetDatum & {
  __typename?: 'PlateauDefaultDatasetDatum'
  format: PlateauDatasetFormat
  id: Scalars['ID']['output']
  name: Scalars['String']['output']
  url: Scalars['String']['output']
}

export type PlateauMunicipality = PlateauArea & {
  __typename?: 'PlateauMunicipality'
  code: Scalars['String']['output']
  datasets: Array<PlateauDataset>
  id: Scalars['ID']['output']
  name: Scalars['String']['output']
  parents: Array<PlateauArea>
  prefecture: PlateauPrefecture
  type: PlateauAreaType
}

export type PlateauMunicipalityDatasetsArgs = {
  excludeTypes?: InputMaybe<Array<PlateauDatasetType>>
  includeTypes?: InputMaybe<Array<PlateauDatasetType>>
  searchTokens?: InputMaybe<Array<Scalars['String']['input']>>
}

export type PlateauPrefecture = PlateauArea & {
  __typename?: 'PlateauPrefecture'
  code: Scalars['String']['output']
  id: Scalars['ID']['output']
  municipalities: Array<PlateauMunicipality>
  name: Scalars['String']['output']
  parents: Array<PlateauArea>
  type: PlateauAreaType
}

export type Query = {
  __typename?: 'Query'
  areaGeometry?: Maybe<EstatAreaGeometry>
  areas: Array<EstatArea>
  dataset?: Maybe<PlateauDataset>
  datasets: Array<PlateauDataset>
  municipalities: Array<PlateauMunicipality>
  municipality?: Maybe<PlateauMunicipality>
  prefecture?: Maybe<PlateauPrefecture>
  prefectures: Array<PlateauPrefecture>
}

export type QueryAreaGeometryArgs = {
  areaId: Scalars['ID']['input']
}

export type QueryAreasArgs = {
  searchTokens: Array<Scalars['String']['input']>
}

export type QueryDatasetArgs = {
  datasetId: Scalars['String']['input']
}

export type QueryDatasetsArgs = {
  excludeTypes?: InputMaybe<Array<PlateauDatasetType>>
  includeTypes?: InputMaybe<Array<PlateauDatasetType>>
  municipalityCodes?: InputMaybe<Array<Scalars['String']['input']>>
  searchTokens?: InputMaybe<Array<Scalars['String']['input']>>
}

export type QueryMunicipalitiesArgs = {
  datasetType?: InputMaybe<PlateauDatasetType>
  prefectureCode?: InputMaybe<Scalars['String']['input']>
}

export type QueryMunicipalityArgs = {
  code: Scalars['String']['input']
}

export type QueryPrefectureArgs = {
  code: Scalars['String']['input']
}

export type QueryPrefecturesArgs = {
  datasetType?: InputMaybe<PlateauDatasetType>
}

export type PlateauPrefectureFragment = {
  __typename?: 'PlateauPrefecture'
  id: string
  code: string
  name: string
}

export type PlateauMunicipalityFragment = {
  __typename?: 'PlateauMunicipality'
  id: string
  code: string
  name: string
  parents: Array<
    | {
        __typename?: 'PlateauMunicipality'
        id: string
        type: PlateauAreaType
        code: string
        name: string
      }
    | {
        __typename?: 'PlateauPrefecture'
        id: string
        type: PlateauAreaType
        code: string
        name: string
      }
  >
  prefecture: {
    __typename?: 'PlateauPrefecture'
    id: string
    code: string
    name: string
  }
}

type PlateauDatasetDatum_PlateauBuildingDatasetDatum_Fragment = {
  __typename?: 'PlateauBuildingDatasetDatum'
  version: string
  lod: number
  textured: boolean
  id: string
  format: PlateauDatasetFormat
  url: string
  name: string
}

type PlateauDatasetDatum_PlateauDefaultDatasetDatum_Fragment = {
  __typename?: 'PlateauDefaultDatasetDatum'
  id: string
  format: PlateauDatasetFormat
  url: string
  name: string
}

export type PlateauDatasetDatumFragment =
  | PlateauDatasetDatum_PlateauBuildingDatasetDatum_Fragment
  | PlateauDatasetDatum_PlateauDefaultDatasetDatum_Fragment

type PlateauDataset_PlateauBuildingDataset_Fragment = {
  __typename?: 'PlateauBuildingDataset'
  id: string
  name: string
  type: PlateauDatasetType
  typeName: string
  data: Array<{
    __typename?: 'PlateauBuildingDatasetDatum'
    version: string
    lod: number
    textured: boolean
    id: string
    format: PlateauDatasetFormat
    url: string
    name: string
  }>
}

type PlateauDataset_PlateauDefaultDataset_Fragment = {
  __typename?: 'PlateauDefaultDataset'
  id: string
  name: string
  type: PlateauDatasetType
  typeName: string
  data: Array<{
    __typename?: 'PlateauDefaultDatasetDatum'
    id: string
    format: PlateauDatasetFormat
    url: string
    name: string
  }>
}

export type PlateauDatasetFragment =
  | PlateauDataset_PlateauBuildingDataset_Fragment
  | PlateauDataset_PlateauDefaultDataset_Fragment

type PlateauDatasetDetail_PlateauBuildingDataset_Fragment = {
  __typename?: 'PlateauBuildingDataset'
  description?: string | null
  id: string
  name: string
  type: PlateauDatasetType
  typeName: string
  municipality?: {
    __typename?: 'PlateauMunicipality'
    id: string
    code: string
    name: string
    parents: Array<
      | {
          __typename?: 'PlateauMunicipality'
          id: string
          type: PlateauAreaType
          code: string
          name: string
        }
      | {
          __typename?: 'PlateauPrefecture'
          id: string
          type: PlateauAreaType
          code: string
          name: string
        }
    >
    prefecture: {
      __typename?: 'PlateauPrefecture'
      id: string
      code: string
      name: string
    }
  } | null
  data: Array<{
    __typename?: 'PlateauBuildingDatasetDatum'
    version: string
    lod: number
    textured: boolean
    id: string
    format: PlateauDatasetFormat
    url: string
    name: string
  }>
}

type PlateauDatasetDetail_PlateauDefaultDataset_Fragment = {
  __typename?: 'PlateauDefaultDataset'
  description?: string | null
  id: string
  name: string
  type: PlateauDatasetType
  typeName: string
  municipality?: {
    __typename?: 'PlateauMunicipality'
    id: string
    code: string
    name: string
    parents: Array<
      | {
          __typename?: 'PlateauMunicipality'
          id: string
          type: PlateauAreaType
          code: string
          name: string
        }
      | {
          __typename?: 'PlateauPrefecture'
          id: string
          type: PlateauAreaType
          code: string
          name: string
        }
    >
    prefecture: {
      __typename?: 'PlateauPrefecture'
      id: string
      code: string
      name: string
    }
  } | null
  data: Array<{
    __typename?: 'PlateauDefaultDatasetDatum'
    id: string
    format: PlateauDatasetFormat
    url: string
    name: string
  }>
}

export type PlateauDatasetDetailFragment =
  | PlateauDatasetDetail_PlateauBuildingDataset_Fragment
  | PlateauDatasetDetail_PlateauDefaultDataset_Fragment

export type EstatAreaFragment = {
  __typename?: 'EstatArea'
  id: string
  name: string
  address: string
  addressComponents: Array<string>
}

export type EstatAreaGeometryFragment = {
  __typename?: 'EstatAreaGeometry'
  id: string
  geometry: any
  bbox: Array<number>
}

export type PrefecturesQueryVariables = Exact<{
  datasetType?: InputMaybe<PlateauDatasetType>
}>

export type PrefecturesQuery = {
  __typename?: 'Query'
  prefectures: Array<{
    __typename?: 'PlateauPrefecture'
    id: string
    code: string
    name: string
  }>
}

export type PrefectureMunicipalitiesQueryVariables = Exact<{
  prefectureCode: Scalars['String']['input']
  datasetType?: InputMaybe<PlateauDatasetType>
}>

export type PrefectureMunicipalitiesQuery = {
  __typename?: 'Query'
  municipalities: Array<{
    __typename?: 'PlateauMunicipality'
    id: string
    code: string
    name: string
    parents: Array<
      | {
          __typename?: 'PlateauMunicipality'
          id: string
          type: PlateauAreaType
          code: string
          name: string
        }
      | {
          __typename?: 'PlateauPrefecture'
          id: string
          type: PlateauAreaType
          code: string
          name: string
        }
    >
    prefecture: {
      __typename?: 'PlateauPrefecture'
      id: string
      code: string
      name: string
    }
  }>
}

export type MunicipalityDatasetsQueryVariables = Exact<{
  municipalityCode: Scalars['String']['input']
  includeTypes?: InputMaybe<Array<PlateauDatasetType> | PlateauDatasetType>
  excludeTypes?: InputMaybe<Array<PlateauDatasetType> | PlateauDatasetType>
}>

export type MunicipalityDatasetsQuery = {
  __typename?: 'Query'
  municipality?: {
    __typename?: 'PlateauMunicipality'
    id: string
    code: string
    name: string
    datasets: Array<
      | {
          __typename?: 'PlateauBuildingDataset'
          id: string
          name: string
          type: PlateauDatasetType
          typeName: string
          data: Array<{
            __typename?: 'PlateauBuildingDatasetDatum'
            version: string
            lod: number
            textured: boolean
            id: string
            format: PlateauDatasetFormat
            url: string
            name: string
          }>
        }
      | {
          __typename?: 'PlateauDefaultDataset'
          id: string
          name: string
          type: PlateauDatasetType
          typeName: string
          data: Array<{
            __typename?: 'PlateauDefaultDatasetDatum'
            id: string
            format: PlateauDatasetFormat
            url: string
            name: string
          }>
        }
    >
    parents: Array<
      | {
          __typename?: 'PlateauMunicipality'
          id: string
          type: PlateauAreaType
          code: string
          name: string
        }
      | {
          __typename?: 'PlateauPrefecture'
          id: string
          type: PlateauAreaType
          code: string
          name: string
        }
    >
    prefecture: {
      __typename?: 'PlateauPrefecture'
      id: string
      code: string
      name: string
    }
  } | null
}

export type DatasetsQueryVariables = Exact<{
  municipalityCodes?: InputMaybe<
    Array<Scalars['String']['input']> | Scalars['String']['input']
  >
  includeTypes?: InputMaybe<Array<PlateauDatasetType> | PlateauDatasetType>
  excludeTypes?: InputMaybe<Array<PlateauDatasetType> | PlateauDatasetType>
}>

export type DatasetsQuery = {
  __typename?: 'Query'
  datasets: Array<
    | {
        __typename?: 'PlateauBuildingDataset'
        id: string
        name: string
        type: PlateauDatasetType
        typeName: string
        municipality?: {
          __typename?: 'PlateauMunicipality'
          id: string
          code: string
          name: string
          parents: Array<
            | {
                __typename?: 'PlateauMunicipality'
                id: string
                type: PlateauAreaType
                code: string
                name: string
              }
            | {
                __typename?: 'PlateauPrefecture'
                id: string
                type: PlateauAreaType
                code: string
                name: string
              }
          >
          prefecture: {
            __typename?: 'PlateauPrefecture'
            id: string
            code: string
            name: string
          }
        } | null
        data: Array<{
          __typename?: 'PlateauBuildingDatasetDatum'
          version: string
          lod: number
          textured: boolean
          id: string
          format: PlateauDatasetFormat
          url: string
          name: string
        }>
      }
    | {
        __typename?: 'PlateauDefaultDataset'
        id: string
        name: string
        type: PlateauDatasetType
        typeName: string
        municipality?: {
          __typename?: 'PlateauMunicipality'
          id: string
          code: string
          name: string
          parents: Array<
            | {
                __typename?: 'PlateauMunicipality'
                id: string
                type: PlateauAreaType
                code: string
                name: string
              }
            | {
                __typename?: 'PlateauPrefecture'
                id: string
                type: PlateauAreaType
                code: string
                name: string
              }
          >
          prefecture: {
            __typename?: 'PlateauPrefecture'
            id: string
            code: string
            name: string
          }
        } | null
        data: Array<{
          __typename?: 'PlateauDefaultDatasetDatum'
          id: string
          format: PlateauDatasetFormat
          url: string
          name: string
        }>
      }
  >
}

export type DatasetDetailQueryVariables = Exact<{
  datasetId: Scalars['String']['input']
}>

export type DatasetDetailQuery = {
  __typename?: 'Query'
  dataset?:
    | {
        __typename?: 'PlateauBuildingDataset'
        description?: string | null
        id: string
        name: string
        type: PlateauDatasetType
        typeName: string
        municipality?: {
          __typename?: 'PlateauMunicipality'
          id: string
          code: string
          name: string
          parents: Array<
            | {
                __typename?: 'PlateauMunicipality'
                id: string
                type: PlateauAreaType
                code: string
                name: string
              }
            | {
                __typename?: 'PlateauPrefecture'
                id: string
                type: PlateauAreaType
                code: string
                name: string
              }
          >
          prefecture: {
            __typename?: 'PlateauPrefecture'
            id: string
            code: string
            name: string
          }
        } | null
        data: Array<{
          __typename?: 'PlateauBuildingDatasetDatum'
          version: string
          lod: number
          textured: boolean
          id: string
          format: PlateauDatasetFormat
          url: string
          name: string
        }>
      }
    | {
        __typename?: 'PlateauDefaultDataset'
        description?: string | null
        id: string
        name: string
        type: PlateauDatasetType
        typeName: string
        municipality?: {
          __typename?: 'PlateauMunicipality'
          id: string
          code: string
          name: string
          parents: Array<
            | {
                __typename?: 'PlateauMunicipality'
                id: string
                type: PlateauAreaType
                code: string
                name: string
              }
            | {
                __typename?: 'PlateauPrefecture'
                id: string
                type: PlateauAreaType
                code: string
                name: string
              }
          >
          prefecture: {
            __typename?: 'PlateauPrefecture'
            id: string
            code: string
            name: string
          }
        } | null
        data: Array<{
          __typename?: 'PlateauDefaultDatasetDatum'
          id: string
          format: PlateauDatasetFormat
          url: string
          name: string
        }>
      }
    | null
}

export type AreasQueryVariables = Exact<{
  searchTokens: Array<Scalars['String']['input']> | Scalars['String']['input']
}>

export type AreasQuery = {
  __typename?: 'Query'
  areas: Array<{
    __typename?: 'EstatArea'
    id: string
    name: string
    address: string
    addressComponents: Array<string>
  }>
}

export type AreaGeometryQueryVariables = Exact<{
  areaId: Scalars['ID']['input']
}>

export type AreaGeometryQuery = {
  __typename?: 'Query'
  areaGeometry?: {
    __typename?: 'EstatAreaGeometry'
    id: string
    geometry: any
    bbox: Array<number>
  } | null
}

export const PlateauDatasetDatumFragmentDoc = gql`
  fragment PlateauDatasetDatum on PlateauDatasetDatum {
    id
    format
    url
    name
    ... on PlateauBuildingDatasetDatum {
      version
      lod
      textured
    }
  }
`
export const PlateauDatasetFragmentDoc = gql`
  fragment PlateauDataset on PlateauDataset {
    id
    name
    type
    typeName
    data {
      ...PlateauDatasetDatum
    }
  }
  ${PlateauDatasetDatumFragmentDoc}
`
export const PlateauPrefectureFragmentDoc = gql`
  fragment PlateauPrefecture on PlateauPrefecture {
    id
    code
    name
  }
`
export const PlateauMunicipalityFragmentDoc = gql`
  fragment PlateauMunicipality on PlateauMunicipality {
    id
    code
    name
    parents {
      id
      type
      code
      name
    }
    prefecture {
      ...PlateauPrefecture
    }
  }
  ${PlateauPrefectureFragmentDoc}
`
export const PlateauDatasetDetailFragmentDoc = gql`
  fragment PlateauDatasetDetail on PlateauDataset {
    ...PlateauDataset
    description
    municipality {
      ...PlateauMunicipality
    }
  }
  ${PlateauDatasetFragmentDoc}
  ${PlateauMunicipalityFragmentDoc}
`
export const EstatAreaFragmentDoc = gql`
  fragment EstatArea on EstatArea {
    id
    name
    address
    addressComponents
  }
`
export const EstatAreaGeometryFragmentDoc = gql`
  fragment EstatAreaGeometry on EstatAreaGeometry {
    id
    geometry
    bbox
  }
`
export const PrefecturesDocument = gql`
  query prefectures($datasetType: PlateauDatasetType) {
    prefectures(datasetType: $datasetType) {
      ...PlateauPrefecture
    }
  }
  ${PlateauPrefectureFragmentDoc}
`

/**
 * __usePrefecturesQuery__
 *
 * To run a query within a React component, call `usePrefecturesQuery` and pass it any options that fit your needs.
 * When your component renders, `usePrefecturesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePrefecturesQuery({
 *   variables: {
 *      datasetType: // value for 'datasetType'
 *   },
 * });
 */
export function usePrefecturesQuery(
  baseOptions?: Apollo.QueryHookOptions<
    PrefecturesQuery,
    PrefecturesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<PrefecturesQuery, PrefecturesQueryVariables>(
    PrefecturesDocument,
    options
  )
}
export function usePrefecturesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    PrefecturesQuery,
    PrefecturesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<PrefecturesQuery, PrefecturesQueryVariables>(
    PrefecturesDocument,
    options
  )
}
export type PrefecturesQueryHookResult = ReturnType<typeof usePrefecturesQuery>
export type PrefecturesLazyQueryHookResult = ReturnType<
  typeof usePrefecturesLazyQuery
>
export type PrefecturesQueryResult = Apollo.QueryResult<
  PrefecturesQuery,
  PrefecturesQueryVariables
>
export const PrefectureMunicipalitiesDocument = gql`
  query prefectureMunicipalities(
    $prefectureCode: String!
    $datasetType: PlateauDatasetType
  ) {
    municipalities(prefectureCode: $prefectureCode, datasetType: $datasetType) {
      ...PlateauMunicipality
    }
  }
  ${PlateauMunicipalityFragmentDoc}
`

/**
 * __usePrefectureMunicipalitiesQuery__
 *
 * To run a query within a React component, call `usePrefectureMunicipalitiesQuery` and pass it any options that fit your needs.
 * When your component renders, `usePrefectureMunicipalitiesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePrefectureMunicipalitiesQuery({
 *   variables: {
 *      prefectureCode: // value for 'prefectureCode'
 *      datasetType: // value for 'datasetType'
 *   },
 * });
 */
export function usePrefectureMunicipalitiesQuery(
  baseOptions: Apollo.QueryHookOptions<
    PrefectureMunicipalitiesQuery,
    PrefectureMunicipalitiesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<
    PrefectureMunicipalitiesQuery,
    PrefectureMunicipalitiesQueryVariables
  >(PrefectureMunicipalitiesDocument, options)
}
export function usePrefectureMunicipalitiesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    PrefectureMunicipalitiesQuery,
    PrefectureMunicipalitiesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<
    PrefectureMunicipalitiesQuery,
    PrefectureMunicipalitiesQueryVariables
  >(PrefectureMunicipalitiesDocument, options)
}
export type PrefectureMunicipalitiesQueryHookResult = ReturnType<
  typeof usePrefectureMunicipalitiesQuery
>
export type PrefectureMunicipalitiesLazyQueryHookResult = ReturnType<
  typeof usePrefectureMunicipalitiesLazyQuery
>
export type PrefectureMunicipalitiesQueryResult = Apollo.QueryResult<
  PrefectureMunicipalitiesQuery,
  PrefectureMunicipalitiesQueryVariables
>
export const MunicipalityDatasetsDocument = gql`
  query municipalityDatasets(
    $municipalityCode: String!
    $includeTypes: [PlateauDatasetType!]
    $excludeTypes: [PlateauDatasetType!]
  ) {
    municipality(code: $municipalityCode) {
      ...PlateauMunicipality
      datasets(includeTypes: $includeTypes, excludeTypes: $excludeTypes) {
        ...PlateauDataset
      }
    }
  }
  ${PlateauMunicipalityFragmentDoc}
  ${PlateauDatasetFragmentDoc}
`

/**
 * __useMunicipalityDatasetsQuery__
 *
 * To run a query within a React component, call `useMunicipalityDatasetsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMunicipalityDatasetsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMunicipalityDatasetsQuery({
 *   variables: {
 *      municipalityCode: // value for 'municipalityCode'
 *      includeTypes: // value for 'includeTypes'
 *      excludeTypes: // value for 'excludeTypes'
 *   },
 * });
 */
export function useMunicipalityDatasetsQuery(
  baseOptions: Apollo.QueryHookOptions<
    MunicipalityDatasetsQuery,
    MunicipalityDatasetsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<
    MunicipalityDatasetsQuery,
    MunicipalityDatasetsQueryVariables
  >(MunicipalityDatasetsDocument, options)
}
export function useMunicipalityDatasetsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    MunicipalityDatasetsQuery,
    MunicipalityDatasetsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<
    MunicipalityDatasetsQuery,
    MunicipalityDatasetsQueryVariables
  >(MunicipalityDatasetsDocument, options)
}
export type MunicipalityDatasetsQueryHookResult = ReturnType<
  typeof useMunicipalityDatasetsQuery
>
export type MunicipalityDatasetsLazyQueryHookResult = ReturnType<
  typeof useMunicipalityDatasetsLazyQuery
>
export type MunicipalityDatasetsQueryResult = Apollo.QueryResult<
  MunicipalityDatasetsQuery,
  MunicipalityDatasetsQueryVariables
>
export const DatasetsDocument = gql`
  query datasets(
    $municipalityCodes: [String!]
    $includeTypes: [PlateauDatasetType!]
    $excludeTypes: [PlateauDatasetType!]
  ) {
    datasets(
      municipalityCodes: $municipalityCodes
      includeTypes: $includeTypes
      excludeTypes: $excludeTypes
    ) {
      ...PlateauDataset
      municipality {
        ...PlateauMunicipality
      }
    }
  }
  ${PlateauDatasetFragmentDoc}
  ${PlateauMunicipalityFragmentDoc}
`

/**
 * __useDatasetsQuery__
 *
 * To run a query within a React component, call `useDatasetsQuery` and pass it any options that fit your needs.
 * When your component renders, `useDatasetsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDatasetsQuery({
 *   variables: {
 *      municipalityCodes: // value for 'municipalityCodes'
 *      includeTypes: // value for 'includeTypes'
 *      excludeTypes: // value for 'excludeTypes'
 *   },
 * });
 */
export function useDatasetsQuery(
  baseOptions?: Apollo.QueryHookOptions<DatasetsQuery, DatasetsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<DatasetsQuery, DatasetsQueryVariables>(
    DatasetsDocument,
    options
  )
}
export function useDatasetsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    DatasetsQuery,
    DatasetsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<DatasetsQuery, DatasetsQueryVariables>(
    DatasetsDocument,
    options
  )
}
export type DatasetsQueryHookResult = ReturnType<typeof useDatasetsQuery>
export type DatasetsLazyQueryHookResult = ReturnType<
  typeof useDatasetsLazyQuery
>
export type DatasetsQueryResult = Apollo.QueryResult<
  DatasetsQuery,
  DatasetsQueryVariables
>
export const DatasetDetailDocument = gql`
  query datasetDetail($datasetId: String!) {
    dataset(datasetId: $datasetId) {
      ...PlateauDatasetDetail
    }
  }
  ${PlateauDatasetDetailFragmentDoc}
`

/**
 * __useDatasetDetailQuery__
 *
 * To run a query within a React component, call `useDatasetDetailQuery` and pass it any options that fit your needs.
 * When your component renders, `useDatasetDetailQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDatasetDetailQuery({
 *   variables: {
 *      datasetId: // value for 'datasetId'
 *   },
 * });
 */
export function useDatasetDetailQuery(
  baseOptions: Apollo.QueryHookOptions<
    DatasetDetailQuery,
    DatasetDetailQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<DatasetDetailQuery, DatasetDetailQueryVariables>(
    DatasetDetailDocument,
    options
  )
}
export function useDatasetDetailLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    DatasetDetailQuery,
    DatasetDetailQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<DatasetDetailQuery, DatasetDetailQueryVariables>(
    DatasetDetailDocument,
    options
  )
}
export type DatasetDetailQueryHookResult = ReturnType<
  typeof useDatasetDetailQuery
>
export type DatasetDetailLazyQueryHookResult = ReturnType<
  typeof useDatasetDetailLazyQuery
>
export type DatasetDetailQueryResult = Apollo.QueryResult<
  DatasetDetailQuery,
  DatasetDetailQueryVariables
>
export const AreasDocument = gql`
  query areas($searchTokens: [String!]!) {
    areas(searchTokens: $searchTokens) {
      ...EstatArea
    }
  }
  ${EstatAreaFragmentDoc}
`

/**
 * __useAreasQuery__
 *
 * To run a query within a React component, call `useAreasQuery` and pass it any options that fit your needs.
 * When your component renders, `useAreasQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAreasQuery({
 *   variables: {
 *      searchTokens: // value for 'searchTokens'
 *   },
 * });
 */
export function useAreasQuery(
  baseOptions: Apollo.QueryHookOptions<AreasQuery, AreasQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AreasQuery, AreasQueryVariables>(
    AreasDocument,
    options
  )
}
export function useAreasLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<AreasQuery, AreasQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AreasQuery, AreasQueryVariables>(
    AreasDocument,
    options
  )
}
export type AreasQueryHookResult = ReturnType<typeof useAreasQuery>
export type AreasLazyQueryHookResult = ReturnType<typeof useAreasLazyQuery>
export type AreasQueryResult = Apollo.QueryResult<
  AreasQuery,
  AreasQueryVariables
>
export const AreaGeometryDocument = gql`
  query areaGeometry($areaId: ID!) {
    areaGeometry(areaId: $areaId) {
      ...EstatAreaGeometry
    }
  }
  ${EstatAreaGeometryFragmentDoc}
`

/**
 * __useAreaGeometryQuery__
 *
 * To run a query within a React component, call `useAreaGeometryQuery` and pass it any options that fit your needs.
 * When your component renders, `useAreaGeometryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAreaGeometryQuery({
 *   variables: {
 *      areaId: // value for 'areaId'
 *   },
 * });
 */
export function useAreaGeometryQuery(
  baseOptions: Apollo.QueryHookOptions<
    AreaGeometryQuery,
    AreaGeometryQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AreaGeometryQuery, AreaGeometryQueryVariables>(
    AreaGeometryDocument,
    options
  )
}
export function useAreaGeometryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    AreaGeometryQuery,
    AreaGeometryQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AreaGeometryQuery, AreaGeometryQueryVariables>(
    AreaGeometryDocument,
    options
  )
}
export type AreaGeometryQueryHookResult = ReturnType<
  typeof useAreaGeometryQuery
>
export type AreaGeometryLazyQueryHookResult = ReturnType<
  typeof useAreaGeometryLazyQuery
>
export type AreaGeometryQueryResult = Apollo.QueryResult<
  AreaGeometryQuery,
  AreaGeometryQueryVariables
>
