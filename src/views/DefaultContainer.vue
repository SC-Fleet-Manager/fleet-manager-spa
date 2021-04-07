<template>
    <div class="app">
        <AppHeader fixed>
            <SidebarToggler class="d-lg-none" display="md" mobile/>
            <b-link class="navbar-brand" href="/">
                <img class="navbar-brand-full" src="@img/logo_fm_blue.svg" alt="SC Fleet Manager" height="40">
                <img class="navbar-brand-minimized" src="@img/icon_fm_blue.svg" alt="FM" height="40">
            </b-link>
            <SidebarToggler class="d-md-down-none" display="lg" :defaultOpen="true" ref="sidebarDesktop"/>
            <b-navbar-nav class="ml-auto">
                <b-nav-text v-if="user !== null" class="px-3 d-none d-sm-inline-block">Welcome, {{ user.auth0Username }}</b-nav-text>
                <b-nav-text v-if="user !== null && user.coins > 0" class="px-3 d-none d-sm-inline-block"><img src="@img/coin.svg" title="FM Coins" alt="FM Coins" height="30"> {{ user.coins }}</b-nav-text>
                <b-nav-item v-if="$auth.isAuthenticated" class="px-3" @click="logout"><i class="fas fa-sign-out-alt"></i> Logout</b-nav-item>
                <b-nav-item v-else class="px-3" v-b-modal.modal-login><i class="fas fa-sign-in-alt"></i> Login</b-nav-item>
            </b-navbar-nav>
        </AppHeader>
        <div class="app-body">
            <AppSidebar fixed>
                <SidebarNav :navItems="nav"></SidebarNav>
                <SidebarMinimizer/>
            </AppSidebar>
            <main class="main">
                <div class="container-fluid mt-4">
                    <router-view></router-view>
                </div>
            </main>
        </div>
        <TheFooter class="font-lg">
            <div>
                <a href="/">Fleet Manager</a>
                <a href="https://blog.fleet-manager.space/tag/change-logs/" target="_blank">{{ lastVersion }}</a>
                <span class="ml-1">&copy; 2018 - {{ actualYear }}</span>
                - <a href="/privacy-policy">Privacy policy</a>.
                Star Citizen is a product of Cloud Imperium Rights LLC and Cloud Imperium Rights Ltd.
            </div>
            <b-nav class="ml-auto">
                <b-nav-item link-classes="p-2" v-b-modal.modal-patch-notes>Patch notes</b-nav-item>
                <b-nav-text class="p-2">–</b-nav-text>
                <b-nav-item href="https://discord.gg/f6mrA3Y" target="_blank" link-classes="p-2"><i class="fab fa-discord" style="font-size: 1.4rem;"></i></b-nav-item>
                <b-nav-item href="https://github.com/Ioni14/starcitizen-fleet-manager" target="_blank" link-classes="p-2"><i class="fab fa-github" style="font-size: 1.4rem;"></i></b-nav-item>
            </b-nav>
        </TheFooter>

        <b-modal id="modal-patch-notes" ref="modalPatchNotes" size="lg" centered scrollable title="What's new?" hide-footer @show="onShowPatchNotes">
            <div v-for="patchNote in patchNotes" :key="patchNote.id">
                <h5>{{ patchNote.title }}</h5>
                <p v-html="nl2br(patchNote.body)"></p>
                <p v-if="patchNote.link"><a :href="patchNote.link" target="_blank">{{ patchNote.link }}</a></p>
            </div>
        </b-modal>
    </div>
</template>

<script>
    import axios from 'axios';
    import {
        Header as AppHeader,
        SidebarToggler,
        Sidebar as AppSidebar,
        SidebarMinimizer,
        SidebarNav,
        Footer as TheFooter
    } from '@coreui/vue';
    import { mapMutations } from 'vuex';
    import Config from '@config/config.json';

    export default {
        name: 'DefaultContainer',
        components: {
            AppHeader,
            AppSidebar,
            TheFooter,
            SidebarNav,
            SidebarToggler,
            SidebarMinimizer
        },
        data() {
            return {
                actualYear: (new Date()).getFullYear(),
                user: null,
                citizen: null,
                lastVersion: null,
                patchNotes: [],
            }
        },
        created() {
            if (!this.$auth.loading) {
                this.loadAuthRequests();
            } else {
                this.$auth.$on('loaded', this.loadAuthRequests);
            }
            this.findLastVersion();
        },
        computed: {
            name() {
                return this.$route.name
            },
            nav() {
                const nav = [];
                nav.push(
                    {
                        name: 'My Fleet',
                        url: `/my-fleet`,
                        icon: 'fas fa-fighter-jet',
                    },
                    {
                        name: 'My Orgas',
                        url: '/my-organizations',
                        icon: 'fas fa-space-shuttle',
                    },
                    {
                        name: "Profile",
                        url: '/profile',
                        icon: 'fas fa-user',
                        attributes: {
                            disabled: !this.user,
                        },
                    },
                );

                return nav;
            }
        },
        methods: {
            ...mapMutations(['updateUser']),
            logout() {
                this.$auth.logout({
                    returnTo: window.location.origin
                });
            },
            async loadAuthRequests() {
                const token = await this.$auth.getTokenSilently();
                if (!this.$auth.isAuthenticated) {
                    return;
                }
                this.loadProfile(token);
                this.loadNewPatchNoteIfNew(token);
            },
            loadProfile(token) {
                axios.get(`${Config.api_base_url}/api/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }).then(response => {
                    this.user = response.data;
                    this.updateUser(this.user);
                });
            },
            loadNewPatchNoteIfNew(token) {
                axios.get(`${Config.api_base_url}/api/patch-note/has-new-patch-note`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }).then(response => {
                    if (response.data.hasNewPatchNote === true) {
                        this.$bvModal.show('modal-patch-notes');
                    }
                });
            },
            findLastVersion() {
                axios.get('https://api.github.com/repos/Ioni14/starcitizen-fleet-manager/tags').then(response => {
                    this.lastVersion = response.data[0].name;
                });
            },
            async onShowPatchNotes() {
                const token = await this.$auth.getTokenSilently();
                if (!this.$auth.isAuthenticated) {
                    this.$toastr.e('Sorry, we are unable to display the last patch notes for the moment. Please try again later.');
                    return;
                }
                try {
                    const response = await axios.get(`${Config.api_base_url}/api/patch-note/has-new-patch-note`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    });
                    this.patchNotes = response.data.patchNotes;
                } catch (err) {
                    if (err.response.data.errorMessage) {
                        this.$toastr.e(err.response.data.errorMessage);
                    } else {
                        this.$toastr.e('Sorry, an unexpected error has occurred when requesting the last patch notes. Please try again later.');
                    }
                }
            },
            nl2br(str) {
                return str.replace(/(?:\r\n|\r|\n)/g, '<br />');
            },
        }
    };
</script>

<style lang="scss">
    $fa-font-path: '~@fortawesome/fontawesome-free/webfonts/';
    @import '~@fortawesome/fontawesome-free/scss/fontawesome';
    @import '~@fortawesome/fontawesome-free/scss/solid';
    @import '~@fortawesome/fontawesome-free/scss/brands';
    /*@import '~@fortawesome/fontawesome-free/scss/regular';*/
    @import '~bootstrap-vue/dist/bootstrap-vue.css';
    @import '~@styles/style.scss';
</style>
