<template>
    <div class="animated fadeIn">
        <b-card>
            <b-card-body>
                <div class="btn-edit-ships d-flex mb-3">
                    <b-button variant="primary" role="button" @click="createShip">Create a ship</b-button>
                </div>
                <input type="text" placeholder="Search a ship" />
                <b-row cols-lg="mt-3">
                    <ShipCard v-for="ship in listOfShips" :key="ship.id" :ship="ship" @edit="onEditShip" />
                </b-row>
                <b-alert v-if="notFoundFleet" show variant="warning">You have no ships yet. Why don't you create one?</b-alert>
                <b-alert v-if="errorMessage !== null" show variant="error">{{ errorMessage }}</b-alert>
            </b-card-body>
        </b-card>
        <b-modal id="modal-edit-ship" ref="modalEditShip" size="lg" centered title="Edit ship" hide-footer>
            <EditShipModal @success="" :ship="editingShip" @updateShip="onUpdateShip" @deleteShip="onDeleteShip"></EditShipModal>
        </b-modal>
        <b-modal id="modal-create-ship" ref="modalCreateShip" size="lg" centered title="Create ship" hide-footer>
            <CreateShipModal @success="" @newShip="onNewShip"></CreateShipModal>
        </b-modal>
    </div>
</template>

<script>
    import ShipCard from './ShipCard.vue';
    import axios from 'axios';
    import Config from '@config/config.json';
    import EditShipModal from '@/components/EditShipModal';
    import CreateShipModal from '@/components/CreateShipModal';

    export default {
        name: 'my-fleet',
        components: {EditShipModal, CreateShipModal, ShipCard},
        data() {
            return {
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
                    if(err.response.status == 404 && err.response.data.error === 'not_found_fleet'){
                        this.notFoundFleet = true
                        return;
                    }
                    this.errorMessage = 'Sorry, we are unable to retrieve your fleet. Please, try again later.';
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
            }
        }
    }
</script>
