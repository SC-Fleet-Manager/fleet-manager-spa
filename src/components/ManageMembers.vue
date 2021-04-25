<template>
    <b-card class="col-md-6" style="border: none">
        <h3>Members</h3>
        <p v-if="listOfMembers.length == 0">No members</p>
        <b-list-group v-else style="height: 400px; overflow: auto;">
            <b-list-group-item v-for="member in listOfMembers" :key="member.id" class="d-flex justify-content-between">
                {{ member.nickname }}
                <span @click="kick(member.id)" class="remove-member"><i class="fas fa-times"></i></span>
            </b-list-group-item>
        </b-list-group>
        <b-modal id="modal-kick-member" ref="modalKickMember" size="lg" centered title="Kick member" hide-footer>
            <b-alert variant="warning" :show="true"><i class="fa fa-exclamation-triangle"></i> You are about to kick a member.
                <br />Are you sure you want to confirm?
            </b-alert>
            <b-alert v-if="kickMemberErrorMessage !== null" variant="danger" show v-html="kickMemberErrorMessage"></b-alert>
            <b-button v-else size="lg" block variant="danger" @click="kickMember(kickMemberId)">Leave organization</b-button>
        </b-modal>
    </b-card>
</template>

<script>
import axios from "axios";
import Config from '@config/config.json';

export default {
    name: "ManageMembers",
    props: ['listOfMembers', 'orga'],
    data() {
        return {
            kickMemberErrorMessage: null,
            kickMemberId: null,
        }
    },
    methods: {
        async kickMember(memberId) {
            try {
                this.kickMemberErrorMessage = null;
                await axios.post(`${Config.api_base_url}/api/organizations/manage/${this.orga.id}/kick-member/${memberId}`, {}, {
                    headers: {
                        Authorization: `Bearer ${this.$store.state.accessToken}`,
                    },
                });
                this.onKickMember()
            } catch (err) {
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    this.$toastr.e('You have been disconnected. Please login again.');
                    this.$router.push({ name: 'Home' });
                    return;
                }
                this.kickMemberErrorMessage = ('Sorry, we are unable to kick this member for the moment. Please, try again later.');
            }
        },
        kick(memberId) {
            this.kickMemberId = memberId;
            this.$refs.modalKickMember.show();
        },
        onKickMember() {
            this.$refs.modalKickMember.hide();
            this.$emit('onKickMember');
        },
    }
}
</script>

<style lang="scss"  scoped>
@import '~@styles/style.scss';
.remove-member {
    color: $danger;
    cursor: pointer;
}

</style>
