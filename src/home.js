import Vue from 'vue';
import Home from './Home';
import VModal from 'vue-js-modal';


import Router from 'vue-router';
import { Auth0Plugin } from "./auth";
import axios from 'axios';

// Views
const HomeWrapped = () => import('@/views/HomeWrapped');
const CheckDiscord = () => import('@/views/CheckDiscord');

Vue.use(Router);
Vue.use(VModal);

const router = new Router({
    mode: 'history',
    linkActiveClass: 'open active',
    scrollBehavior: () => ({y: 0}),
    routes: [
        {
            path: '/',
            name: 'Home',
            component: HomeWrapped,
        },
        {
            path: '/oauth/callback',
            name: 'CheckDiscord',
            component: CheckDiscord,
        },
        // {
        //     path: '/404',
        //     component: Page404,
        //     meta: {
        //         titleTag: '404 - Fleet Manager',
        //     },
        // },
        // {
        //     path: '*',
        //     component: Page404,
        //     meta: {
        //         titleTag: '404 - Fleet Manager',
        //     },
        // }
    ]
});


// see Discord OAuth2 implicit grant https://discord.com/developers/docs/topics/oauth2#implicit-grant

import Config from "@config/config.json";
Vue.use(Auth0Plugin, {
    domain: Config.auth0_domain,
    clientId: Config.auth0_clientId,
    audience: Config.auth0_audience,
    redirectUri: 'https://fleet-manager.traefik.test/oauth/callback',
    onRedirectCallback: appState => {
        router.push(
            appState && appState.targetUrl
                ? appState.targetUrl
                : window.location.pathname
        );
    }
});

new Vue({
    el: '#app',
    router,
    template: '<Home/>',
    components: {Home},
});


// new Vue({
//     el: '#app',
//     render(h) {
//         return h(Home);
//     }
// });




// function(accessToken, context, callback) {
//     request.get(
//         {
//             url: 'https://discordapp.com/api/v6/users/@me',
//             headers: {
//                 'Authorization': 'Bearer ' + accessToken,
//             }
//         },
//         (err, resp, body) => {
//             if (err) {
//                 return callback(err);
//             }
//
//             if (resp.statusCode !== 200) {
//                 return callback(new Error(body));
//             }
//
//             let bodyParsed;
//             try {
//                 bodyParsed = JSON.parse(body);
//             } catch (jsonError) {
//                 return callback(new Error(body));
//             }
//
//             const profile = {
//                 user_id: bodyParsed.id,
//                 email: bodyParsed.email,
//                 username: bodyParsed.username+'#'+bodyParsed.discriminator,
//                 nickname: bodyParsed.username,
//                 picture: 'https://cdn.discordapp.com/avatars/'+bodyParsed.id+'/'+bodyParsed.avatar+'.png',
//             };
//
//             callback(null, profile);
//         }
//     );
// }
