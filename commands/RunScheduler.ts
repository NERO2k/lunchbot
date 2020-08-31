import { BaseCommand } from "@adonisjs/ace";

export default class RunScheduler extends BaseCommand {
  public static commandName = "run:scheduler";
  public static description = "";

  public async handle() {
    this.logger.info("Hello world!");
  }
}
