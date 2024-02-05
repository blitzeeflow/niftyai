import { useEffect, useState, useRef } from "react";
import { ModelLoading } from "../component/model-loading";
import {
  loadModel,
  getProgress,
  getStatus,
  generate,
  resultCallback,
} from "../worker-instance";
import { Button, Col, Container, Input, Label, Row, Spinner } from "reactstrap";
export const SummarisePage = () => {
  const textareaRef = useRef(null);
  const resultRef = useRef(null);
  const [progress, setProgress] = useState<number>(0);
  const [maxLength, setMaxLength] = useState<number>(150);
  const [generatedText, setGeneratedText] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  function onResult(result: any) {
    setGeneratedText(result.data[0].summary_text);
    setIsGenerating(false);
  }

  useEffect(() => {
    const data = {
      type: "summarise",
    };
    resultCallback(onResult);
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

  function getMaxTokens() {
    // 1 token = 4 characters
    return maxLength * 4;
  }

  function generateText() {
    setIsGenerating(true);
    const text = (textareaRef.current as any)?.value || "";
    generate("summarise", {
      text,
      generation: {
        max_new_tokens: getMaxTokens(),
        num_beams: 2,
        temperature: 0.3,
        top_k: 0,
        do_sample: false,
      },
    });
  }
  return (
    <>
      <Container>
        <Row>
          <Col>
            <h1>Summarise</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <textarea placeholder="add text here" ref={textareaRef}></textarea>
          </Col>
          <Col>
            <div
              className="result-container summarise-container"
              ref={resultRef}
            >
              {generatedText}
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <Label for="max-length">Max Length </Label>
            <Input
              id="max-length"
              type="number"
              defaultValue={150}
              onInput={(event: any) => setMaxLength(Number(event.target.value))}
            ></Input>
          </Col>
          <Col className="flex">
            {isGenerating ? (
              <Spinner className="generate-spinner" />
            ) : (
              <Button
                color="primary"
                className="generate-button"
                onClick={() => generateText()}
              >
                Generate
              </Button>
            )}
          </Col>
        </Row>
      </Container>

      <ModelLoading isOpen={isOpen} progress={progress} />
    </>
  );
};
