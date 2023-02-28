import { FaSolidWindowMaximize, FaSolidWindowMinimize } from "solid-icons/fa";
import { VsChromeClose } from "solid-icons/vs";
import { createComponent } from "solid-js/web";

import { Link } from "~Components/Link.Component";

import { LayoutController } from "./Layout.Controller";

export const LayoutView = LayoutController.view(({ state, actions: { minimize, toggleMaximize, close } }) => {
  return (
    <div class="absolute top-0 right-0 bottom-0 left-0 grid grid-rows-[40px_1fr] antialiased">
      <div data-tauri-drag-region class="flex items-center justify-between bg-primary text-primary-text">
        <div class="pl-5">Guilds</div>
        <div class="flex items-center pr-5">
          <button class="ml-4" onClick={minimize}>
            <FaSolidWindowMinimize />
          </button>
          <button class="ml-4" onClick={toggleMaximize}>
            <FaSolidWindowMaximize />
          </button>
          <button class="ml-4 items-center" onClick={close}>
            <VsChromeClose />
          </button>
        </div>
      </div>
      <div class="grid grid-cols-[200px_1fr]">
        <aside class="min-h-full bg-primary px-3 py-4 text-primary-text">
          <ul>
            {state.nav.top.map(({ href, icon: Icon, label }) => (
              <li>
                <Link class="flex items-center p-2 text-sm hover:rounded-md hover:bg-primary-light" href={href}>
                  <Icon class="mr-2" /> {label}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
        <main class="bg-secondary">
          {state.routed !== undefined ? createComponent(state.routed.component, state.routed.props) : null}
        </main>
      </div>
    </div>
  );
});
