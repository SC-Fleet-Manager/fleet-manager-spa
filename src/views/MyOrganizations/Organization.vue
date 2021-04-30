<template>
    <div class="animated fadeIn">
        <b-card>
            <div class="btn-actions-orga d-flex justify-content-end align-items-baseline flex-wrap flex-nowrap">
                <b-breadcrumb class="mb-3" style="flex-grow:1;" :items="[
                    {
                        text: 'My organizations',
                        to: { name: 'My organizations' },
                    },
                    {
                        text: orga !== null ? orga.name : $route.params.sid,
                        active: true,
                    },
                ]"></b-breadcrumb>
                <b-dropdown v-if="orga !== null" class="d-sm-none" size="lg" right variant="link" toggle-class="text-decoration-none" no-caret>
                    <template #button-content>
                        <span class="navbar-toggler-icon"></span>
                    </template>
                    <b-dropdown-item v-if="orga.founder" :to="'/my-organizations/'+orga.sid+'/manage'">
                        <i class="fa fa-cogs text-primary"></i> Manage organization
                    </b-dropdown-item>
                    <b-dropdown-item v-else v-b-modal.modal-leave-orga>
                        <i class="fas fa-door-closed text-danger"></i> Leave organization
                    </b-dropdown-item>
                </b-dropdown>
                <template v-if="orga !== null">
                    <b-button v-if="orga.founder" class="btn-action-orga mb-3 ml-2 flex-shrink-0" variant="primary" role="button" :to="'/my-organizations/'+orga.sid+'/manage'"><i class="fa fa-cogs"></i> Manage organization</b-button>
                    <b-button v-else v-b-modal.modal-leave-orga class="btn-action-orga mb-3 ml-2 flex-shrink-0" variant="outline-danger" role="button"><i class="fas fa-door-closed"></i> Leave organization</b-button>
                </template>
                <b-modal id="modal-leave-orga" ref="modalLeaveOrga" size="lg" centered title="Leave organization" hide-footer>
                    <b-alert variant="warning" :show="true"><i class="fa fa-exclamation-triangle"></i> You are about to leave the organization.
                        <br />Are you sure you want to confirm?
                    </b-alert>
                    <b-alert v-if="leaveOrgaErrorMessage !== null" variant="danger" show v-html="leaveOrgaErrorMessage"></b-alert>
                    <b-button v-else size="lg" block variant="danger" @click="leaveOrga">Leave organization</b-button>
                </b-modal>
            </div>
            <h3 class="mb-3"><b-img v-if="orga !== null && orga.logoUrl !== null" class="orga-logo-img mr-2" :src="orga.logoUrl"/>{{orga !== null ? orga.name : $route.params.sid}}</h3>
            <div class="mb-4 px-0 col-12 col-md-5 col-xl-3">
                <b-input-group>
                    <template #prepend>
                        <b-input-group-text style="background-color: white;"><i class="fa fa-search"></i></b-input-group-text>
                    </template>
                    <b-form-input v-model="form.search" type="search" debounce="100" :trim="true" placeholder="Search a ship"></b-form-input>
                </b-input-group>
            </div>

            <div v-if="!listOfShipsLoaded || !listOfOrgasLoaded" class="d-flex justify-content-center">
                <b-spinner label="Loading..." style="width: 3rem; height: 3rem;"></b-spinner>
            </div>
            <div v-else>
                <b-row cols-lg="mt-3">
                    <OrgaShipCard v-for="ship in filteredlistOfShips" :key="ship.id" :ship="ship" :visible="visible" @showOwners="onShowOwners"/>
                </b-row>
                <b-alert v-if="errorMessage !== null" show variant="danger">{{ errorMessage }}</b-alert>
                <b-alert v-else-if="hasNoShips" show variant="warning">The organization does not have any ships. Why don't you create one on <router-link to="/my-fleet">My Fleet page</router-link>?</b-alert>
            </div>
            <b-sidebar
                id="sidebar-backdrop"
                ref="sidebarBackdrop"
                v-if="selectShip !== null"
                :title="selectShip.model"
                bg-variant="light"
                :backdrop-variant="variant"
                backdrop
                shadow
                right
                v-model="visible"
                width="300px"
            >
                <ul class="px-4 py-2" v-if="owners !== null">
                    <li v-for="owner in owners" :key="owner.id" class="h5 d-flex justify-content-between w-100" style="list-style: none">
                        {{ owner.nickname ? owner.nickname : owner.handle }}
                        <b-badge variant="primary">{{ owner.quantity }}</b-badge>
                    </li>
                </ul>
            </b-sidebar>
        </b-card>
    </div>
</template>

<script>
import axios from 'axios';
import Config from '@config/config.json';
import OrgaShipCard from '@/components/OrgaShipCard.vue';
import exported from 'locale-index-of';
import {mapState} from "vuex";
const localeIndexOf = exported(Intl);
import bus from '@/bus';

export default {
    name: 'organization',
    components: {OrgaShipCard},
    data() {
        return {
            form: {
                search: null,
            },
            orgaId: null,
            orga: null,
            errorMessage: null,
            listOfOrgasLoaded: false,
            listOfShipsLoaded: false,
            leaveOrgaErrorMessage: null,
            selectShip: null,
            visible: false,
            variant: 'dark',
            owners: [],
        };
    },
    beforeRouteUpdate(to, from, next) {
        // if we go from /my-organizations/ABC to /my-organizations/DEF
        next();
        this.loadCurrentOrganization();
    },
    created() {
        if (this.myOrgasList !== null) {
            this.listOfOrgasLoaded = true;
            this.loadCurrentOrganization();
        }
    },
    computed: {
        ...mapState(['myOrgasList']),
        hasNoShips() {
            return this.orga.fleet.ships.length === 0;
        },
        filteredlistOfShips() {
            if (!this.form.search) {
                return this.orga.fleet.ships;
            }

            return this.orga.fleet.ships.filter((ship) => {
                return -1 !== localeIndexOf(ship.model, this.form.search, 'en', { sensitivity: 'base', ignorePunctuation: true });
            });
        },
    },
    watch: {
        myOrgasList() {
            this.listOfOrgasLoaded = true;
            this.loadCurrentOrganization();
        },
    },
    methods: {
        loadCurrentOrganization() {
            for (const orga of this.$store.state.myOrgasList) {
                if (orga.sid.toLowerCase() === this.$route.params.sid.toLowerCase()) {
                    this.orgaId = orga.id;
                    break;
                }
            }
            this.loadOrganization();
        },
        async loadOrganization() {
            try {
                this.errorMessage = null;
                const response = await axios.get(`${Config.api_base_url}/api/organizations/${this.orgaId}`, {
                    headers: {
                        Authorization: `Bearer ${this.$store.state.accessToken}`,
                    },
                });
                this.orga = response.data;
                this.orga.fleet.ships.sort((ship1, ship2) => {
                    return ship2.quantity - ship1.quantity;
                });
            } catch (err) {
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    this.$toastr.e('You have been disconnected. Please login again.');
                    this.$router.push({ name: 'Home' });
                    return;
                }
                if (err.response.status === 400){
                    this.errorMessage = err.response.data.errorMessage;
                    return;
                }
                this.errorMessage = "Sorry, we are unable to retrieve this organization's fleet. Please, try again later.";
            } finally {
                this.listOfShipsLoaded = true;
            }
        },
        async leaveOrga() {
            try {
                this.leaveOrgaErrorMessage = null;
                await axios.post(`${Config.api_base_url}/api/organizations/${this.orgaId}/leave`, {}, {
                    headers: {
                        Authorization: `Bearer ${this.$store.state.accessToken}`,
                    },
                });
                bus.$emit('updateMyOrganizations');
                this.$toastr.s('You have left the organization');
                this.$router.push({ name: 'My organizations' });
            } catch (err) {
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    this.$toastr.e('You have been disconnected. Please login again.');
                    this.$router.push({ name: 'Home' });
                    return;
                }
                if (err.response && err.response.status === 400) {
                    this.errorMessage = err.response.data.errorMessage;
                    return;
                }
                console.error(err);
                this.leaveOrgaErrorMessage = 'Sorry, you are unable to leave this organization for the moment.';
            }
        },
        onShowOwners(ship) {
            this.selectShip = ship;
            this.loadOwners(ship);
            this.$nextTick(() => {
                if (this.selectShip.imageUrl) {
                    this.$refs.sidebarBackdrop.$el.querySelector('.b-sidebar').style.backgroundImage = `url(${this.selectShip.imageUrl})`;
                } else {
                    this.$refs.sidebarBackdrop.$el.querySelector('.b-sidebar').style.backgroundImage = 'none';
                }
                this.visible = true;
            });
        },
        async loadOwners(ship) {
            try {
                const response = await axios.get(`${Config.api_base_url}/api/organizations/${this.orgaId}/ship/${ship.model}/owners`, {
                    headers: {
                        Authorization: `Bearer ${this.$store.state.accessToken}`,
                    },
                });
                this.owners = response.data.owners;
            } catch (err) {
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    this.$toastr.e('You have been disconnected. Please login again.');
                    this.$router.push({ name: 'Home' });
                    return;
                }
                if (err.response && err.response.status === 400) {
                    this.$toastr.e(err.response.data.errorMessage);
                    return;
                }
                console.error(err);
                this.$toastr.e('Sorry, we are unable to load the ship owners for the moment. Please, try again later.');
            }
        },
    }
}
</script>

<style lang="scss" scoped>
@import '~@styles/style.scss';

.navbar-toggler-icon {
    background-image: $navbar-toggler-icon;
}

.btn-actions-orga {
    .btn-action-orga {
        display: none;
        @include media-breakpoint-up(sm) {
            display: inline-block;
        }
    }
}

.orga-logo-img {
    max-height: 80px;
    @include media-breakpoint-up(sm) {
        max-height: 110px;
    }
    @include media-breakpoint-up(md) {
        max-height: 130px;
    }
}
</style>
