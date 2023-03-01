import { Controller } from "~Libraries/Solid";
import { fantastical } from "~Services/Fantastical";

export class WorldController extends Controller<{
  guilds: string[];
  taverns: string[];
}> {
  async onInit() {
    this.setState({
      guilds: [],
      taverns: []
    });
  }

  async addGuild() {
    this.state.guilds.push(await fantastical.getGuildName());
  }

  async addTavern() {
    this.state.taverns.push(await fantastical.getTavernName());
  }
}
