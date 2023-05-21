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
const defaultOptions = {} as const
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
}

export type PlateauArea = {
  code: Scalars['String']
  id: Scalars['ID']
  name: Scalars['String']
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
  description?: Maybe<Scalars['String']>
  id: Scalars['ID']
  municipality?: Maybe<PlateauMunicipality>
  name: Scalars['String']
  type: PlateauDatasetType
  typeName: Scalars['String']
}

export type PlateauBuildingDatasetDatum = PlateauDatasetDatum & {
  __typename?: 'PlateauBuildingDatasetDatum'
  format: PlateauDatasetFormat
  id: Scalars['ID']
  lod: Scalars['Float']
  name: Scalars['String']
  textured: Scalars['Boolean']
  url: Scalars['String']
  version: Scalars['String']
}

export type PlateauDataset = {
  data: Array<PlateauDatasetDatum>
  description?: Maybe<Scalars['String']>
  id: Scalars['ID']
  municipality?: Maybe<PlateauMunicipality>
  name: Scalars['String']
  type: PlateauDatasetType
  typeName: Scalars['String']
}

export type PlateauDatasetDatum = {
  format: PlateauDatasetFormat
  id: Scalars['ID']
  name: Scalars['String']
  url: Scalars['String']
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
  EmergencyRoute = 'EmergencyRoute',
  Facility = 'Facility',
  Flood = 'Flood',
  Furniture = 'Furniture',
  Generic = 'Generic',
  Hightide = 'Hightide',
  InlandFlood = 'InlandFlood',
  Landmark = 'Landmark',
  Landslide = 'Landslide',
  Landuse = 'Landuse',
  Park = 'Park',
  Railway = 'Railway',
  Road = 'Road',
  Shelter = 'Shelter',
  Station = 'Station',
  Tsunami = 'Tsunami',
  UseCase = 'UseCase',
  Vegetation = 'Vegetation'
}

export type PlateauDefaultDataset = PlateauDataset & {
  __typename?: 'PlateauDefaultDataset'
  data: Array<PlateauDefaultDatasetDatum>
  description?: Maybe<Scalars['String']>
  id: Scalars['ID']
  municipality?: Maybe<PlateauMunicipality>
  name: Scalars['String']
  type: PlateauDatasetType
  typeName: Scalars['String']
}

export type PlateauDefaultDatasetDatum = PlateauDatasetDatum & {
  __typename?: 'PlateauDefaultDatasetDatum'
  format: PlateauDatasetFormat
  id: Scalars['ID']
  name: Scalars['String']
  url: Scalars['String']
}

export type PlateauMunicipality = PlateauArea & {
  __typename?: 'PlateauMunicipality'
  code: Scalars['String']
  datasets: Array<PlateauDataset>
  id: Scalars['ID']
  name: Scalars['String']
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
  code: Scalars['String']
  id: Scalars['ID']
  municipalities: Array<PlateauMunicipality>
  name: Scalars['String']
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
  prefectureCode?: InputMaybe<Scalars['String']>
}

export type QueryMunicipalityArgs = {
  code: Scalars['String']
}

export type QueryPrefectureArgs = {
  code: Scalars['String']
}

export type PlateauMunicipalityFragment = {
  __typename?: 'PlateauMunicipality'
  id: string
  code: string
  name: string
  prefecture: {
    __typename?: 'PlateauPrefecture'
    id: string
    code: string
    name: string
  }
}

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
  municipalityCode: Scalars['String']
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
    prefecture: {
      __typename?: 'PlateauPrefecture'
      id: string
      code: string
      name: string
    }
  } | null
}

export const PlateauMunicipalityFragmentDoc = gql`
  fragment PlateauMunicipality on PlateauMunicipality {
    id
    code
    name
    prefecture {
      id
      code
      name
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
  }
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
