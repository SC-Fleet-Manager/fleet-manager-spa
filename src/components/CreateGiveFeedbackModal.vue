<template>
    <b-form @submit="onSubmit">
        <b-alert variant="info" show>
            Here you can write something about your experience on Fleet-Manager (bugs, features, enhancements, etc.).<br/>
            This will help us to improve FM and see what are the most hyped.
        </b-alert>
        <b-form-group class="mb-4" label="Description *" label-for="input-description">
            <b-form-textarea
                id="input-description"
                v-model="form.description.value"
                placeholder="Write something to help us. :-)"
                :state="stateDescription"
                rows="5"
                required
            ></b-form-textarea>
            <b-form-invalid-feedback :state="stateDescription">{{ form.description.violation }}</b-form-invalid-feedback>
        </b-form-group>
        <b-form-group class="mb-4" label="Email" label-for="input-email">
            <b-form-input
                id="input-email"
                v-model="form.email.value"
                type="email"
                :state="stateEmail"
            ></b-form-input>
            <b-form-invalid-feedback :state="stateEmail">{{ form.email.violation }}</b-form-invalid-feedback>
        </b-form-group>
        <b-form-group class="mb-4" label="Discord ID" label-for="input-discordid">
            <b-form-input
                id="input-discordid"
                v-model="form.discordId.value"
                type="text"
                :state="stateDiscordId"
            ></b-form-input>
            <b-form-invalid-feedback :state="stateDiscordId">{{ form.discordId.violation }}</b-form-invalid-feedback>
        </b-form-group>
        <b-button class="d-block ml-auto" type="submit" :disabled="submitDisabled" variant="success"><i class="fa fa-send"></i> Send</b-button>
    </b-form>
</template>

<script>
import axios from 'axios';
import Config from '@config/config.json';

export default {
    name: 'CreateGiveFeedbackModal',
    components: {},
    props: [],
    data() {
        return {
            form: {
                description: {
                    value: null,
                    violation: null,
                },
                email: {
                    value: null,
                    violation: null,
                },
                discordId: {
                    value: null,
                    violation: null,
                },
            },
            submitDisabled: false,
        };
    },
    computed: {
        stateDescription() {
            return this.form.description.violation !== null ? false : null;
        },
        stateEmail() {
            return this.form.email.violation !== null ? false : null;
        },
        stateDiscordId() {
            return this.form.discordId.violation !== null ? false : null;
        },
    },
    methods: {
        async onSubmit(ev) {
            ev.preventDefault();

            try {
                this.submitDisabled = true;
                this.form.description.violation = null;
                this.form.email.violation = null;
                this.form.discordId.violation = null;
                await axios.post(`${Config.api_base_url}/api/support/give-feedback`, {
                    description: this.form.description.value,
                    email: this.form.email.value || null,
                    discordId: this.form.discordId.value || null,
                }, {
                    headers: {
                        Authorization: `Bearer ${this.$store.state.accessToken}`,
                    },
                });
                this.$toastr.s('Many thanks for your feedback! Have fun on FM. 😉');
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
                    case 'description':
                        this.form.description.violation = violation.title;
                        break;
                    case 'email':
                        this.form.email.violation = violation.title;
                        break;
                    case 'discordId':
                        this.form.discordId.violation = violation.title;
                        break;
                }
            }
        }
    }
};
</script>
