import { gql } from '@apollo/client'

export const CreateRepository = gql`
  mutation createRepository($input: CreateRepositoryInput!) {
    createRepository(input: $input) {
      clientMutationId
      repository {
        id
        name
        updatedAt
      }
    }
  }
`
