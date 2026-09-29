import "server-only";

import { serverEnvironmentSchema } from "./environment.schema";

const parsedEnvironment = serverEnvironmentSchema.safeParse(process.env);

if (!parsedEnvironment.success) {
  const invalidKeys = parsedEnvironment.error.issues.map((issue) => issue.path.join(".")).join(", ");
  console.error(JSON.stringify({ event: "environment.invalid", invalidKeys }));
  throw new Error("Environnement serveur invalide");
}

export const serverEnv = parsedEnvironment.data;
