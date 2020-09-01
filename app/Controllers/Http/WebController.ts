// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import moment from "moment";
import { Exception } from "@poppinss/utils";
import { getMenu } from "App/Common/HelperFunctions";
import { engDayCast } from "../../../config/words";
import ical from 'ical-generator';

export default class WebController {
  public async index({ view, request }) {
    const params = request.all();
    const date = moment(params.date, params.format);

    if (!date.isValid())
      throw new Exception("Date / Date format provided is invalid.");

    const data = await getMenu(date, false, true);

    const momentInstance = moment();
    const viewData = {
      zoom: Number(params.zoom ? params.zoom : params.tv ? 2 : 1),
      // @ts-ignore
      menu: data.menu,
      // @ts-ignore
      week_number: data.listed_week,
      // @ts-ignore
      engDayCast: engDayCast,
      // @ts-ignore
      current_menu: data.menu[momentInstance.format("dddd").toLowerCase()]
    };
    return view.render("menu", viewData);
  }

  public async calendar()
  {
    const cal = ical({domain: 'eatery.nero2k.com', name: 'Eatery Lunchmeny'});

    const week = moment(moment().week(), "WW").startOf('week');
    const data = await getMenu(week, false, true);

    // @ts-ignore
    Object.keys(data.menu).forEach((key) => {
      let day = engDayCast[key].charAt(0).toUpperCase() + engDayCast[key].slice(1) || key.charAt(0).toUpperCase() + key.slice(1);
      let momentDay = moment(key, "dddd").add(1, "d");
      cal.createEvent({
        start: momentDay,
        end: momentDay,
        allDay: true,
        summary: `Eatery ${day}`,
        // @ts-ignore
        description: data.menu[key].join("\n"),
        url: `https://eatery.nero2k.com?date=${week.week()}-${week.year()}&format=WW-YYYY`
      });
    })

    return cal.toString();
  }
}
