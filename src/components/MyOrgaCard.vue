<template>
    <b-col sm="6" md="4" lg="3" xl="2">
        <div class="card">
            <router-link v-if="orga.joined" :to="'/my-organizations/'+orga.sid" style="text-decoration: none;">
                <MyOrgaCardInner :orga="orga" :unjoin="unjoin" />
            </router-link>
            <MyOrgaCardInner v-else :orga="orga" :unjoin="unjoin" />
        </div>
    </b-col>
</template>

<script>
    import axios from "axios";
    import Config from '@config/config.json';
    import MyOrgaCardInner from '@/components/MyOrgaCardInner.vue';

    export default {
        name: 'MyOrgaCard',
        props: ['orga'],
        components: {MyOrgaCardInner},
        data() {
            return {
            };
        },
        methods: {
            async unjoin() {
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
