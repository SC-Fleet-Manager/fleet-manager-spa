<template>
    <b-col sm="6" md="4" lg="3" xl="2">
        <div class="card">
            <div class="mb-0 p2 text-center border-bottom footer-orga-card">
                <p class="mb-0">{{ orga.name }}</p>
                <p class="mb-0">[{{ orga.sid }}]</p>
            </div>
            <div class="position-relative placeholder-orga">
                <div class="aspect-ratio-box" :style="stylePictureShip" />
            </div>
            <b-button v-if="member && !joined" @click="unjoin" class="button-join-orga" block variant="warning" size="lg" style="border-top-left-radius: 0; border-top-right-radius: 0;"><i class="fas fa-times"></i>Cancel</b-button>
            <b-button v-else-if="member && joined" class="button-join-orga" block disabled variant="secondary" size="lg" style="border-top-left-radius: 0; border-top-right-radius: 0; opacity: 1;">Member</b-button>
            <b-button v-else-if="!member" @click="join" class="button-join-orga" block variant="primary" size="lg" style="border-top-left-radius: 0; border-top-right-radius: 0;"><i class="fas fa-door-open"></i>Join</b-button>
        </div>
        <b-modal id="modal-create-handle" ref="modalCreateHandle" size="lg" centered title="Create your Handle" hide-footer>
            <b-alert variant="info" show>
                In order <strong>to join</strong> an organization, please <strong>create your Handle</strong> (letters and digits only).<br/>
                It is <strong>unique</strong> and will be displayed to the organization's founder <strong>to verify your identity</strong>.<br/>
                Don't worry, <strong>you can change it at anytime</strong>.
            </b-alert>
            <ChangeHandleForm>
                <template v-slot:title>Create my handle</template>
                <template v-slot:submit-content><i class="fa fa-check"></i> Create & Join</template>
            </ChangeHandleForm>
        </b-modal>
    </b-col>
</template>

<script>
    import axios from "axios";
    import Config from '@config/config.json';
    import ChangeHandleForm from "./ChangeHandleForm";
    import {mapState} from 'vuex';

    export default {
        name: 'OrgaCard',
        components: {ChangeHandleForm},
        props: ['orga', 'member', 'joined'],
        data() {
            return {
                tryToJoin: false,
            };
        },
        computed: {
            ...mapState(['profile']),
            stylePictureShip() {
                if (this.orga.logoUrl !== null) {
                    return `background-image: url(${this.orga.logoUrl}); background-color:#fff`;
                }
                return '';
            },
        },
        watch: {
            profile(newValue) {
                if (this.tryToJoin && newValue.handle) {
                    this.$refs.modalCreateHandle.hide();
                    this.join();
                }
            },
        },
        methods: {
            async join() {
                try {
                    this.tryToJoin = true;
                    await axios.post(`${Config.api_base_url}/api/organizations/${this.orga.id}/join`, {}, {
                        headers: {
                            Authorization: `Bearer ${this.$store.state.accessToken}`,
                        },
                    });
                    this.tryToJoin = false;
                    this.$emit('join', this.orga);
                } catch (err) {
                    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                        this.$toastr.e('You have been disconnected. Please login again.');
                        this.$router.push({ name: 'Home' });
                        return;
                    }
                    if (err.response.status === 400) {
                        if (err.response.data.error === 'no_member_handle') {
                            this.$refs.modalCreateHandle.show();
                            return;
                        }
                        this.$toastr.e(err.response.data.errorMessage);
                        return;
                    }
                    this.$toastr.e('Sorry, you cannot join this organization for the moment. Please, try again later.');
                }
            },
            async unjoin() {
                try {
                    await axios.post(`${Config.api_base_url}/api/organizations/${this.orga.id}/unjoin`, {}, {
                        headers: {
                            Authorization: `Bearer ${this.$store.state.accessToken}`,
                        },
                    });
                    this.$emit('unjoin', this.orga);
                } catch (err) {
                    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                        this.$toastr.e('You have been disconnected. Please login again.');
                        this.$router.push({ name: 'Home' });
                        return;
                    }
                    if (err.response.status === 400) {
                        this.$toastr.e(err.response.data.errorMessage);
                    }
                }
            },
        },
    }
</script>

<style lang="scss" scoped>
@import '~@styles/orga_card';

</style>
