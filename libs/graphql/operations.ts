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
  id: Scalars['String']
  type: Scalars['String']
  variants: Array<PlateauBuildingDatasetVariant>
}

export type PlateauBuildingDatasetVariant = {
  __typename?: 'PlateauBuildingDatasetVariant'
  lod: Scalars['Float']
  textured: Scalars['Boolean']
  url: Scalars['String']
  version: Scalars['String']
}

export type PlateauDataset = {
  id: Scalars['String']
  type: Scalars['String']
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
  version?: InputMaybe<Scalars['String']>
}

export type PlateauPrefecture = PlateauArea & {
  __typename?: 'PlateauPrefecture'
  code: Scalars['String']
  id: Scalars['ID']
  name: Scalars['String']
  parents: Array<PlateauArea>
  type: PlateauAreaType
}

export type PlateauUnknownDataset = PlateauDataset & {
  __typename?: 'PlateauUnknownDataset'
  id: Scalars['String']
  type: Scalars['String']
}

export type Query = {
  __typename?: 'Query'
  municipalities: Array<PlateauMunicipality>
  municipality?: Maybe<PlateauMunicipality>
}

export type QueryMunicipalityArgs = {
  code: Scalars['String']
}

export type PlateauMunicipalityFragment = {
  __typename?: 'PlateauMunicipality'
  id: string
  code: string
  name: string
}

type PlateauDataset_PlateauBuildingDataset_Fragment = {
  __typename?: 'PlateauBuildingDataset'
  id: string
  type: string
  variants: Array<{
    __typename?: 'PlateauBuildingDatasetVariant'
    version: string
    lod: number
    textured: boolean
    url: string
  }>
}

type PlateauDataset_PlateauUnknownDataset_Fragment = {
  __typename?: 'PlateauUnknownDataset'
  id: string
  type: string
}

export type PlateauDatasetFragment =
  | PlateauDataset_PlateauBuildingDataset_Fragment
  | PlateauDataset_PlateauUnknownDataset_Fragment

export type MunicipalityDatasetsQueryVariables = Exact<{
  municipalityCode: Scalars['String']
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
          type: string
          variants: Array<{
            __typename?: 'PlateauBuildingDatasetVariant'
            version: string
            lod: number
            textured: boolean
            url: string
          }>
        }
      | { __typename?: 'PlateauUnknownDataset'; id: string; type: string }
    >
  } | null
}

export const PlateauMunicipalityFragmentDoc = gql`
  fragment PlateauMunicipality on PlateauMunicipality {
    id
    code
    name
  }
`
export const PlateauDatasetFragmentDoc = gql`
  fragment PlateauDataset on PlateauDataset {
    id
    type
    ... on PlateauBuildingDataset {
      variants {
        version
        lod
        textured
        url
      }
    }
  }
`
export const MunicipalityDatasetsDocument = gql`
  query municipalityDatasets($municipalityCode: String!) {
    municipality(code: $municipalityCode) {
      ...PlateauMunicipality
      datasets {
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
