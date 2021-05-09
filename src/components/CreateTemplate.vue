<template>
        <b-form @submit="onSubmit">
            <b-button class="d-block ml-auto" type="submit" variant="success"><i class="fa fa-check"></i> Create</b-button>
            <b-tabs v-model="tabIndex">
                <b-tab title="Ship" :title-link-class="hasShipTabViolations ? 'text-danger' : ''" active>
                    <b-card-text>
                        <b-form-group class="mb-4" label="Model *" label-for="input-ship-model">
                            <b-form-input
                                id="input-ship-model"
                                v-model="form.model.value"
                                type="text"
                                :state="stateModel"
                                placeholder="Constellation Aquila"
                            ></b-form-input>
                            <b-form-invalid-feedback :state="stateModel">{{ form.model.violation }}</b-form-invalid-feedback>
                        </b-form-group>
                        <b-form-group class="mb-4" label="Chassis *" label-for="input-ship-chassis">
                            <b-form-input
                                id="input-ship-chassis"
                                v-model="form.chassis.value"
                                type="text"
                                :state="stateChassis"
                                placeholder="Constellation"
                            ></b-form-input>
                            <b-form-invalid-feedback :state="stateChassis">{{ form.chassis.violation }}</b-form-invalid-feedback>
                        </b-form-group>
                        <b-form-group class="mb-4" label="Picture URL (optional)" label-for="input-ship-pictureUrl" description="Only from RSI or starcitizen.tools">
                            <b-form-input
                                id="input-ship-pictureUrl"
                                v-model="form.pictureUrl.value"
                                type="text"
                                :state="statePictureUrl"
                                debounce="500"
                                placeholder="https://media.robertsspaceindustries.com/c2k21tjgn3z6a/store_small.jpg"
                            ></b-form-input>
                            <b-form-invalid-feedback :state="statePictureUrl">{{ form.pictureUrl.violation }}</b-form-invalid-feedback>
                        </b-form-group>
                        <div v-if="form.pictureUrl.value" class="col-4 p-0 mb-3">
                            <b-img :src="form.pictureUrl.value" fluid alt=""></b-img>
                        </div>
                    </b-card-text>
                    <b-button class="d-block ml-auto" variant="primary" @click="tabIndex++">Next <i class="fas fa-arrow-right"></i></b-button>
                </b-tab>
                <b-tab title="Manufacturer" :title-link-class="hasManufacturerTabViolations ? 'text-danger' : ''">
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
                        <b-button class="d-block ml-auto" variant="primary" @click="tabIndex++">Next <i class="fas fa-arrow-right"></i></b-button>
                    </b-card-text>
                </b-tab>
                <b-tab title="Utility" :title-link-class="hasUtilityTabViolations ? 'text-danger' : ''">
                    <b-card-text>
                        <b-form-group class="mb-4" label="Size (optional)" label-for="input-ship-size">
                            <b-form-select
                                id="input-ship-size"
                                v-model="form.shipSize.value"
                                :options="[{ text: 'Choose...', value: null }, { text: 'Vehicle', value: 'vehicle' }, { text: 'Snub', value: 'snub' }, { text: 'Small', value: 'small' }, { text: 'Medium', value: 'medium' }, { text: 'Large', value: 'large' }, { text: 'Capital', value: 'capital' }]"
                            ></b-form-select>
                            <b-form-invalid-feedback :state="stateShipSize">{{ form.shipSize.violation }}</b-form-invalid-feedback>
                        </b-form-group>
                        <b-form-group class="mb-4" label="Role (optional)" label-for="input-ship-role">
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
                                :number="true"
                                type="number"
                                :state="stateCargoCapacity"
                                min="0"
                                placeholder="96 SCU"
                            ></b-form-input>
                            <b-form-invalid-feedback :state="stateCargoCapacity">{{ form.cargoCapacity.violation }}</b-form-invalid-feedback>
                        </b-form-group>
                        <div :class="{'is-invalid': stateCrew === false}">
                            <b-form-invalid-feedback :state="stateCrew">{{ form.crew.violation }}</b-form-invalid-feedback>
                            <b-form-group class="mb-4 col-md-3 p-0 d-block d-md-inline-block" label="Min crew (optional)" label-for="input-min-crew">
                                <b-form-input
                                    id="input-min-crew"
                                    v-model="form.minCrew.value"
                                    :number="true"
                                    type="number"
                                    :state="stateCrew === false ? false : stateMinCrew"
                                    min="1"
                                    placeholder="1"
                                ></b-form-input>
                                <b-form-invalid-feedback :state="stateMinCrew">{{ form.minCrew.violation }}</b-form-invalid-feedback>
                            </b-form-group>
                            <b-form-group class="mb-4 col-md-3 mx-2 p-0 d-block d-md-inline-block" label="Max crew (optional)" label-for="input-max-crew">
                                <b-form-input
                                    id="input-max-crew"
                                    v-model="form.maxCrew.value"
                                    :number="true"
                                    type="number"
                                    :state="stateCrew === false ? false : stateMaxCrew"
                                    placeholder="4"
                                    min="1"
                                ></b-form-input>
                                <b-form-invalid-feedback :state="stateMaxCrew">{{ form.maxCrew.violation }}</b-form-invalid-feedback>
                            </b-form-group>
                        </div>
                        <b-button class="d-block ml-auto" variant="primary" @click="tabIndex++">Next <i class="fas fa-arrow-right"></i></b-button>
                    </b-card-text>
                </b-tab>
                <b-tab title="Prices" :title-link-class="hasPricesTabViolations ? 'text-danger' : ''">
                    <b-card-text>
                        <b-form-group class="mb-4" label="Pledge price (optional)" label-for="input-pledge-price">
                            <b-input-group prepend="$">
                                <b-form-input
                                    id="input-pledge-price"
                                    v-model="form.pledgePrice.value"
                                    :number="true"
                                    type="number"
                                    :state="statePledgePrice"
                                    placeholder="310"
                                    step="0.01"
                                    min="0"
                                ></b-form-input>
                                <b-form-invalid-feedback :state="statePledgePrice">{{ form.pledgePrice.violation }}</b-form-invalid-feedback>
                            </b-input-group>
                        </b-form-group>
                        <b-form-group class="mb-4" label="In-game price (optional)" label-for="input-in-game-price">
                            <b-input-group prepend="UEC">
                                <b-form-input
                                    id="input-in-game-price"
                                    v-model="form.inGamePrice.value"
                                    :number="true"
                                    type="number"
                                    :state="stateInGamePrice"
                                    placeholder="4 926 700"
                                    min="0"
                                ></b-form-input>
                                <b-form-invalid-feedback :state="stateInGamePrice">{{ form.inGamePrice.violation }}</b-form-invalid-feedback>
                            </b-input-group>
                        </b-form-group>
                        <b-button class="d-block ml-auto" type="submit" variant="success"><i class="fa fa-check"></i> Create</b-button>
                    </b-card-text>
                </b-tab>
            </b-tabs>
        </b-form>
</template>

<script>
import axios from 'axios';
import Config from '@config/config.json';

const formFields = ['chassis', 'model', 'pictureUrl', 'manufacturerName', 'manufacturerCode', 'shipSize', 'shipRole', 'cargoCapacity', 'crew', 'minCrew', 'maxCrew', 'pledgePrice', 'inGamePrice'];
function generateFormStates() {
    let obj = {};
    for (const formfield of formFields) {
        obj[`state${formfield.charAt(0).toUpperCase() + formfield.slice(1)}`] = function () {
            return this.form[formfield].violation !== null ? false : null;
        }
    }
    return obj;
}

export default {
    name: "CreateTemplate",
    data() {
        return {
            form: null,
            globalViolation: null,
            tabIndex: 1,
        };
    },
    created() {
        this.resetForm();
    },
    computed: {
        ...generateFormStates(),
        hasShipTabViolations() {
            return this.stateChassis === false || this.stateModel === false || this.statePictureUrl === false;
        },
        hasManufacturerTabViolations() {
            return this.stateManufacturerName === false || this.stateManufacturerCode === false;
        },
        hasUtilityTabViolations() {
            return this.stateShipSize === false || this.stateShipRole === false || this.stateCargoCapacity === false || this.stateCrew === false || this.stateMinCrew === false || this.stateMaxCrew === false;
        },
        hasPricesTabViolations() {
            return this.statePledgePrice === false || this.stateInGamePrice === false;
        },
    },
    methods: {
        resetForm() {
            this.form = {};
            for( const value of formFields) {
                this.$set(this.form, value, {
                    value: null,
                    violation: null
                });
            }
        },
        async onSubmit(ev) {
            ev.preventDefault();
            try {
                this.submitDisabled = true;
                for( const value of formFields) {
                    this.form[value].violation = null;
                }
                this.globalViolation = null;
                await axios.post(`${Config.api_base_url}/api/ship-template/create`, {
                    model: this.form.model.value || null,
                    pictureUrl: this.form.pictureUrl.value || null,
                    chassis: {
                        name: this.form.chassis.value || null
                    },
                    manufacturer: {
                        name: this.form.manufacturerName.value || null,
                        code: this.form.manufacturerCode.value || null
                    },
                    size: this.form.shipSize.value || null,
                    role: this.form.shipRole.value || null,
                    cargoCapacity: this.form.cargoCapacity.value !== null ? parseInt(this.form.cargoCapacity.value) : null,
                    crew: {
                        min: this.form.minCrew.value !== null ? parseInt(this.form.minCrew.value) : null,
                        max: this.form.maxCrew.value !== null ? parseInt(this.form.maxCrew.value) : null
                    },
                    price: {
                        pledge: this.form.pledgePrice.value !== null ? Math.round(this.form.pledgePrice.value * 100) : null,
                        ingame: this.form.inGamePrice.value !== null ? this.form.inGamePrice.value : null
                    }
                }, {
                    headers: {
                        Authorization: `Bearer ${this.$store.state.accessToken}`,
                    },
                });
                this.$emit('newTemplate', { shouldClose: true });
            } catch (err) {
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    this.$toastr.e('You have been disconnected. Please login again.');
                    this.$router.push({ name: 'Home' });
                    return;
                }
                if (err.response && err.response.status === 400) {
                    this.handleViolations(err.response);
                    return;
                }
                console.error(err);
            } finally {
                this.submitDisabled = false;
            }
        },
        handleViolations(response) {
            const mapViolationToFormfield = {
                'model': 'model',
                'chassis.name': 'chassis',
                'pictureUrl': 'pictureUrl',
                'manufacturer.name': 'manufacturerName',
                'manufacturer.code': 'manufacturerCode',
                'size': 'shipSize',
                'role': 'shipRole',
                'cargoCapacity': 'cargoCapacity',
                'crew': 'crew',
                'crew.min': 'minCrew',
                'crew.max': 'maxCrew',
                'price.pledge': 'pledgePrice',
                'price.ingame': 'inGamePrice',
            };
            const data = response.data;
            for (const violation of data.violations.violations) {
                if (violation.propertyPath === '') {
                    this.globalViolation = violation.title;
                    continue;
                }
                if (mapViolationToFormfield[violation.propertyPath]) {
                    this.form[mapViolationToFormfield[violation.propertyPath]].violation = violation.title;
                }
            }
        },
    }
}
</script>
