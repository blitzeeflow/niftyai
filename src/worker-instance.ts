let progress: number = 0;
let status: string = "progress";
// Initialise worker, import.meta.url
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

export function getStatus() {
  return status;
}

export function getProgress() {
  return progress;
}

worker.addEventListener("message", (event) => {
  const message = event.data;
  console.log(message);
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
      console.log(message);
      break;
  }
});
