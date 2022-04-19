import { gql } from '@apollo/client'

export const GetRepository = gql`
  query getRepository($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      id
      name
      updatedAt
    }
  }
`
