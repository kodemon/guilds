import type { Controller } from "./Controller";
import type { JsonLike } from "./JsonLike";

export type ControllerPlugin = {
  onResolve(): Promise<void>;
  onDestroy(): Promise<void>;
};

export type Plugin<Options extends JsonLike = any, State extends JsonLike = {}> = {
  plugin: PluginController<Options, State>;
  options?: Options;
};

type PluginController<Options extends JsonLike = any, State extends JsonLike = {}> = Options extends void
  ? { new (controller: Controller<State>): ControllerPlugin }
  : {
      new (controller: Controller<State>, options: Options): ControllerPlugin;
    };
