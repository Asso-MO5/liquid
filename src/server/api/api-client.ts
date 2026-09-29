import "server-only";

import { serverEnv } from "~/platform/env/env.server";
import { createApiClient } from "./api-client.factory";

/** Client HTTP vers l'API Ocelot, réservé au serveur. */
export const api = createApiClient(serverEnv.OCELOT_API_URL);
