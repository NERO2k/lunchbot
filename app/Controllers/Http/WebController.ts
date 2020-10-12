import moment from "moment";
import { Exception } from "@poppinss/utils";
import {booleanParse, getMenu} from "App/Common/HelperFunctions";
import { engDayCast } from "../../../config/words";
import { getCalendar } from "App/Common/CalendarFunctions";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class WebController {
  public async index({ view, request }: HttpContextContract) {
    const params = request.all();
    const date = moment(
      params.date || params.week + params.year || moment().format("WW-YYYY"),
      params.format || "WWYYYY"
    );

    if (!date.isValid())
      throw new Exception("Datum / datumformat som anges är ogiltigt.");

    const data = await getMenu(date, false, true);

    const momentInstance = moment();
    const viewData = {
      engDayCast: engDayCast,
      tv: booleanParse(params.tv, false),
      embed: booleanParse(params.tv, false) ? true : booleanParse(params.embed, false),
      animation: booleanParse(params.tv, false) ? false : booleanParse(params.animation, true),
      scroll: booleanParse(params.tv, false) ? true : booleanParse(params.scroll, true),
      year: moment().year(),
      zoom: Number(params.zoom ? params.zoom : booleanParse(params.tv, false) ? 1.55 : 1),
      menu: data.menu,
      week_number: data.listed_week,
      current_day: momentInstance.format("dddd").toLowerCase(),
      current_menu: data.menu[momentInstance.format("dddd").toLowerCase()],
    };
    return view.render("menu", viewData);
  }

  public async calendar() {
    return getCalendar();
  }
}
