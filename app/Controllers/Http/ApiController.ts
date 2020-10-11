import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import {
  hasWeekImage,
  isWeekParsed,
  isWeekStringified,
} from "App/Common/MenuHelpers";
import moment from "moment/";
import { Exception } from "@poppinss/utils";
import { getMenu } from "App/Common/HelperFunctions";
import FileType from "file-type";
import {engDayCast} from "../../../config/words";
import {embed} from "App/Common/DiscordHelpers";

export default class ApiController {
  public async index({ view }: HttpContextContract) {
    return view.render("api");
  }

  public async json({ request }: HttpContextContract) {
    const params = request.all();
    const date = moment(params.date, params.format);

    if (!date.isValid())
      throw new Exception("Datum / datumformat som anges är ogiltigt.");

    if (await isWeekParsed(date)) {
      return await getMenu(date, false, true);
    }

    throw new Exception("Begärd vecka sparas inte på servern.");
  }

  public async image({ request, response }: HttpContextContract) {
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

  public async ocr_image({ request, response }: HttpContextContract) {
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

  public async text({ request }: HttpContextContract) {
    const params = request.all();
    const date = moment(params.date, params.format);

    if (!date.isValid())
      throw new Exception("Datum / datumformat som anges är ogiltigt.");

    if (await isWeekParsed(date)) {
      let returnT = "EATERY KISTA NOD — MENY VECKA "+date.format("WW")+"\n\n";
      const data = await getMenu(date, false, true);
      Object.keys(data.menu).forEach((value) => {
        const day = engDayCast[value] || value;
        returnT += day.toUpperCase()+'\n';
        returnT += data.menu[value].join("\n")+'\n\n';
      });
      return returnT;
    }

    throw new Exception("Begärd vecka sparas inte på servern.");
  }

  public async markdown_text({ request }: HttpContextContract) {
    const params = request.all();
    const date = moment(params.date, params.format);

    if (!date.isValid())
      throw new Exception("Datum / datumformat som anges är ogiltigt.");

    if (await isWeekParsed(date)) {
      let returnT = "# EATERY KISTA NOD — MENY VECKA "+date.format("WW")+"\n---\n";
      const data = await getMenu(date, false, true);
      Object.keys(data.menu).forEach((value) => {
        const day = engDayCast[value] || value;
        returnT += "##### "+day.toUpperCase()+'\n - ';
        returnT += data.menu[value].join("\n - ")+'\n\n';
      });
      return returnT;
    }

    throw new Exception("Begärd vecka sparas inte på servern.");
  }

  public async html_text({ request }: HttpContextContract) {
    const params = request.all();
    const date = moment(params.date, params.format);

    if (!date.isValid())
      throw new Exception("Datum / datumformat som anges är ogiltigt.");

    if (await isWeekParsed(date)) {
      let returnT = `
      <div class="eatery-body">
      <div class="eatery-week" id="eatery-${date.format("WW")}">EATERY KISTA NOD — MENY VECKA ${date.format("WW")}</div>
      `;
      const data = await getMenu(date, false, true);

      Object.keys(data.menu).forEach((value) => {
        const day = engDayCast[value] || value;

        const entries = '<div class="eatery-entry">'+data.menu[value].join('</div><div class="eatery-entry">')+'</div>'

        const template =
        `<div class="eatery-container" id="eatery-${value}">
          <div class="eatery-day">${day.toUpperCase()}</div>
          <div class="eatery-menu">
            ${entries}
          </div>
        </div>`
        returnT += template;
      });

      return returnT+'</div>';
    }

    throw new Exception("Begärd vecka sparas inte på servern.");
  }

  public async raw_text({ request, response }: HttpContextContract) {
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

  public async embed({ request }: HttpContextContract) {
    const params = request.all();
    const date = moment(params.date, params.format);

    if (!date.isValid())
      throw new Exception("Datum / datumformat som anges är ogiltigt.");

    if (await isWeekParsed(date)) {
      const data = await getMenu(date, false, true);
      return embed(data, date);
    }

    throw new Exception("Begärd vecka sparas inte på servern.");
  }
}
