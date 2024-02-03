import { useEffect, useState, useRef } from "react";
import { ModelLoading } from "../component/model-loading";
import {
  loadModel,
  getProgress,
  getStatus,
  generate,
} from "../worker-instance";
import { Button, Col, Container, Row } from "reactstrap";
export const SummarisePage = () => {
  const textareaRef = useRef(null);
  const resultRef = useRef(null);
  const [progress, setProgress] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(true);
  useEffect(() => {
    const data = {
      type: "summarise",
    };
    loadModel(data);
    const timer = setInterval(() => {
      const status = getStatus();
      const newProgress = getProgress();
      if (status === "ready") {
        clearInterval(timer);
        setIsOpen(false);
      } else {
        setProgress(newProgress);
      }
    }, 10);
  }, []);

  function generateText() {
    const text = (textareaRef.current as any)?.value || "";
    generate("summarise", {
      text,
      generation: {
        max_new_tokens: 150,
        num_beams: 2,
        temperature: 1,
        top_k: 0,
        do_sample: false,
      },
    });
  }
  return (
    <>
      <div>Summarise</div>
      <Container>
        <Row>
          <Col>
            <textarea ref={textareaRef}></textarea>
          </Col>
          <Col>
            <div className="result-container" ref={resultRef}></div>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button onClick={() => generateText()}>Generate</Button>
          </Col>
        </Row>
      </Container>

      <ModelLoading isOpen={isOpen} progress={progress} />
    </>
  );
};
