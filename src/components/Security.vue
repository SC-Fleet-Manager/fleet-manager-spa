<template>
    <b-card header="Security">
        <b-row>
            <b-col col xl="6" lg="12" class="mb-3">
                <h5 class="mb-3">Danger section</h5>
                <b-button size="lg" block variant="danger" v-b-modal.modal-delete-account>Delete my account and my data</b-button>
                <b-modal id="modal-delete-account" ref="modalDeleteAccount" size="lg" centered title="Delete my account and my data" hide-footer>
                    <b-alert variant="warning" :show="true"><i class="fa fa-exclamation-triangle"></i> You are about to delete your account and all your data.
                        This can not be cancelled.<br />Are you sure you want to confirm?
                    </b-alert>
                    <b-alert v-if="deleteAccountErrorMessage !== null" variant="danger" show v-html="deleteAccountErrorMessage"></b-alert>
                    <b-button size="lg" block variant="danger" @click="deleteAccount">Delete my account</b-button>
                </b-modal>
            </b-col>
        </b-row>
    </b-card>
</template>
<script>
import axios from 'axios';
import Config from '@config/config.json';

export default {
    name: 'Security',
    data() {
        return {
            deleteAccountErrorMessage: null,
            submitDisabled: false,
        };
    },
    methods: {
        async deleteAccount() {
            try {
                this.deleteAccountErrorMessage = null;
                await axios.post(`${Config.api_base_url}/api/profile/delete-account`, {}, {
                    headers: {
                        Authorization: `Bearer ${this.$store.state.accessToken}`,
                    },
                });
                this.$auth.logout({
                    returnTo: window.location.origin
                });
            } catch (err) {
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    this.$router.push({ name: 'Home' });
                    return;
                }
                console.error(err);
                const subject = `Delete my account ${this.$store.state.profile.id}`;
                const body = `Hello,

Please can you delete my account with all my data?
User id : ${this.$store.state.profile.id}
Auth0 username : ${this.$store.state.profile.auth0Username}

Best regards,
${this.$store.state.profile.nickname}`;
                this.deleteAccountErrorMessage = `Sorry, we are unable to delete your account for the moment.<br/><a href='mailto:fleet-manager@protonmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}'>Please send us an email at fleet-manager@protonmail.com.</a>`;
            }
        }
    }
};
</script>
