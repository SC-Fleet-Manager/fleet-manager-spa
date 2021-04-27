<template>
    <div>
        <h6 class="mb-3">
            <slot name="title">Change my handle</slot>
        </h6>
        <b-form @submit="onSubmit">
            <b-form-group class="mb-4">
                <b-input-group>
                    <b-form-input
                        id="input-handle"
                        v-model="form.handle.value"
                        placeholder="Your handle"
                        type="text"
                        :state="stateHandle"
                    ></b-form-input>
                    <b-input-group-append>
                        <b-button type="submit" :disabled="submitDisabled" variant="success">
                            <slot name="submit-content"><i class="fa fa-check"></i> Change</slot>
                        </b-button>
                    </b-input-group-append>
                </b-input-group>
                <b-form-invalid-feedback :state="stateHandle">{{ form.handle.violation }}</b-form-invalid-feedback>
            </b-form-group>
        </b-form>
    </div>
</template>
<script>
import axios from "axios";
import Config from '@config/config.json';
import {mapState} from "vuex";
import bus from '@/bus';

export default {
    name: 'ChangeHandleForm',
    data() {
        return {
            submitDisabled: false,
            form: {
                handle: {
                    value: null,
                    violation: null,
                },
            },
        };
    },
    created() {
        this.form.handle.value = this.$store.state.profile.handle || null;
    },
    computed: {
        ...mapState(['profile']),
        stateHandle() {
            return this.form.handle.violation !== null ? false : null;
        },
    },
    watch: {
        profile(newValue) {
            this.form.handle.value = newValue.handle || null;
        },
    },
    methods: {
        async onSubmit(ev) {
            ev.preventDefault();

            try {
                this.submitDisabled = true;
                this.form.handle.violation = null;
                await axios.post(`${Config.api_base_url}/api/profile/change-handle`, {
                    handle: this.form.handle.value || null,
                }, {
                    headers: {
                        Authorization: `Bearer ${this.$store.state.accessToken}`,
                    },
                });
                bus.$emit('updatedProfile');
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
            const data = response.data;
            for (const violation of data.violations.violations) {
                switch (violation.propertyPath) {
                    case 'handle':
                        this.form.handle.violation = violation.title;
                        break;
                }
            }
        },
    }
}
</script>
