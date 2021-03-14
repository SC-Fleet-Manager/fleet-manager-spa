<template>
    <div>
        CheckDiscord

        <div>
            <img :src="$auth.user.picture">
            <h2>{{ $auth.user.name }}</h2>
            <p>{{ $auth.user.email }}</p>
        </div>

        <div>
            <pre>{{ JSON.stringify($auth.user, null, 2) }}</pre>

            <button @click="callApi">Call API</button>
            <p v-if="user !== null">id: {{ user.id }}<br/>username: {{ user.auth0Username }}</p>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Config from '@config/config.json';

export default {
    name: 'check-discord',
    data() {
        return {
            user: null,
        };
    },
    methods: {
        async callApi() {
            const token = await this.$auth.getTokenSilently();
            const toto = await axios.get(`${Config.api_base_url}/api/toto`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(toto.data);
            this.user = toto.data.user;
        },
    },
};
</script>
