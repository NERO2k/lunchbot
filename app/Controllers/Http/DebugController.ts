// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import moment from 'moment';
import {Exception} from "@poppinss/utils";
import {fetch, image, ocr, parse} from 'App/Common/MenuFunctions';
import {getMenu} from "App/Common/HelperFunctions";

export default class WebController {
  public async image ({ params }) {
    return image(params.url)
  }

  public async fetch ({ request }) {
    const params = request.all();
    const date = moment(params.date, params.format)

    if (!date.isValid())
      throw new Exception("Date / Date format provided is invalid.")

    if (!params.url)
      throw new Exception("No fetch url provided.")

    return fetch(date, params.url)
  }

  public async ocr ({ request }) {
    const params = request.all();
    const data = await ocr(params.file);
    return data;
  }

  public async parse ({ request }) {
    const params = request.all();
    return parse(params.text)
  }

  public async process ({ request }) {
    const params = request.all();
    const date = moment(params.date, params.format)

    if (!date.isValid())
      throw new Exception("Date / Date format provided is invalid.")

    const data = getMenu(date)
    return data;
  }
}
