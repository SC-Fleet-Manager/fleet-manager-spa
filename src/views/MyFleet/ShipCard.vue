<template>
    <div class="col col-12 col-sm-12 col-md-6 col-lg-4 col-xl-3">
        <div class="card">
            <header class="d-flex justify-content-between align-items-center px-4 py-3 h5">
                {{shipName}}<span v-if="number" class="badge badge-primary badge-pill">{{number}}</span>
            </header>
            <img class="img-fluid" :src="placeholderShipImg" alt="">
        </div>
    </div>

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
