<template>
    <div class="animated fadeIn">
        <div class="btn-edit-ships d-flex flex-row-reverse m-2">
            <router-link to="/my-fleet/edit-ships-and-fleet"><b-button variant="secondary" role="button">Edit ships and fleet</b-button></router-link>
        </div>
        <div v-if="!noShip" class="d-flex flex-row flex-wrap mt-3">
            <ShipCard v-for="(ship, index) in listOfShips" :key="index"
                :shipName="ship.name"
                :quantity="ship.quantity"
                :image="ship.imageUrl"
            />
        </div>
        <div v-else class="card p-2">
            <p class=" m-0 mx-auto">{{noShipMessage}}</p>
        </div>
    </div>
</template>

<script>
    import ShipCard from './ShipCard.vue';
    import axios from 'axios';
    import Config from '@config/config.json';

    export default {
        name: 'my-fleet',
        props: ['userHandle'],
        components: {
            ShipCard
        },
        data() {
            return {
                noShip: false,
                noShipMessage: '',
                listOfShips: null
            };
        },
        created() {
            this.loadShipList()
        },
        methods: {
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
                    console.log(this.listOfShips)
                } catch (err) {
                    if(err.response.status == 404){
                        this.noShip = true
                        this.noShipMessage = err.response.data.errorMessage
                    }

                }

            }
        }
    }
</script>
