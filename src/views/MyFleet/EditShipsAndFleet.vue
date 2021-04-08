<template>
    <div class="animated fadeIn">
        <div class="d-flex justify-content-between mb-4">
            <router-link to="/my-fleet"><b-button variant="secondary" role="button">Back to my fleet</b-button></router-link>
            <router-link to="/my-fleet/edit-ships-and-fleet/add-new-ship"><b-button variant="secondary" role="button">Add new ship</b-button></router-link>
        </div>
        <input type="text" v-model="searchValue" placeholder="Search a ship" id="search-input" class="col-md-6 p-2"/>
        <b-list-group v-if="!noShip" class="col-xl-8 my-4">
            <b-list-group-item  v-for="(ship, index) in filteredShips" :key="index" class="d-flex justify-content-between">
                <input class="col-6" v-model="ship.name">
                <b-button-group class="btn-actions p-0">
                    <b-button class="border">{{ship.quantity}}</b-button>
                    <b-button class="border" @click="addShip(ship)">+</b-button>
                    <b-button class="border" @click="subShip(ship)">-</b-button>
                    <b-button class="border" @click="removeShip(ship)"><i class="fas fa-trash"></i></b-button>
                </b-button-group>
            </b-list-group-item>
        </b-list-group>
        <div v-else class="card p-2">
            <p class=" m-0 mx-auto">{{noShipMessage}}</p>
        </div>
    </div>
</template>

<script>

    import axios from 'axios';
    import Config from '@config/config.json';

    export default {
        name: 'edit-ships-and-fleet',
        props: ['userHandle'],
        components: {

        },
        data() {
            return {
                searchValue: '',
                listOfShips: null,
                noShip: false
            };
        },
        created() {
            this.loadShipList()
        },
        computed: {
            filteredShips() {
                let tempShips = this.listOfShips
                if (this.searchValue != '' && this.searchValue) {
                    tempShips = tempShips.filter((item) => {
                        return item.name
                            .toUpperCase()
                            .includes(this.searchValue.toUpperCase())
                    })
                }
                return tempShips
            }
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
                    console.log(response)
                    this.listOfShips = response.data.ships.items;
                } catch (err) {
                    if(err.response.status == 404){
                        this.noShip = true
                        this.noShipMessage = err.response.data.errorMessage
                    } else {
                        this.noShip = true
                        this.$toastr.e('Sorry, we are unable to load your ships for the moment.');
                    }

                }

            },
            async addShip(ship) {
                const token = await this.$auth.getTokenSilently();
                if (!this.$auth.isAuthenticated) {
                    this.$toastr.e('Sorry, we are unable to load your ships for the moment.');
                    return;
                }
                try {
                    const response = await axios.post(`${Config.api_base_url}/api/my-fleet/increment-quantity-ship`,{
                        params: {
                            id: ship.id,
                            step: 1
                        }
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    ship.quantity += 1
                    console.log(response)
                    this.listOfShips = response.data.ships.items;
                } catch (err) {
                    console.log(err)
                    // this.$toastr.e('Sorry' + err.response.data.violations.detail);
                }
            },
            subShip(ship) {
                if(ship.quantity > 0) {
                    ship.quantity -= 1
                }
            },
            async removeShip(ship){
                const token = await this.$auth.getTokenSilently();
                if (!this.$auth.isAuthenticated) {
                    this.$toastr.e('Sorry, we are unable to load your ships for the moment.');
                    return;
                }
                try {
                    const response = await axios.post(`${Config.api_base_url}/api/my-fleet/delete-ship`,{
                        params: {
                            id: ship.id
                        }
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    this.listOfShips.splice(this.listOfShips.indexOf(ship), 1);
                    console.log(response)
                    this.listOfShips = response.data.ships.items;
                } catch (err) {
                    console.log(err)
                    // this.$toastr.e('Sorry' + err.response.data.violations.detail);
                }
            }
        }
    }
</script>
