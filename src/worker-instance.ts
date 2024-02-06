let progress: number = 0;
let status: string = "progress";
let callbacks: ((result: any) => void)[] = [];
let updateCallbacks: ((result: any) => void)[] = [];

export const worker = new Worker(new URL("./worker.ts", import.meta.url), {
  type: "module",
});

export function loadModel(data: any) {
  worker.postMessage(JSON.stringify({ type: "download", data: data }, null, 2));
}

export function generate(type: string, data: any) {
  worker.postMessage(
    JSON.stringify({ type: "generate", data: { type: type, ...data } }, null, 2)
  );
}

export function resultCallback(callback: (result: any) => void) {
  callbacks = [];
  callbacks.push(callback);
}
export function updateCallback(callback: (result: any) => void) {
  updateCallbacks = [];
  updateCallbacks.push(callback);
}

export function getStatus() {
  return status;
}

export function getProgress() {
  return progress;
}

worker.addEventListener("message", (event) => {
  const message = event.data;
  // console.log(message);
  switch (message.type) {
    case "download":
      status = message.data.status;
      if (message.data.status === "ready") {
        progress = 100;
      } else {
        progress = Number((message.data.progress || 100).toFixed(2));
      }
      break;
    case "update":
      if (updateCallbacks.length) {
        updateCallbacks.forEach((item) => item(message));
      }
      // console.log(message);
      break;
    case "result":
      if (callbacks.length) {
        callbacks.forEach((item) => item(message));
      }
      break;
  }
});
