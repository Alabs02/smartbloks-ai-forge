export const corsConfig = {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Origin", "Content-Type", "Authorization", "Accept"]
};
