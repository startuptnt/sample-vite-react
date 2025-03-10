import { PreviousLocationStorageKey } from 'react-admin';
import { Auth0Client } from '@auth0/auth0-spa-js';

/**
 * An authProvider which handles authentication via the Auth0 instance.
 */
const Auth0AuthProvider = (client, options = { redirectOnCheckAuth: true }) => {
    const { loginRedirectUri, logoutRedirectUri, redirectOnCheckAuth = true } = options;

    const differentAudienceOptions = {
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          connection: "",
        }
      };

    return {
        async login() {
                client.loginWithRedirect({
                    authorizationParams: {
                        redirect_uri: loginRedirectUri || `${window.location.origin}/auth-callback`,
                        audience: import.meta.env.VITE_AUTH0_AUDIENCE, // Ensure the audience is set so we get JWK instead of only token
                        connection: "",
                    }
                });
        },

        async logout() {
            await client.logout({
                logoutParams: {
                    returnTo: logoutRedirectUri || window.location.origin,
                },
            });
            return false;
        },

        async checkError({ status }) {
            if (status === 401 || status === 403) {
                throw new Error('Unauthorized');
            }
        },

        async checkAuth() {
            const isAuthenticated = await client.isAuthenticated();
            if (isAuthenticated) return;

            try {
                // Attempt to get a new token silently
                const token = await client.getTokenSilently(differentAudienceOptions);
                if (token) return;

                throw new Error('Unauthorized');
            } catch (error) {
                if (redirectOnCheckAuth) {
                    localStorage.setItem(PreviousLocationStorageKey, window.location.href);
                    return client.loginWithRedirect({
                        authorizationParams: {
                            redirect_uri: loginRedirectUri || `${window.location.origin}/auth-callback`,
                            audience: import.meta.env.VITE_AUTH0_AUDIENCE, // Ensure the audience is set so we get JWK instead of only token
                            connection: "",
                        },
                    });
                }
                throw new Error('Unauthorized');
            }
            
        },

        async getPermissions() {
            if (!(await client.isAuthenticated())) return;

            const claims = await client.getIdTokenClaims();
            const roleProperty = Object.keys(claims).find(key => key.includes('role'));
            return claims[roleProperty];
        },

        async getIdentity() {
            if (await client.isAuthenticated()) {
                const user = await client.getUser();
                return {
                    id: user.email,
                    fullName: user.name,
                    avatar: user.picture,
                };
            }
            throw new Error('Failed to get identity.');
        },

        async handleCallback() {

            if (!handleCallbackPromise) {
                handleCallbackPromise = new Promise(async (resolve, reject) => {
                    const query = window.location.search;
                    if (query.includes('code=') && query.includes('state=')) {
                        try {
                            await client.handleRedirectCallback();
                            return resolve();
                        } catch (error) {
                            return reject({
                                redirectTo: false,
                                message: error.message,
                            });
                        }
                    }
                    return reject({
                        message: 'Failed to handle login callback.',
                    });
                });
            }
            return handleCallbackPromise;
        },
        async getToken() {
            try {
                return await auth0.getTokenSilently(differentAudienceOptions);
            } catch (error) {
                client.loginWithRedirect({
                    authorizationParams: {
                        redirect_uri: loginRedirectUri || `${window.location.origin}/auth-callback`,
                        audience: import.meta.env.VITE_AUTH0_AUDIENCE, // Ensure the audience is set so we get JWK instead of only token
                    }
                });
                throw new Error('Unauthorized');
            }
        }
    };
};

let handleCallbackPromise = null;


const auth0 = new Auth0Client({
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  authorizationParams: {
    audience: import.meta.env.VITE_AUTH0_AUDIENCE,
    connection: "",
  },
  useRefreshTokens: true,
  /* cacheLocation is set to local storage because the Auth0 SDK only supports memory and localStorage. Memory storage is lost on page refresh/ redirect.
   * Historically 3rd-party cookies bridged the gap, but 3rd party cookies are largely deprecated and cannot be relied on anymore. 
   * The Auth0 and React-Admin requires a consistent redirect url, while we need multiple URIs for each object for untuitive navigation, so we cannot use memory.
   * The SDK does NOT allow multiple methods of token storage (ie. auth-token in memory and refresh in localStorage).
   * Auth0 advises that the risk can be minimized by setting a short expiry on the auth-token. In this case it is set to expire every 5 minutes.
   */
  cacheLocation: 'localstorage',
});

const authProvider = Auth0AuthProvider(auth0, {
    loginRedirectUri: import.meta.env.VITE_LOGIN_REDIRECT_URL,
    logoutRedirectUri: import.meta.env.VITE_LOGOUT_REDIRECT_URL,
  });

export default authProvider;