import * as React from "react";
import Container from "react-bootstrap/Container";
import { PostCard } from "./PostCard";
import Row from "react-bootstrap/Row";

export const MainLayout = function () {
  return (
    <Container>
      <Row>
        <PostCard likes={5} title={"My first question"} />
      </Row>
      <Row>
        <PostCard likes={32} title={"Why is earth flat"} />
      </Row>
    </Container>
  );
};
