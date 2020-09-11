import GET_WEEK_MENU from "App/Handlers/GET_WEEK_MENU";
import GET_DATE_MENU from "App/Handlers/GET_DATE_MENU";
import moment from "moment";

const fallback = function(conv)
{
  conv.add("I could not find this handler. Please try again.")
}

export async function mapConversation(params, conv)
{
  const handlers = {
    "GET_WEEK_MENU": (params, conv) => GET_WEEK_MENU(params, conv),
    "GET_DATE_MENU": (params, conv) => GET_DATE_MENU(params, conv)
  }

  const handler = handlers[params.handler.name]

  if (handler) {
    await handler(params, conv)
  } else {
    fallback(conv)
  }
}

export function resolvedToDate(resolved)
{
  const dateStr = `${resolved.year}-${resolved.month}-${resolved.day}`
  const date = moment(dateStr, "YYYY-MM-DD")
  return date.isValid() ? date : false
}
