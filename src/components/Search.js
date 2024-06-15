import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import './Search.scss';

export default function SearchBar() {
    return (
        <Container>
            <Row>
                <Col>
                    <Form className='d-flex'>
                        <Form.Control
                            type='search'
                            placeholder='Search'
                            className='me-2 search-input'
                            aria-label='Search'
                        />
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

// handleScroll = e => {
//     const bottom =
//       e.target.scrollHeight - Math.ceil(e.target.scrollTop) === e.target.offsetHeight ||
//       e.target.scrollHeight - Math.floor(e.target.scrollTop) === e.target.offsetHeight;

//     if (bottom && !this.state.pending) {
//       this.fetchMore();
//     }
//   };
