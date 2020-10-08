/*
|--------------------------------------------------------------------------
| Http Exception Handler
|--------------------------------------------------------------------------
|
| AdonisJs will forward all exceptions occurred during an HTTP request to
| the following class. You can learn more about exception handling by
| reading docs.
|
| The exception handler extends a base `HttpExceptionHandler` which is not
| mandatory, however it can do lot of heavy lifting to handle the errors
| properly.
|
*/

import Logger from "@ioc:Adonis/Core/Logger";
import HttpExceptionHandler from "@ioc:Adonis/Core/HttpExceptionHandler";
import Env from "@ioc:Adonis/Core/Env";
import { Exception } from "@poppinss/utils";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class ExceptionHandler extends HttpExceptionHandler {
  protected statusPages = {
    "404": "errors.not-found",
    "500..599": "errors.server-error",
  };

  public async handle(error: Exception, ctx: HttpContextContract) {
    if (Env.get("NODE_ENV") !== "development")
      return ctx.response.send(error.message);
    return super.handle(error, ctx);
  }

  constructor() {
    super(Logger);
  }
}
