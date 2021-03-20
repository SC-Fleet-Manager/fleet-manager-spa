import Vue from 'vue';
import router from './router';
// see Discord OAuth2 implicit grant https://discord.com/developers/docs/topics/oauth2#implicit-grant
import Config from "@config/config.json";
import { Auth0Plugin } from "./auth";
import App from './App';
import store from './store/store';
import VueToastr from "vue-toastr";
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

Vue.use(Auth0Plugin, {
    domain: Config.auth0_domain,
    clientId: Config.auth0_clientId,
    audience: Config.auth0_audience,
    redirectUri: 'https://fleet-manager.traefik.test/profile',
    onRedirectCallback: appState => {
        router.push(
            appState && appState.targetUrl
                ? appState.targetUrl
                : window.location.pathname
        );
    }
});
Vue.use(LayoutPlugin);
Vue.use(FormPlugin);
Vue.use(FormGroupPlugin);
Vue.use(FormInputPlugin);
Vue.use(FormCheckboxPlugin);
Vue.use(FormFilePlugin);
Vue.use(FormRadioPlugin);
Vue.use(InputGroupPlugin);
Vue.use(ButtonPlugin);
Vue.use(ButtonGroupPlugin);
Vue.use(AlertPlugin);
Vue.use(CardPlugin);
Vue.use(ModalPlugin);
Vue.use(DropdownPlugin);
Vue.use(SpinnerPlugin);
Vue.use(LinkPlugin);
Vue.use(NavPlugin);
Vue.use(NavbarPlugin);
Vue.use(PaginationPlugin);
Vue.use(BadgePlugin);
Vue.use(CollapsePlugin);
Vue.use(ProgressPlugin);
Vue.use(TablePlugin);
Vue.use(VBTooltipPlugin);
Vue.use(VueToastr, {
    defaultTimeout: 3000,
    defaultProgressBar: false,
    defaultProgressBarValue: 0,
    defaultPosition: "toast-bottom-right",
    defaultCloseOnHover: false,
    defaultClassNames: ["animated", "zoomInUp"]
});

new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: {App},
});
