import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import {glob} from "glob";
import path from "path";
import moment from "moment";
import {Exception} from "@poppinss/utils";
import {hasWeekImage, hasWeekSourceImage, isWeekParsed, isWeekStringified} from "App/Common/MenuHelpers";
import {fileToDateString, getMenu} from "App/Common/HelperFunctions";

export default class DataController {
  public async menus_available() {
    const data:any = await new Promise( (resolve) => {
      glob(
        path.join(__dirname, "../../../../tmp/*.source"),
        {},
        async (_err, files) => {
          resolve(files);
        }
      );
    });
    const mappedData = data.map((data: string) => data.replace(/^.*[\\\/]/, ''));

    let dateMappedData:any = {}
    for (let i = 0; i < mappedData.length; i++) {
      const strDate = fileToDateString(mappedData[i])
      const date = moment(strDate, "YYYY-WW");
      const data = await getMenu(date, false, true)

      dateMappedData[strDate] = {
        schema_version: data.schema_version,
        listed_week: data.listed_week,
        actual_year: data.actual_year,
        actual_week: data.actual_week,
        iteration_year: data.iteration_year,
        iteration_week: data.iteration_week
      }
    }

    return dateMappedData;
  }

  public async menu_details({ request }: HttpContextContract) {
    const params = request.all();
    const date = moment(params.date, params.format);

    if (!date.isValid())
      throw new Exception("Datum / datumformat som anges är ogiltigt.");

    const jsonData = isWeekParsed(date);
    const imageData = hasWeekImage(date);
    const sourceImageData = hasWeekSourceImage(date);
    const textData = isWeekStringified(date);

    const data = await getMenu(date, false, true)

    return {
      info: {
        schema_version: data.schema_version,
        listed_week: data.listed_week,
        actual_year: data.actual_year,
        actual_week: data.actual_week,
        iteration_year: data.iteration_year,
        iteration_week: data.iteration_week
      },
      available: {
        json: jsonData,
        image: sourceImageData,
        ocr_image: imageData,
        text: textData
      }
    }
  }

  public async statistics() {
    const json_files = await new Promise( (resolve) => {
      glob(
        path.join(__dirname, "../../../../tmp/*.json"),
        {},
        async (_err, files) => {
          resolve(files.length)
        }
      );
    });
    const text_files = await new Promise( (resolve) => {
      glob(
        path.join(__dirname, "../../../../tmp/*.txt"),
        {},
        async (_err, files) => {
          resolve(files.length)
        }
      );
    });
    const source_images = await new Promise( (resolve) => {
      glob(
        path.join(__dirname, "../../../../tmp/*.source"),
        {},
        async (_err, files) => {
          resolve(files.length)
        }
      );
    });
    const ocr_images = await new Promise( (resolve) => {
      glob(
        path.join(__dirname, "../../../../tmp/*.json"),
        {},
        async (_err, files) => {
          resolve(files.length)
        }
      );
    });

    return {
      json_files,
      text_files,
      source_images,
      ocr_images
    }
  }
}
