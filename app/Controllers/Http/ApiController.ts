// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import {
  hasWeekImage,
  isWeekParsed,
  isWeekStringified,
} from "App/Common/MenuHelpers";
import moment from "moment/";
import { Exception } from "@poppinss/utils";
import { promises as fs } from "fs";
import { getMenu } from "App/Common/HelperFunctions";

export default class ApiController {
  public async index({ view }) {
    return view.render("api");
  }

  public async text({ request, response }) {
    const params = request.all();
    const date = moment(params.date, params.format);

    if (!date.isValid())
      throw new Exception("Date / Date format provided is invalid.");

    if (!(await isWeekStringified(date))) {
      await getMenu(date, false, true);
    }

    if (await isWeekStringified(date)) {
      response.download(`../tmp/eatery-${date.format("YYYY-WW")}.txt`);
      return "Downloading file...";
    }

    throw new Exception("Requested week is not stored on the server.");
  }

  public async json({ request }) {
    const params = request.all();
    const date = moment(params.date, params.format);

    if (!date.isValid())
      throw new Exception("Date / Date format provided is invalid.");

    if (!(await isWeekParsed(date))) {
      await getMenu(date, false, true);
    }

    if (await isWeekParsed(date)) {
      const data = await fs.readFile(
        `../tmp/eatery-${date.format("YYYY-WW")}.json`
      );
      return data.toString().replace(/\\r/g, "");
    }

    throw new Exception("Requested week is not stored on the server.");
  }

  public async image({ request, response }) {
    const params = request.all();
    const date = moment(params.date, params.format);

    if (!date.isValid())
      throw new Exception("Date / Date format provided is invalid.");

    if (await hasWeekImage(date)) {
      response.download(`../tmp/eatery-${date.format("YYYY-WW")}.tif`);
      return "Downloading file...";
    }
    throw new Exception("Requested week is not stored on the server.");
  }

  public async source_image({ request, response }) {
    const params = request.all();
    const date = moment(params.date, params.format);

    if (!date.isValid())
      throw new Exception("Date / Date format provided is invalid.");

    if (await hasWeekImage(date)) {
      response.download(`../tmp/eatery-${date.format("YYYY-WW")}.source`);
      return "Downloading file...";
    }
    throw new Exception("Requested week is not stored on the server.");
  }
}
