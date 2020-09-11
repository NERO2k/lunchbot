import {
  ConversationV3
} from '@assistant/conversation';
import {mapConversation} from "App/Common/AssistantHelpers";

export default class WebController {

  public async call({request}) {
    const params = request.all();
    console.log(params);

    let conv = new ConversationV3({
      body: request.body,
      headers: request.headers,
    })

    await mapConversation(params, conv)

    return conv.serialize();
  }
}
