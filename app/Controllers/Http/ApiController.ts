// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import {hasWeekImage} from "App/Common/MenuHelpers";
import moment from "moment";
import {Exception} from "@poppinss/utils";
import {promises as fs} from "fs";

export default class ApiController {
  public async index ({ view }) {
    return view.render('api')
  }
  public async text ({ request }) {
    const params = request.all();
    const date = moment(params.date, params.format)

    if (!date.isValid())
      throw new Exception("Date / Date format provided is invalid.")
  }
  public async json ({ request }) {
    const params = request.all();
    const date = moment(params.date, params.format)

    if (!date.isValid())
      throw new Exception("Date / Date format provided is invalid.")
  }
  public async image ({ request, response }) {
    const params = request.all();
    const date = moment(params.date, params.format)

    if (!date.isValid())
      throw new Exception("Date / Date format provided is invalid.")

    if (await hasWeekImage(date)) {
      response.download(`../tmp/eatery-${date.format("YYYY-WW")}.png`)
      return "Downloading file..."
    }
    throw new Exception("Requested week is not stored on the server.")
  }
}
