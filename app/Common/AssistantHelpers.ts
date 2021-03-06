import GET_WEEK_MENU from "App/Handlers/GET_WEEK_MENU";
import GET_DATE_MENU from "App/Handlers/GET_DATE_MENU";
import moment from "moment";
import { ConversationV3 } from "@assistant/conversation";

const fallback = function (conv: ConversationV3) {
  conv.add("I could not find this handler. Please try again.");
};

export async function mapConversation(params: any, conv: ConversationV3) {
  const handlers: { [key: string]: Function } = {
    GET_WEEK_MENU: (params: any, conv: ConversationV3) =>
      GET_WEEK_MENU(params, conv),
    GET_DATE_MENU: (params: any, conv: ConversationV3) =>
      GET_DATE_MENU(params, conv),
  };

  const handler = handlers[params.handler?.name];

  if (handler) {
    await handler(params, conv);
  } else {
    fallback(conv);
  }
}

export function resolvedToDate(resolved: any) {
  const dateStr = `${resolved.year}-${resolved.month}-${resolved.day}`;
  const date = moment(dateStr, "YYYY-MM-DD");
  return date.isValid() ? date : false;
}
