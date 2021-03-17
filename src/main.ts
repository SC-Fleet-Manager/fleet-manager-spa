import { createApp } from 'vue';
import Config from "@config/config";
import router from './router';
import store from '@/store/store';
// import VueToastr from "vue-toastr";
// see Discord OAuth2 implicit grant https://discord.com/developers/docs/topics/oauth2#implicit-grant
import { Auth0Plugin } from "./auth";
import {
    LayoutPlugin,
    FormPlugin,
    FormGroupPlugin,
    FormInputPlugin,
    FormCheckboxPlugin,
    FormFilePlugin,
    FormRadioPlugin,
    InputGroupPlugin,
    ButtonPlugin,
    ButtonGroupPlugin,
    AlertPlugin,
    CardPlugin,
    ModalPlugin,
    DropdownPlugin,
    SpinnerPlugin,
    LinkPlugin,
    NavPlugin,
    NavbarPlugin,
    PaginationPlugin,
    BadgePlugin,
    CollapsePlugin,
    ProgressPlugin,
    TablePlugin,
    VBTooltipPlugin,
} from 'bootstrap-vue';

import AppToto from '@/views/App.vue';
const app = createApp(AppToto);
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
app.use(LayoutPlugin);
app.use(FormPlugin);
app.use(FormGroupPlugin);
app.use(FormInputPlugin);
app.use(FormCheckboxPlugin);
app.use(FormFilePlugin);
app.use(FormRadioPlugin);
app.use(InputGroupPlugin);
app.use(ButtonPlugin);
app.use(ButtonGroupPlugin);
app.use(AlertPlugin);
app.use(CardPlugin);
app.use(ModalPlugin);
app.use(DropdownPlugin);
app.use(SpinnerPlugin);
app.use(LinkPlugin);
app.use(NavPlugin);
app.use(NavbarPlugin);
app.use(PaginationPlugin);
app.use(BadgePlugin);
app.use(CollapsePlugin);
app.use(ProgressPlugin);
app.use(TablePlugin);
app.use(VBTooltipPlugin);

// app.use(VueToastr, {
//     defaultTimeout: 3000,
//     defaultProgressBar: false,
//     defaultProgressBarValue: 0,
//     defaultPosition: "toast-bottom-right",
//     defaultCloseOnHover: false,
//     defaultClassNames: ["animated", "zoomInUp"]
// });

app.mount('#app');
