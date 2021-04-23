<template>
    <b-col sm="12" md="6" lg="4" xl="3">
        <div class="card">
            <header class="mb-0 px-4 py-3 h4 d-flex justify-content-between">
                {{ ship.model }}
            </header>
            <div class="position-relative placeholder-ship">
                <div class="aspect-ratio-box" :style="stylePictureShip" />
                <div class="ship-family-detail-variant-counter">{{ ship.quantity }}</div>
            </div>
        </div>
    </b-col>
</template>
<script>
    export default {
        name: 'OrgaShipCard',
        props: ['ship'],
        data() {
            return {};
        },
        computed: {
            stylePictureShip() {
                if (this.ship.imageUrl !== null) {
                    return `background-image: url(${this.ship.imageUrl})`
                }
                return '';
            },
        },
    }
</script>

<style lang="scss" scoped>
@import '~@styles/vendors/variables';
@import '~@coreui/icons';

.placeholder-ship {
    max-width: 100%;
    background-image: url('~@img/static/Placeholder-FM_1.svg');
    background-size: cover;
    background-position: center;
}
.aspect-ratio-box {
    overflow: hidden;
    height: 0;
    padding-top: 56.25%;
    background-size: cover;
    background-position: center;
}
.ship-family-detail-variant-counter {
    font-family: "Josefin Sans", Helvetica Neue, Arial, sans-serif;
    font-size: 4rem;
    position: absolute;
    bottom: 0;
    right: 0.6rem;
    line-height: 1;
    color: $gray-200;
    text-shadow: 0 0 4px rgba(30, 30, 30, 1);
}
</style>
