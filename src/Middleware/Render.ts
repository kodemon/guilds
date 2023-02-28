import { Action } from "@valkyr/router";
import { JSX } from "solid-js";

export function render(components: (props: any) => JSX.Element): Action {
  return async function () {
    return this.render(components);
  };
}
