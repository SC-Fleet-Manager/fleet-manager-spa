<template>
    <div class="animated fadeIn">
        <b-card>
            <div class="btn-edit-ships d-flex justify-content-end align-items-baseline flex-wrap flex-sm-nowrap mb-2">
                <b-breadcrumb class="mr-2" style="width:100%; flex-grow:1;" :items="[
                    {
                        text: 'My organizations',
                        active: true
                    }
                ]"></b-breadcrumb>
                <b-button class="mx-2 flex-shrink-0" variant="outline-primary" role="button" @click="createOrga"><i class="fa fa-plus mr-2"></i>Create</b-button>
                <b-button to="/my-organizations/join" class="flex-shrink-0" variant="primary" role="button"><i class="fas fa-door-open mr-2"></i>Join</b-button>
            </div>
            <div v-if="!listOfOrgasLoaded" class="d-flex justify-content-center">
                <b-spinner label="Loading..." style="width: 3rem; height: 3rem;"></b-spinner>
            </div>
            <div v-else>
                <b-row cols-lg="mt-3">
                    <MyOrgaCard v-for="orga in $store.state.myOrgasList" :key="orga.id" @unJoin="onUnJoin" :orga="orga"/>
                </b-row>
                <b-alert v-if="hasAnyOrga" show variant="warning">You don't have any organization yet. Why don't you join one ?</b-alert>
                <b-alert v-if="errorMessage !== null" show variant="danger">{{ errorMessage }}</b-alert>
            </div>
        </b-card>
        <b-modal id="modal-create-orga" ref="modalCreateOrga" size="lg" centered title="Create Orga" hide-footer>
            <CreateOrgaModal @newOrga="onNewOrga"></CreateOrgaModal>
        </b-modal>
    </div>
</template>

<script>
    import MyOrgaCard from '@/components/MyOrgaCard.vue';
    import CreateOrgaModal from '@/components/CreateOrgaModal';
    import {mapState} from "vuex";
    import bus from '@/bus';

    export default {
        name: 'my-orga',
        components: {CreateOrgaModal, MyOrgaCard},
        data() {
            return {
                listOfOrgasLoaded: false,
                errorMessage: null,
            };
        },
        created() {
            if (this.$store.state.myOrgasList !== null) {
                this.listOfOrgasLoaded = true;
            }
        },
        computed: {
            ...mapState(['myOrgasList']),
            hasAnyOrga() {
                return this.$store.state.myOrgasList.length === 0;
            },
        },
        watch: {
            myOrgasList() {
                this.listOfOrgasLoaded = true;
            },
        },
        methods: {
            createOrga() {
                this.$refs.modalCreateOrga.show();
            },
            onNewOrga() {
                this.$toastr.s('Your orga has been created!');
                bus.$emit('updateMyOrganizations');
                this.$refs.modalCreateOrga.hide();
            },
            onUnJoin() {
                bus.$emit('updateMyOrganizations');
            },
        }
    }
</script>
