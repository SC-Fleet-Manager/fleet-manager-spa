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
    }
});
