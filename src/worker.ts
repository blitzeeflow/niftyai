import {
  chatModelInstance,
  summarizationModelInstance,
} from "./ai/model-instances";
import { ModelTransformer } from "./ai/pipeline";

let pipelines: { [key: string]: any } = {};
console.log("here");
type ModelType = "summarise" | "chat";

const taskMap: { [key in ModelType]: ModelTransformer } = {
  summarise: summarizationModelInstance,
  chat: chatModelInstance,
};
async function runModel(type: ModelType, _modelData: any) {
  const model = taskMap[type];
  pipelines[type] = await model.getInstance((data: any) => {
    self.postMessage({
      type: "download",
      task: type,
      data: data,
    });
  });
}
async function generate(type: string, data: any) {
  const fn = pipelines[type];
  let prompt = data.text;
  // if (type === "chat") {
  //   prompt = fn.tokenizer.apply_chat_template(data.messages, {
  //     tokenize: false,
  //     add_generation_prompt: true,
  //   });
  // }
  console.log(prompt);
  return await fn(prompt, {
    ...data.generation,
    callback_function: function (beams: any) {
      const decodedText = fn.tokenizer.decode(beams[0].output_token_ids, {
        skip_special_tokens: true,
      });

      self.postMessage({
        type: "update",
        data: decodedText.trim(),
      });
    },
  });
}
// Listen for messages from UI
self.addEventListener("message", async (event) => {
  const data = event.data;
  console.log(data);
  try {
    const eventData = JSON.parse(data);
    switch (eventData.type) {
      case "download":
        runModel(eventData.data.type, eventData.data);
        break;
      case "generate":
        const result = await generate(eventData.data.type, eventData.data);
        self.postMessage({ type: "result", data: result });
        break;
      case "update":
        break;
    }
  } catch (e) {
    console.error(e);
  }
  self.postMessage("hello world");
});
//     let pipeline = await CodeCompletionPipelineFactory.getInstance(data => {
//         self.postMessage({
//             type: 'download',
//             task: 'code-completion',
//             data: data,
//         });
//     })

//     let text = data.text;

//     return await pipeline(text, {
//         ...data.generation,
//         callback_function: function (beams) {
//             const decodedText = pipeline.tokenizer.decode(beams[0].output_token_ids, {
//                 skip_special_tokens: true,
//             })

//             self.postMessage({
//                 type: 'update',
//                 target: data.elementIdToUpdate,
//                 targetType: data.targetType,
//                 data: decodedText
//             });
//         }
//     })
// }
