<template>
    <div>
        <b-card no-body>
            <b-form @submit="onSubmit">
                <b-tabs card>
                    <b-tab title="Ship" active>
                        <b-card-text>
                            <b-form-group class="mb-4" label="Ship chassis *" label-for="input-ship-chassis">
                                <b-form-input
                                    id="input-ship-chassis"
                                    v-model="form.chassis.value"
                                    type="text"
                                    :state="stateChassis"
                                    required
                                ></b-form-input>
                                <b-form-invalid-feedback :state="stateChassis">{{ form.chassis.violation }}</b-form-invalid-feedback>
                            </b-form-group>
                            <b-form-group class="mb-4" label="Ship variant *" label-for="input-ship-variant">
                                <b-form-input
                                    id="input-ship-variant"
                                    v-model="form.variant.value"
                                    type="text"
                                    :state="stateVariant"
                                    required
                                ></b-form-input>
                                <b-form-invalid-feedback :state="stateVariant">{{ form.variant.violation }}</b-form-invalid-feedback>
                            </b-form-group>
                            <b-form-group class="mb-4" label="Ship picture " label-for="input-ship-pictureUrl">
                                <b-form-input
                                    id="input-ship-pictureUrl"
                                    v-model="form.pictureUrl.value"
                                    type="text"
                                    :state="statePictureUrl"
                                    required
                                ></b-form-input>
                                <b-form-invalid-feedback :state="statePictureUrl">{{ form.pictureUrl.violation }}</b-form-invalid-feedback>
                            </b-form-group>
                        </b-card-text>
                    </b-tab>
                    <b-tab title="Manufacturer">
                        <b-card-text>
                            <b-form-group class="mb-4" label="Manufacturer name (optional)" label-for="input-manufacturer-name">
                                <b-form-input
                                    id="input-manufacturer-name"
                                    v-model="form.manufacturerName.value"
                                    type="text"
                                    :state="stateManufacturerName"
                                    required
                                ></b-form-input>
                                <b-form-invalid-feedback :state="stateManufacturerName">{{ form.manufacturerName.violation }}</b-form-invalid-feedback>
                            </b-form-group>
                            <b-form-group class="mb-4" label="Manufacturer code (optional)" label-for="input-manufacturer-code">
                                <b-form-input
                                    id="input-manufacturer-code"
                                    v-model="form.manufacturerCode.value"
                                    type="text"
                                    :state="stateManufacturerCode"
                                    required
                                ></b-form-input>
                                <b-form-invalid-feedback :state="stateManufacturerCode">{{ form.manufacturerCode.violation }}</b-form-invalid-feedback>
                            </b-form-group>
                        </b-card-text>
                    </b-tab>
                    <b-tab title="Utility">
                        <b-card-text>
                            <b-form-group class="mb-4" label="Ship size (optional)" label-for="input-ship-size">
                                <b-form-input
                                    id="input-ship-size"
                                    v-model="form.shipSize.value"
                                    type="text"
                                    :state="stateShipSize"
                                    required
                                ></b-form-input>
                                <b-form-invalid-feedback :state="stateShipSize">{{ form.shipSize.violation }}</b-form-invalid-feedback>
                            </b-form-group>
                            <b-form-group class="mb-4" label="Ship role (optional)" label-for="input-ship-role">
                                <b-form-input
                                    id="input-ship-role"
                                    v-model="form.shipRole.value"
                                    type="text"
                                    :state="stateShipRole"
                                    required
                                ></b-form-input>
                                <b-form-invalid-feedback :state="stateShipRole">{{ form.shipRole.violation }}</b-form-invalid-feedback>
                            </b-form-group>
                            <b-form-group class="mb-4" label="Cargo capacity (optional)" label-for="input-cargo-capacity">
                                <b-form-input
                                    id="input-cargo-capacity"
                                    v-model="form.cargoCapacity.value"
                                    type="text"
                                    :state="stateCargoCapacity"
                                    required
                                ></b-form-input>
                                <b-form-invalid-feedback :state="stateCargoCapacity">{{ form.cargoCapacity.violation }}</b-form-invalid-feedback>
                            </b-form-group>
                            <b-form-group class="mb-4" content-cols-lg="3" label="Min crew (optional)" label-for="input-min-crew">
                                <b-form-input
                                    id="input-min-crew"
                                    v-model="form.minCrew.value"
                                    type="text"
                                    :state="stateMinCrew"
                                    required
                                ></b-form-input>
                                <b-form-invalid-feedback :state="stateMinCrew">{{ form.minCrew.violation }}</b-form-invalid-feedback>
                            </b-form-group>
                            <b-form-group class="mb-4" content-cols-lg="3" label="Max crew (optional)" label-for="input-max-crew">
                                <b-form-input
                                    id="input-max-crew"
                                    v-model="form.maxCrew.value"
                                    type="text"
                                    :state="stateMaxCrew"
                                    required
                                ></b-form-input>
                                <b-form-invalid-feedback :state="stateMaxCrew">{{ form.maxCrew.violation }}</b-form-invalid-feedback>
                            </b-form-group>
                        </b-card-text>
                    </b-tab>
                    <b-tab title="Prices">
                        <b-card-text>
                            <b-form-group class="mb-4" label="Pledge price (optional)" label-for="input-pledge-price">
                                <b-form-input
                                    id="input-pledge-price"
                                    v-model="form.pledgePrice.value"
                                    type="text"
                                    :state="statePledgePrice"
                                    required
                                ></b-form-input>
                                <b-form-invalid-feedback :state="statePledgePrice">{{ form.pledgePrice.violation }}</b-form-invalid-feedback>
                            </b-form-group>
                            <b-form-group class="mb-4" label="In game price (optional)" label-for="input-in-game-price">
                                <b-form-input
                                    id="input-in-game-price"
                                    v-model="form.inGamePrice.value"
                                    type="text"
                                    :state="stateInGamePrice"
                                    required
                                ></b-form-input>
                                <b-form-invalid-feedback :state="stateInGamePrice">{{ form.inGamePrice.violation }}</b-form-invalid-feedback>
                            </b-form-group>
                        </b-card-text>
                    </b-tab>
                </b-tabs>
            </b-form>
        </b-card>
    </div>
</template>

<script>
import axios from 'axios';
import Config from '@config/config.json';

export default {
    name: "CreateTemplate",
    data() {
        return {
            form: null,
            globalViolation: null,
            submitDisabled: false,
        };
    },
    created() {
        this.resetForm();
    },
    computed: {
        stateChassis() {
            return this.form.chassis.violation !== null ? false : null;
        },
        stateVariant() {
            return this.form.variant.violation !== null ? false : null;
        },
        statePictureUrl() {
            return this.form.pictureUrl.violation !== null ? false : null;
        },
        stateManufacturerName() {
            return this.form.manufacturerName.violation !== null ? false : null;
        },
        stateManufacturerCode() {
            return this.form.manufacturerCode.violation !== null ? false : null;
        },
        stateShipSize() {
            return this.form.shipSize.violation !== null ? false : null;
        },
        stateShipRole() {
            return this.form.shipRole.violation !== null ? false : null;
        },
        stateCargoCapacity() {
            return this.form.cargoCapacity.violation !== null ? false : null;
        },
        stateMinCrew() {
            return this.form.minCrew.violation !== null ? false : null;
        },
        stateMaxCrew() {
            return this.form.maxCrew.violation !== null ? false : null;
        },
        statePledgePrice() {
            return this.form.pledgePrice.violation !== null ? false : null;
        },
        stateInGamePrice() {
            return this.form.inGamePrice.violation !== null ? false : null;
        }
    },
    methods: {
        resetForm() {
            this.form = {
                chassis: {
                    value: null,
                    violation: null,
                },
                variant: {
                    value: null,
                    violation: null,
                },
                pictureUrl: {
                    value: null,
                    violation: null,
                },
                manufacturerName: {
                    value: null,
                    violation: null,
                },
                manufacturerCode: {
                    value: null,
                    violation: null,
                },
                shipSize: {
                    value: null,
                    violation: null,
                },
                shipRole: {
                    value: null,
                    violation: null,
                },
                cargoCapacity: {
                    value: null,
                    violation: null,
                },
                minCrew: {
                    value: null,
                    violation: null,
                },
                maxCrew: {
                    value: null,
                    violation: null,
                },
                pledgePrice: {
                    value: null,
                    violation: null,
                },
                inGamePrice: {
                    value: null,
                    violation: null,
                },
            };
        },
        // async onSubmit(ev) {
        //     ev.preventDefault();
        //     try {
        //         this.submitDisabled = true;
        //         this.globalViolation = null;
        //         this.form.name.violation = null;
        //         this.form.logoUrl.violation = null;
        //         await axios.post(`${Config.api_base_url}/api/`, {
        //             name: this.form.name.value || null,
        //             logoUrl: this.form.logoUrl.value || null
        //         }, {
        //             headers: {
        //                 Authorization: `Bearer ${this.$store.state.accessToken}`,
        //             },
        //         });
        //         this.$toastr.s('Your organization has been updated!');
        //         bus.$emit('updateMyOrganizations');
        //     } catch (err) {
        //         if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        //             this.$toastr.e('You have been disconnected. Please login again.');
        //             this.$router.push({ name: 'Home' });
        //             return;
        //         }
        //         this.handleViolations(err.response);
        //     } finally {
        //         this.submitDisabled = false;
        //     }
        // },
        // handleViolations(response) {
        //     const data = response.data;
        //     for (const violation of data.violations.violations) {
        //         switch (violation.propertyPath) {
        //             case '':
        //                 this.globalViolation = violation.title;
        //                 break;
        //             case 'name':
        //                 this.form.name.violation = violation.title;
        //                 break;
        //             case 'logoUrl':
        //                 this.form.logoUrl.violation = violation.title;
        //                 break;
        //         }
        //     }
        // }
    }
}
</script>

<style scoped>

</style>
