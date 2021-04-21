<template>
    <b-col sm="6" md="4" lg="3" xl="2">
        <div class="card">
            <div class="mb-0 py-2 px-2 text-center border-bottom footer-orga-card">
                {{ orga.name }}
            </div>
            <div class="position-relative placeholder-orga">
                <div class="aspect-ratio-box" :style="stylePictureShip" />
            </div>
            <b-button v-if="!orga.joined" @click="onUnJoin" class="button-join-orga" block variant="warning" size="lg" style="border-top-left-radius: 0; border-top-right-radius: 0;"><i class="fas fa-times"></i>Cancel</b-button>
        </div>
    </b-col>
</template>

<script>
    import axios from "axios";
    import Config from '@config/config.json';

    export default {
        name: 'MyOrgaCard',
        props: ['orga'],
        data() {
            return {
            };
        },
        computed: {
            stylePictureShip() {
                if (this.orga.logoUrl !== null) {
                    return `background-image: url(${this.orga.logoUrl}); background-color:#fff`
                }
                return '';
            },
        },
        methods: {
            async onUnJoin() {
                try {
                    await axios.post(`${Config.api_base_url}/api/organizations/${this.orga.id}/unjoin`, {}, {
                        headers: {
                            Authorization: `Bearer ${this.$store.state.accessToken}`,
                        },
                    });
                    this.$emit('unJoin');
                } catch (err) {
                    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                        this.$toastr.e('You have been disconnected. Please login again.');
                        this.$router.push({ name: 'Home' });
                        return;
                    }
                    if (err.response.status === 400) {
                        this.$toastr.e(err.response.userMessage);
                    }
                }
            },
        },
    }
</script>

<style lang="scss" scoped>
@import '~@styles/orga_card';

</style>
