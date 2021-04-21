<template>
    <b-col sm="6" md="4" lg="3" xl="2">
        <div class="card">
            <div class="mb-0 py-2 px-2 text-center border-bottom footer-orga-card">
                {{ orga.name }}
            </div>
            <div class="position-relative placeholder-orga">
                <div class="aspect-ratio-box" :style="stylePictureShip" />
            </div>
            <b-button v-if="member && !joined" @click="unjoin" class="button-join-orga" block variant="warning" size="lg" style="border-top-left-radius: 0; border-top-right-radius: 0;"><i class="fas fa-times"></i>Cancel</b-button>
            <b-button v-else-if="member && joined" class="button-join-orga" block disabled variant="secondary" size="lg" style="border-top-left-radius: 0; border-top-right-radius: 0; opacity: 1;">Member</b-button>
            <b-button v-else-if="!member" @click="join" class="button-join-orga" block variant="primary" size="lg" style="border-top-left-radius: 0; border-top-right-radius: 0;"><i class="fas fa-door-open"></i>Join</b-button>
        </div>
    </b-col>
</template>

<script>
    import axios from "axios";
    import Config from '@config/config.json';

    export default {
        name: 'OrgaCard',
        props: ['orga', 'member', 'joined'],
        data() {
            return {
            };
        },
        created() {
        },
        methods: {
            async join() {
                try {
                    await axios.post(`${Config.api_base_url}/api/organizations/${this.orga.id}/join`, {}, {
                        headers: {
                            Authorization: `Bearer ${this.$store.state.accessToken}`,
                        },
                    });
                    this.$emit('join', this.orga);
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
            async unjoin() {
                try {
                    await axios.post(`${Config.api_base_url}/api/organizations/${this.orga.id}/unjoin`, {}, {
                        headers: {
                            Authorization: `Bearer ${this.$store.state.accessToken}`,
                        },
                    });
                    this.$emit('unJoin', this.orga);
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
        computed: {
            stylePictureShip() {
                if (this.orga.logoUrl !== null) {
                    return `background-image: url(${this.orga.logoUrl}); background-color:#fff`;
                }
                return '';
            },
        },
    }
</script>

<style lang="scss" scoped>
@import '~@styles/orga_card';

</style>
