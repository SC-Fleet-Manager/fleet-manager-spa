<template>
    <div>
        <div class="mb-0 py-2 px-2 text-center border-bottom footer-orga-card">
            {{ orga.name }}
        </div>
        <div class="position-relative placeholder-orga">
            <div class="aspect-ratio-box" :style="stylePictureShip" />
        </div>
        <b-button v-if="!orga.joined" @click="unjoin" class="button-join-orga" block variant="warning" size="lg" style="border-top-left-radius: 0; border-top-right-radius: 0;"><i class="fas fa-times"></i>Cancel</b-button>
    </div>
</template>

<script>
export default {
    name: "MyOrgaCardInner",
    props: ['orga', 'unjoin'],
    data() {
        return {
        };
    },
    computed: {
        stylePictureShip() {
            if (this.orga.logoUrl !== null) {
                return `background-image: url(${this.orga.logoUrl}); background-color:#fff`
            }
            return '';
        },
    },
}
</script>

<style lang="scss" scoped>
@import '~@styles/orga_card';

</style>
