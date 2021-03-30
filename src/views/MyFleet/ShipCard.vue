<template>
    <b-card class="col col-12 col-sm-12 col-md-6 col-lg-4 col-xl-3">
        <b-card-text class="text-center">
            {{ shipName }} [{{number}}]
        </b-card-text>
        <img class="img-fluid" :src="placeholderShipImg" alt="">
    </b-card>

</template>
<script>
    import placeholderShipImg from '@img/vaisseau-2.png';
    export default {
        name: 'ShipCard,',
        props: ['shipName', 'number', 'image'],
        data(){
            return {
                placeholderShipImg
            }
        }
    }
</script>
