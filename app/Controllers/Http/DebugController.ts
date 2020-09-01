// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import moment from "moment/";
import { Exception } from "@poppinss/utils";
import { fetch, image, ocr, parse } from "App/Common/MenuFunctions";
import { getMenu } from "App/Common/HelperFunctions";
import User from "App/Models/User";
import Server from "App/Models/Server";
import {generateCalendar} from "App/Common/CalendarFunctions";
import * as fs from "fs/promises";

export default class WebController {
  public async image({ params }) {
    return image(params.url);
  }

  public async fetch({ request }) {
    const params = request.all();
    const date = moment(params.date, params.format);

    if (!date.isValid())
      throw new Exception("Date / Date format provided is invalid.");

    if (!params.url) throw new Exception("No fetch url provided.");

    return fetch(date, params.url, false);
  }

  public async ocr({ request }) {
    const params = request.all();
    return await ocr(params.file);
  }

  public async parse({ request }) {
    const params = request.all();
    return parse(params.text);
  }

  public async process({ request }) {
    const params = request.all();
    const date = moment(params.date, params.format);

    if (!date.isValid())
      throw new Exception("Date / Date format provided is invalid.");

    return getMenu(date, true, true);
  }

  public async addUser({ request }) {
    const params = request.all();

    const user = await User.firstOrCreate(
      { user_id: params.user_id },
      { user_id: params.user_id, enabled: false }
    );

    if (!user.enabled) {
      user.enabled = true;
      await user.save();
    } else {
      user.enabled = false;
      await user.save();
    }

    return user;
  }

  public async addServer({ request }) {
    const params = request.all();

    const server = await Server.firstOrCreate(
      { channel_id: params.channel_id },
      {
        server_id: params.server_id,
        channel_id: params.channel_id,
        enabled: false,
      }
    );

    if (!server.enabled) {
      server.enabled = true;
      await server.save();
    } else {
      server.enabled = false;
      await server.save();
    }

    return server;
  }

  public async regenerateCalendar()
  {
    const calendar = await generateCalendar();
    await fs.writeFile("../tmp/eatery-calendar.ical", calendar);
    return calendar;
  }

  public async dump()
  {
    return {
      users: User.all(),
      servers: Server.all()
    }
  }
}
