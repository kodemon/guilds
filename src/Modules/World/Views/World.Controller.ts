import { Controller } from "~Libraries/Solid";
import { fantastical } from "~Services/Fantastical";

export class WorldController extends Controller<{
  guilds: string[];
}> {
  async onInit() {
    this.state.guilds = [];
  }

  async addGuild() {
    this.state.guilds.push(await fantastical.getGuildName());
  }
}
