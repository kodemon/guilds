import { EventEmitter } from "@valkyr/eventemitter";
import { batch, createComponent } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import { createMutable, StoreNode } from "solid-js/store";

import { Plugin } from "./Controller.Plugin.js";
import { ControllerClass, ControllerComponent } from "./Controller.Types.js";
import { ControllerView } from "./Controller.View.jsx";
import { JsonLike } from "./JsonLike.js";

const RESERVED_MEMBERS = ["state", "onInit", "onDestroy", "setState", "toActions"] as const;

export abstract class Controller<State extends JsonLike = {}, Props extends JsonLike = {}> extends EventEmitter {
  $lifecycle: StoreNode;

  readonly plugins: Plugin[] = [];
  readonly state: State;

  /**
   * Creates a new controller instance with given default state and pushState
   * handler method.
   *
   * @param state    - Default state to assign to controller.
   * @param pushData - Push data handler method.
   */
  constructor(readonly props: Props = {} as Props) {
    super();
    this.$lifecycle = createMutable({ loading: true, error: undefined });
    this.state = createMutable<State>({} as State);
    this.setState = this.setState.bind(this);
  }

  /*
   |--------------------------------------------------------------------------------
   | Factories
   |--------------------------------------------------------------------------------
   */

  /**
   * Register a react component as a view for this controller.
   *
   * @param component - Component to render.
   * @param options   - View options.
   */
  static view<T extends ControllerClass, Props extends {} = InstanceType<T>["props"]>(
    this: T,
    component: ControllerComponent<Props, T>,
    options: Partial<ViewOptions> = {}
  ) {
    return (props: any) => {
      return createComponent(ControllerView, {
        $components: {
          view: component,
          loading: options.loading ?? (() => {}),
          error: options.error ?? (() => {})
        },
        controller: new (this as any)(props).$resolve()
      });
    };
  }

  /*
   |--------------------------------------------------------------------------------
   | Bootstrap & Teardown
   |--------------------------------------------------------------------------------
   */

  $resolve(): this {
    this.onInit()
      .then(() => Promise.all(this.plugins.map(({ plugin, options }) => new plugin(this as any, options).onResolve())))
      .then(() => {
        this.$lifecycle.loading = false;
      });
    return this;
  }

  async $destroy(): Promise<void> {
    await this.onDestroy();
  }

  /*
   |--------------------------------------------------------------------------------
   | Lifecycle Methods
   |--------------------------------------------------------------------------------
   */

  /**
   * Method runs once per controller view lifecycle. This is where you should
   * subscribe to and return initial controller state. A component is kept in
   * loading state until the initial resolve is completed.
   *
   * Once the initial resolve is completed the controller will not run the onInit
   * method again unless the controller is destroyed and re-created.
   *
   * @returns Partial state or void.
   */
  async onInit(): Promise<void> {}

  /**
   * Method runs when the controller parent view is destroyed.
   */
  async onDestroy(): Promise<void> {}

  /*
   |--------------------------------------------------------------------------------
   | State Methods
   |--------------------------------------------------------------------------------
   */

  /**
   * Updates the state of the controller and triggers a state update via the push
   * state handler. This method will debounce state updates to prevent excessive
   * state updates.
   *
   * @param key   - State key to assign data to.
   * @param value - State value to assign.
   */
  setState(state: Partial<State>): void;
  setState<K extends keyof State>(key: K): (state: State[K]) => void;
  setState<K extends keyof State>(key: K, value: State[K]): void;
  setState<K extends keyof State>(...args: [K | State, State[K]?]): void | ((state: State[K]) => void) {
    const [target, value] = args;

    if (this.#isStateKey(target) && args.length === 1) {
      return (value: State[K]) => {
        this.setState(target, value);
      };
    }

    if (this.#isStateKey(target)) {
      (this.state as any)[target] = value;
    } else {
      batch(() => {
        for (const key in target) {
          this.state[key] = target[key];
        }
      });
    }
  }

  /*
   |--------------------------------------------------------------------------------
   | Resolvers
   |--------------------------------------------------------------------------------
   */

  /**
   * Returns all the prototype methods defined on the controller as a list of
   * actions bound to the controller instance to be used in the view.
   *
   * @returns List of actions.
   */
  toActions(): Omit<this, ReservedPropertyMembers[number]> {
    const actions: any = {};
    for (const name of Object.getOwnPropertyNames(this.constructor.prototype)) {
      if (name !== "constructor" && name !== "resolve" && RESERVED_MEMBERS.includes(name as any) === false) {
        actions[name] = (this as any)[name].bind(this);
      }
    }
    return actions;
  }

  /*
   |--------------------------------------------------------------------------------
   | Utilities
   |--------------------------------------------------------------------------------
   */

  #isStateKey(key: unknown): key is keyof State {
    return typeof key === "string";
  }
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

type ReservedPropertyMembers = typeof RESERVED_MEMBERS;

type ViewOptions = {
  name?: string;
  loading: () => JSX.Element;
  error: (error: string) => JSX.Element;
};
