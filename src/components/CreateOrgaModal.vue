<template>
    <div>
        <template v-if="needCreateHandle">
            <b-alert variant="info" show>
                In order <strong>to create</strong> an organization, please <strong>create your Handle</strong> (letters and digits only).<br/>
                It is <strong>unique</strong> and will be displayed to the organization's founder <strong>to verify your identity</strong>.<br/>
                Don't worry, <strong>you can change it at anytime</strong>.
            </b-alert>
            <ChangeHandleForm>
                <template v-slot:title>Create my handle</template>
                <template v-slot:submit-content><i class="fa fa-check"></i> Create</template>
            </ChangeHandleForm>
        </template>
        <b-form @submit="onSubmit" >
            <b-alert variant="danger" :show="globalViolation !== null">{{ globalViolation }}</b-alert>
            <b-form-group class="mb-4" label="Name *" label-for="input-orga-name">
                <b-form-input
                    id="input-orga-name"
                    :disabled="needCreateHandle"
                    v-model="form.name.value"
                    type="text"
                    :state="stateName"
                    required
                ></b-form-input>
                <b-form-invalid-feedback :state="stateName">{{ form.name.violation }}</b-form-invalid-feedback>
            </b-form-group>
            <b-form-group class="mb-4" label="Sid *" label-for="input-orga-name">
                <b-form-input
                    id="input-orga-sid"
                    :disabled="needCreateHandle"
                    v-model="form.sid.value"
                    type="text"
                    :state="stateSid"
                    required
                ></b-form-input>
                <b-form-invalid-feedback :state="stateSid">{{ form.sid.violation }}</b-form-invalid-feedback>
            </b-form-group>
            <b-form-group class="mb-4" label="Logo URL (optional)" label-for="input-orga-image" description="URL only from RSI">
                <b-form-input
                    id="input-orga-image"
                    :disabled="needCreateHandle"
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
            <b-button class="d-block ml-auto" type="submit" :disabled="submitDisabled || needCreateHandle" variant="success"><i class="fa fa-check"></i> Create</b-button>
        </b-form>
    </div>
</template>

<script>
import axios from 'axios';
import Config from '@config/config.json';
import ChangeHandleForm from "./ChangeHandleForm";
import {mapState} from 'vuex';

export default {
    name: 'CreateOrgaModal',
    components: {ChangeHandleForm},
    props: [],
    data() {
        return {
            form: null,
            globalViolation: null,
            submitDisabled: false,
            needCreateHandle: false,
        };
    },
    created() {
        this.resetForm();
    },
    computed: {
        ...mapState(['profile']),
        stateName() {
            return this.form.name.violation !== null ? false : null;
        },
        stateSid() {
            return this.form.sid.violation !== null ? false : null;
        },
        statelogoUrl() {
            return this.form.logoUrl.violation !== null ? false : null;
        }
    },
    watch: {
        profile(newValue) {
            if (this.needCreateHandle && newValue.handle) {
                this.needCreateHandle = false;
            }
        },
    },
    methods: {
        resetForm() {
            this.form = {
                name: {
                    value: null,
                    violation: null,
                },
                sid: {
                    value: null,
                    violation: null,
                },
                logoUrl: {
                    value: null,
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
                this.form.sid.violation = null;
                this.form.logoUrl.violation = null;
                await axios.post(`${Config.api_base_url}/api/organizations/create`, {
                    name: this.form.name.value,
                    sid: this.form.sid.value,
                    logoUrl: this.form.logoUrl.value || null
                }, {
                    headers: {
                        Authorization: `Bearer ${this.$store.state.accessToken}`,
                    },
                });
                this.$emit('newOrga');
            } catch (err) {
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    this.$toastr.e('You have been disconnected. Please login again.');
                    this.$router.push({ name: 'Home' });
                    return;
                }
                if (err.response.status === 400) {
                    if (err.response.data.error === 'no_member_handle') {
                        this.needCreateHandle = true;
                        return;
                    }
                    if (err.response.data.error === 'invalid_form') {
                        this.handleViolations(err.response);
                        return;
                    }
                }
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
                    case 'sid':
                        this.form.sid.violation = violation.title;
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
