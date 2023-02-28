import type { Subscription } from "rxjs";
import type { JSX } from "solid-js";

import { container } from "~/Container";

import type { Controller } from "./Controller.js";
import type { ControllerPlugin, Plugin } from "./Controller.Plugin.js";

export class ControllerRoutes implements ControllerPlugin {
  readonly router = container.get("router");

  readonly #controller: Controller<Routed>;
  readonly #routes: string[] = [];

  #subscription?: Subscription;

  constructor(controller: Controller<Routed>, { routeId }: PluginOptions) {
    const parent = this.router.getParentRouteById(routeId);
    if (parent === undefined) {
      throw new Error(`ControllerRoutes Exception: Template route for ${routeId} was not found`);
    }
    for (const route of parent.children ?? []) {
      this.#routes.push(route.path);
    }
    this.#controller = controller;
  }

  /*
   |--------------------------------------------------------------------------------
   | Registrar
   |--------------------------------------------------------------------------------
   */

  static for(routeId: string): Plugin<PluginOptions> {
    return {
      plugin: this,
      options: {
        routeId
      }
    };
  }

  /*
   |--------------------------------------------------------------------------------
   | Bootstrap & Teardown
   |--------------------------------------------------------------------------------
   */

  async onResolve(): Promise<void> {
    this.#subscription?.unsubscribe();

    // ### Subscriber

    this.#subscription = this.router.subscribe(this.#routes, async (resolved) => {
      const result = await this.router.getRender<typeof this.router>(resolved);
      if (result !== undefined) {
        this.#controller.state.routed = {
          component: result.component,
          props: result.props
        };
      }
    });

    // ### Preload

    for (const path of this.#routes) {
      const isCurrentPath = this.router.match(path);
      if (isCurrentPath === true) {
        const resolved = this.router.getResolvedRoute(this.router.location.pathname);
        if (resolved !== undefined) {
          const view = await this.router.getRender<typeof this.router>(resolved);
          if (view !== undefined) {
            this.#controller.state.routed = {
              component: view.component,
              props: view.props
            };
          }
        }
      }
    }
  }

  async onDestroy(): Promise<void> {
    this.#subscription?.unsubscribe();
  }
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type Routed = {
  routed?: {
    component: (props: any) => JSX.Element;
    props: any;
  };
};

type PluginOptions = { routeId: string };
