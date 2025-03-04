export const isTestMode = () => process.env.NODE_ENV === "test";
export const isDevMode = () => process.env.NODE_ENV === "development";
export const getProtocol = () => (isDevMode() ? "http" : "https");
