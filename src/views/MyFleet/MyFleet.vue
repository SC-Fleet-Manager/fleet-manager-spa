<template>
    <div class="animated fadeIn">
        <div class="btn-edit-ships d-flex flex-row-reverse m-2">
            <b-button variant="secondary" role="button">Edit ships and fleet</b-button>
        </div>
        <div class="list-ships">
            <b-row class="row">
                <ShipCard v-for="(ship, index) in listOfShips" :key="index"
                    :shipName="ship.name"
                    :number="ship.number"
                    :image="ship.image"
                />
            </b-row>
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
                    {name: 'Avenger Titan', number:1},
                    {name: 'Mercury', number:1},
                    {name: 'Avenger S', number:1},
                    {name: '85X', number:3}
                ],
            };
        },
        methods: {

        },
        created() {
        }
    }
</script>
