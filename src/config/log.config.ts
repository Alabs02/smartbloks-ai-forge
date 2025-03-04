export const logConfig = {
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "dd-mm-yyyy HH:MM:ss",
      ignore: "pid,hostname"
    }
  }
};
