import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useState } from 'react';

import { searchInitialState } from '../store/reducers/searchReducer';
import './Search.scss';

// Example of searchInitialState (uncomment and adjust as needed)
// export const searchInitialState = {
//   searchData: {
//     searchTerm: '',
//     dates: [],
//     // add other fields if necessary
//   },
// };

export default function SearchBar({ searchHandler }) {
  const [searchData, setSearchData] = useState(searchInitialState.searchData);

  const submitHandler = () => {
    searchHandler(searchData);
    setSearchData(searchInitialState.searchData);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    submitHandler();
  };

  return (
    <Container>
      <Row>
        <Col>
          <Form className="d-flex" onSubmit={handleSubmit}>
            <Form.Control
              type="search"
              placeholder="Search Patient"
              className="me-2 search-input"
              aria-label="Search Patient"
              value={searchData.searchTerm}
              onChange={(e) =>
                setSearchData({ ...searchData, searchTerm: e.target.value })
              }
            />
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
