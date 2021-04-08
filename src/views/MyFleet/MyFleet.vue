<template>
    <div class="animated fadeIn">
        <b-card>
            <b-card-body>
                <div class="btn-edit-ships d-flex mb-3">
                    <b-button variant="primary" role="button" @click="createShip">Create a ship</b-button>
                </div>
                <b-row cols-lg="mt-3">
                    <ShipCard v-for="ship in listOfShips" :key="ship.id"
                        :shipName="ship.name"
                        :quantity="ship.quantity"
                        :image="ship.imageUrl"
                    />
                </b-row>
                <b-alert v-if="notFoundFleet" show variant="warning">You have no ships yet. Why don't you create one?</b-alert>
            </b-card-body>
        </b-card>
    </div>
</template>

<script>
    import ShipCard from './ShipCard.vue';
    import axios from 'axios';
    import Config from '@config/config.json';

    export default {
        name: 'my-fleet',
        props: ['userHandle'],
        components: {ShipCard},
        data() {
            return {
                notFoundFleet: false,
                listOfShips: []
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
                    this.$toastr.e('Sorry, we are unable to load your ships for the moment.');
                    return;
                }
                try {
                    const response = await axios.get(`${Config.api_base_url}/api/my-fleet`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    this.listOfShips = response.data.ships.items;
                } catch (err) {
                    if(err.response.status == 404 && err.response.data.error === 'not_found_fleet'){
                        this.notFoundFleet = true
                    }
                }
            },
            createShip() {

            }
        }
    }
</script>
