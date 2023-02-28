import { WorldController } from "./World.Controller";

export const WorldView = WorldController.view(({ state, actions: { addGuild } }) => {
  return (
    <div class="p-4">
      <div>World</div>
      <button class="rounded-md bg-slate-700 px-3 py-1 text-white" onClick={addGuild}>
        Generate Guild Name
      </button>
      <ul>
        {state.guilds.map((guild) => (
          <li>{guild}</li>
        ))}
      </ul>
    </div>
  );
});
