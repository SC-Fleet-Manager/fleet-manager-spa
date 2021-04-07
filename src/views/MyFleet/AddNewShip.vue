<template>
    <div class="animated fadeIn">
        <router-link to="/my-fleet/edit-ships-and-fleet"><b-button variant="secondary" role="button">Back to fleet edit</b-button></router-link>
        <div class="card mt-4 p-4">
            <h4>Add a new ship</h4>
            <b-form @submit="onSubmit">
                <b-form-group
                    id="input-group-1"
                    label="Ship name:"
                    label-for="input-ship-name"
                >
                    <b-form-input
                    id="input-ship-name"
                    v-model="form.name"
                    type="text"
                    placeholder="Cutlass black"
                    required
                    ></b-form-input>
                </b-form-group>
                <b-form-group
                    id="input-group-2"
                    label="Ship image url ( only RSI or Citizen tool url):"
                    label-for="input-ship-image"
                >
                    <b-form-input
                    id="input-ship-image"
                    v-model="form.imageShip"
                    type="text"
                    placeholder="https://media.robertsspaceindustries.com/wj92rqzvhnecb/store_small.jpg"
                    :state="!error"
                    ></b-form-input>
                    <b-form-invalid-feedback :state="!error">
                       Invalid Url.
                    </b-form-invalid-feedback>
                    <b-img :src="url" fluid alt="" class="col-xl-4 mt-3"></b-img>
                </b-form-group>
                <b-form-group>
                    <b-form-checkbox value="me">Add another ship</b-form-checkbox>
                </b-form-group>
                <b-button type="submit" variant="primary">Add ship</b-button>
            </b-form>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import Config from '@config/config.json';

    export default {
        name: 'edit-ships-and-fleet',
        props: ['userHandle'],
        components: {

        },
        data() {
            return {
                form: {
                    name: '',
                    imageShip: ''
                },
                showImage: false,
                error: false,
                errorMessage: 'Please enter a valid url',
                authorizedLinks: ['https://media.robertsspaceindustries.com/', 'https://robertsspaceindustries.com/media/', 'https://starcitizen.tools/images/thumb/']
            }
        },
        methods: {
            onSubmit(event) {
                event.preventDefault()
                this.saveNewShip()
            },
            async saveNewShip() {
                const token = await this.$auth.getTokenSilently();
                if (!this.$auth.isAuthenticated) {
                    this.$toastr.e('Sorry, we are unable to save your ship for the moment. Please try again later.');
                    return;
                }
                try {
                    const sendShip = await axios.post(`${Config.api_base_url}/api/my-fleet/create-ship`, {
                        name: this.form.name,
                        pictureUrl: this.form.imageShip
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    console.log(sendShip)
                    this.$toastr.s('Changes saved');
                } catch (err) {
                    console.log(err)
                    this.$toastr.e('Sorry' + err.response.data.violations.detail);
                }
            },
        },
        computed: {
            url() {
                let authorized = this.authorizedLinks.some(el => this.form.imageShip.includes(el))
                if(authorized) {
                    if(this.error == true) this.error = false;
                    this.showImage = true;
                    return this.form.imageShip;
                } else if (this.form.imageShip !== '') {
                    this.error = true;
                    return this.errorMessage;
                }
            },
        }
    }
</script>
