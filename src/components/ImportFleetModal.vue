<template>
    <b-form @submit="onSubmit">
        <b-alert variant="info" show>Toto</b-alert>
        <b-alert variant="danger" :show="globalViolation !== null">{{ globalViolation }}</b-alert>
        <b-form-group>
            <b-form-file
                v-model="form.file.value"
                placeholder="Select your fleet file (.json) or drop it here..."
                drop-placeholder="Drop file here..."
            ></b-form-file>
        </b-form-group>
        <b-form-group>
            <b-form-checkbox v-model="form.onlyMissing.value">Import only my missing ships</b-form-checkbox>
        </b-form-group>
        <b-button class="d-block ml-auto" type="submit" :disabled="submitDisabled" variant="success"><i class="fa fa-check"></i> Import</b-button>
    </b-form>
</template>

<script>
import axios from 'axios';
import Config from '@config/config.json';

export default {
    name: 'ImportFleetModal',
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
        stateFile() {
            return this.form.file.violation !== null ? false : null;
        },
    },
    methods: {
        resetForm() {
            this.form = {
                file: {
                    value: null,
                    violation: null,
                },
                onlyMissing: {
                    value: false,
                    violation: null,
                },
            };
        },
        async onSubmit(ev) {
            ev.preventDefault();

            try {
                this.submitDisabled = true;
                this.globalViolation = null;
                this.form.file.violation = null;
                this.form.onlyMissing.violation = null;
                // await axios.post(`${Config.api_base_url}/api/my-fleet/create-ship`, {
                //     model: this.form.model.value,
                //     pictureUrl: this.form.imageUrl.value || null,
                //     quantity: this.form.quantity.value,
                // }, {
                //     headers: {
                //         Authorization: `Bearer ${this.$store.state.accessToken}`,
                //     },
                // });
                // if (this.form.addAnother.value) {
                //     this.$emit('newShip', { shouldClose: false });
                //     this.resetForm();
                //     this.form.addAnother.value = true;
                //     return;
                // }
                // this.$emit('newShip', { shouldClose: true });
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
                    case 'file':
                        this.form.file.violation = violation.title;
                        break;
                    case 'onlyMissing':
                        this.form.onlyMissing.violation = violation.title;
                        break;
                }
            }
        }
    }
};
</script>
