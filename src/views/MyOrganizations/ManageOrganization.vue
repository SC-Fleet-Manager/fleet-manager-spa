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

            <div v-else>
                <b-row v-if="orga !== null">
                    <b-col md="6" class="mb-4">
                        <ManageMembers :orga="orga" />
                    </b-col>
                    <b-col md="6" class="mb-4">
                        <EditOrga :orga="orga" />
                    </b-col>
                    <b-col md="6" class="mb-4">
                        <ManageCandidates :orga="orga" />
                    </b-col>
                </b-row>
                <b-row>
                    <b-col col lg="6" xl="3" class="mb-4">
                        <h3 class="mb-3">Danger section</h3>
                        <b-button block variant="danger" v-b-modal.modal-disband-organization>Disband organization</b-button>
                        <b-modal id="modal-disband-organization" ref="modalDisbandOrganization" size="lg" centered title="Disband organization" hide-footer>
                            <b-alert variant="warning" :show="true"><i class="fa fa-exclamation-triangle"></i> You are about to disband your organization.<br/>
                                <strong>All the data</strong> related to the organization <strong>will be deleted</strong>.<br/>
                                Personal ships of members will <strong>not</strong> be deleted.<br/>
                                Are you sure you want to confirm?
                            </b-alert>
                            <b-alert v-if="disbandErrorMessage !== null" variant="danger" show v-html="disbandErrorMessage"></b-alert>
                            <b-button v-else size="lg" block variant="danger" @click="disbandOrga">Disband organization</b-button>
                        </b-modal>
                    </b-col>
                </b-row>
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
            orga: null,
            disbandErrorMessage: null,
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
            if (this.orga === null) {
                this.$toastr.e('Sorry, you are not a member of this organization.');
                this.$router.push({ name: 'My organizations' });
                return;
            }
        },
        async disbandOrga() {
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
                if (err.response && err.response.data.error) {
                    this.disbandErrorMessage = err.response.data.errorMessage;
                    return;
                }
                console.log(err);
                this.$toastr.e('Sorry, we are unable to decline candidate for the moment. Please, try again later.');
            }
        },
        disband() {
            this.$refs.modalDisbandOrganization.show();
        }
    }
}
</script>
