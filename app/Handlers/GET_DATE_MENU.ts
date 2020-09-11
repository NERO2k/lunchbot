import {Card, Simple} from "@assistant/conversation";
import {getMenu} from "App/Common/HelperFunctions";
import {resolvedToDate} from "App/Common/AssistantHelpers";
import {engDayCast} from "../../config/words";

export default async function(params, conv) {
  if (params.device.capabilities.includes("RICH_RESPONSE")) {

    const data = await getMenu(resolvedToDate(params.intent.params.date.resolved), false, true)

    /*// @ts-ignore
    Object.keys(data.menu).forEach((value) => {
      const day = engDayCast[value] || value;

      let dayList = [];
      // @ts-ignore
      Object.keys(data.menu[value]).forEach((dayNum) => {
        dayList.push({
          "cells": [{
            // @ts-ignore
            "text": data.menu[value][dayNum]
          }]
        });
      });
      console.log(day.toUpperCase())
      conv.add(new Simple({
        "text": "Card Subtitle",
        "speech": ""
      }));
    });*/
  } else {
    if (params.device.capabilities.includes("SPEECH")) {
      conv.add("Today eatery is serving.")
    }
  }
}
