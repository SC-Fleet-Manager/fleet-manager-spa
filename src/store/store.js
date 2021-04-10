import Vue from "vue";
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
    },
    state: {
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
        profile(state, payload) {
            state.profile = payload;
        },
        accessToken(state, payload) {
            state.accessToken = payload;
        },
    }
});
