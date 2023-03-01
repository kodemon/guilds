import { invoke } from "@tauri-apps/api";

class Fantastical {
  async getGuildName(): Promise<string> {
    return invoke("generate_guild_name");
  }

  async getTavernName(): Promise<string> {
    return invoke("generate_tavern_name");
  }
}

export const fantastical = new Fantastical();
