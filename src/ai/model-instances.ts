import { ModelTransformer } from "./pipeline";

export const summarizationModelInstance = new ModelTransformer({
  task: "summarization",
  model: "Xenova/distilbart-cnn-6-6",
});

// class AutomaticSpeechRecognitionPipeline extends Pipeline {
//     static task = 'automatic-speech-recognition';
//     static model = 'Xenova/whisper-tiny.en';
// }

// class ImageToTextPipeline extends Pipeline {
//     static task = 'image-to-text';
//     static model = 'Xenova/vit-gpt2-image-captioning';
// }

// class ImageClassificationPipeline extends Pipeline {
//     static task = 'image-classification';
//     static model = 'Xenova/vit-base-patch16-224';
// }

// class ZeroShotImageClassificationPipeline extends Pipeline {
//     static task = 'zero-shot-image-classification';
//     static model = 'Xenova/clip-vit-base-patch16';
// }

// class ObjectDetectionPipeline extends Pipeline {
//     static task = 'object-detection';
//     static model = 'Xenova/detr-resnet-50';
// }
