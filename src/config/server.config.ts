import { config } from "dotenv";
import { getProtocol } from "@/utils";

config();

const SERVICE_NAME = "SmartBloks AI-Forge API Service";
const SERVICE_DESCRIPTION = "AI-powered backend service for content transformation.";
const HOSTNAME = process.env.SERVER_HOSTNAME || "localhost";
const SERVICE_VERSION = process.env.SERVICE_VERSION || "v1";
const PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 8000;

const DOCS_URL = `${getProtocol()}://${HOSTNAME}:${PORT}/docs/${SERVICE_VERSION}`;
const BASE_URL = `${getProtocol()}://${HOSTNAME}:${PORT}/api/${SERVICE_VERSION}`;

export const SERVER = {
  PORT,
  HOSTNAME,
  DOCS_URL,
  BASE_URL,
  SERVICE_NAME,
  SERVICE_VERSION,
  SERVICE_DESCRIPTION
};
