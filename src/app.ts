import express, { Application, NextFunction, Request, Response } from "express";
import { route } from "./Routes";
import "dotenv/config";
import { ResponseError } from "./Utils/CustomThrowError.Utils";
const cors = require("cors");
const app: Application = express();
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

route(app);
// built-in error handler that takes care of any errors that might be encountered in the app.
// can't catch  a Promise rejection outside of an async function
//https://stackoverflow.com/questions/51391080/handling-errors-in-express-async-middleware
// app.use(
//   (err: ResponseError, req: Request, res: Response, next: NextFunction) => {
//     console.log(err);
//     res.status(err.status || 500).json({
//       status: err.status || 500,
//       message: (err.status || "Internal server error") && err.message,
//     });
//   }
// );
app.listen(process.env.PORT || 3000, () => {
  console.log(`App listening on port ${process.env.PORT || 3000}`);
});
