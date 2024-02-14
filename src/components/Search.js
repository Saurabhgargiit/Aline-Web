import { Button, Col, Container, Form, Row } from "react-bootstrap";
import './Search.scss';

export default function SearchBar() {
    return (
        <Container>
            <Row>
                <Col>
                    <Form className="d-flex">
                        <Form.Control
                            type="search"
                            placeholder="Search"
                            className="me-2 search-input"
                            aria-label="Search"
                        />
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

