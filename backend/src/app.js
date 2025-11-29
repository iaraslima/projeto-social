import express from "express";
import cors from "cors";
import bibliaRoutes from "./routes/biblia.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", bibliaRoutes);

export default app;
