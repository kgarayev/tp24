// import dependancies
import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import receivables from "./routes/receivables";
import helmet from "helmet";
import cors from "cors";

const app = express();

// Use helmet middleware for security headers
app.use(helmet());

// Disable X-Powered-By header to enhance security
app.disable("x-powered-by");

// Enable CORS to allow cross-origin requests
app.use(cors());

// Parse JSON request bodies
app.use(bodyParser.json());

// Define the root route
// check if everything works and the test passes
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

// Define routes for receivables
app.use("/", receivables);

// Error handler middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).send("Something broke!");
});

const PORT = process.env.NODE_ENV === "test" ? 0 : 6001;

// Start the server and export the server instance
const server = app.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT}`);
});

export { app, server };
