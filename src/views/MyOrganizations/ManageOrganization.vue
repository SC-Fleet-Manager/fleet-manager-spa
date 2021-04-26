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
                        text: orga !== null ? orga.name : $route.params.sid,
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
                    <ManageMembers :listOfMembers="listOfMembers" :orga="orga" :onKickMember="onKickMember" @onKickMember="onKickMember"/>
                    <EditOrga :orga="orga"/>
                    <ManageCandidates :listOfCandidates="listOfCandidates" :orga="orga" @onAcceptCandidate="onAcceptCandidate" @onDeclineCandidate="onDeclineCandidate"/>
                </div>
                <h5 class="disband-button" @click="disband">Disband organization</h5>
                <b-modal id="modal-disband-organization" ref="modalDisbandOrganization" size="lg" centered title="Disband organization" hide-footer>
                    <b-alert variant="warning" :show="true"><i class="fa fa-exclamation-triangle"></i> You are about to disband your organization.
                        <br />Are you sure you want to confirm?
                    </b-alert>
                    <b-alert v-if="disbandOrgnaizationErrorMessage !== null" variant="danger" show v-html="disbandOrgnaizationErrorMessage"></b-alert>
                    <b-button v-else size="lg" block variant="danger" @click="disbandOrga">Disband organization</b-button>
                </b-modal>
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
import {mapState} from "vuex";
const localeIndexOf = exported(Intl);
import bus from '@/bus';

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
            disbandOrgnaizationErrorMessage: null,
        };
    },
    created() {
        if (this.myOrgasList !== null) {
            this.listOfOrgasLoaded = true;
            this.loadCurrentOrganization();
        }
    },
    computed: {
        ...mapState(['myOrgasList']),
    },
    watch: {
        myOrgasList() {
            this.listOfOrgasLoaded = true;
            this.loadCurrentOrganization();
        },
    },
    methods: {
        loadCurrentOrganization() {
            for (const orga of this.$store.state.myOrgasList) {
                if (orga.sid.toLowerCase() === this.$route.params.sid.toLowerCase()) {
                    this.orga = orga;
                    break;
                }
            }
            this.loadListOfMembers();
            this.loadListOfCandidates();
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
            this.loadListOfMembers();
        },
        onDeclineCandidate(){
            this.$toastr.s('Candidate declined');
            this.loadListOfCandidates();
        },
        onKickMember(){
            this.$toastr.s('Member kicked');
            this.loadListOfMembers();
        },
        async disbandOrga(){
            try {
                await axios.post(`${Config.api_base_url}/api/organizations/manage/${this.orga.id}/disband`, {}, {
                    headers: {
                        Authorization: `Bearer ${this.$store.state.accessToken}`,
                    },
                });
                this.$toastr.s('Organization disband');
                this.$router.push({ name: 'My organizations' });
                bus.$emit('updateMyOrganizations');
            } catch (err) {
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    this.$toastr.e('You have been disconnected. Please login again.');
                    this.$router.push({ name: 'Home' });
                    return;
                }
                this.$toastr.e('Sorry, we are unable to decline candidate for the moment. Please, try again later.');
            }
        },
        disband(){
            this.$refs.modalDisbandOrganization.show();
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@styles/style.scss';

.disband-button {
    cursor: pointer;
    color: $danger;
}

</style>
