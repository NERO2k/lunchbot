import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Env from "@ioc:Adonis/Core/Env";
import { Exception } from "@poppinss/utils";

export default class DebugMiddleware {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    const query = ctx.request.all();
    if (!Env.get("WEBSITE_DEBUG_KEY"))
      throw new Exception(
        "A debug key has not been set. Please add one to your .env file."
      );
    if (query.key === Env.get("WEBSITE_DEBUG_KEY")) {
      await next();
    } else {
      throw new Exception("The debug key is required to access this page.");
    }
  }
}
