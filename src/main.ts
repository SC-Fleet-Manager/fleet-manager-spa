import { createApp } from 'vue';
import Config from "@config/config";
import router from './router';
import store from '@/store/store';
// see Discord OAuth2 implicit grant https://discord.com/developers/docs/topics/oauth2#implicit-grant
import { Auth0Plugin } from "./auth";

import App from '@/views/App.vue';
const app = createApp(App);
app.use(router);
app.use(Auth0Plugin, {
    domain: Config.auth0_domain,
    clientId: Config.auth0_clientId,
    audience: Config.auth0_audience,
    redirectUri: 'https://fleet-manager.traefik.test/profile',
    onRedirectCallback: (appState: any) => {
        router.push(
            appState && appState.targetUrl
                ? appState.targetUrl
                : window.location.pathname
        );
    }
});

app.mount('#app');
