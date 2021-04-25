<template>
    <div class="animated fadeIn">
        <b-card>
            <div class="btn-actions-orga d-flex justify-content-end align-items-baseline flex-wrap flex-sm-nowrap">
                <b-breadcrumb class="mb-3" style="flex-grow:1;" :items="[
                    {
                        text: 'My organizations',
                        to: { name: 'My organizations' },
                    },
                    {
                        text: `Organization ${orga !== null ? orga.name : $route.params.sid}`,
                        to: { path: `/my-organizations/${$route.params.sid}` },
                    },
                    {
                        text: `Manage`,
                        active: true,
                    },
                ]"></b-breadcrumb>
            </div>
            <b-alert v-if="errorMessage !== null" show variant="danger">{{ errorMessage }}</b-alert>
            <div v-if="!listOfCandidatesLoaded" class="d-flex justify-content-center">
                <b-spinner label="Loading..." style="width: 3rem; height: 3rem;"></b-spinner>
            </div>
            <div v-else>
                <div class="d-flex flex-column-reverse flex-md-row flex-wrap">
                    <ManageMembers :listOfMembers="listOfMembers" :orga="orga" :onKickMember="onKickMember"/>
                    <EditOrga :orga="orga"/>
                    <ManageCandidates :listOfCandidates="listOfCandidates" :orga="orga" @onAcceptCandidate="onAcceptCandidate" @onDeclineCandidate="onDeclineCandidate"/>
                </div>
                <h4 class="text-danger" @click="disbandOrga">Disband organization</h4>
            </div>
        </b-card>
    </div>
</template>

<script>
import axios from 'axios';
import Config from '@config/config.json';
import EditOrga from '@/components/EditOrga';
import exported from 'locale-index-of';
import ManageMembers from "@/components/ManageMembers";
import ManageCandidates from "@/components/ManageCandidates";
const localeIndexOf = exported(Intl);

export default {
    name: 'ManageOrganization',
    components: {ManageCandidates, ManageMembers, EditOrga},
    data() {
        return {
            //TODO: Search member
            form: {
                search: null,
            },
            errorMessage: null,
            listOfCandidatesLoaded: false,
            listOfMembersLoaded: false,
            listOfMembers: [],
            listOfCandidates: [],
            orga: null,
        };
    },
    async created() {
        if (this.$store.state.myOrgasList === null) {
            await this.loadOrgaList();
        } else {
            this.listOfOrgasLoaded = true;
        }
        this.loadCurrentOrganization();
        this.loadListOfMembers();
        this.loadListOfCandidates();
    },
    methods: {
        async loadOrgaList() {
            try {
                this.errorMessage = null;
                const response = await axios.get(`${Config.api_base_url}/api/my-organizations`, {
                    headers: {
                        Authorization: `Bearer ${this.$store.state.accessToken}`,
                    },
                });
                this.$store.commit('myOrgasList', response.data.organizations);
            } catch (err) {
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    this.$toastr.e('You have been disconnected. Please login again.');
                    this.$router.push({ name: 'Home' });
                    return;
                }
                this.errorMessage = 'Sorry, we are unable to retrieve this organization. Please, try again later.';
            } finally {
                this.listOfOrgasLoaded = true;
            }
        },
        loadCurrentOrganization() {
            for (const orga of this.$store.state.myOrgasList) {
                if (orga.sid.toLowerCase() === this.$route.params.sid.toLowerCase()) {
                    this.orga = orga;
                    break;
                }
            }
        },
        async loadListOfMembers(){
            try {
                this.errorMessage = null;
                const response = await axios.get(`${Config.api_base_url}/api/organizations/manage/${this.orga.id}/members`, {
                    headers: {
                        Authorization: `Bearer ${this.$store.state.accessToken}`,
                    },
                });
                this.listOfMembers = response.data.members;
            } catch (err) {
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    this.$toastr.e('You have been disconnected. Please login again.');
                    this.$router.push({ name: 'Home' });
                    return;
                }
                this.errorMessage = 'Sorry, we are unable to retrieve your organizations. Please, try again later.';
            } finally {
                this.listOfMembersLoaded = true;
            }
        },
        async loadListOfCandidates(){
            try {
                this.errorMessage = null;
                const response = await axios.get(`${Config.api_base_url}/api/organizations/manage/${this.orga.id}/candidates`, {
                    headers: {
                        Authorization: `Bearer ${this.$store.state.accessToken}`,
                    },
                });
                this.listOfCandidates = response.data.candidates;
            } catch (err) {
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    this.$toastr.e('You have been disconnected. Please login again.');
                    this.$router.push({ name: 'Home' });
                    return;
                }
                this.errorMessage = 'Sorry, we are unable to retrieve your organizations. Please, try again later.';
            } finally {
                this.listOfCandidatesLoaded = true;
            }
        },
        onAcceptCandidate(){
            this.$toastr.s('Candidate accepted.');
            this.loadListOfCandidates();
        },
        onDeclineCandidate(){
            this.$toastr.s('Candidate declined');
            this.loadListOfCandidates();
        },
        onKickMember(){
            this.$toastr.s('Member kicked');
            this.loadListOfMembers();
        },
        disbandOrga(){
            console.log('disband')
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@styles/style.scss';

</style>
