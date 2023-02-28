import { Container, token } from "@valkyr/inverse";

import { router } from "~Services/Router";

export const container = new Container([token.singleton("router", router)]);
