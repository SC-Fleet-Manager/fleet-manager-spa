<template>
    <b-card>
        <template #header><h5 class="m-0">Preferences</h5></template>
        <b-row>
            <b-col cols="12" class="mb-3">
                <h6 class="mb-3">Change my nickname</h6>
                <b-form @submit="onSubmit">
                    <b-form-group class="mb-4" description="Set empty to back to your default one.">
                        <b-input-group>
                            <b-form-input
                                id="input-nickname"
                                v-model="form.nickname.value"
                                placeholder="New nickname"
                                type="text"
                                :state="stateNickname"
                            ></b-form-input>
                            <b-input-group-append>
                                <b-button type="submit" :disabled="submitDisabled" variant="success"><i class="fa fa-check"></i> Change</b-button>
                            </b-input-group-append>
                        </b-input-group>
                        <b-form-invalid-feedback :state="stateNickname">{{ form.nickname.violation }}</b-form-invalid-feedback>
                    </b-form-group>
                </b-form>
            </b-col>
            <b-col cols="12" class="mb-3">
                <ChangeHandleForm />
            </b-col>
        </b-row>
    </b-card>
</template>

<script>
import axios from 'axios';
import Config from '@config/config.json';
import {mapState} from 'vuex';
import ChangeHandleForm from "./ChangeHandleForm";
import bus from '@/bus';

export default {
    name: 'Preferences',
    components: {ChangeHandleForm},
    data() {
        return {
            submitDisabled: false,
            form: {
                nickname: {
                    value: null,
                    violation: null,
                },
            },
        };
    },
    created() {
        this.form.nickname.value = this.$store.state.profile.nickname || null;
    },
    computed: {
        ...mapState(['profile']),
        stateNickname() {
            return this.form.nickname.violation !== null ? false : null;
        },
    },
    watch: {
        profile(newValue) {
            this.form.nickname.value = newValue.nickname || null;
        },
    },
    methods: {
        async onSubmit(ev) {
            ev.preventDefault();

            try {
                this.submitDisabled = true;
                this.form.nickname.violation = null;
                await axios.post(`${Config.api_base_url}/api/profile/change-nickname`, {
                    nickname: this.form.nickname.value || null,
                }, {
                    headers: {
                        Authorization: `Bearer ${this.$store.state.accessToken}`,
                    },
                });
                bus.$emit('updatedProfile');
                this.form.nickname.value = this.$store.state.profile.nickname || null;
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
                    case 'nickname':
                        this.form.nickname.violation = violation.title;
                        break;
                }
            }
        },
    },
};
</script>
