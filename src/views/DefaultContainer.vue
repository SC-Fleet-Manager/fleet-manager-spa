<template>
    <div class="app">
        <AppHeader fixed>
            <SidebarToggler class="d-lg-none" display="md" mobile/>
            <router-link class="navbar-brand" to="/my-fleet">
                <img class="navbar-brand-full" src="@img/logo_fm_blue.svg" alt="SC Fleet Manager" height="40">
                <img class="navbar-brand-minimized" src="@img/icon_fm_blue.svg" alt="FM" height="40">
            </router-link>
            <SidebarToggler class="d-md-down-none" display="lg" :defaultOpen="true" ref="sidebarDesktop"/>
            <div v-if="displayEnv" class="p-3 bg-danger text-white text-uppercase">{{ environment }}</div>
            <b-navbar-nav class="ml-auto">
                <b-nav-text v-if="profile !== null" class="px-3 d-none d-sm-inline-block">Welcome, {{ profile.nickname }}</b-nav-text>
                <b-nav-text v-if="profile !== null && profile.coins > 0" class="px-3 d-none d-sm-inline-block"><img src="@img/coin.svg" title="FM Coins" alt="FM Coins" height="30"> {{ profile.coins }}</b-nav-text>
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
                <router-link :to="{ name: 'Home' }">Fleet Manager</router-link>
                <span>{{ lastVersion }}</span>
                <span class="ml-1">&copy; 2018 - {{ actualYear }}</span>
                - <router-link to="/privacy-policy">Privacy policy</router-link>.
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
    import { mapState } from 'vuex';
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
                patchNotes: [],
                versionCommitHash: null,
            }
        },
        created() {
            this.loadNewPatchNoteIfNew();
            this.loadVersionCommitHash();
        },
        computed: {
            ...mapState(['accessToken', 'profile']),
            lastVersion() {
                let version = Config.version;
                if (Config.environment !== 'prod') {
                    version += `-${Config.environment}${this.versionCommitHash !== null ? '-'+this.versionCommitHash : ''}`;
                }

                return version;
            },
            actualYear() {
                return (new Date()).getFullYear();
            },
            nav() {
                const nav = [];
                nav.push(
                    {
                        name: 'My Fleet',
                        url: `/my-fleet`,
                        icon: 'fas fa-fighter-jet',
                        attributes: {
                            disabled: !this.profile,
                        },
                    },
                    {
                        name: 'My Orgas',
                        url: '/my-organizations',
                        icon: 'fas fa-space-shuttle',
                        attributes: {
                            disabled: !this.profile,
                        },
                    },
                    {
                        name: "Profile",
                        url: '/profile',
                        icon: 'fas fa-user',
                        attributes: {
                            disabled: !this.profile,
                        },
                    },
                );

                return nav;
            },
            environment() {
                return Config.environment;
            },
            displayEnv() {
                return Config.environment === 'beta';
            }
        },
        methods: {
            logout() {
                this.$auth.logout({
                    returnTo: window.location.origin
                });
            },
            async loadVersionCommitHash() {
                if (Config.environment === 'prod') {
                    return;
                }
                try {
                    this.versionCommitHash = null;
                    const response = await axios.get('https://api.github.com/repos/Ioni14/fleet-manager-spa/branches/master');
                    if (response.data && response.data.commit) {
                        this.versionCommitHash = response.data.commit.sha.substring(0, 6);
                    }
                } catch (err) {
                    console.error(err);
                }
            },
            async loadNewPatchNoteIfNew() {
                if (!this.accessToken) {
                    return;
                }
                try {
                    const response = await axios.get(`${Config.api_base_url}/api/patch-note/has-new-patch-note`, {
                        headers: {
                            Authorization: `Bearer ${this.accessToken}`,
                        }
                    });
                    if (response.data.hasNewPatchNote) {
                        this.$bvModal.show('modal-patch-notes');
                    }
                } catch (err) {
                    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                        this.$toastr.e('You have been disconnected. Please login again.');
                        this.$router.push({ name: 'Home' });
                        return;
                    }
                    console.error(err);
                }
            },
            async onShowPatchNotes() {
                try {
                    const response = await axios.get(`${Config.api_base_url}/api/patch-note/last-patch-notes`, {
                        headers: {
                            Authorization: `Bearer ${this.$store.state.accessToken}`,
                        }
                    });
                    this.patchNotes = response.data.patchNotes;
                } catch (err) {
                    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                        this.$toastr.e('You have been disconnected. Please login again.');
                        this.$router.push({ name: 'Home' });
                        return;
                    }
                    if (err.response.data.errorMessage) {
                        this.$toastr.e(err.response.data.errorMessage);
                        return;
                    }
                    this.$toastr.e('Sorry, an unexpected error has occurred when requesting the last patch notes. Please try again later.');
                }
            },
            nl2br(str) {
                return str.replace(/(?:\r\n|\r|\n)/g, '<br />');
            },
        }
    };
</script>
