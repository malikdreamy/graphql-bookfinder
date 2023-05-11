import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`


export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const SAVE_BOOK = gql`
  mutation saveBooks($author: [String!], $title: String!, $bookId: String!, $image: String!, $link: String!) {
    saveBook(author: $author, title: $title, bookId: $bookId, image: $image, link: $link) {
      user {
        savedBooks
      }
    }
  }
`;


export const REMOVE_BOOK = gql`
mutation removeBook($bookId: String!){
    removeBook(bookId: $bookId){
        user{
            savedBooks
        }
    }
}


`

export const SEARCH_BOOKS = gql`
  query searchBooks($searchInput: String!) {
    searchBooks(input: $searchInput) {
      items {
        id
        volumeInfo {
          authors
          title
          description
          imageLinks {
            thumbnail
          }
        }
      }
    }
  }
`;