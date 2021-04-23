<template>
    <div class="animated fadeIn">
        <b-card>
            <b-breadcrumb :items="[
                {
                    text: 'My organizations',
                    to: {name: 'My organizations'},
                },
                {
                    text: 'Join an organization',
                    active: true,
                },
            ]"></b-breadcrumb>
            <div class="mb-4 search-bar-wrapper">
                <b-input-group>
                    <template #prepend>
                        <b-input-group-text style="background-color: white;">
                            <i v-if="searching" class="fas fa-circle-notch fa-spin"></i>
                            <i v-else class="fa fa-search"></i>
                        </b-input-group-text>
                    </template>
                    <b-form-input v-model="form.search" type="search" debounce="500" :trim="true" placeholder="Search an organization"></b-form-input>
                </b-input-group>
            </div>
            <div v-if="!listOfOrgasLoaded" class="d-flex justify-content-center">
                <b-spinner label="Loading..." style="width: 3rem; height: 3rem;"></b-spinner>
            </div>
            <div v-else>
                <b-row cols-lg="mt-3">
                    <OrgaCard v-for="orga in listOfOrgas" :key="orga.id" :orga="orga" :member="isMember(orga)" :joined="hasJoined(orga)" @join="onJoin" @unjoin="onUnjoin" />
                </b-row>
            </div>
        </b-card>
    </div>
</template>

<script>
import axios from 'axios';
import Config from '@config/config.json';
import OrgaCard from '@/components/OrgaCard.vue';
import bus from '@/bus';
import {mapState} from "vuex";

export default {
    name: 'organizations',
    components: {OrgaCard},
    data() {
        return {
            form: {
                search: null,
            },
            searching: false,
            listOfOrgasLoaded: false,
            listOfOrgas: [],
            orgasJoinedStatuses: {},
            nextUrl: null,
        };
    },
    async created() {
        bus.$on('infinite-scroll-load-more', this.loadMore);
        await this.loadOrgaList();
        if (this.$store.state.myOrgasList !== null) {
            for (const myOrga of this.$store.state.myOrgasList) {
                this.$set(this.orgasJoinedStatuses, myOrga.id, myOrga.joined);
            }
        }
    },
    computed: {
        ...mapState(['myOrgasList']),
        hasAnyOrga() {
            return this.listOfOrgas.length === 0;
        },
    },
    watch: {
        'form.search'(newValue) {
            if (!newValue || newValue.length >= 2) {
                this.loadOrgaList(newValue);
            }
        },
        myOrgasList(newValue) {
            this.orgasJoinedStatuses = {};
            for (const myOrga of newValue) {
                this.$set(this.orgasJoinedStatuses, myOrga.id, myOrga.joined);
            }
        },
    },
    methods: {
        isMember(orga) {
            return this.orgasJoinedStatuses[orga.id] !== undefined;
        },
        hasJoined(orga) {
            return this.orgasJoinedStatuses[orga.id];
        },
        async loadOrgaList(searchQuery) {
            try {
                this.errorMessage = null;
                this.searching = searchQuery && searchQuery.length > 0;
                const response = await axios.get(`${Config.api_base_url}/api/organizations`, {
                    params: {
                        search: searchQuery || null,
                    },
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
                this.searching = false;
            }
        },
        async loadMore() {
            if(this.nextUrl === null) return;
            try {
                this.$store.commit('infiniteScrollDisabled', true);
                const response = await axios.get(this.nextUrl, {
                    params: {
                        search: this.form.search && this.form.search.length >= 2 ? this.form.search : null,
                    },
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
        },
        onJoin(orga) {
            bus.$emit('updateMyOrganizations');
        },
        onUnjoin(orga) {
            bus.$emit('updateMyOrganizations');
        },
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
