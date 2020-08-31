// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import moment from "moment";
import { Exception } from "@poppinss/utils";
import { getMenu } from "App/Common/HelperFunctions";
import { engDayCast } from "../../../config/words";

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
      current_menu: data.menu[momentInstance.format("dddd").toLowerCase()],
    };
    return view.render("menu", viewData);
  }
}
