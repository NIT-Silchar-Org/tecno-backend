//----------------------- IMPORTS ---------------------------
import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import pc from "picocolors";
import swaggerUI from "swagger-ui-express";

import * as Routers from "@routes";
import * as Constants from "@constants";
import * as Utils from "@utils";
import * as Middlewares from "@middlewares";

import swaggerDocument from "./docs/swagger.json";

dotenv.config();
Utils.Firebase.firebaseInit();

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

app.use(
  `${Constants.Server.ROOT}/docs`,
  swaggerUI.serve,
  swaggerUI.setup(swaggerDocument)
);
app.use(`${Constants.Server.ROOT}/auth`, Routers.Auth);

//----------------------- PROTECTED ROUTERS ----------------------------

app.use(`${Constants.Server.ROOT}/home`, Routers.Home);

app.use(Middlewares.Auth.validateUser);

app.use(`${Constants.Server.ROOT}/module`, Routers.Module);
app.use(`${Constants.Server.ROOT}/event`, Routers.Event);
app.use(`${Constants.Server.ROOT}/user`, Routers.User);
app.use(`${Constants.Server.ROOT}/transaction`, Routers.Transaction);
app.use(`${Constants.Server.ROOT}/team`, Routers.Home);

//----------------------- ERROR HANDLERS ---------------------

app.use(Utils.Error.errorLogger);
app.use(Utils.Error.errorHandler);

//----------------------- APP --------------------------------
app.listen(process.env.PORT!, () => {
  console.log(
    pc.bgGreen(
      pc.black(
        "Server listening on port:" +
          pc.bold(pc.italic(` ${process.env.PORT} `)) +
          ", in mode:" +
          pc.bold(pc.italic(` ${process.env.NODE_ENV} `))
      )
    )
  );
});
