import express from "express";
import swaggerUi from "swagger-ui-express";
import openapiDocument from "./openapi.json" with { type: "json" };
import { config } from "./src/config";
import { authRouter } from "./src/routes/auth";
import { protectedRouter } from "./src/routes/protected";
import { publicRouter } from "./src/routes/public";

const app = express();

app.disable("x-powered-by");
app.use(express.json({ limit: "10kb" }));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiDocument));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/auth", authRouter);
app.use("/public", publicRouter);
app.use("/protected", protectedRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(config.port, () => {
  console.log(`Server running and connected to Supabase on port ${config.port}`);
  console.log(`Swagger UI: http://localhost:${config.port}/docs`);
});