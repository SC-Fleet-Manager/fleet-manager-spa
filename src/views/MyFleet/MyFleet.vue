<template>
    <div class="animated fadeIn">
        <div class="btn-edit-ships d-flex flex-row-reverse m-2">
            <router-link to="/my-fleet/edit-ships-and-fleet"><b-button variant="secondary" role="button">Edit ships and fleet</b-button></router-link>
        </div>
        <div class="d-flex flex-row flex-wrap mt-3">
            <ShipCard v-for="(ship, index) in listOfShips" :key="index"
                :shipName="ship.name"
                :number="ship.number"
                :image="ship.image"
            />
        </div>
    </div>
</template>

<script>
    import ShipCard from './ShipCard.vue';

    export default {
        name: 'my-fleet',
        props: ['userHandle'],
        components: {
            ShipCard
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
                    {name: 'Avenger Titan super mega stalker', number:100},
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
        methods: {

        },
        created() {
        }
    }
</script>
