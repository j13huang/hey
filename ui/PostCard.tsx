import * as React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import { UpArrow } from "./UpArrow";

export const PostCard = function ({ likes, title }) {
  return (
    <Container>
      <Row>
        <Col md={1}>
          <Image fluid src="up-arrow.svg" />
          <UpArrow />
          <UpArrow voted />
          {likes}
        </Col>
        <Col className="align-self-md-center" md="auto">
          {title}
        </Col>
      </Row>
    </Container>
  );
};
