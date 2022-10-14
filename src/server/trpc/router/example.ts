import { router, publicProcedure } from "../trpc";
import { z } from "zod";

export const exampleRouter = router({
  hello: publicProcedure
    .input(z.object({ text: z.string().nullish() }).nullish())
    .query(({ input }) => {
      return {
        greeting: `Hello ${input?.text ?? "world"}`,
      };
    }),

  serverTest: publicProcedure
    .input(z.object({ text: z.string().nullish() }).nullish())
    .query(({ input, ctx }) => {
      const { jwt } = ctx;
      console.log('jwt: ', jwt)
      return {
        greeting: `123Server Test ${input?.text ?? "world"}`,
      };
    }),
});
