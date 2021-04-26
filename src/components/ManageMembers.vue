<template>
    <div style="position: relative;">
        <h3>Members</h3>
        <b-alert v-if="errorMessage !== null" show variant="danger">{{ errorMessage }}</b-alert>
        <div v-if="!listOfMembersLoaded" class="d-flex justify-content-center">
            <b-spinner label="Loading..." style="width: 3rem; height: 3rem;"></b-spinner>
        </div>
        <template v-else>
            <b-alert v-if="listOfMembers.length === 0" show variant="warning">No members</b-alert>
            <b-list-group v-else style="height: 400px; overflow: auto; border-bottom: 1px solid rgba(0, 0, 0, 0.125);">
                <b-list-group-item v-for="member in listOfMembers" :key="member.id" class="d-flex justify-content-between">
                    <span><i v-if="isFounder(member)" class="fas fa-crown text-warning"></i> {{ fullName(member) }}</span>
                    <span v-if="!isFounder(member)" title="Kick" @click="kick(member)" class="remove-member"><i class="fas fa-times"></i></span>
                </b-list-group-item>
            </b-list-group>
        </template>
        <b-modal id="modal-kick-member" ref="modalKickMember" size="lg" centered :title="'Kick member ' + (kickingMember ? fullName(kickingMember) : '')" hide-footer>
            <template v-if="kickingMember !== null">
                <b-alert variant="warning" :show="true">
                    <i class="fa fa-exclamation-triangle"></i> You are about to kick a member.
                    <br />Are you sure you want to kick {{ fullName(kickingMember) }}?
                </b-alert>
                <b-alert v-if="kickMemberErrorMessage !== null" variant="danger" show v-html="kickMemberErrorMessage"></b-alert>
                <b-button v-else size="lg" block variant="danger" @click="kickMember(kickingMember)">Kick member</b-button>
            </template>
        </b-modal>
    </div>
</template>

<script>
import axios from "axios";
import Config from '@config/config.json';
import bus from '@/bus';

export default {
    name: "ManageMembers",
    props: ['orga'],
    data() {
        return {
            listOfMembersLoaded: false,
            errorMessage: null,
            kickMemberErrorMessage: null,
            kickingMember: null,
            listOfMembers: [],
        }
    },
    created() {
        bus.$on('acceptCandidate', this.onAcceptCandidate);
        this.loadListOfMembers();
    },
    methods: {
        isFounder(member) {
            return member.id === this.$store.state.profile.id;
        },
        fullName(member) {
            return member.handle + (member.nickname ? ` aka ${member.nickname}` : '');
        },
        async loadListOfMembers() {
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
                if (err.response && err.response.data.error) {
                    this.errorMessage = err.response.data.errorMessage;
                    return;
                }
                console.error(err);
                this.errorMessage = 'Sorry, we are unable to retrieve your organizations. Please, try again later.';
            } finally {
                this.listOfMembersLoaded = true;
            }
        },
        async kickMember(member) {
            try {
                this.kickMemberErrorMessage = null;
                await axios.post(`${Config.api_base_url}/api/organizations/manage/${this.orga.id}/kick-member/${member.id}`, {}, {
                    headers: {
                        Authorization: `Bearer ${this.$store.state.accessToken}`,
                    },
                });
                this.onKickMember(member);
            } catch (err) {
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    this.$toastr.e('You have been disconnected. Please login again.');
                    this.$router.push({ name: 'Home' });
                    return;
                }
                if (err.response && err.response.data.error) {
                    this.kickMemberErrorMessage = err.response.data.errorMessage;
                    return;
                }
                console.error(err);
                this.kickMemberErrorMessage = 'Sorry, we are unable to kick this member for the moment. Please, try again later.';
            }
        },
        kick(member) {
            this.kickingMember = member;
            this.$refs.modalKickMember.show();
        },
        onKickMember() {
            this.loadListOfMembers();
            this.$toastr.s('Member kicked');
            this.$refs.modalKickMember.hide();
        },
        onAcceptCandidate() {
            this.loadListOfMembers();
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
