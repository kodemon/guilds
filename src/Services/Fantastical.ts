import { invoke } from "@tauri-apps/api";

class Fantastical {
  async getGuildName(): Promise<string> {
    return invoke("generate_guild_name");
  }
}

export const fantastical = new Fantastical();
