import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const exampleRouter = router({
  hello: publicProcedure
    .input(z.object({ text: z.string().nullish() }).nullish())
    .query(({ input }) => {
      return {
        greeting: `Hello ${input?.text ?? "world"}`,
      };
    }),

  serverTest: protectedProcedure
    .input(z.object({ text: z.string().nullish() }).nullish())
    .query(({ input }) => {
      return {
        greeting: `123Server Test ${input?.text ?? "world"}`,
      };
    }),
});
