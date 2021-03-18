import {App, defineComponent, DefineComponent} from 'vue';
import createAuth0Client, {Auth0Client, LogoutOptions, RedirectLoginOptions} from '@auth0/auth0-spa-js';

/** Define a default action to perform after authentication */
const DEFAULT_REDIRECT_CALLBACK = (_: any) =>
    window.history.replaceState({}, document.title, window.location.pathname);

export const getInstance = () => instance;

class Auth0 {
    public loading = true;
    public isAuthenticated = false;
    public user:{}|undefined = {};
    public auth0Client: Auth0Client|null = null;
    public error = null;

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
            // this.$emit('loaded');
        }
    }
    /** Authenticates the user using the redirect method */
    loginWithRedirect(o:RedirectLoginOptions) {
        if(this.auth0Client === null) {
            return;
        }
        return this.auth0Client.loginWithRedirect(o);
    }
    /** Returns all the claims present in the ID token */
    getIdTokenClaims(o:RedirectLoginOptions) {
        if(this.auth0Client === null) {
            return;
        }
        return this.auth0Client.getIdTokenClaims(o);
    }
    /** Returns the access token. If the token is invalid or missing, a new one is retrieved */
    getTokenSilently(o:RedirectLoginOptions) {
        if(this.auth0Client === null) {
            return;
        }
        return this.auth0Client.getTokenSilently(o);
    }
    /** Logs the user out and removes their session on the authorization server */
    logout(o:LogoutOptions) {
        if(this.auth0Client === null) {
            return;
        }
        return this.auth0Client.logout(o);
    }

    async init(onRedirectCallback: (state: any) => void, redirectUri: string, options: any) {
        // Create a new instance of the SDK client using members of the given options object
        this.auth0Client = await createAuth0Client({
            ...options as {domain: string},
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
            console.error(e);
            this.error = e;
        } finally {
            // Initialize our internal authentication state
            this.isAuthenticated = await this.auth0Client.isAuthenticated();
            this.user = await this.auth0Client.getUser();
            this.loading = false;
            // this.$emit('loaded');
        }
    }
}

let instance: Auth0;

/** Creates an instance of the Auth0 SDK. If one has already been created, it returns that instance */
export const useAuth0 = ({
                             onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
                             redirectUri = window.location.origin,
                             ...options
                         }) => {
    if (instance) return instance;

    instance = new Auth0();
    instance.init(onRedirectCallback, redirectUri, options);

    return instance;
};

// Create a simple Vue plugin to expose the wrapper object throughout the application
export const Auth0Plugin = {
    install(Vue: App, options:{domain:string}) {
        Vue.config.globalProperties.$auth = useAuth0(options);
    },
};

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $auth: Auth0;
    }
}
