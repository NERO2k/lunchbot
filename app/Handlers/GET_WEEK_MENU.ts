import {Image, Table} from "@assistant/conversation";

export default function(params, conv) {
  if (params.device.capabilities.includes("RICH_RESPONSE")) {
    conv.add(new Table({
      "title": "Table Title",
      "subtitle": "Table Subtitle",
      "image": new Image({
        url: 'https://developers.google.com/assistant/assistant_96.png',
        alt: 'Google Assistant logo'
      }),
      "columns": [{
        "header": "Column A"
      }, {
        "header": "Column B"
      }, {
        "header": "Column C"
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
  } else {
    if (params.device.capabilities.includes("SPEECH")) {
      conv.add("Today eatery is serving.")
    }
  }
}
