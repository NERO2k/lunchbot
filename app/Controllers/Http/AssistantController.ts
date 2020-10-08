import { ConversationV3, Headers } from "@assistant/conversation";
import { mapConversation } from "App/Common/AssistantHelpers";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class AssistantController {
  public async call({ request }: HttpContextContract) {
    const params = request.all();

    let conv = new ConversationV3({
      body: request.all(),
      headers: <Headers>(<object>request.headers),
    });

    await mapConversation(params, conv);

    return conv.serialize();
  }
}
