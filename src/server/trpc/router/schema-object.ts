import { protectedProcedure, router } from "../trpc";
import jsforce from 'jsforce';
import { CustomizableSObject } from "schema-object";
import { TRPCError } from "@trpc/server";

export const schemaObjectRouter = router({

    /**
     * Method use to retrieve SObjects that are customizable.
     */
    getCustomizableSObjects: protectedProcedure
        .query(({ ctx }) => {
            return new Promise((resolve, reject) => {
                const jwt = ctx.jwt?.sfdc
                const conn = new jsforce.Connection({
                    instanceUrl: jwt?.instanceURL,
                    accessToken: jwt?.accessToken,
                });

                const sObjects: CustomizableSObject[] = [];
                conn.query(
                    'SELECT Label, QualifiedApiName ' +
                    'FROM EntityDefinition ' +
                    'WHERE IsCustomizable = true ' +
                    'Order By Label'
                )
                    .on('record', function (record) {
                        sObjects.push(record);
                    })
                    .on('end', function () {
                        resolve(sObjects)
                    })
                    .on('error', function (err) {
                        reject(new TRPCError({ message: err.message, code: 'UNAUTHORIZED' }));
                    })
                    .run({ autoFetch: true, maxFetch: 4000 });
            })
        }),
});