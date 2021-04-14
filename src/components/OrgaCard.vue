<template>
    <b-col sm="6" md="4" lg="3" xl="2">
        <div class="card">
            <div class="position-relative placeholder-orga">
                <div class="aspect-ratio-box" :style="stylePictureShip" />
            </div>
            <footer class="mb-0 py-3 px-2 text-center border-top footer-orga-card">
                {{ orga.name }}
            </footer>
        </div>
    </b-col>
</template>
<script>
    export default {
        name: 'OrgaCard',
        props: ['orga'],
        data() {
            return {};
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
@import '~@styles/vendors/variables';
@import '~@coreui/icons';
.placeholder-orga {
    max-width: 100%;
    background-image: url('~@img/static/Placeholder-org.svg');
    background-size: cover;
    background-position: center;
}
.aspect-ratio-box {
    overflow: hidden;
    height: 0;
    padding-top: 100%;
    background-size: cover;
    background-position: center;
}
.footer-orga-card {
    font-size: 1.2rem;
}
</style>
