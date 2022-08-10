//----------------------- IMPORTS ---------------------------
import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import * as Routers from "@routes";
import * as Constants from "@constants";
import * as Utils from "@utils";

dotenv.config();

const app: Express = express();

//----------------------- MIDDLEWARES ------------------------

app
  .use(
    cors({
      origin: process.env.CLIENT!.split(", "),
      credentials: true,
    })
  )
  .use(helmet())
  .use(morgan(process.env.NODE_ENV === "development" ? "dev" : "short"))
  .use(express.json())
  .use(express.urlencoded({ extended: true }));

//----------------------- ROUTERS ----------------------------

app.use(`${Constants.Server.ROOT}/home`, Routers.Home);

//----------------------- ERROR HANDLERS ---------------------

app.use(Utils.Error.errorLogger);
app.use(Utils.Error.errorHandler);

//----------------------- APP --------------------------------
app.listen(process.env.PORT!, () => {
  console.log(
    `Server listening on port:${process.env.PORT} in mode:${process.env.NODE_ENV}`
  );
});

export default app;
