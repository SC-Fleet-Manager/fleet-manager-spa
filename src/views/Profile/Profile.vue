<template>
    <div class="animated fadeIn">
        <b-row>
            <b-col col md="6">
                <Preferences @updatedProfile="onUpdatedProfile" />
            </b-col>
        </b-row>
        <b-row>
            <b-col col md="6">
                <Security />
            </b-col>
        </b-row>
    </div>
</template>

<script>
import axios from 'axios';
import Config from '@config/config.json';
import Preferences from '@/components/Preferences';
import Security from '@/components/Security';
import store from '@/store/store';
import Vue from 'vue';

export default {
    name: 'profile',
    components: {Preferences, Security},
    data() {
        return {};
    },
    methods: {
        async onUpdatedProfile() {
            this.$toastr.s('Your profile has been updated!');
            try {
                const response = await axios.get(`${Config.api_base_url}/api/profile`, {
                    headers: {
                        Authorization: `Bearer ${store.state.accessToken}`,
                    }
                });
                store.commit('profile', response.data);
            } catch (err) {
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    this.$toastr.e('You have been disconnected. Please login again.');
                    this.$router.push({ name: 'Home' });
                    return;
                }
                console.error(err);
            }
        },
    },
};
</script>
