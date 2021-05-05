<template>
    <div>
        <b-card no-body>
            <b-form @submit="onSubmit">
                <b-tabs v-model="tabIndex" card>
                    <b-tab title="Ship" active>
                        <b-card-text>
                            <b-form-group class="mb-4" label="Ship chassis *" label-for="input-ship-chassis">
                                <b-form-input
                                    id="input-ship-chassis"
                                    v-model="form.chassis.value"
                                    type="text"
                                    :state="stateChassis"
                                    placeholder="Constellation"
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
                                    placeholder="Aquila"
                                    required
                                ></b-form-input>
                                <b-form-invalid-feedback :state="stateVariant">{{ form.variant.violation }}</b-form-invalid-feedback>
                            </b-form-group>
                            <b-form-group class="mb-4" label="Ship picture (optional)" label-for="input-ship-pictureUrl" description="Only from RSI or starcitizen.tools">
                                <b-form-input
                                    id="input-ship-pictureUrl"
                                    v-model="form.pictureUrl.value"
                                    type="url"
                                    :state="statePictureUrl"
                                    debounce="500"
                                    placeholder="https://media.robertsspaceindustries.com/c2k21tjgn3z6a/store_small.jpg"
                                ></b-form-input>
                                <b-form-invalid-feedback :state="statePictureUrl">{{ form.pictureUrl.violation }}</b-form-invalid-feedback>
                            </b-form-group>
                        </b-card-text>
                        <b-button class="d-block ml-auto" variant="primary" @click="tabIndex++">Next</b-button>
                    </b-tab>
                    <b-tab title="Manufacturer">
                        <b-card-text>
                            <b-form-group class="mb-4" label="Manufacturer name (optional)" label-for="input-manufacturer-name">
                                <b-form-input
                                    id="input-manufacturer-name"
                                    v-model="form.manufacturerName.value"
                                    type="text"
                                    :state="stateManufacturerName"
                                    placeholder="Robert Space Industries"
                                ></b-form-input>
                                <b-form-invalid-feedback :state="stateManufacturerName">{{ form.manufacturerName.violation }}</b-form-invalid-feedback>
                            </b-form-group>
                            <b-form-group class="mb-4" label="Manufacturer code (optional)" label-for="input-manufacturer-code">
                                <b-form-input
                                    id="input-manufacturer-code"
                                    v-model="form.manufacturerCode.value"
                                    type="text"
                                    :state="stateManufacturerCode"
                                    placeholder="RSI"
                                ></b-form-input>
                                <b-form-invalid-feedback :state="stateManufacturerCode">{{ form.manufacturerCode.violation }}</b-form-invalid-feedback>
                            </b-form-group>
                            <b-button class="d-block ml-auto" variant="primary" @click="tabIndex++">Next</b-button>
                        </b-card-text>
                    </b-tab>
                    <b-tab title="Utility">
                        <b-card-text>
                            <b-form-group class="mb-4" label="Ship size (optional)" label-for="input-ship-size">
                                <b-form-select
                                    id="input-ship-size"
                                    class=""
                                    :options="[{ text: 'Choose...', value: null }, 'Vehicule', 'Snub', 'Small', 'Medium', 'Large', 'Capital']"
                                    :value="null"
                                ></b-form-select>
                                <b-form-invalid-feedback :state="stateShipSize">{{ form.shipSize.violation }}</b-form-invalid-feedback>
                            </b-form-group>
                            <b-form-group class="mb-4" label="Ship role (optional)" label-for="input-ship-role">
                                <b-form-input
                                    id="input-ship-role"
                                    v-model="form.shipRole.value"
                                    type="text"
                                    :state="stateShipRole"
                                    placeholder="Expedition"
                                ></b-form-input>
                                <b-form-invalid-feedback :state="stateShipRole">{{ form.shipRole.violation }}</b-form-invalid-feedback>
                            </b-form-group>
                            <b-form-group class="mb-4" label="Cargo capacity (optional)" label-for="input-cargo-capacity">
                                <b-form-input
                                    id="input-cargo-capacity"
                                    v-model="form.cargoCapacity.value"
                                    type="number"
                                    :state="stateCargoCapacity"
                                    min="0"
                                    placeholder="96 SCU"
                                ></b-form-input>
                                <b-form-invalid-feedback :state="stateCargoCapacity">{{ form.cargoCapacity.violation }}</b-form-invalid-feedback>
                            </b-form-group>
                            <b-form-group class="mb-4" content-cols-lg="3" label="Min crew (optional)" label-for="input-min-crew">
                                <b-form-input
                                    id="input-min-crew"
                                    v-model="form.minCrew.value"
                                    type="number"
                                    :state="stateMinCrew"
                                    min="1"
                                    placeholder="1"
                                ></b-form-input>
                                <b-form-invalid-feedback :state="stateMinCrew">{{ form.minCrew.violation }}</b-form-invalid-feedback>
                            </b-form-group>
                            <b-form-group class="mb-4" content-cols-lg="3" label="Max crew (optional)" label-for="input-max-crew">
                                <b-form-input
                                    id="input-max-crew"
                                    v-model="form.maxCrew.value"
                                    type="number"
                                    :state="stateMaxCrew"
                                    placeholder="4"
                                    min="1"
                                ></b-form-input>
                                <b-form-invalid-feedback :state="stateMaxCrew">{{ form.maxCrew.violation }}</b-form-invalid-feedback>
                            </b-form-group>
                            <b-button class="d-block ml-auto" variant="primary" @click="tabIndex++">Next</b-button>
                        </b-card-text>
                    </b-tab>
                    <b-tab title="Prices">
                        <b-card-text>
                            <label for="input-pledge-price">Pledge price (optional)</label>
                            <b-input-group prepend="$" class="mb-4">
                                <b-form-input
                                    id="input-pledge-price"
                                    v-model="form.pledgePrice.value"
                                    placeholder="310"
                                    :state="statePledgePrice"
                                    min="0"
                                >
                                </b-form-input>
                                <b-form-invalid-feedback :state="statePledgePrice">{{ form.pledgePrice.violation }}</b-form-invalid-feedback>
                            </b-input-group>
                            <label for="input-in-game-price">In game price (optional)</label>
                            <b-input-group prepend="UEC" class="mb-4">
                                <b-form-input
                                    id="input-in-game-price"
                                    v-model="form.inGamePrice.value"
                                    placeholder="4,926,700"
                                    :state="stateInGamePrice"
                                    min="0"
                                >
                                </b-form-input>
                                <b-form-invalid-feedback :state="stateInGamePrice">{{ form.inGamePrice.violation }}</b-form-invalid-feedback>
                            </b-input-group>
                            <b-button class="d-block ml-auto" type="submit" :disabled="submitDisabled" variant="success"><i class="fa fa-check"></i> Create</b-button>
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
            tabIndex: 1,
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
        //
        //     try {
        //         this.submitDisabled = true;
        //         this.globalViolation = null;
        //         this.form.chassis.violation = null;
        //         this.form.imageUrl.violation = null;
        //         await axios.post(`${Config.api_base_url}/api/`, {
        //             name: this.form.chassis.value,
        //             pictureUrl: this.form.imageUrl.value || null,
        //             quantity: this.form.quantity.value,
        //         }, {
        //             headers: {
        //                 Authorization: `Bearer ${this.$store.state.accessToken}`,
        //             },
        //         });
        //         if (this.form.addAnother.value) {
        //             this.$emit('newShip', { shouldClose: false });
        //             this.resetForm();
        //             this.form.addAnother.value = true;
        //             return;
        //         }
        //         this.$emit('newShip', { shouldClose: true });
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
        //             case 'model':
        //                 this.form.model.violation = violation.title;
        //                 break;
        //             case 'pictureUrl':
        //                 this.form.imageUrl.violation = violation.title;
        //                 break;
        //             case 'quantity':
        //                 this.form.quantity.violation = violation.title;
        //                 break;
        //         }
        //     }
        // }
    }
}
</script>

<style scoped>

</style>
