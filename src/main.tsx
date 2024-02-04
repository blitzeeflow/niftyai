import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Row, Col, Container } from "reactstrap";
import { Header } from "./component/header.tsx";
import { SummarisePage } from "./page/summarise.tsx";
import "./worker-instance.ts";
import { ChatPage } from "./page/chat.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "summarise",
    element: <SummarisePage />,
  },
  {
    path: "chat",
    element: <ChatPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Container>
      <Row>
        <Col>
          <Header />
        </Col>
      </Row>
      <Row>
        <Col>
          <RouterProvider router={router} />
        </Col>
      </Row>
    </Container>
  </React.StrictMode>
);
