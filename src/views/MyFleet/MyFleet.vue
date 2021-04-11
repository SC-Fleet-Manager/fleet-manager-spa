<template>
    <div class="animated fadeIn">
        <b-card>
            <b-card-body>
                <div class="btn-edit-ships d-flex mb-3">
                    <b-button variant="primary" role="button" @click="createShip"><i class="fa fa-plus"></i> Create a ship</b-button>
                </div>
                <b-input-group class="mb-3">
                    <template #prepend>
                        <b-input-group-text style="background-color: white;"><i class="fa fa-search"></i></b-input-group-text>
                    </template>
                    <b-form-input v-model="form.search" type="search" debounce="100" :trim="true" placeholder="Search a ship"></b-form-input>
                </b-input-group>
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
            </b-card-body>
        </b-card>
        <b-modal id="modal-edit-ship" ref="modalEditShip" size="lg" centered hide-footer>
            <template #modal-title>
                Edit ship
                <b-button type="button" variant="danger" @click="deleteShip(editingShip)"><i class="fa fa-times"></i> Delete</b-button>
            </template>
            <EditShipModal @success="" :ship="editingShip" @updateShip="onUpdateShip"></EditShipModal>
        </b-modal>
        <b-modal id="modal-create-ship" ref="modalCreateShip" size="lg" centered title="Create ship" hide-footer>
            <CreateShipModal @success="" @newShip="onNewShip"></CreateShipModal>
        </b-modal>
    </div>
</template>

<script>
    import axios from 'axios';
    import Config from '@config/config.json';
    import ShipCard from '@/components/ShipCard.vue';
    import EditShipModal from '@/components/EditShipModal';
    import CreateShipModal from '@/components/CreateShipModal';
    import exported from 'locale-index-of';
    const localeIndexOf = exported(Intl);

    export default {
        name: 'my-fleet',
        components: {EditShipModal, CreateShipModal, ShipCard},
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
                const token = await this.$auth.getTokenSilently();
                if (!this.$auth.isAuthenticated) {
                    this.$toastr.e('Sorry, we are unable to load your ships for the moment. Please, try again later.');
                    return;
                }
                try {
                    this.notFoundFleet = false;
                    this.errorMessage = null;
                    const response = await axios.get(`${Config.api_base_url}/api/my-fleet`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    this.listOfShips = response.data.ships.items;
                } catch (err) {
                    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
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
            async deleteShip(ship) {
                try {
                    await axios.post(`${Config.api_base_url}/api/my-fleet/delete-ship/${ship.id}`, {}, {
                        headers: {
                            Authorization: `Bearer ${this.$store.state.accessToken}`,
                        },
                    });
                    this.onDeleteShip();
                } catch (err) {
                    this.$toastr.e('Sorry, we are unable to delete your ship for the moment. Please, try again later.');
                }
            },
        }
    }
</script>
