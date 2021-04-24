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
                    <b-dropdown-item v-if="isFounder" :to="'/my-organizations/'+orga.sid+'/manage'">
                        <i class="fa fa-cogs text-primary"></i> Manage organization
                    </b-dropdown-item>
                    <b-dropdown-item v-else @click="leaveOrga">
                        <i class="fas fa-door-closed text-danger"></i> Leave organization
                    </b-dropdown-item>
                </b-dropdown>
                <template v-if="orga !== null">
                    <b-button v-if="isFounder" class="btn-action-orga mb-3 ml-2 flex-shrink-0" variant="primary" role="button" :to="'/my-organizations/'+orga.sid+'/manage'"><i class="fa fa-cogs"></i> Manage organization</b-button>
                    <b-button v-else class="btn-action-orga mb-3 ml-2 flex-shrink-0" variant="ouline-danger" role="button" @click="leaveOrga"><i class="fas fa-door-closed"></i> Leave organization</b-button>
                </template>
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
                    <OrgaShipCard v-for="ship in filteredlistOfShips" :key="ship.id" :ship="ship"/>
                </b-row>
                <b-alert v-if="errorMessage !== null" show variant="danger">{{ errorMessage }}</b-alert>
                <b-alert v-else-if="hasNoShips" show variant="warning">The organization does not have any ships. Why don't you create one on <router-link to="/my-fleet">My Fleet page</router-link>?</b-alert>
            </div>
        </b-card>
    </div>
</template>

<script>
import axios from 'axios';
import Config from '@config/config.json';
import OrgaShipCard from '@/components/OrgaShipCard.vue';
import exported from 'locale-index-of';
const localeIndexOf = exported(Intl);

export default {
    name: 'organization',
    components: {OrgaShipCard},
    data() {
        return {
            form: {
                search: null,
            },
            orga: null,
            errorMessage: null,
            listOfOrgasLoaded: false,
            listOfShipsLoaded: false,
            listOfShips: [],
        };
    },
    async created() {
        if (this.$store.state.myOrgasList === null) {
            await this.loadOrgaList();
        } else {
            this.listOfOrgasLoaded = true;
        }
        this.loadCurrentOrganization();
    },
    beforeRouteUpdate(to, from, next) {
        // if we go from /my-organizations/ABC to /my-organizations/DEF
        next();
        this.loadCurrentOrganization();
    },
    computed: {
        hasNoShips() {
            return this.listOfShips.length === 0;
        },
        filteredlistOfShips() {
            if (!this.form.search) {
                return this.listOfShips;
            }

            return this.listOfShips.filter((ship) => {
                return -1 !== localeIndexOf(ship.model, this.form.search, 'en', { sensitivity: 'base', ignorePunctuation: true });
            });
        },
    },
    methods: {
        loadCurrentOrganization() {
            for (const orga of this.$store.state.myOrgasList) {
                if (orga.sid.toLowerCase() === this.$route.params.sid.toLowerCase()) {
                    this.orga = orga;
                    break;
                }
            }
            this.loadShipList();
        },
        async loadOrgaList() {
            try {
                this.errorMessage = null;
                const response = await axios.get(`${Config.api_base_url}/api/my-organizations`, {
                    headers: {
                        Authorization: `Bearer ${this.$store.state.accessToken}`,
                    },
                });
                this.$store.commit('myOrgasList', response.data.organizations);
            } catch (err) {
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    this.$toastr.e('You have been disconnected. Please login again.');
                    this.$router.push({ name: 'Home' });
                    return;
                }
                this.errorMessage = 'Sorry, we are unable to retrieve this organization. Please, try again later.';
            } finally {
                this.listOfOrgasLoaded = true;
            }
        },
        async loadShipList() {
            try {
                this.errorMessage = null;
                const response = await axios.get(`${Config.api_base_url}/api/organizations/${this.orga.id}`, {
                    headers: {
                        Authorization: `Bearer ${this.$store.state.accessToken}`,
                    },
                });
                this.listOfShips = response.data.fleet.ships;
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
        leaveOrga() {

        },
        isFounder() {
            return this.$store.state.profile.id === this.orga.founderId;
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
