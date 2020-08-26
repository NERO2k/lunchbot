// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import moment from "moment";
import {Exception} from "@poppinss/utils";
import {getMenu} from "App/Common/HelperFunctions";

export default class WebController {
  public async index ({ view, request }) {
    const params = request.all();
    const date = moment(params.date, params.format)

    if (!date.isValid())
      throw new Exception("Date / Date format provided is invalid.")

    let data = await getMenu(date, false)
    // @ts-ignore
    data.current_day = data.menu[moment().format("dddd")]
    // @ts-ignore
    delete data.menu[moment().format("dddd")]
    return view.render('menu', data)
  }
}
