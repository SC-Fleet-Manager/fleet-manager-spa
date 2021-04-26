<template>
    <div>
        <h3>Candidates</h3>
        <b-alert v-if="errorMessage !== null" show variant="danger">{{ errorMessage }}</b-alert>
        <div v-if="!listOfCandidatesLoaded" class="d-flex justify-content-center">
            <b-spinner label="Loading..." style="width: 3rem; height: 3rem;"></b-spinner>
        </div>
        <template v-else>
            <b-alert v-if="listOfCandidates.length === 0" show variant="info">No pending candidates</b-alert>
            <b-list-group v-else style="height: 400px; overflow: auto;" id="toto">
                <b-list-group-item v-for="candidate in listOfCandidates" :key="candidate.id" class="d-flex justify-content-between">
                   {{ fullName(candidate) }}
                    <div>
                        <span title="Accept" class="accept-candidate mr-2" @click="accept(candidate)"><i class="fas fa-check"></i></span>
                        <span title="Decline" class="remove-candidate" @click="decline(candidate)"><i class="fas fa-times"></i></span>
                    </div>
                </b-list-group-item>
            </b-list-group>
        </template>
        <b-modal id="modal-accept-candidate" ref="modalAcceptCandidate" size="lg" centered :title="'Accept candidate ' + (acceptingCandidate ? fullName(acceptingCandidate) : '')" hide-footer>
            <template v-if="acceptingCandidate !== null">
                <b-alert variant="warning" :show="true"><i class="fa fa-exclamation-triangle"></i> You are about to accept the candidate.
                    <br />Are you sure you want to accept {{ fullName(acceptingCandidate) }}?
                </b-alert>
                <b-alert v-if="acceptCandidateErrorMessage !== null" variant="danger" show v-html="acceptCandidateErrorMessage"></b-alert>
                <b-button v-else size="lg" block variant="success" @click="acceptCandidate(acceptingCandidate)">Accept candidate</b-button>
            </template>
        </b-modal>
        <b-modal id="modal-decline-candidate" ref="modalDeclineCandidate" size="lg" centered :title="'Decline candidate ' + (decliningCandidate ? fullName(decliningCandidate) : '')" hide-footer>
            <template v-if="decliningCandidate !== null">
                <b-alert variant="warning" :show="true"><i class="fa fa-exclamation-triangle"></i> You are about to decline a member.
                    <br />Are you sure you want to decline {{ fullName(decliningCandidate) }}?
                </b-alert>
                <b-alert v-if="declineCandidateErrorMessage !== null" variant="danger" show v-html="declineCandidateErrorMessage"></b-alert>
                <b-button v-else size="lg" block variant="danger" @click="declineCandidate(decliningCandidate)">Decline candidate</b-button>
            </template>
        </b-modal>
    </div>
</template>

<script>
import axios from "axios";
import Config from '@config/config.json';
import bus from '@/bus';

export default {
    name: "ManageCandidates",
    props: ['orga'],
    data() {
        return {
            errorMessage: null,
            acceptCandidateErrorMessage: null,
            declineCandidateErrorMessage: null,
            acceptingCandidate: null,
            decliningCandidate: null,
            listOfCandidatesLoaded: false,
            listOfCandidates: [],
        };
    },
    created() {
        this.loadListOfCandidates();
    },
    methods: {
        fullName(member) {
            return member.handle + (member.nickname ? ` aka ${member.nickname}` : '');
        },
        async loadListOfCandidates() {
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
                if (err.response && err.response.data.error) {
                    this.errorMessage = err.response.data.errorMessage;
                    return;
                }
                this.errorMessage = 'Sorry, we are unable to retrieve the candidates. Please, try again later.';
            } finally {
                this.listOfCandidatesLoaded = true;
            }
        },
        async acceptCandidate(candidate) {
            try {
                await axios.post(`${Config.api_base_url}/api/organizations/manage/${this.orga.id}/accept-candidate/${candidate.id}`, {}, {
                    headers: {
                        Authorization: `Bearer ${this.$store.state.accessToken}`,
                    },
                });
                this.onAcceptCandidate(candidate);
            } catch (err) {
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    this.$toastr.e('You have been disconnected. Please login again.');
                    this.$router.push({ name: 'Home' });
                    return;
                }
                if (err.response && err.response.data.error) {
                    this.acceptCandidateErrorMessage = err.response.data.errorMessage;
                    return;
                }
                console.error(err);
                this.acceptCandidateErrorMessage = 'Sorry, we are unable to accept members for the moment. Please, try again later.';
            }
        },
        async declineCandidate(candidate) {
            try {
                await axios.post(`${Config.api_base_url}/api/organizations/manage/${this.orga.id}/decline-candidate/${candidate.id}`, {}, {
                    headers: {
                        Authorization: `Bearer ${this.$store.state.accessToken}`,
                    },
                });
                this.onDeclineCandidate(candidate);
            } catch (err) {
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    this.$toastr.e('You have been disconnected. Please login again.');
                    this.$router.push({ name: 'Home' });
                    return;
                }
                if (err.response && err.response.data.error) {
                    this.declineCandidateErrorMessage = err.response.data.errorMessage;
                    return;
                }
                console.error(err);
                this.declineCandidateErrorMessage = 'Sorry, we are unable to decline candidates for the moment. Please, try again later.';
            }
        },
        accept(member) {
            this.acceptingCandidate = member;
            this.$refs.modalAcceptCandidate.show();
        },
        decline(member) {
            this.decliningCandidate = member;
            this.$refs.modalDeclineCandidate.show();
        },
        onAcceptCandidate(candidate) {
            this.loadListOfCandidates();
            this.$toastr.s('Candidate accepted.');
            this.$refs.modalAcceptCandidate.hide();
            bus.$emit('acceptCandidate', candidate);
        },
        onDeclineCandidate() {
            this.loadListOfCandidates();
            this.$toastr.s('Candidate declined');
            this.$refs.modalDeclineCandidate.hide();
        },
    }
}
</script>

<style lang="scss" scoped>
@import '~@styles/style.scss';

.remove-candidate, .accept-candidate {
    cursor: pointer;
}
.accept-candidate{
    color: $success;
}
.remove-candidate{
    color: $danger;
}
</style>
