import { createMemoryHistory, Router } from "@valkyr/router";
import { JSX } from "solid-js";

export const router = new Router<(props: any) => JSX.Element>(createMemoryHistory());
