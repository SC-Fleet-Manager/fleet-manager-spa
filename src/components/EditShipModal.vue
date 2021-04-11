<template>
    <b-form @submit="onSubmit">
        <b-alert variant="danger" :show="globalViolation !== null">{{ globalViolation }}</b-alert>
        <b-form-group class="mb-4" label="Model *" label-for="input-ship-model">
            <b-form-input
                id="input-ship-model"
                v-model="form.model.value"
                placeholder="Cutlass black"
                type="text"
                :state="stateModel"
                required
            ></b-form-input>
            <b-form-invalid-feedback :state="stateModel">{{ form.model.violation }}</b-form-invalid-feedback>
        </b-form-group>
        <b-form-group class="mb-4" label="Image URL" label-for="input-ship-image" description="Only from RSI or starcitizen.tools">
            <b-form-input
                id="input-ship-image"
                v-model="form.imageUrl.value"
                debounce="500"
                type="url"
                placeholder="https://media.robertsspaceindustries.com/wj92rqzvhnecb/store_small.jpg"
                :state="stateImageUrl"
            ></b-form-input>
            <b-form-invalid-feedback :state="stateImageUrl">{{ form.imageUrl.violation }}</b-form-invalid-feedback>
        </b-form-group>
        <div v-if="form.imageUrl.value" class="mb-3">
            <b-img :src="form.imageUrl.value" fluid alt=""></b-img>
        </div>
        <b-form-group class="mb-4" label="Quantity *" label-for="input-ship-quantity">
            <b-form-input
                id="input-ship-quantity"
                v-model="form.quantity.value"
                type="number"
                :state="stateQuantity"
                required
                :number="true"
                min="1"
            ></b-form-input>
            <b-form-invalid-feedback :state="stateQuantity">{{ form.quantity.violation }}</b-form-invalid-feedback>
        </b-form-group>
        <b-button class="d-block ml-auto" type="submit" :disabled="submitDisabled" variant="success"><i class="fa fa-check"></i> Save</b-button>
    </b-form>
</template>

<script>
import axios from 'axios';
import Config from '@config/config.json';

export default {
    name: 'EditShipModal',
    components: {},
    props: ['ship'],
    data() {
        return {
            form: null,
            globalViolation: null,
            submitDisabled: false,
        }
    },
    created() {
        this.resetForm();
        if (!this.$auth.loading) {
            this.onAuthenticated();
        } else {
            this.$auth.$on('loaded', this.onAuthenticated);
        }
    },
    computed: {
        stateModel() {
            return this.form.model.violation !== null ? false : null;
        },
        stateImageUrl() {
            return this.form.imageUrl.violation !== null ? false : null;
        },
        stateQuantity() {
            return this.form.quantity.violation !== null ? false : null;
        },
    },
    methods: {
        onAuthenticated() {
            this.submitDisabled = false;
        },
        resetForm() {
            this.form = {
                model: {
                    value: this.ship.model,
                    violation: null,
                },
                imageUrl: {
                    value: this.ship.imageUrl,
                    violation: null,
                },
                quantity: {
                    value: this.ship.quantity,
                    violation: null,
                },
            };
        },
        async onSubmit(ev) {
            ev.preventDefault();

            try {
                this.submitDisabled = true;
                this.globalViolation = null;
                this.form.model.violation = null;
                this.form.imageUrl.violation = null;
                this.form.quantity.violation = null;
                await axios.post(`${Config.api_base_url}/api/my-fleet/update-ship/${this.ship.id}`, {
                    model: this.form.model.value,
                    pictureUrl: this.form.imageUrl.value || null,
                    quantity: this.form.quantity.value,
                }, {
                    headers: {
                        Authorization: `Bearer ${this.$store.state.accessToken}`,
                    },
                });
                this.$emit('updateShip');
            } catch (err) {
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    this.$toastr.e('You have been disconnected. Please login again.');
                    this.$router.push({ name: 'Home' });
                    return;
                }
                this.handleViolations(err.response);
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
                    case 'pictureUrl':
                        this.form.imageUrl.violation = violation.title;
                        break;
                    case 'quantity':
                        this.form.quantity.violation = violation.title;
                        break;
                }
            }
        }
    }
};
</script>
