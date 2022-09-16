//----------------------- IMPORTS ---------------------------
import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import pc from "picocolors";
import swaggerUI from "swagger-ui-express";
import YAML from "yamljs";

import * as Routers from "@routes";
import * as Constants from "@constants";
import * as Utils from "@utils";
import * as Interfaces from "@interfaces";

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

//----------------------- DOCS ------------------------------

const swaggerDocument = YAML.load(Constants.Server.DOCS);

app.use(
  `${Constants.Server.ROOT}/docs`,
  swaggerUI.serve,
  swaggerUI.setup(swaggerDocument, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Tecnoesis API",
  })
);

//----------------------- HEALTH CHECK ----------------------------

app.get(`${Constants.Server.ROOT}/`, ((_req, res, _next) => {
  res.json({
    status: 200,
    msg: "Health check OK",
  });
}) as Interfaces.Controller.Sync);

//----------------------- ROUTERS ----------------------------

app.use(`${Constants.Server.ROOT}/auth`, Routers.Auth);

app.use(`${Constants.Server.ROOT}/home`, Routers.Home);

app.use(`${Constants.Server.ROOT}/module`, Routers.Module);
app.use(`${Constants.Server.ROOT}/event`, Routers.Event);
app.use(`${Constants.Server.ROOT}/team`, Routers.Team);
app.use(`${Constants.Server.ROOT}/user`, Routers.User);
app.use(`${Constants.Server.ROOT}/transaction`, Routers.Transaction);

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
