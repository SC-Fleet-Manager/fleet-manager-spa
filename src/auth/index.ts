import {Vue as _Vue} from 'vue';
import createAuth0Client, {Auth0Client, LogoutOptions, RedirectLoginOptions} from '@auth0/auth0-spa-js';
import { RedirectOption } from 'vue-router';
import { VueConstructor } from 'vue/types/umd';

/** Define a default action to perform after authentication */
const DEFAULT_REDIRECT_CALLBACK = () =>
    window.history.replaceState({}, document.title, window.location.pathname);

let instance: Vue;

/** Returns the current instance of the SDK */
export const getInstance = () => instance;

/** Creates an instance of the Auth0 SDK. If one has already been created, it returns that instance */
export const useAuth0 = ({
                             onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
                             redirectUri = window.location.origin,
                             ...options
                         }) => {
    if (instance) return instance;

    // The 'instance' is simply a Vue object
    instance = new _Vue({
        data() {
            return {
                loading: true,
                isAuthenticated: false,
                user: {} as {}|undefined,
                auth0Client: null as Auth0Client|null,
                popupOpen: false,
                error: null,
            };
        },
        methods: {
            /** Handles the callback when logging in using a redirect */
            async handleRedirectCallback() {
                if(this.auth0Client === null) {
                    return;
                }
                this.loading = true;
                try {
                    await this.auth0Client.handleRedirectCallback();
                    this.user = await this.auth0Client.getUser();
                    this.isAuthenticated = true;
                    this.error = null;
                } catch (e) {
                    this.error = e;
                } finally {
                    this.loading = false;
                    this.$emit('loaded');
                }

            },
            /** Authenticates the user using the redirect method */
            loginWithRedirect(o:RedirectLoginOptions) {
                if(this.auth0Client === null) {
                    return;
                }
                return this.auth0Client.loginWithRedirect(o);
            },
            /** Returns all the claims present in the ID token */
            getIdTokenClaims(o:RedirectLoginOptions) {
                if(this.auth0Client === null) {
                    return;
                }
                return this.auth0Client.getIdTokenClaims(o);
            },
            /** Returns the access token. If the token is invalid or missing, a new one is retrieved */
            getTokenSilently(o:RedirectLoginOptions) {
                if(this.auth0Client === null) {
                    return;
                }
                return this.auth0Client.getTokenSilently(o);
            },
            /** Logs the user out and removes their session on the authorization server */
            logout(o:LogoutOptions) {
                if(this.auth0Client === null) {
                    return;
                }
                return this.auth0Client.logout(o);
            },
        },
        /** Use this lifecycle method to instantiate the SDK client */
        async created() {
            // Create a new instance of the SDK client using members of the given options object
            this.auth0Client = await createAuth0Client({
                ...options,
                client_id: options.clientId,
                redirect_uri: redirectUri,
            });

            try {
                // If the user is returning to the app after authentication..
                if (
                    window.location.search.includes('code=') &&
                    window.location.search.includes('state=')
                ) {
                    // handle the redirect and retrieve tokens
                    const {appState} = await this.auth0Client.handleRedirectCallback();

                    this.error = null;

                    // Notify subscribers that the redirect callback has happened, passing the appState
                    // (useful for retrieving any pre-authentication state)
                    onRedirectCallback(appState);
                }
            } catch (e) {
                this.error = e;
            } finally {
                // Initialize our internal authentication state
                this.isAuthenticated = await this.auth0Client.isAuthenticated();
                this.user = await this.auth0Client.getUser();
                this.loading = false;
                this.$emit('loaded');
            }
        },
    });

    return instance;
};

// Create a simple Vue plugin to expose the wrapper object throughout the application
export const Auth0Plugin = {
    install(Vue: _Vue, options:{domain:string}) {
        Vue.config.globalProperties.$auth = useAuth0(options);
    },
};
