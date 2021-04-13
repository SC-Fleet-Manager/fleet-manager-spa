<template>
    <div class="animated fadeIn">
        <b-card>
            <b-card-body>
                <div class="btn-edit-ships d-flex justify-content-between flex-wrap mb-3">
                    <h3>My organizations</h3>
                    <div>
                        <b-button class="mr-2" variant="primary" role="button" @click="createOrga"><i class="fa fa-plus"></i> Create a orga</b-button>
                        <!-- <b-button variant="primary" role="button">Join a orga</b-button> -->
                    </div>
                </div>
                <div v-if="!listOfOrgasLoaded" class="d-flex justify-content-center">
                    <b-spinner label="Loading..." style="width: 3rem; height: 3rem;"></b-spinner>
                </div>
                <div v-else>
                    <b-row cols-lg="mt-3">
                        <OrgaCard v-for="orga in listOfOrgas" :key="orga.id" :orga="orga"/>
                    </b-row>
                    <b-alert v-if="hasAnyOrga" show variant="warning">You don't have any organization yet. Why don't you create one?</b-alert>
                    <b-alert v-if="errorMessage !== null" show variant="danger">{{ errorMessage }}</b-alert>
                </div>
            </b-card-body>
        </b-card>
        <b-modal id="modal-create-orga" ref="modalCreateOrga" size="lg" centered title="Create Orga" hide-footer>
            <CreateOrgaModal @newOrga="onNewOrga"></CreateOrgaModal>
        </b-modal>
    </div>
</template>

<script>
    import OrgaCard from '@/components/OrgaCard.vue';
    import CreateOrgaModal from '@/components/CreateOrgaModal';

    export default {
        name: 'my-orga',
        components: {CreateOrgaModal, OrgaCard},
        data() {
            return {
                listOfOrgasLoaded: false,
                notFoundOrgas: false,
                errorMessage: null,
                listOfOrgas: [],
            };
        },
        created() {
            if (!this.$auth.loading) {
                this.loadAuthRequests();
            } else {
                this.$auth.$on('loaded', this.loadAuthRequests);
            }
        },
        computed: {
            hasAnyOrga() {
                return this.notFoundOrgas || this.listOfOrgas.length === 0;
            },
        },
        methods: {
            loadAuthRequests() {
                this.loadOrgaList();
            },
            loadOrgaList() {
                this.notFoundOrgas = false;
                this.errorMessage = null;
                this.listOfOrgasLoaded = true;
            },
            createOrga() {
                this.$refs.modalCreateOrga.show();
            },
            onNewOrga({ shouldClose, name, sid, logoUrl }) {
                this.$toastr.s('Your orga has been created!');
                this.loadOrgaList();
                if (shouldClose) {
                    this.$refs.modalCreateOrga.hide();
                }
                const newOrga = {name, sid, logoUrl}
                this.listOfOrgas.push(newOrga)
            }
        }
    }
</script>
