<template>
    <div class="animated fadeIn">
        <b-card>
            <b-card-body>
                <b-breadcrumb :items="[
                    {
                        text: 'My organizations',
                        to: {name: 'My organizations'}
                    },
                    {
                        text: 'Join an orga',
                        active: true
                    }
                ]"></b-breadcrumb>
                <div class="mb-3 search-bar-wrapper">
                    <b-input-group>
                        <template #prepend>
                            <b-input-group-text style="background-color: white;"><i class="fa fa-search"></i></b-input-group-text>
                        </template>
                        <b-form-input v-model="form.search" type="search" debounce="100" :trim="true" placeholder="Search an organization"></b-form-input>
                    </b-input-group>
                </div>
                <div v-if="!listOfOrgasLoaded" class="d-flex justify-content-center">
                    <b-spinner label="Loading..." style="width: 3rem; height: 3rem;"></b-spinner>
                </div>
                <div v-else>
                    <b-row cols-lg="mt-3">
                        <OrgaCard v-for="orga in listOfOrgas" :key="orga.id" :orga="orga"/>
                    </b-row>
                </div>
            </b-card-body>
        </b-card>
    </div>
</template>

<script>
import axios from 'axios';
import Config from '@config/config.json';
import OrgaCard from '@/components/OrgaCard.vue';
import bus from '@/bus';

export default {
    name: 'organizations',
    components: {OrgaCard},
    data() {
        return {
            form: {
                search: null,
            },
            listOfOrgasLoaded: true,
            listOfOrgas: [],
            nextUrl: null,
        };
    },
    created() {
        this.loadOrgaList();
        bus.$on('infinite-scroll-load-more', this.loadMore);
    },
    computed: {
        hasAnyOrga() {
            return this.listOfOrgas.length === 0;
        },
    },
    methods: {
        async loadOrgaList() {
            try {
                this.errorMessage = null;
                const response = await axios.get(`${Config.api_base_url}/api/organizations`, {
                    headers: {
                        Authorization: `Bearer ${this.$store.state.accessToken}`,
                    },
                });
                this.listOfOrgas = response.data.organizations;
                this.nextUrl = response.data.nextUrl;
            } catch (err) {
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    this.$toastr.e('You have been disconnected. Please login again.');
                    this.$router.push({ name: 'Home' });
                    return;
                }
                this.errorMessage = 'Sorry, we are unable to retrieve the available organizations. Please, try again later.';
            } finally {
                this.listOfOrgasLoaded = true;
            }
        },
        async loadMore() {
            if(this.nextUrl === null) return;
            try {
                this.$store.commit('infiniteScrollDisabled', true);
                const response = await axios.get(this.nextUrl, {
                    headers: {
                        Authorization: `Bearer ${this.$store.state.accessToken}`,
                    },
                });
                for(const orga of response.data.organizations) {
                    this.listOfOrgas.push(orga);
                }
                this.nextUrl = response.data.nextUrl;
            } catch (err) {
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    this.$toastr.e('You have been disconnected. Please login again.');
                    this.$router.push({ name: 'Home' });
                    return;
                }
            } finally {
                this.$store.commit('infiniteScrollDisabled', false);
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@styles/style.scss';

.search-bar-wrapper {
    max-width: 100%;
    & .input-group {
        width: 250px;
        max-width: 100%;
        @include media-breakpoint-down(sm) {
            width: 100%
        }
    }
}

</style>
