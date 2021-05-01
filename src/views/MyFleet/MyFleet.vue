<template>
    <div class="animated fadeIn">
        <b-card>
            <div class="btn-actions-my-fleet  d-flex justify-content-end align-items-baseline flex-wrap flex-sm-nowrap">
                <b-breadcrumb style="flex-grow:1;" :items="[
                    {
                        text: 'My fleet',
                        active: true
                    }
                ]"></b-breadcrumb>
                <b-dropdown class="d-sm-none" size="lg" right variant="link" toggle-class="text-decoration-none" no-caret>
                    <template #button-content>
                        <span class="navbar-toggler-icon"></span>
                    </template>
                    <b-dropdown-item @click="createShip">
                        <i class="fa fa-plus"></i> Create a ship
                    </b-dropdown-item>
                    <b-dropdown-item @click="importFleet">
                        <i class="fas fa-cloud-upload-alt"></i> Import
                    </b-dropdown-item>
                    <b-dropdown-item @click="deleteFleet">
                        <i class="fas fa-trash"></i> Clear my fleet
                    </b-dropdown-item>
                </b-dropdown>
                <b-button class="btn-action-my-fleet mb-3 ml-2 flex-shrink-0" variant="primary" role="button" @click="createShip"><i class="fa fa-plus"></i> Create a ship</b-button>
                <b-button class="btn-action-my-fleet mb-3 ml-2 flex-shrink-0" variant="outline-primary" role="button" @click="importFleet"><i class="fas fa-cloud-upload-alt"></i> Import</b-button>
                <b-button class="btn-action-my-fleet mb-3 ml-2 flex-shrink-0" variant="outline-danger" role="button" @click="deleteFleet"><i class="fas fa-trash"></i> Clear my fleet</b-button>
            </div>
            <div class="mb-4 px-0 col-12 col-md-5 col-xl-3">
                <b-input-group>
                    <template #prepend>
                        <b-input-group-text style="background-color: white;"><i class="fa fa-search"></i></b-input-group-text>
                    </template>
                    <b-form-input v-model="form.search" type="search" debounce="100" :trim="true" placeholder="Search a ship"></b-form-input>
                </b-input-group>
            </div>

            <div v-if="!listOfShipsLoaded" class="d-flex justify-content-center">
                <b-spinner label="Loading..." style="width: 3rem; height: 3rem;"></b-spinner>
            </div>
            <div v-else>
                <b-row cols-lg="mt-3">
                    <ShipCard v-for="ship in filteredlistOfShips" :key="ship.id" :ship="ship" @edit="onEditShip" />
                </b-row>
                <b-alert v-if="hasAnyShip" show variant="warning">You don't have any ships yet. Why don't you create one?</b-alert>
                <b-alert v-if="errorMessage !== null" show variant="danger">{{ errorMessage }}</b-alert>
            </div>
        </b-card>
        <b-modal id="modal-edit-ship" ref="modalEditShip" size="lg" centered title="Edit ship" hide-footer>
            <EditShipModal :ship="editingShip" @updateShip="onUpdateShip" @deleteShip="onDeleteShip"></EditShipModal>
        </b-modal>
        <b-modal id="modal-create-ship" ref="modalCreateShip" size="lg" centered title="Create ship" hide-footer>
            <CreateShipModal @newShip="onNewShip"></CreateShipModal>
        </b-modal>
        <b-modal id="modal-import" ref="modalImport" size="lg" centered title="Import fleet" hide-footer>
<!--                :state="Boolean(form.importFile)"-->
            <ImportFleetModal @newImport="onImportFleet"></ImportFleetModal>
        </b-modal>
        <b-modal id="modal-delete-fleet" ref="modalDeleteFleet" size="lg" centered title="Clear my fleet" hide-footer>
            <DeleteMyFleetModal @newDeleteFleet="onDeleteFleet"></DeleteMyFleetModal>
        </b-modal>
    </div>
</template>

<script>
    import axios from 'axios';
    import Config from '@config/config.json';
    import ShipCard from '@/components/ShipCard.vue';
    import EditShipModal from '@/components/EditShipModal';
    import CreateShipModal from '@/components/CreateShipModal';
    import DeleteMyFleetModal from '@/components/DeleteMyFleetModal';
    import exported from 'locale-index-of';
    import ImportFleetModal from "../../components/ImportFleetModal";
    const localeIndexOf = exported(Intl);

    export default {
        name: 'my-fleet',
        components: {DeleteMyFleetModal, ImportFleetModal, EditShipModal, CreateShipModal, ShipCard},
        data() {
            return {
                form: {
                    search: null,
                },
                listOfShipsLoaded: false,
                notFoundFleet: false,
                errorMessage: null,
                listOfShips: [],
                editingShip: null,
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
            filteredlistOfShips() {
                if (!this.form.search) {
                    return this.listOfShips;
                }

                return this.listOfShips.filter((ship) => {
                    return -1 !== localeIndexOf(ship.model, this.form.search, 'en', { sensitivity: 'base', ignorePunctuation: true });
                });
            },
            hasAnyShip() {
                return this.notFoundFleet || this.listOfShips.length === 0;
            },
        },
        methods: {
            loadAuthRequests() {
                this.loadShipList();
            },
            async loadShipList() {
                try {
                    this.notFoundFleet = false;
                    this.errorMessage = null;
                    const response = await axios.get(`${Config.api_base_url}/api/my-fleet`, {
                        headers: {
                            Authorization: `Bearer ${this.$store.state.accessToken}`,
                        },
                    });
                    this.listOfShips = response.data.ships.items;
                    this.listOfShips.sort((ship1, ship2) => {
                        return ship2.quantity - ship1.quantity;
                    });
                } catch (err) {
                    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                        this.$toastr.e('You have been disconnected. Please login again.');
                        this.$router.push({ name: 'Home' });
                        return;
                    }
                    if (err.response.status == 400 && err.response.data.error === 'not_found_fleet'){
                        this.notFoundFleet = true
                        return;
                    }
                    this.errorMessage = 'Sorry, we are unable to retrieve your fleet. Please, try again later.';
                } finally {
                    this.listOfShipsLoaded = true;
                }
            },
            onEditShip(ship) {
                this.editingShip = ship;
                this.$refs.modalEditShip.show();
            },
            createShip() {
                this.$refs.modalCreateShip.show();
            },
            importFleet() {
                this.$refs.modalImport.show();
            },
            onImportFleet() {
                this.$toastr.s('Your fleet has been imported!');
                this.loadShipList();
                this.$refs.modalImport.hide();
            },
            deleteFleet() {
                this.$refs.modalDeleteFleet.show();
            },
            onDeleteFleet() {
                this.$toastr.s('Your fleet has been cleared!');
                this.loadShipList();
                this.$refs.modalDeleteFleet.hide();
            },
            onNewShip({ shouldClose }) {
                this.$toastr.s('Your ship has been created!');
                this.loadShipList();
                if (shouldClose) {
                    this.$refs.modalCreateShip.hide();
                }
            },
            onUpdateShip() {
                this.$toastr.s('Your ship has been updated!');
                this.loadShipList();
                this.$refs.modalEditShip.hide();
                this.editingShip = null;
            },
            onDeleteShip() {
                this.$toastr.s('Your ship has been deleted!');
                this.loadShipList();
                this.$refs.modalEditShip.hide();
                this.editingShip = null;
            },
        }
    }
</script>

<style lang="scss" scoped>
@import '~@styles/style.scss';

.navbar-toggler-icon {
    background-image: $navbar-toggler-icon;
}

.btn-actions-my-fleet .btn-action-my-fleet {
    display: none;
    @include media-breakpoint-up(sm) {
        display: inline-block;
    }
}
</style>
