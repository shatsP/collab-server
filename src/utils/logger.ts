export const log = {
  info: (msg: string, ...args: any[]) => console.log("[INFO]", msg, ...args),
  error: (msg: string, ...args: any[]) => console.error("[ERROR]", msg, ...args),
};
