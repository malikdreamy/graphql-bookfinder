import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';
import { useMutation, useQuery } from '@apollo/client';
import { REMOVE_BOOK } from '../utils/mutations';
import { QUERY_ME } from '../utils/queries';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {

  const token = Auth.loggedIn() ? Auth.getToken() : null;
  let profile = Auth.getProfile();
  let userId = profile.data._id
 

  const [userData, setUserData] = useState([]);

  
    const [removeBook, {error}] = useMutation(REMOVE_BOOK);
  const { loading, data, refetch } = useQuery(QUERY_ME);

  if (loading) {
    return <h2>LOADING...</h2>;
  }



const handleDeleteBook = async (e) => {

    if (!token) {
      return false;
    }

    let bookToDelete = e.target.parentElement.parentElement.parentElement.id;



    try {
      const { data } = await removeBook({
        variables: {bookId: bookToDelete, userId: userId }
      });
      refetch();

    } catch (err) {
      console.error(err);
    }
  };



  return (
    <>
      <div >
        <Container>
          <h1>Saved Books</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {data.me.savedBooks.length
            ? `Viewing ${data.me.savedBooks.length} saved ${data.me.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
        {data.me.savedBooks.map((book, index) => {
  const uniqueKey = `${book.bookId}-${index}`;
  return (
    <Col md="4" key={uniqueKey} id={index}>
      <Card border='dark'>
        {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
        <Card.Body>
          <Card.Title>{book.title}</Card.Title>
          <p className='small'>Authors: {book.authors}</p>
          <Card.Text>{book.description}</Card.Text>
        
          <Button className='btn-block btn-danger' onClick={handleDeleteBook}>
            Delete this Book!
          </Button>
        </Card.Body>
      </Card>
    </Col>
  );
})}

        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
