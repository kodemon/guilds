import { WorldController } from "./World.Controller";

export const WorldView = WorldController.view(({ state, actions: { addGuild, addTavern } }) => {
  return (
    <div class="p-4">
      <div>World</div>
      <div class="flex flex-row">
        <div class="mx-3">
          <button class="rounded-md bg-slate-700 px-3 py-1 text-white" onClick={addGuild}>
            Generate Guild Name
          </button>
          <ul>
            {state.guilds.map((guild) => (
              <li>{guild}</li>
            ))}
          </ul>
        </div>
        <div class="mx-3">
          <button class="rounded-md bg-slate-700 px-3 py-1 text-white" onClick={addTavern}>
            Generate Tavern Name
          </button>
          <ul>
            {state.taverns.map((tavern) => (
              <li>{tavern}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
});
