import express, { type Request, type Response } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import session from "express-session";
import cors from "cors";
import "dotenv/config";
import { routers } from "../routes/routers.js";
import { ApiError } from "../utils/apiError.js";
import { apiErrorResponder } from "../utils/apiErrorResponder.js";
import { fileURLToPath } from 'url';

const createExpressApp = (): express.Express => {
  const app = express();

  app.set("port", process.env.PORT ?? 4000);
  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true,
    })
  );
  app.use(cors({ credentials: true, origin: "localhost:3000" }));
  app.use(cookieParser(process.env.COOKIE_SECRET));

  // Use express-session to maintain sessions
  app.use(
    session({
      secret: process.env.COOKIE_SECRET ?? "SHOULD_DEFINE_COOKIE_SECRET",
      resave: false, // don't save session if unmodified
      saveUninitialized: false, // don't create session until something stored
      cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
      },
    })
  );

  // Inits routers listed in routers.ts file
  routers.forEach((entry) => app.use(entry.prefix, entry.router));


  // Serving static files
  if (process.env.NODE_ENV === "production") {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const root = path.join(__dirname, "../..", "public")

    app.use(express.static(root));

    app.get('*', (req, res) => {
      res.sendFile(`${root}/index.html`);
    });
  }

  // Handles all non-matched routes
  app.use((req, res, next) => {
    next(ApiError.notFound("Endpoint unavailable"));
  });

  // Sets the error handler to use for all errors passed on by previous handlers
  app.use(apiErrorResponder);

  return app;
};

export { createExpressApp };
