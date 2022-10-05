import session from 'express-session';
import { getSFDCSession, sfdcConnection } from './oauth.controller';

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

/**
 * Method use for signing out user
 * @param {*} request
 * @param {*} response
 * @param {*} next
 */
export const signoutUser = async (request, response, next) => {
    const session = getSFDCSession(request, response, next);
    const conn = await sfdcConnection(request, response, next);
    conn.logout((error) => {
        if (error) {
            response.status(500).json(error);
            return;
        }

        // Destroy server-side session
        session.destroy((error) => {
            if (error) {
                console.error(
                    'Salesforce session destruction error: ' +
                        JSON.stringify(error)
                );
            }
        });
        response.status(200).json({ is_success: true });
    });
};
