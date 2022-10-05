import * as dotenv from 'dotenv';
import axios from 'axios';
import jsforce from 'jsforce';

dotenv.config();

/**
 * Method use to call for authenticating the user to
 * Salesforce.
 *
 * @param {*} request
 * @param {*} response
 * @param {*} next
 */
export const callback = async (request, response, next) => {
    if (request.query.error) {
        let error = new Error(`Error on oauth callback ${request.query.error}`);
        next(error);
    }

    if (!request.query.code || !request.query.state) {
        response
            .status(404)
            .send('Authorization code and state parameters are required');
    }

    const state = JSON.parse(request.query.state);
    const authEndpoint = `${state.baseURL}/services/oauth2/token`;

    const data = `grant_type=authorization_code&code=${request.query.code}&client_id=${process.env.SF_CLIENT_ID}&client_secret=${process.env.SF_CLIENT_SECRET}&redirect_uri=${state.redirectURI}`;
    try {
        await axios
            .post(authEndpoint, data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            })
            .then((res) => {
                request.session.oauthInfo = res.data;
                request.session.oauthSuccess = true;
                const url =
                    process.env.NODE_ENV !== 'production'
                        ? 'http://localhost:3000/'
                        : '/';
                response.redirect(url);
            })
            .catch((error) => {
                next(new Error(`Oauth response returned an error: ${error}`));
            });
    } catch (error) {
        next(new Error(`Fetch failed on oauth request: ${error}`));
    }
};

/**
 * Method to return Salesforce Client Id.
 * @param {*} _request
 * @param {*} response
 */
export const clientId = async (_request, response, _next) => {
    response.status(200).send(process.env.SF_CLIENT_ID);
};

/**
 * Method to return Salesforce Connection via
 * jsforce.
 * @param {*} request
 * @param {*} response
 * @param {*} next
 * @returns
 */
export const sfdcConnection = async (request, response, next) => {
    try {
        const sess = request.session.oauthInfo;
        const { access_token, instance_url } = sess;
        return new jsforce.Connection({
            instanceUrl: instance_url,
            accessToken: access_token,
        });
    } catch (error) {
        next(error);
    }
};
