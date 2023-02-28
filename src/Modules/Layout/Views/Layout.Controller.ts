import { appWindow } from "@tauri-apps/api/window";
import { BiRegularWorld } from "solid-icons/bi";

import { Controller } from "~Libraries/Solid";
import { ControllerRoutes, Routed } from "~Libraries/Solid/Controller.Routes";

type Nav = {
  top: {
    href: string;
    icon: any;
    label: string;
  }[];
};

export class LayoutController extends Controller<
  {
    count: number;
    nav: Nav;
  } & Routed
> {
  readonly plugins = [ControllerRoutes.for("layout")];

  async onInit() {
    this.state.nav = {
      top: [
        {
          href: "/",
          icon: BiRegularWorld,
          label: "World"
        },
        {
          href: "/characters",
          icon: BiRegularWorld,
          label: "Characters"
        }
      ]
    };
  }

  minimize() {
    appWindow.minimize();
  }

  toggleMaximize() {
    appWindow.toggleMaximize();
  }

  close() {
    appWindow.close();
  }
}
