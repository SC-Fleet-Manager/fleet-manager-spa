<template>
    <div>
        <b-alert variant="warning" :show="true"><i class="fa fa-exclamation-triangle"></i> You are about to clear your fleet.
            <br />Are you sure you want to confirm?
        </b-alert>
        <b-alert v-if="deleteFleetErrorMessage !== null" variant="danger" show v-html="deleteFleetErrorMessage"></b-alert>
        <b-button size="lg" block variant="danger" @click="deleteFleet">Clear my fleet</b-button>
    </div>
</template>

<script>
import axios from 'axios';
import Config from '@config/config.json';

export default {
    name: 'DeleteMyFleetModal',
    data() {
        return {
            deleteFleetErrorMessage: null,
        };
    },
    methods: {
        async deleteFleet() {
            try {
                this.deleteFleetErrorMessage = null;
                await axios.post(`${Config.api_base_url}/api/my-fleet/delete-all`, {}, {
                    headers: {
                        Authorization: `Bearer ${this.$store.state.accessToken}`,
                    },
                });
                this.$emit('newDeleteFleet');
            } catch (err) {
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    this.$toastr.e('You have been disconnected. Please login again.');
                    this.$router.push({ name: 'Home' });
                    return;
                }
                if (err.response && err.response.data.error) {
                    this.deleteFleetErrorMessage = err.response.data.errorMessage;
                    return;
                }
                console.error(err);
                this.deleteFleetErrorMessage = 'Sorry, we are unable to clear your fleet for the moment. Please, try again later.';
            }
        },
    }
};
</script>
