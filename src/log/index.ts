import pino from "pino";
import { logConfig } from "@/config";

declare global {
  var log: pino.Logger;
  var divider: () => void;
}

const log = pino(logConfig);
const divider = (lenght: number = 60) => log.info("=".repeat(lenght));

globalThis.log = log;
globalThis.divider = divider;

export { log, divider };
