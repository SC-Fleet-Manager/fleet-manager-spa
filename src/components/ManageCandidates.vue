<template>
    <div>
        <h3>Candidate list</h3>
        <p v-if="listOfCandidates.length == 0">No candidates</p>
        <b-list-group v-else style="height: 400px; overflow: auto;">
            <b-list-group-item v-for="candidate in listOfCandidates" :key="candidate.id" class="d-flex justify-content-between">
                {{ candidate.handle }}
                <template v-if="candidate.nickname !== null">
                    aka {{ candidate.nickname}}
                </template>
                <div>
                    <span class="accept-candidate mr-2" @click="accept(candidate.id)"><i class="fas fa-check"></i></span>
                    <span class="remove-candidate" @click="decline(candidate.id)"><i class="fas fa-times"></i></span>
                </div>
            </b-list-group-item>
        </b-list-group>
        <b-modal id="modal-accept-candidate" ref="modalAcceptCandidate" size="lg" centered title="Accept Candidate" hide-footer>
            <b-alert variant="warning" :show="true"><i class="fa fa-exclamation-triangle"></i> You are about to accept the candidate.
                <br />Are you sure you want to confirm?
            </b-alert>
            <b-alert v-if="acceptCandidateErrorMessage !== null" variant="danger" show v-html="acceptCandidateErrorMessage"></b-alert>
            <b-button v-else size="lg" block variant="success" @click="acceptCandidate(acceptCandidateId)">Accept candidate</b-button>
        </b-modal>
        <b-modal id="modal-decline-candidate" ref="modalDeclineCandidate" size="lg" centered title="Decline Candidate" hide-footer>
            <b-alert variant="warning" :show="true"><i class="fa fa-exclamation-triangle"></i> You are about to decline a member.
                <br />Are you sure you want to confirm?
            </b-alert>
            <b-alert v-if="declineCandidateErrorMessage !== null" variant="danger" show v-html="declineCandidateErrorMessage"></b-alert>
            <b-button v-else size="lg" block variant="danger" @click="declineCandidate(declineCandidateId)">Decline candidate</b-button>
        </b-modal>
    </div>
</template>

<script>
import axios from "axios";
import Config from '@config/config.json';

export default {
    name: "ManageCandidates.vue",
    props: ['listOfCandidates', 'orga'],
    data() {
        return {
            acceptCandidateErrorMessage: null,
            acceptCandidateId: null,
            declineCandidateErrorMessage: null,
            declineCandidateId: null,
        }
    },
    methods: {
        async acceptCandidate(candidateId){
            try {
                await axios.post(`${Config.api_base_url}/api/organizations/manage/${this.orga.id}/accept-candidate/${candidateId}`, {}, {
                    headers: {
                        Authorization: `Bearer ${this.$store.state.accessToken}`,
                    },
                });
                this.onAcceptCandidate();
            } catch (err) {
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    this.$toastr.e('You have been disconnected. Please login again.');
                    this.$router.push({ name: 'Home' });
                    return;
                }
                this.$toastr.e('Sorry, we are unable to accept candidate for the moment. Please, try again later.');
            }
        },
        accept(memberId) {
            this.acceptCandidateId = memberId;
            this.$refs.modalAcceptCandidate.show();
        },
        onAcceptCandidate() {
            this.$refs.modalAcceptCandidate.hide();
            this.$emit('onAcceptCandidate');
        },
        async declineCandidate(candidateId) {
            try {
                await axios.post(`${Config.api_base_url}/api/organizations/manage/${this.orga.id}/decline-candidate/${candidateId}`, {}, {
                    headers: {
                        Authorization: `Bearer ${this.$store.state.accessToken}`,
                    },
                });
                this.onDeclineCandidate();
            } catch (err) {
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    this.$toastr.e('You have been disconnected. Please login again.');
                    this.$router.push({ name: 'Home' });
                    return;
                }
                this.$toastr.e('Sorry, we are unable to decline candidate for the moment. Please, try again later.');
            }
        },
        decline(memberId) {
            this.declineCandidateId = memberId;
            this.$refs.modalDeclineCandidate.show();
        },
        onDeclineCandidate() {
            this.$refs.modalDeclineCandidate.hide();
            this.$emit('onDeclineCandidate');
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
