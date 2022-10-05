import { sfdcConnection } from './oauth.controller';

/**
 * Method used for retrieving user details from salesforce.
 * @param {*} request
 * @param {*} response
 * @param {*} next
 */
export const sfWhoAmI = async (request, response, next) => {
    const conn = await sfdcConnection(request, response, next);
    if (conn) {
        conn.identity((_error, res) => {
            response.status(200).json(res);
        });
    }
};
