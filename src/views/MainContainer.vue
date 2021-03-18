<template>
    <div>
        <router-view></router-view>
    </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {RouteRecordName} from "vue-router";
import axios from 'axios';

export default defineComponent({
    name: 'MainContainer',
    components: {},
    data() {
        return {
            user: null as any, // TODO : use Vuex
        };
    },
    created(): void {
        axios.get('/api/profile').then(response => {
            this.user = response.data;
        });
    },
    computed: {},
    methods: {}
});
</script>

<style lang="scss">
$fa-font-path: '~@fortawesome/fontawesome-free/webfonts/';
@import '~@fortawesome/fontawesome-free/scss/fontawesome';
@import '~@fortawesome/fontawesome-free/scss/solid';
@import '~@fortawesome/fontawesome-free/scss/brands';
@import '~@styles/style.scss';
</style>
