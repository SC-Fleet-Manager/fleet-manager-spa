<template>
    <div class="animated fadeIn">
        <div class="d-flex justify-content-between mb-4">
            <router-link to="/my-fleet"><b-button variant="secondary" role="button">Back to my fleet</b-button></router-link>
            <router-link to="/my-fleet/edit-ships-and-fleet/add-new-ship"><b-button variant="secondary" role="button">Add new ship</b-button></router-link>
        </div>
        <input type="text" v-model="searchValue" placeholder="Search a ship" id="search-input" class="w-25 mb-4"/>
        <div v-if="listOfShips.length !== 0" class="card container-xxl">
            <div v-for="(ship, index) in filteredShips" :key="index" class="row m-0">
                <input class="col-10" v-model="ship.name">
                <b-button-group class="btn-actions col-2">
                    <b-button class="border px-2">{{ship.number}}</b-button>
                    <b-button class="border px-2" @click="addShip(ship)">+</b-button>
                    <b-button class="border px-2" @click="subShip(ship)">-</b-button>
                    <b-button class="border px-2" @click="removeShip(ship)"><i class="fas fa-trash"></i></b-button>
                </b-button-group>
            </div>
        </div>
        <div v-else class="card p-2">
            <p class=" m-0 mx-auto">You have no ships</p>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'edit-ships-and-fleet',
        props: ['userHandle'],
        components: {

        },
        data() {
            return {
                searchValue: '',
                // placeholderShipUri,
                listOfShips:[
                    {name: 'Avenger S', number:5},
                    {name: 'Avenger Titan', number:0},
                    {name: 'Mercury', number:1},
                    {name: 'Avenger S', number:1},
                    {name: '85X', number:3},
                    {name: '85X', number:3},
                    {name: '85X', number:10},
                    {name: 'Avenger Titan super mega stalker super mega', number:100},
                    {name: 'Avenger S', number:5},
                    {name: 'Avenger Titan super stalker ', number:0},
                    {name: 'Mercury', number:1},
                    {name: 'Avenger S', number:1},
                    {name: 'Avenger Titan', number:0},
                    {name: 'Mercury', number:1},
                    {name: 'Avenger S', number:1}
                ],
            };
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
            addShip(ship) {
                ship.number += 1

            },
            subShip(ship) {
                if(ship.number > 0) {
                    ship.number -= 1
                }
            },
            removeShip(ship){
                this.listOfShips.splice(this.listOfShips.indexOf(ship), 1);
            }
        }
    }
</script>
