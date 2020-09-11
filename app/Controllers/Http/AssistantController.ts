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

    /*const response = {
      "expectUserResponse": true,
      "expectedInputs": [
        {
          "possibleIntents": [
            {
              "intent": "actions.intent.GET_MENU"
            }
          ],
          "inputPrompt": {
            "richInitialPrompt": {
              "items": [
                {
                  "simpleResponse": {
                    "textToSpeech": "<speak>Here are <say-as interpret-as=\"characters\">SSML</say-as> samples. I can pause <break time=\"3\" />. I can play a sound <audio src=\"https://www.example.com/MY_WAVE_FILE.wav\">your wave file</audio>. I can speak in cardinals. Your position is <say-as interpret-as=\"cardinal\">10</say-as> in line. Or I can speak in ordinals. You are <say-as interpret-as=\"ordinal\">10</say-as> in line. Or I can even speak in digits. Your position in line is <say-as interpret-as=\"digits\">10</say-as>. I can also substitute phrases, like the <sub alias=\"World Wide Web Consortium\">W3C</sub>. Finally, I can speak a paragraph with two sentences. <p><s>This is sentence one.</s><s>This is sentence two.</s></p></speak>"
                  }
                }
              ]
            }
          }
        }
      ]
    }*/
    return conv.serialize();
  }
}
