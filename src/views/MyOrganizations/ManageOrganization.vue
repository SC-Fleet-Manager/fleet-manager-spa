<template>
    <div class="animated fadeIn">
        <b-card>
            <div class="btn-actions-orga d-flex justify-content-end align-items-baseline flex-wrap flex-sm-nowrap">
                <b-breadcrumb class="mb-3" style="flex-grow:1;" :items="[
                    {
                        text: 'My organizations',
                        to: {name: 'My organizations'},
                    },
                    {
                        text: `Organization ${orga !== null ? orga.name : $route.params.sid}`,
                        to: {name: `My organizations/${orga !== null ? orga.name : $route.params.sid}`},
                    },
                    {
                        text: `Manage`,
                        active: true,
                    },
                ]"></b-breadcrumb>
            </div>

            <div v-if="!listOfMembersLoaded" class="d-flex justify-content-center">
                <b-spinner label="Loading..." style="width: 3rem; height: 3rem;"></b-spinner>
            </div>
            <div v-else>
                <b-row cols-lg="mt-3">
                    <b-card class="col-md-5">
                        <h3>Members</h3>
                        <b-list-group>
                            <b-list-group-item v-for="joined in listOfJoined" :key="joined.id" class="d-flex justify-content-between">
                                {{ joined}}
                                <span class="remove-member" @click="removeMember"><i class="fas fa-times"></i></span>
                            </b-list-group-item>
                        </b-list-group>
                    </b-card>
                    <b-card class="col-md-5">
                        <h3>Edit orgnization</h3>
                        <EditOrga :orga="orga"/>
                    </b-card>
                    <b-card class="col-md-5">
                        <h3>Candidate list</h3>
                        <b-list-group>
                            <b-list-group-item v-for="member in listOfMembers" :key="member.id" class="d-flex justify-content-between">
                                {{ member }}
                                <div>
                                    <span class="accept-member mr-2" @click="acceptMember"><i class="fas fa-check"></i></span>
                                    <span class="remove-member" @click="declinedMember"><i class="fas fa-times"></i></span>
                                </div>
                            </b-list-group-item>
                        </b-list-group>
                    </b-card>
                </b-row>
                <h4 class="text-danger" @click="disbandOrga">Disband organization</h4>
                <b-alert v-if="errorMessage !== null" show variant="danger">{{ errorMessage }}</b-alert>
            </div>
        </b-card>
    </div>
</template>

<script>
import axios from 'axios';
import Config from '@config/config.json';
import EditOrga from '@/components/EditOrga';
import exported from 'locale-index-of';
const localeIndexOf = exported(Intl);

export default {
    name: 'ManageOrganization',
    components: {EditOrga},
    data() {
        return {
            form: {
                search: null,
            },
            errorMessage: null,
            listOfMembersLoaded: true,
            listOfJoinedLoaded: true,
            listOfJoined: ['Ioni', 'Vyrtualsynthese', 'Compote','Ioni', 'Vyrtualsynthese', 'Compote','Ioni', 'Vyrtualsynthese', 'Compote','Ioni', 'Vyrtualsynthese', 'Compote'],
            listOfMembers: ['toto', 'titi'],
            orga: ''
        };
    },
    created() {
        // this.loadListOfJoined();
        // this.loadListOfMember();
    },
    computed: {

    },
    methods: {
        async loadListOfJoined(){
            try {
                this.errorMessage = null;
                const response = await axios.get(`${Config.api_base_url}/api/organizations/${this.orga.id}`, {
                    headers: {
                        Authorization: `Bearer ${this.$store.state.accessToken}`,
                    },
                });
                this.listOfJoined = response.data.organizations;
            } catch (err) {
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    this.$toastr.e('You have been disconnected. Please login again.');
                    this.$router.push({ name: 'Home' });
                    return;
                }
                this.errorMessage = 'Sorry, we are unable to retrieve your organizations. Please, try again later.';
            } finally {
                this.listOfJoinedLoaded = true;
            }

        },
        async loadListOfMember(){
            try {
                this.errorMessage = null;
                const response = await axios.get(`${Config.api_base_url}/api/organizations/${this.orga.id}`, {
                    headers: {
                        Authorization: `Bearer ${this.$store.state.accessToken}`,
                    },
                });
                this.listOfMembers = response.data.organizations;
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
        removeMember(){
            console.log('remove');
        },
        acceptMember(){
            console.log('accepte')
        },
        declinedMember() {
            console.log('declined');
        },
        disbandOrga(){
            console.log('disband')
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@styles/style.scss';

.remove-member, .accept-member {
    cursor: pointer;
}
.accept-member{
    color: $success;
}
.remove-member{
    color: $danger;
}
</style>
