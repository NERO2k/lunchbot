import moment from "moment";
import { Exception } from "@poppinss/utils";
import { getMenu } from "App/Common/HelperFunctions";
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
      tv: Boolean(params.tv),
      embed: Boolean(params.embed),
      year: moment().year(),
      zoom: Number(params.zoom ? params.zoom : params.tv ? 1.55 : 1),
      menu: data.menu,
      week_number: data.listed_week,
      engDayCast: engDayCast,
      current_menu: data.menu[momentInstance.format("dddd").toLowerCase()],
    };
    return view.render("menu", viewData);
  }

  public async calendar() {
    return getCalendar();
  }
}
