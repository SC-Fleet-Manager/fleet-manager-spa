<template>
    <div class="animated fadeIn">
        <b-card>
            <b-card-body>
                <div class="btn-edit-ships d-flex justify-content-end align-items-baseline flex-wrap flex-sm-nowrap mb-3">
                    <b-breadcrumb style="width:100%; flex-grow:1;" :items="[
                        {
                            text: 'My organizations',
                            active: true
                        }
                    ]"></b-breadcrumb>
                    <b-button class="mx-2 flex-shrink-0" variant="secondary" role="button" @click="createOrga"><i class="fa fa-plus"></i> Create</b-button>
                    <b-button to="/my-organizations/join" class="flex-shrink-0" variant="primary" role="button"><i class="fas fa-door-open"></i> Join</b-button>
                </div>
                <div v-if="!listOfOrgasLoaded" class="d-flex justify-content-center">
                    <b-spinner label="Loading..." style="width: 3rem; height: 3rem;"></b-spinner>
                </div>
                <div v-else>
                    <b-row cols-lg="mt-3">
                        <OrgaCard v-for="orga in listOfOrgas" :key="orga.id" :orga="orga"/>
                    </b-row>
                    <b-alert v-if="hasAnyOrga" show variant="warning">You don't have any organization yet. Why don't you join one ?</b-alert>
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
    import axios from 'axios';
    import Config from '@config/config.json';
    import OrgaCard from '@/components/OrgaCard.vue';
    import CreateOrgaModal from '@/components/CreateOrgaModal';

    export default {
        name: 'my-orga',
        components: {CreateOrgaModal, OrgaCard},
        data() {
            return {
                listOfOrgasLoaded: false,
                errorMessage: null,
                listOfOrgas: [],
            };
        },
        created() {
            this.loadOrgaList();
        },
        computed: {
            hasAnyOrga() {
                return this.listOfOrgas.length === 0;
            },
        },
        methods: {
            async loadOrgaList() {
                try {
                    this.notFoundOrgas = false;
                    this.errorMessage = null;
                    const response = await axios.get(`${Config.api_base_url}/api/my-organizations`, {
                        headers: {
                            Authorization: `Bearer ${this.$store.state.accessToken}`,
                        },
                    });
                    this.listOfOrgas = response.data.organizations;
                } catch (err) {
                    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                        this.$toastr.e('You have been disconnected. Please login again.');
                        this.$router.push({ name: 'Home' });
                        return;
                    }
                    this.errorMessage = 'Sorry, we are unable to retrieve your organizations. Please, try again later.';
                } finally {
                    this.listOfOrgasLoaded = true;
                }
            },
            createOrga() {
                this.$refs.modalCreateOrga.show();
            },
            onNewOrga() {
                this.$toastr.s('Your orga has been created!');
                this.loadOrgaList();
                this.$refs.modalCreateOrga.hide();
            }
        }
    }
</script>
