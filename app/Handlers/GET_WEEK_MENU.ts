import {Table} from "@assistant/conversation";
import {resolvedToDate} from "App/Common/AssistantHelpers";
import moment from "moment";
import {getMenu} from "App/Common/HelperFunctions";

export default async function(params, conv) {
  let data;
  const resolvedDate = params.intent.params.date.resolved ? resolvedToDate(params.intent.params.date.resolved): moment()
  const date = resolvedDate || moment()

  try {
    data = await getMenu(date, false, true)
  } catch(error) {
    conv.add("Något gick fel...")
    conv.add(error.message);
    return;
  }

  conv.add(new Table({
    "title": "EATERY KISTA NOD — MENY VECKA " + data.listed_week,
    "subtitle": "Powered by Lunchbot.",
    "columns": [{
      "header": "Dag"
    }, {
      "header": "Meny"
    }],
    "rows": [{
      "cells": [{
        "text": "A1"
      }, {
        "text": "B1"
      }, {
        "text": "C1"
      }]
    }, {
      "cells": [{
        "text": "A2"
      }, {
        "text": "B2"
      }, {
        "text": "C2"
      }]
    }, {
      "cells": [{
        "text": "A3"
      }, {
        "text": "B3"
      }, {
        "text": "C3"
      }]
    }]
  }));
}
