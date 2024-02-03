import { PipelineType, pipeline, env } from "@xenova/transformers";
env.allowLocalModels = false;
export class ModelTransformer {
  task: PipelineType | null = null;
  model: any = null;
  tokenizer: any = null;

  // NOTE: instance stores a promise that resolves to the pipeline
  instance: any = null;

  constructor(options: { task: PipelineType; tokenizer?: any; model: any }) {
    this.task = options.task;
    this.tokenizer = options.tokenizer;
    this.model = options.model;
  }

  /**
   * Get pipeline instance
   * @param {*} progressCallback
   * @returns {Promise}
   */
  getInstance(progressCallback: any = null) {
    if (this.task === null || this.model === null) {
      throw Error("Must set task and model");
    }
    if (this.instance === null) {
      this.instance = pipeline(this.task, this.model, {
        ...(progressCallback ? { progress_callback: progressCallback } : {}),
      });
    }

    return this.instance;
  }
}
