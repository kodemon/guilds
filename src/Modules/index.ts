import { Route } from "@valkyr/router";

import { render } from "~Middleware/Render";
import { router } from "~Services/Router";

import { CharactersView } from "./Characters";
import { LayoutView } from "./Layout";
import { WorldView } from "./World";

router.register([
  new Route({
    id: "layout",
    actions: [render(LayoutView)],
    children: [
      new Route({
        id: "world",
        name: "World",
        path: "/",
        actions: [render(WorldView)]
      }),
      new Route({
        id: "characters",
        name: "Characters",
        path: "/characters",
        actions: [render(CharactersView)]
      })
    ]
  })
]);
