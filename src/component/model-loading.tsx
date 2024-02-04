import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Progress,
} from "reactstrap";
export interface ModalLoadingProps {
  isOpen: boolean;
  progress: number;
}
export const ModelLoading = (props: ModalLoadingProps) => {
  const { isOpen, progress } = props;
  return (
    <>
      <Modal isOpen={isOpen}>
        <ModalHeader>Loading App</ModalHeader>
        <ModalBody>
          Please wait while we load the AI into your browser.
        </ModalBody>
        <ModalFooter>
          <Progress value={progress} />
        </ModalFooter>
      </Modal>
    </>
  );
};
