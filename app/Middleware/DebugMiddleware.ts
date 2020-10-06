import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Env from "@ioc:Adonis/Core/Env";
import { Exception } from "@poppinss/utils";

export default class DebugMiddleware {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    const query = ctx.request.all();
    if (!Env.get("WEBSITE_DEBUG_KEY"))
      throw new Exception(
        "En felsökningsnyckel har inte ställts in. Lägg till en i din .env-fil."
      );
    if (query.key === Env.get("WEBSITE_DEBUG_KEY")) {
      await next();
    } else {
      throw new Exception(
        "Felsökningsnyckeln krävs för att komma åt den här sidan."
      );
    }
  }
}
