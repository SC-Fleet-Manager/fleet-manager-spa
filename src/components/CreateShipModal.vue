<template>
    <b-form @submit="onSubmit" novalidate>
        <b-alert variant="danger" :show="globalViolation !== null">{{ globalViolation }}</b-alert>
        <b-form-group class="mb-4" label="Ship name" label-for="input-ship-name">
            <b-form-input
                id="input-ship-name"
                v-model="form.name.value"
                placeholder="Cutlass black"
                type="text"
                :state="stateName"
                required
            ></b-form-input>
            <b-form-invalid-feedback :state="stateName">{{ form.name.violation }}</b-form-invalid-feedback>
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
        <b-form-group class="mb-4" label="Quantity" label-for="input-ship-quantity">
            <b-form-input
                id="input-ship-quantity"
                v-model="form.quantity.value"
                type="number"
                :state="stateQuantity"
                :number="true"
                min="1"
            ></b-form-input>
            <b-form-invalid-feedback :state="stateQuantity">{{ form.quantity.violation }}</b-form-invalid-feedback>
        </b-form-group>
        <b-form-group>
            <b-form-checkbox v-model="form.addAnother.value">Add another ship</b-form-checkbox>
        </b-form-group>
        <b-button type="submit" :disabled="submitDisabled" variant="success">Create</b-button>
    </b-form>
</template>

<script>
import axios from 'axios';
import Config from '@config/config.json';

export default {
    name: 'CreateShipModal',
    components: {},
    props: [],
    data() {
        return {
            form: null,
            globalViolation: null,
            submitDisabled: true,
        };
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
        stateName() {
            return this.form.name.violation !== null ? false : null;
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
                name: {
                    value: null,
                    violation: null,
                },
                imageUrl: {
                    value: null,
                    violation: null,
                },
                quantity: {
                    value: 1,
                    violation: null,
                },
                addAnother: {
                    value: false,
                },
            };
        },
        async onSubmit(ev) {
            ev.preventDefault();

            const token = await this.$auth.getTokenSilently();
            if (!this.$auth.isAuthenticated) {
                this.$toastr.e('Sorry, we are unable to create your ship for the moment. Please, try again later.');
                return;
            }

            try {
                this.submitDisabled = true;
                this.globalViolation = null;
                this.form.name.violation = null;
                this.form.imageUrl.violation = null;
                this.form.quantity.violation = null;
                await axios.post(`${Config.api_base_url}/api/my-fleet/create-ship`, {
                    name: this.form.name.value,
                    pictureUrl: this.form.imageUrl.value || null,
                    quantity: this.form.quantity.value,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (this.form.addAnother.value) {
                    this.$emit('newShip', { shouldClose: false });
                    this.resetForm();
                    this.form.addAnother.value = true;
                    return;
                }
                this.$emit('newShip', { shouldClose: true });
            } catch (err) {
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
                    case 'name':
                        this.form.name.violation = violation.title;
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

<style scoped>
</style>
