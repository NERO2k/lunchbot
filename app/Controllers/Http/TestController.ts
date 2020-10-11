import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Env from "@ioc:Adonis/Core/Env";
import got from "got";

export default class TestController {
  public async eatery_website({request}: HttpContextContract) {
    const params = request.all();

    const page_url: any = params.url || <string>Env.get("EATERY_LUNCH_URL");
    const fetch = await got(page_url);

    let returnBody = fetch.body;

    /*if (params.image) {
      const imageUrl = await image(null, returnBody);
      returnBody.replace(imageUrl, params.image);
    }*/

    return returnBody;
  }
}
