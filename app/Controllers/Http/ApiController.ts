import {
  hasWeekImage,
  isWeekParsed,
  isWeekStringified,
} from "App/Common/MenuHelpers";
import moment from "moment/";
import { Exception } from "@poppinss/utils";
import { getMenu } from "App/Common/HelperFunctions";
import FileType from "file-type";

export default class ApiController {
  public async index({ view }) {
    return view.render("api");
  }

  public async text({ request, response }) {
    const params = request.all();
    const date = moment(params.date, params.format);

    if (!date.isValid())
      throw new Exception("Datum / datumformat som anges är ogiltigt.");

    if (!(await isWeekStringified(date))) {
      await getMenu(date, false, true);
    }

    if (await isWeekStringified(date)) {
      response.download(`../tmp/eatery-${date.format("YYYY-WW")}.txt`);
      return "Downloading file...";
    }

    throw new Exception("Begärd vecka sparas inte på servern.");
  }

  public async json({ request }) {
    const params = request.all();
    const date = moment(params.date, params.format);

    if (!date.isValid())
      throw new Exception("Datum / datumformat som anges är ogiltigt.");

    if (!(await isWeekParsed(date))) {
      await getMenu(date, false, true);
    }

    if (await isWeekParsed(date)) {
      const data = await getMenu(date, false, true);
      return data;
    }

    throw new Exception("Begärd vecka sparas inte på servern.");
  }

  public async image({ request, response }) {
    const params = request.all();
    const date = moment(params.date, params.format);

    if (!date.isValid())
      throw new Exception("Datum / datumformat som anges är ogiltigt.");

    if (await hasWeekImage(date)) {
      response.attachment(
        `../tmp/eatery-${date.format("YYYY-WW")}.tif`,
        "image.tif"
      );
      return "Downloading file...";
    }
    throw new Exception("Begärd vecka sparas inte på servern.");
  }

  public async source_image({ request, response }) {
    const params = request.all();
    const date = moment(params.date, params.format);

    if (!date.isValid())
      throw new Exception("Datum / datumformat som anges är ogiltigt.");

    if (await hasWeekImage(date)) {
      const file = await FileType.fromFile(
        `../tmp/eatery-${date.format("YYYY-WW")}.source`
      );
      if (file) {
        if ("ext" in file) {
          response.attachment(
            `../tmp/eatery-${date.format("YYYY-WW")}.source`,
            "image." + file.ext
          );
        }
      }
      return "Downloading file...";
    }
    throw new Exception("Begärd vecka sparas inte på servern.");
  }
}
