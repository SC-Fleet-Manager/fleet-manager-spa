<template>
    <div>
        <p>HomeWrapped</p>

        <div v-if="!$auth.loading">
            <!-- show login when not authenticated -->
            <button v-if="!$auth.isAuthenticated" @click="login">Log in</button>
            <!-- show logout when authenticated -->
            <button v-if="$auth.isAuthenticated" @click="logout">Log out</button>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'home-wrapped',
        methods: {
            login() {
                console.log('login with Auth0');
                this.$auth.loginWithRedirect();
            },
            logout() {
                console.log('logout');
                this.$auth.logout({
                    returnTo: window.location.origin
                });
            }
        }
    }
</script>
