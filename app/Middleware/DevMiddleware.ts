import Env from "@ioc:Adonis/Core/Env";
import { Exception } from "@poppinss/utils";
import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";

export default class DebugMiddleware {
  // @ts-ignore
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    if (Env.get("NODE_ENV") === "development") {
      await next();
    } else {
      throw new Exception(
        "Denna sida får endast användas i dev-läge. Ändra lunchbot-env och försök igen."
      );
    }
  }
}
