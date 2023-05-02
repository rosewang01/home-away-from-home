import "dotenv/config";
import { createExpressApp } from "./src/config/createExpressApp.js";
import express from "express";
import path from "path";

const main = (): void => {
  // Listen for termination
  process.on("SIGTERM", () => process.exit());

  // Instantiate express app with configured routes and middleware
  const app = createExpressApp();

  const port = app.get("port") as number;

  // Instantiate a server to listen on a specified port
  app.listen(port, () => {
    console.log(`Listening on port ${port.toString()}`);
    console.log("Press Control-C to stop\n");
  });
};

// Run the server
main();
