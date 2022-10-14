// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { exampleRouter } from "./example";
import { authRouter } from "./auth";
import { schemaObjectRouter } from "./schema-object";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  schemaObjectRouter: schemaObjectRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
