<template>
    <div :class="{ 'splash-screen': true, 'active': splashScreenActive }">
        <div class="splash-screen-inner">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
export default {
    name: 'app',
    computed: {
        splashScreenActive() {
            return this.$store.state.splashScreen;
        }
    }
}
</script>

<style lang="scss">
    $fa-font-path: '~@fortawesome/fontawesome-free/webfonts/';
    @import '~@fortawesome/fontawesome-free/scss/fontawesome';
    @import '~@fortawesome/fontawesome-free/scss/solid';
    @import '~@fortawesome/fontawesome-free/scss/brands';
    /*@import '~@fortawesome/fontawesome-free/scss/regular';*/
    @import '~bootstrap-vue/dist/bootstrap-vue.css';
    @import '~@styles/style.scss';

    html {
        font-size: 100%;
    }

    @keyframes pulse {
        from {
            background-size: 20vh 20vh;
        }
        to {
            background-size: 30vh 30vh;
        }
    }

    body {
        margin: 0;
    }
    .splash-screen {
        .splash-screen-inner {
            opacity: 1;
            transition: opacity 0.3s ease-in-out;
        }
    }
    .splash-screen.active {
        height: 100vh;
        width: 100vw;
        overflow: hidden;

        .splash-screen-inner {
            opacity: 0;
        }

        background-color: #e4e5e6;
        &::after {
            content: " ";
            position: absolute;
            left: 0;
            top: 0;
            height: 100vh;
            width: 100vw;
            display: block !important;
            background-image: url('~@img/icon_fm_blue.svg');
            background-size: 20vh 20vh;
            background-repeat: no-repeat;
            background-position: center;
            animation: pulse 1s infinite ease-in-out alternate;
        }
    }
</style>
