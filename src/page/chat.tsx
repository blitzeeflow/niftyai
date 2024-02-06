import { useEffect, useState, useRef, useCallback } from "react";
import { ModelLoading } from "../component/model-loading";
import {
  loadModel,
  getProgress,
  getStatus,
  generate,
  resultCallback,
  updateCallback,
} from "../worker-instance";
import { Button, Col, Container, Input, Label, Row, Spinner } from "reactstrap";

export const ChatPage = () => {
  const textareaRef = useRef(null);
  const resultRef = useRef<any>([]);
  const [messagesList, setMessages] = useState<any[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [maxLength, setMaxLength] = useState<number>(150);
  const [started, setStarted] = useState<boolean>(false);
  const [lastQuestion, setLastQuestion] = useState<string>("");
  // const [generatedText, setGeneratedText] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const onUpdate = useCallback(
    (result: any) => {
      const lastItem = messagesList[messagesList.length - 1];
      if (lastItem.role !== "assistant") {
        const newItem = {
          role: "assistant",
          content: result.data.replace(lastQuestion, ""),
        };
        setMessages([...messagesList, newItem]);
      } else {
        setMessages([
          ...messagesList.slice(0, -1),
          {
            role: "assistant",
            content: result.data.replace(lastQuestion, ""),
          },
        ]);
      }
    },
    [messagesList]
  );
  const onResult = (_result: any) => {
    // console.log(result.data[0], resultRef.current);
    // resultRef.current = [
    //   ...resultRef.current,
    //   {
    //     role: "assistant",
    //     content: result.data[0].generated_text,
    //   },
    // ];
    setIsGenerating(false);
  };

  resultCallback(onResult);
  updateCallback(onUpdate);

  useEffect(() => {
    if (started) return;
    setStarted(true);

    const data = {
      type: "chat",
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
  }, [messagesList]);

  function getMaxTokens() {
    // 1 token = 4 characters
    return maxLength * 4;
  }

  function generateText() {
    setIsGenerating(true);
    const text = (textareaRef.current as any)?.value || "";
    resultRef.current = [
      ...resultRef.current,
      {
        role: "user",
        content: text,
      },
    ];
    setMessages([
      ...messagesList,
      {
        role: "user",
        content: text,
      },
    ]);
    setLastQuestion(`Question:${text}\nAnswer:`);
    generate("chat", {
      text: `Question:${text}\nAnswer:`,
      generation: {
        max_new_tokens: getMaxTokens(),
        temperature: 0.3,
        do_sample: true,
        top_k: 50,
      },
    });
  }
  return (
    <>
      <Container>
        <Row>
          <Col>
            <h1>Chat</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="result-container chat-container ">
              {messagesList.map((item: any, index: number) => {
                return (
                  <div
                    key={index}
                    className={`chat-message ${item.role}-message`}
                  >
                    {item.content}
                  </div>
                );
              })}
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <textarea
              className="user-input"
              placeholder="add text here"
              ref={textareaRef}
            ></textarea>
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
                className="generate-button"
                color="primary"
                onClick={() => generateText()}
              >
                Send
              </Button>
            )}
          </Col>
        </Row>
      </Container>

      <ModelLoading isOpen={isOpen} progress={progress} />
    </>
  );
};
