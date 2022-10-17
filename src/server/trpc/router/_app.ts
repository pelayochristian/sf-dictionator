// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { authRouter } from "./auth";
import { schemaObjectRouter } from "./schema-object";

export const appRouter = router({
  auth: authRouter,
  schemaObjectRouter: schemaObjectRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
