<template>
    <b-card class="col-md-6">
        <h3>Members</h3>
        <p v-if="listOfMembers.length == 0">No members</p>
        <b-list-group v-else>
            <b-list-group-item v-for="member in listOfMembers" :key="member.id" class="d-flex justify-content-between">
                {{ member }}
                <span class="remove-member" @click="onKickMember(member.id)"><i class="fas fa-times"></i></span>
            </b-list-group-item>
        </b-list-group>
    </b-card>
</template>

<script>
import axios from "axios";

export default {
    name: "ManageMembers",
    props: ['listOfMembers'],
    methods: {
        async onKickMember(memberId) {
            try {
                await axios.post(`${Config.api_base_url}/api/organizations/manage/${this.orga.id}/kick-member/${memberId}`, {}, {
                    headers: {
                        Authorization: `Bearer ${this.$store.state.accessToken}`,
                    },
                });
                this.$emit('onKickMember');
            } catch (err) {
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    this.$toastr.e('You have been disconnected. Please login again.');
                    this.$router.push({ name: 'Home' });
                    return;
                }
                this.$toastr.e('Sorry, we are unable to accept candidate for the moment. Please, try again later.');
            }
        },
    }
}
</script>

<style scoped>

</style>
