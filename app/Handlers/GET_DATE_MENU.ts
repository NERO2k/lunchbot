import {Card, Simple} from "@assistant/conversation";
import {getMenu} from "App/Common/HelperFunctions";
import {resolvedToDate} from "App/Common/AssistantHelpers";
import {engDayCast} from "../../config/words";
import moment from "moment";

export default async function(params, conv) {5
  let data;
  const resolvedDate = params.intent.params.date ? resolvedToDate(params.intent.params.date.resolved): moment()
  const date = resolvedDate || moment()

  try {
    data = await getMenu(date, false, true)
  } catch(error) {
    conv.add("Något gick fel...")
    conv.add(error.message);
    return;
  }

  const mergeString = data.menu[date.format('dddd').toLowerCase()]

  conv.add(new Card({
    "title": (engDayCast[date.format("dddd").toLowerCase()] || date.format("dddd")).toUpperCase(),
    "subtitle": "EATERY KISTA NOD — MENY VECKA "+date.format("WW"),
    "text": mergeString.join(". \n\n")
  }));

  if (params.device.capabilities.includes("SPEECH")) {
    conv.add(
      new Simple({
        speech: `<speak>Eatery serverar ${mergeString.join('<break strength="1000ms"/>')}</speak>`,
        text: params.device.capabilities.includes("RICH_RESPONSE") ? "Hämtar Eatery Menyn..." : params.device.capabilities.includes("RICH_RESPONSE") ? mergeString.join(".\n\n") : null
      })
    );
  }
}
