<template>
    <b-card class="col-md-6" style="border: none">
        <h3>Edit organization</h3>
        <b-form @submit="onSubmit">
            <b-alert variant="danger" :show="globalViolation !== null">{{ globalViolation }}</b-alert>
            <b-form-group class="mb-4" label="Name *" label-for="input-orga-name">
                <b-form-input
                    id="input-orga-name"
                    v-model="form.name.value"
                    type="text"
                    :state="stateName"
                    required
                ></b-form-input>
                <b-form-invalid-feedback :state="stateName">{{ form.name.violation }}</b-form-invalid-feedback>
            </b-form-group>
            <b-form-group class="mb-4" label="Logo URL (optional)" label-for="input-orga-image" description="URL only from RSI">
                <b-form-input
                    id="input-orga-image"
                    v-model="form.logoUrl.value"
                    debounce="500"
                    type="url"
                    placeholder="https://robertsspaceindustries.com/rsi/static/images/organization/defaults/logo/generic.jpg"
                    :state="statelogoUrl"
                ></b-form-input>
                <b-form-invalid-feedback :state="statelogoUrl">{{ form.logoUrl.violation }}</b-form-invalid-feedback>
            </b-form-group>
            <div v-if="form.logoUrl.value" class="mb-3">
                <b-img :src="form.logoUrl.value" fluid alt=""></b-img>
            </div>
            <b-button class="d-block ml-auto" type="submit" :disabled="submitDisabled" variant="success"><i class="fa fa-check"></i> Save</b-button>
        </b-form>
    </b-card>
</template>

<script>
import axios from 'axios';
import Config from '@config/config.json';
import bus from '@/bus';

export default {
    name: 'EditOrga',
    props: ['orga'],
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
        stateName() {
            return this.form.name.violation !== null ? false : null;
        },
        statelogoUrl() {
            return this.form.logoUrl.violation !== null ? false : null;
        }
    },
    methods: {
        resetForm() {
            this.form = {
                name: {
                    value: this.orga.name,
                    violation: null,
                },
                logoUrl: {
                    value: this.orga.logoUrl,
                    violation: null,
                },
            };
        },
        async onSubmit(ev) {
            ev.preventDefault();
            try {
                this.submitDisabled = true;
                this.globalViolation = null;
                this.form.name.violation = null;
                this.form.logoUrl.violation = null;
                await axios.post(`${Config.api_base_url}/api/organizations/${this.orga.id}/update`, {
                    name: this.form.name.value,
                    logoUrl: this.form.logoUrl.value || null
                }, {
                    headers: {
                        Authorization: `Bearer ${this.$store.state.accessToken}`,
                    },
                });
                bus.$emit('updateMyOrganizations');
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
                    case 'name':
                        this.form.name.violation = violation.title;
                        break;
                    case 'logoUrl':
                        this.form.logoUrl.violation = violation.title;
                        break;
                }
            }
        }
    }
};
</script>
