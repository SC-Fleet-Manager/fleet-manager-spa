<template>
    <b-card class="col-md-6" style="border: none">
        <h3>Candidate list</h3>
        <p v-if="listOfCandidates.length == 0">No candidates</p>
        <b-list-group v-else style="height: 400px; overflow: auto;">
            <b-list-group-item v-for="candidate in listOfCandidates" :key="candidate.id" class="d-flex justify-content-between">
                {{ candidate.nickname }}
                <div>
                    <span class="accept-candidate mr-2" @click="acceptCandidate(candidate.id)"><i class="fas fa-check"></i></span>
                    <span class="remove-candidate" @click="declineCandidate(candidate.id)"><i class="fas fa-times"></i></span>
                </div>
            </b-list-group-item>
        </b-list-group>
    </b-card>
</template>

<script>
import axios from "axios";
import Config from '@config/config.json';

export default {
    name: "ManageCandidates.vue",
    props: ['listOfCandidates', 'orga'],
    methods: {
        async acceptCandidate(candidateId){
            try {
                await axios.post(`${Config.api_base_url}/api/organizations/manage/${this.orga.id}/accept-candidate/${candidateId}`, {}, {
                    headers: {
                        Authorization: `Bearer ${this.$store.state.accessToken}`,
                    },
                });
                this.$emit('onAcceptCandidate');
            } catch (err) {
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    this.$toastr.e('You have been disconnected. Please login again.');
                    this.$router.push({ name: 'Home' });
                    return;
                }
                this.$toastr.e('Sorry, we are unable to accept candidate for the moment. Please, try again later.');
            }
        },
        async declineCandidate(candidateId) {
            try {
                await axios.post(`${Config.api_base_url}/api/organizations/manage/${this.orga.id}/decline-candidate/${candidateId}`, {}, {
                    headers: {
                        Authorization: `Bearer ${this.$store.state.accessToken}`,
                    },
                });
                this.$emit('onDeclineCandidate');
            } catch (err) {
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    this.$toastr.e('You have been disconnected. Please login again.');
                    this.$router.push({ name: 'Home' });
                    return;
                }
                this.$toastr.e('Sorry, we are unable to decline candidate for the moment. Please, try again later.');
            }
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
