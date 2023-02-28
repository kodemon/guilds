/* @refresh reload */
import "./style.css";
import "./Modules";

import { createSignal, JSX } from "solid-js";
import { createComponent, render } from "solid-js/web";

import { router } from "~Services/Router";

render(() => <App />, document.getElementById("root") as HTMLElement);

let currentComponent: any;

function App(): JSX.Element {
  const [routed, setRouted] = createSignal<JSX.Element | null>(null);

  router
    .render((component, props = {}) => {
      if (component !== currentComponent) {
        currentComponent = component;
        setRouted(createComponent(component, props));
      }
    })
    .error((error) => {
      console.error(error);
    })
    .listen()
    .goTo("/");

  return routed;
}
