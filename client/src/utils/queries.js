import { gql } from '@apollo/client';

export const QUERY_ME = gql`
  {
    me {
      _id
      username
      email
      savedBooks {
        authors
        image
        description
        title
      }
    }
  }
`;

