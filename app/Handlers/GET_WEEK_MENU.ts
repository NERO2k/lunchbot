import { Simple, Table } from "@assistant/conversation";
import { resolvedToDate } from "App/Common/AssistantHelpers";
import moment from "moment";
import { getMenu } from "App/Common/HelperFunctions";
import { engDayCast } from "../../config/words";

export default async function (params, conv) {
  let data;
  let rowData = [];

  if (!params.device.capabilities.includes("RICH_RESPONSE")) {
    conv.add(
      new Simple({
        speech: `Man kan endast visa hela eatery menyn på en enhet med skärm.`,
        text: "",
      })
    );
    return;
  }

  const resolvedDate = params.intent.params.date
    ? resolvedToDate(params.intent.params.date.resolved)
    : moment();
  const date = resolvedDate || moment();

  try {
    data = await getMenu(date, false, true);
  } catch (error) {
    conv.add("Något gick fel...");
    conv.add(error.message);
    return;
  }

  Object.keys(data.menu).forEach((value) => {
    const day = engDayCast[value] || value;
    rowData.push({
      cells: [
        {
          // @ts-ignore
          text: day.toUpperCase(),
        },
        {
          // @ts-ignore
          text: data.menu[value].map(i => i+'.').join(" \n\n"),
        },
      ],
    });
  });

  conv.add(
    new Table({
      title: "EATERY KISTA NOD",
      subtitle: "MENY VECKA " + data.listed_week,
      columns: [
        {
          header: "Dag",
        },
        {
          header: "Meny",
        },
      ],
      rows: rowData,
    })
  );
}
