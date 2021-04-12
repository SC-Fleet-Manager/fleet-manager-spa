<template>
    <b-form @submit="onSubmit">
        <b-alert variant="danger" :show="globalViolation !== null">{{ globalViolation }}</b-alert>
        <b-form-group class="mb-4" label="Name *" label-for="input-orga-name">
            <b-form-input
                id="input-orga-name"
                v-model="form.name.value"
                placeholder="Organization name"
                type="text"
                :state="stateName"
                required
            ></b-form-input>
            <b-form-invalid-feedback :state="statename">{{ form.name.violation }}</b-form-invalid-feedback>
        </b-form-group>
        <b-form-group class="mb-4" label="Image URL" label-for="input-orga-image" description="Only from RSI">
            <b-form-input
                id="input-orga-image"
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
        <b-button class="d-block ml-auto" type="submit" :disabled="submitDisabled" variant="success"><i class="fa fa-check"></i> Create</b-button>
    </b-form>
</template>

<script>
import axios from 'axios';
import Config from '@config/config.json';

export default {
    name: 'CreateOrgaModal',
    components: {},
    props: [],
    data() {
        return {
            form: {
                name: '',
                imageUrl: ''
            },
            globalViolation: null,
            submitDisabled: false,
        };
    },
    created() {
    },
    computed: {
        stateName() {
            return this.form.name.violation !== null ? false : null;
        },
        stateImageUrl() {
            return this.form.imageUrl.violation !== null ? false : null;
        }
    },
    methods: {
        onSubmit(ev) {
        // async onSubmit(ev) {
            ev.preventDefault();

        //     try {
        //         this.submitDisabled = true;
        //         this.globalViolation = null;
        //         this.form.name.violation = null;
        //         this.form.imageUrl.violation = null;
        //         await axios.post(`${Config.api_base_url}/api/my-fleet/create-orga`, {
        //             name: this.form.name.value,
        //             pictureUrl: this.form.imageUrl.value || null
        //         }, {
        //             headers: {
        //                 Authorization: `Bearer ${this.$store.state.accessToken}`,
        //             },
        //         });
        //         this.$emit('newOrga', { shouldClose: true });
        //     } catch (err) {
        //         if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        //             this.$toastr.e('You have been disconnected. Please login again.');
        //             this.$router.push({ name: 'Home' });
        //             return;
        //         }
        //         this.handleViolations(err.response);
        //     } finally {
        //         this.submitDisabled = false;
        //     }
        },
        handleViolations(response) {
            // const data = response.data;
            // for (const violation of data.violations.violations) {
            //     switch (violation.propertyPath) {
            //         case '':
            //             this.globalViolation = violation.title;
            //             break;
            //         case 'name':
            //             this.form.name.violation = violation.title;
            //             break;
            //         case 'pictureUrl':
            //             this.form.imageUrl.violation = violation.title;
            //             break;
            //     }
            // }
        }
    }
};
</script>
