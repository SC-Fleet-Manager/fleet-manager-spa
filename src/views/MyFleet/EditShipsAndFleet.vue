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
                    <b-button class="border">{{ship.number}}</b-button>
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

    export default {
        name: 'edit-ships-and-fleet',
        props: ['userHandle'],
        components: {

        },
        data() {
            return {
                searchValue: '',
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
