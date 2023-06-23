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
  municipalities: Array<PlateauMunicipality>
  municipality?: Maybe<PlateauMunicipality>
  prefecture?: Maybe<PlateauPrefecture>
  prefectures: Array<PlateauPrefecture>
}

export type QueryMunicipalitiesArgs = {
  prefectureCode?: InputMaybe<Scalars['String']['input']>
}

export type QueryMunicipalityArgs = {
  code: Scalars['String']['input']
}

export type QueryPrefectureArgs = {
  code: Scalars['String']['input']
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
  type: PlateauDatasetType
  typeName: string
  name: string
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
  type: PlateauDatasetType
  typeName: string
  name: string
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
          type: PlateauDatasetType
          typeName: string
          name: string
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
          type: PlateauDatasetType
          typeName: string
          name: string
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
    type
    typeName
    name
    data {
      ...PlateauDatasetDatum
    }
  }
  ${PlateauDatasetDatumFragmentDoc}
`
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
