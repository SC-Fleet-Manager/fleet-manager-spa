import Vue from "vue";
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
    },
    state: {
        splashScreen: false,
        accessToken: null,
        profile: null,
        infiniteScrollDisabled: false,
        myOrgasList: null,
    },
    getters: {
        user(state) {
            return state.user;
        },
        accessToken(state) {
            return state.accessToken;
        },
    },
    mutations: {
        splashScreen(state, payload) {
            state.splashScreen = payload;
        },
        profile(state, payload) {
            state.profile = payload;
        },
        accessToken(state, payload) {
            state.accessToken = payload;
        },
        infiniteScrollDisabled(state, payload) {
            state.infiniteScrollDisabled = payload;
        },
        myOrgasList(state, payload) {
            state.myOrgasList = payload;
            state.myOrgasList.sort((orga1, orga2) => {
                if (orga1.joined === orga2.joined) {
                    return orga2.name < orga1.name ? 1 : -1;
                }
                return orga2.joined - orga1.joined;
            });
        },
    }
});
