<template>
    <b-card no-body>
        <b-form @submit="onSubmit">
            <b-tabs v-model="tabIndex" card>
                <b-tab title="Ship" :title-link-class="[stateChassis == false || stateModel == false || statePictureUrl == false  || stateModel == false || statePictureUrl == false ? 'text-danger' : '']" active>
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
                                type="url"
                                :state="statePictureUrl"
                                debounce="500"
                                placeholder="https://media.robertsspaceindustries.com/c2k21tjgn3z6a/store_small.jpg"
                            ></b-form-input>
                            <b-form-invalid-feedback :state="statePictureUrl">{{ form.pictureUrl.violation }}</b-form-invalid-feedback>
                        </b-form-group>
                    </b-card-text>
                    <b-button class="d-block ml-auto" variant="primary" @click="tabIndex++">Next <i class="fas fa-arrow-right"></i></b-button>
                </b-tab>
                <b-tab title="Manufacturer" :title-link-class="[stateManufacturerName == false || stateManufacturerCode == false ? 'text-danger' : '']">
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
                <b-tab title="Utility" :title-link-class="[stateShipSize == false || stateShipRole == false || stateCargoCapacity == false || stateMinCrew == false || stateMaxCrew == false ? 'text-danger' : '']">
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
                                type="number"
                                :state="stateCargoCapacity"
                                min="0"
                                placeholder="96 SCU"
                            ></b-form-input>
                            <b-form-invalid-feedback :state="stateCargoCapacity">{{ form.cargoCapacity.violation }}</b-form-invalid-feedback>
                        </b-form-group>
                        <b-form-group class="mb-4 col-md-3 p-0 d-block d-md-inline-block" label="Min crew (optional)" label-for="input-min-crew">
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
                        <b-form-group class="mb-4 col-md-3 mx-2 p-0 d-block d-md-inline-block" label="Max crew (optional)" label-for="input-max-crew">
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
                        <b-button class="d-block ml-auto" variant="primary" @click="tabIndex++">Next <i class="fas fa-arrow-right"></i></b-button>
                    </b-card-text>
                </b-tab>
                <b-tab title="Prices" :title-link-class="[statePledgePrice == false || stateInGamePrice == false ? 'text-danger' : '']">
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
                        <b-button class="d-block ml-auto" type="submit" variant="success"><i class="fa fa-check"></i> Create</b-button>
                    </b-card-text>
                </b-tab>
            </b-tabs>
        </b-form>
    </b-card>
</template>

<script>
import axios from 'axios';
import Config from '@config/config.json';
const formFields = ['chassis', 'model', 'pictureUrl', 'manufacturerName', 'manufacturerCode', 'shipSize', 'shipRole', 'cargoCapacity', 'minCrew', 'maxCrew', 'pledgePrice', 'inGamePrice' ]
function generateFormState() {
    let obj = {};
    for(const formfield of formFields) {
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
        ...generateFormState(),
    },
    methods: {
        resetForm() {
            this.form = {};
            for( const value of formFields) {
                this.form[value] = {
                    value: null,
                    violation: null
                }
            }
        },
        async onSubmit(ev) {
            console.log('submit')
            ev.preventDefault();
            try {
                this.submitDisabled = true;
                for( const value of formFields) {
                    this.form[value].violation = null;
                }
                this.globalViolation = null;
                await axios.post(`${Config.api_base_url}/api/ship-template/create`, {
                    model: this.form.model.value,
                    pictureUrl: this.form.pictureUrl.value,
                    chassis: {
                        name: this.form.chassis.value
                    },
                    manufacturer: {
                        name: this.form.manufacturerName.value,
                        code: this.form.manufacturerCode.value
                    },
                    size: this.form.shipSize.value,
                    role: this.form.shipRole.value,
                    cargoCapacity: this.form.cargoCapacity.value !== null ? parseInt(this.form.cargoCapacity.value) : null,
                    crew: {
                        min: this.form.minCrew.value !== null ? parseInt(this.form.minCrew.value) : null,
                        max: this.form.maxCrew.value !== null ? parseInt(this.form.maxCrew.value): null
                    },
                    price: {
                        pledge: this.form.pledgePrice.value !== null ? this.form.pledgePrice.value*100 : null,
                        ingame: this.form.inGamePrice.value !== null ? parseInt(this.form.inGamePrice.value ) : null
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
                if(err.response){
                    this.handleViolations(err.response);
                    return;
                }
                console.error(err);
            } finally {
                this.submitDisabled = false;
            }
        },
        handleViolations(response) {
            const data = response.data;
            for (const violation of data.violations.violations) {
                switch (violation.propertyPath) {
                    case '':
                        this.globalViolation = violation.title;
                        break;
                    case 'model':
                        this.form.model.violation = violation.title;
                        break;
                    case 'chassis.name':
                        this.form.chassis.violation = violation.title;
                        break;
                }
            }
        }
    }
}
</script>

<style scoped>

</style>
