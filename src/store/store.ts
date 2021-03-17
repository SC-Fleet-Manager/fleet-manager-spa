import { createStore } from 'vuex';

export default createStore({
    modules: {
    },
    state: {
        user: null,
    },
    getters: {
        user(state) {
            return state.user;
        },
    },
    mutations: {
        updateUser(state, payload) {
            state.user = payload;
        },
    }
});
